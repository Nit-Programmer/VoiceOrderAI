import type { TranscriptionResponse } from "@/types/transcript";

const TRANSCRIPTION_TIMEOUT_MS = 45_000;

export class SpeechToTextError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "SpeechToTextError";
  }
}

/** Sends a browser File to the application endpoint that securely calls Gnani. */
export async function transcribeAudio(file: File): Promise<TranscriptionResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TRANSCRIPTION_TIMEOUT_MS);
  const formData = new FormData();
  formData.append("audio", file, file.name);

  try {
    const response = await fetch("/api/transcriptions", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const error = isErrorResponse(payload) ? payload.error : "We could not transcribe this audio. Please try again.";
      const code = isErrorResponse(payload) ? payload.code : undefined;
      throw new SpeechToTextError(error, code);
    }

    if (!isTranscriptionResponse(payload)) {
      throw new SpeechToTextError("We received an unexpected transcription response. Please try again.");
    }

    return payload;
  } catch (error) {
    if (error instanceof SpeechToTextError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new SpeechToTextError("Transcription took too long. Please try a shorter recording.", "TIMEOUT");
    }
    throw new SpeechToTextError("We could not reach the transcription service. Check your connection and try again.", "NETWORK_ERROR");
  } finally {
    window.clearTimeout(timeout);
  }
}

function isErrorResponse(value: unknown): value is { error: string; code?: string } {
  return typeof value === "object" && value !== null && "error" in value && typeof value.error === "string";
}

function isTranscriptionResponse(value: unknown): value is TranscriptionResponse {
  return typeof value === "object"
    && value !== null
    && "transcript" in value
    && typeof value.transcript === "object"
    && value.transcript !== null
    && "text" in value.transcript
    && typeof value.transcript.text === "string";
}
