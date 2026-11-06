import "server-only";

const DEFAULT_GNANI_API_URL = "https://api.vachana.ai/stt/v3";
const GNANI_TIMEOUT_MS = 35_000;
const MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024;
const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
]);
const SUPPORTED_EXTENSIONS = new Set(["mp3", "wav", "m4a", "aac", "ogg", "flac"]);

export class GnaniServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "GnaniServiceError";
  }
}

export type GnaniTranscription = {
  text: string;
  requestId: string;
  detectedLanguageCode?: string;
  model?: string;
};

/** Validates an audio upload then calls Prisma v3 without exposing the API key. */
export async function transcribeWithGnani(file: File): Promise<GnaniTranscription> {
  validateAudioFile(file);

  const apiKey = process.env.GNANI_API_KEY?.trim();
  if (!apiKey) {
    throw new GnaniServiceError(
      "Speech-to-Text is not configured. Add GNANI_API_KEY to your environment, then try again.",
      503,
      "MISSING_API_KEY",
    );
  }

  const formData = new FormData();
  formData.append("audio_file", file, file.name);
  formData.append("model", "prisma-v3.0");
  formData.append("language_code", "indic-auto");
  formData.append("format", "transcribe");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GNANI_TIMEOUT_MS);

  try {
    const response = await fetch(process.env.GNANI_API_URL?.trim() || DEFAULT_GNANI_API_URL, {
      method: "POST",
      headers: {
        "X-API-Key-ID": apiKey,
      },
      body: formData,
      signal: controller.signal,
      cache: "no-store",
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw new GnaniServiceError(getGnaniErrorMessage(response.status, payload), response.status, "GNANI_API_ERROR");
    }
    if (!isGnaniSuccess(payload)) {
      throw new GnaniServiceError("Gnani returned an invalid transcription response. Please try again.", 502, "INVALID_RESPONSE");
    }

    return {
      text: payload.transcript.trim(),
      requestId: payload.request_id ?? crypto.randomUUID(),
      detectedLanguageCode: payload.detected_language_code,
      model: payload.model,
    };
  } catch (error) {
    if (error instanceof GnaniServiceError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new GnaniServiceError("Gnani took too long to respond. Please try a shorter recording.", 504, "TIMEOUT");
    }
    throw new GnaniServiceError("We could not reach Gnani. Check your connection and try again.", 503, "NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}

function validateAudioFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const isSupportedType = SUPPORTED_AUDIO_TYPES.has(file.type.toLowerCase()) || SUPPORTED_EXTENSIONS.has(extension ?? "");
  if (!isSupportedType) {
    throw new GnaniServiceError("This audio format is not supported. Please use MP3, WAV, M4A, AAC, OGG, or FLAC.", 415, "UNSUPPORTED_FILE");
  }
  if (file.size === 0) {
    throw new GnaniServiceError("This audio file is empty. Choose another recording and try again.", 400, "EMPTY_FILE");
  }
  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    throw new GnaniServiceError("This file is larger than 25 MB. Please choose a smaller recording.", 413, "FILE_TOO_LARGE");
  }
}

function isGnaniSuccess(value: unknown): value is {
  success: boolean;
  transcript: string;
  request_id?: string;
  detected_language_code?: string;
  model?: string;
} {
  return typeof value === "object"
    && value !== null
    && "success" in value
    && value.success === true
    && "transcript" in value
    && typeof value.transcript === "string";
}

function getGnaniErrorMessage(status: number, payload: unknown) {
  if (status === 401 || status === 403) return "Gnani could not verify the API key. Check GNANI_API_KEY and try again.";
  if (status === 413) return "This recording is too large for Gnani. Please choose a shorter file.";
  if (status === 415) return "Gnani does not support this audio format. Please use MP3, WAV, M4A, AAC, OGG, or FLAC.";
  if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") return payload.message;
  return "Gnani could not transcribe this audio. Please try again.";
}
