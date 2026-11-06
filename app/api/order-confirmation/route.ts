import { NextResponse } from "next/server";

import { generateOrderConfirmation } from "@/services/orderConfirmation";

/** Generates a short confirmation message for a structured order. */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const order =
      typeof body === "object" && body !== null && "order" in body
        ? body.order
        : body;

    if (order === null || order === undefined) {
      return NextResponse.json(
        { error: "An order is required.", code: "MISSING_ORDER" },
        { status: 400 },
      );
    }

    const confirmation = await generateOrderConfirmation(order);
    return NextResponse.json({ confirmation });
  } catch {
    return NextResponse.json(
      {
        error: "Something went wrong while generating the order confirmation.",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}
