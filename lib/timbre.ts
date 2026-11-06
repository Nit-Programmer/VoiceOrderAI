import "server-only";

const DEFAULT_GNANI_TTS_URL =
  "https://api.vachana.ai/api/v1/tts/inference";
const GNANI_TIMEOUT_MS = 35_000;

export class GnaniTtsError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "GnaniTtsError";
  }
}

export type GenerateSpeechOptions = {
  text: string;
  language?: string;
  voice?: string;
  model?: string;
  sampleRate?: number;
  container?: "mp3" | "wav" | "ogg";
};

export async function generateSpeech({
  text,
  language = "en-IN",
  voice = "Avinash",
  model = "timbre-v3.0",
  sampleRate = 22050,
  container = "mp3",
}: GenerateSpeechOptions): Promise<ArrayBuffer> {
  validateText(text);

  const apiKey = process.env.GNANI_API_KEY?.trim();

  if (!apiKey) {
    throw new GnaniTtsError(
      "Text-to-Speech is not configured. Add GNANI_API_KEY to your environment.",
      503,
      "MISSING_API_KEY",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GNANI_TIMEOUT_MS);

  try {
    const response = await fetch(
      process.env.GNANI_TTS_URL?.trim() || DEFAULT_GNANI_TTS_URL,
      {
        method: "POST",
        headers: {
          "X-API-Key-ID": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          language,
          voice,
          text,
          audio_config: {
            container,
            encoding: "linear_pcm",
            sample_rate: sampleRate,
            bitrate: "128k",
       },  
        }),
        signal: controller.signal,
        cache: "no-store",
      },
    );

if (!response.ok) {
  const errorText = await response.text();

  throw new GnaniTtsError(
    getGnaniTtsErrorMessage(response.status, errorText),
    response.status,
    "GNANI_TTS_ERROR",
  );
}

    const buffer = await response.arrayBuffer();

    return buffer;


  } catch (error) {
    if (error instanceof GnaniTtsError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new GnaniTtsError(
        "Gnani Text-to-Speech timed out.",
        504,
        "TIMEOUT",
      );
    }

    throw new GnaniTtsError(
      error instanceof Error ? error.message : "Unknown error",
      503,
      "NETWORK_ERROR",
);
  
} finally {
    clearTimeout(timeout);
  }
}

function validateText(text: string) {
  if (!text.trim()) {
    throw new GnaniTtsError(
      "Confirmation text cannot be empty.",
      400,
      "EMPTY_TEXT",
    );
  }
}

function getGnaniTtsErrorMessage(status: number, payload: string) {
  if (status === 400) return "Gnani rejected the text.";
  if (status === 401 || status === 403)
    return "Gnani could not verify your API key.";
  if (status === 429)
    return "Gnani rate limit exceeded. Please try again later.";
  if (status >= 500)
    return "Gnani Text-to-Speech service is temporarily unavailable.";

  return payload || "Gnani could not generate speech.";
}
