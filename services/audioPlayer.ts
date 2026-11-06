import { generateSpeech } from "./tts";

export async function speak(text: string): Promise<void> {
  const blob = await generateSpeech(text);

  const url = URL.createObjectURL(blob);

  const audio = new Audio();
  audio.src = url;
  audio.preload = "auto";

  try {
    await new Promise<void>((resolve, reject) => {
      audio.oncanplaythrough = () => {
        resolve();
      };
      audio.onerror = () => reject(new Error("Audio failed to load."));
      audio.load();
    });

    await audio.play();

    await new Promise<void>((resolve) => {
      audio.onended = () => {
        resolve();
      };
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
