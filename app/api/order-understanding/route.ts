import { NextResponse } from "next/server";

import { GeminiOrderError, understandOrderWithGemini } from "@/lib/geminiOrderUnderstanding";

/** Accepts transcript text and returns a validated, editable structured order. */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const transcript = typeof body === "object" && body !== null && "transcript" in body && typeof body.transcript === "string" ? body.transcript : "";
    const result = await understandOrderWithGemini(transcript);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof GeminiOrderError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Something went wrong while understanding the order. Please try again.", code: "UNKNOWN_ERROR" }, { status: 500 });
  }
}
