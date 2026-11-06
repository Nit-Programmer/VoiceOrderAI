import type { OrderUnderstandingResponse } from "@/types/order";

const REASONING_TIMEOUT_MS = 45_000;

export class AIReasoningError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "AIReasoningError";
  }
}

/** Sends an approved transcript to the server-side order-understanding service. */
export async function understandOrder(transcript: string): Promise<OrderUnderstandingResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REASONING_TIMEOUT_MS);

  try {
    const response = await fetch("/api/order-understanding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
      signal: controller.signal,
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw new AIReasoningError(isErrorResponse(payload) ? payload.error : "We could not understand this order. Please try again.", isErrorResponse(payload) ? payload.code : undefined);
    }
    if (!isOrderUnderstandingResponse(payload)) {
      throw new AIReasoningError("We received an unexpected order response. Please try again.", "INVALID_RESPONSE");
    }
    return payload;
  } catch (error) {
    if (error instanceof AIReasoningError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AIReasoningError("AI order understanding took too long. Please try again.", "TIMEOUT");
    }
    throw new AIReasoningError("We could not reach the AI service. Check your connection and try again.", "NETWORK_ERROR");
  } finally {
    window.clearTimeout(timeout);
  }
}

function isErrorResponse(value: unknown): value is { error: string; code?: string } {
  return typeof value === "object" && value !== null && "error" in value && typeof value.error === "string";
}

function isOrderUnderstandingResponse(value: unknown): value is OrderUnderstandingResponse {
  return typeof value === "object"
    && value !== null
    && "order" in value
    && typeof value.order === "object"
    && value.order !== null
    && "items" in value.order
    && Array.isArray(value.order.items);
}
