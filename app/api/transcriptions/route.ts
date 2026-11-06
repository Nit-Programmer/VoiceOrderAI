import { NextResponse } from "next/server";

import { GnaniServiceError, transcribeWithGnani } from "@/lib/gnani";
import type { Transcript } from "@/types/transcript";

/** Accepts browser audio and returns a normalized transcript for the UI. */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Choose an audio file before starting transcription.", code: "MISSING_AUDIO" }, { status: 400 });
    }

    const result = await transcribeWithGnani(audio);
    if (!result.text) {
      return NextResponse.json({ error: "We could not detect speech in this audio. Try a clearer recording.", code: "EMPTY_TRANSCRIPT" }, { status: 422 });
    }

    const transcript: Transcript = {
      id: result.requestId,
      text: result.text,
      sourceFileName: audio.name,
      languageCode: result.detectedLanguageCode,
      model: result.model,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ transcript });
  } catch (error) {
    if (error instanceof GnaniServiceError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: "Something went wrong while processing your audio. Please try again.", code: "UNKNOWN_ERROR" }, { status: 500 });
  }
}
