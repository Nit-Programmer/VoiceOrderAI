export class TtsError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "TtsError";
  }
}

export async function generateSpeech(text: string): Promise<Blob> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new TtsError(
      error?.error ?? "Failed to generate speech.",
      error?.code,
    );
  }

  return response.blob();
}
