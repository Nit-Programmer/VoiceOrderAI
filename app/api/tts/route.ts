import { NextResponse } from "next/server";

import { GnaniTtsError, generateSpeech } from "@/lib/timbre";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const text = body?.text;

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        {
          error: "Confirmation text is required.",
          code: "MISSING_TEXT",
        },
        { status: 400 },
      );
    }

    const audio = await generateSpeech({
      text,
    });

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof GnaniTtsError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error: "Something went wrong while generating speech.",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}
