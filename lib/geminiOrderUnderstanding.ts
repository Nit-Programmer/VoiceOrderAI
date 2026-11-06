import "server-only";

import { ApiError, GoogleGenAI } from "@google/genai";

import type { OrderItem, StructuredOrder } from "@/types/order";

import { ORDER_EXTRACTION_PROMPT } from "@/services/aiPrompt";

const ORDER_UNDERSTANDING_TIMEOUT_MS = 30_000;
const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";

const ORDER_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          quantity: { type: "number" },
        },
        required: ["name", "quantity"],
      },
    },
    deliveryDate: { type: ["string", "null"] },
    deliveryTime: { type: ["string", "null"] },
    specialInstructions: { type: ["string", "null"] },
    confidence: { type: "number" },
  },
  required: ["items", "deliveryDate", "deliveryTime", "specialInstructions", "confidence"],
} as const;

type GeminiOrderPayload = {
  items: Array<{ name: string; quantity: number }>;
  deliveryDate: string | null;
  deliveryTime: string | null;
  specialInstructions: string | null;
  confidence: number;
};

export class GeminiOrderError extends Error {
  constructor(message: string, public readonly status: number, public readonly code: string) {
    super(message);
    this.name = "GeminiOrderError";
  }
}

/** Extracts an order from a transcript with Gemini structured output. */
export async function understandOrderWithGemini(transcript: string): Promise<{ order: StructuredOrder }> {
  if (!transcript.trim()) {
    throw new GeminiOrderError("Add a transcript before asking AI to understand the order.", 400, "EMPTY_TRANSCRIPT");
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiOrderError("AI Understanding is not configured. Add GEMINI_API_KEY to .env.local and restart the server.", 503, "MISSING_GEMINI_API_KEY");
  }

  try {
    const gemini = new GoogleGenAI({ apiKey, httpOptions: { timeout: ORDER_UNDERSTANDING_TIMEOUT_MS } });
    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL,
      contents: `${ORDER_EXTRACTION_PROMPT}\n\nTranscript:\n${transcript}`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: ORDER_SCHEMA,
      },
    });

    if (!response.text) {
      throw new GeminiOrderError("Gemini did not return an order response. Please try again.", 502, "EMPTY_RESPONSE");
    }

    return { order: normalizeOrder(parseOrderPayload(response.text)) };
  } catch (error) {
    if (error instanceof GeminiOrderError) throw error;
    if (error instanceof ApiError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Gemini API error", {
          status: error.status,
          message: error.message,
          responseBody: getProviderErrorBody(error.message),
          error,
        });
        throw new GeminiOrderError(error.message, error.status || 502, "GEMINI_API_ERROR");
      }
      if (error.status === 401 || error.status === 403) {
        throw new GeminiOrderError("Gemini could not verify GEMINI_API_KEY. Check the key and restart the server.", 503, "INVALID_GEMINI_API_KEY");
      }
      if (error.status === 429) {
        throw new GeminiOrderError("Gemini is temporarily rate limited. Please wait a moment and try again.", 429, "RATE_LIMITED");
      }
      throw new GeminiOrderError("Gemini could not understand this order. Please try again.", error.status || 502, "GEMINI_API_ERROR");
    }
    if (error instanceof Error && /timeout|abort/i.test(error.message)) {
      throw new GeminiOrderError("AI order understanding took too long. Please try again.", 504, "TIMEOUT");
    }
    throw new GeminiOrderError("We could not reach Gemini. Check your connection and try again.", 503, "GEMINI_CONNECTION_ERROR");
  }
}

function parseOrderPayload(value: string): GeminiOrderPayload {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isGeminiOrderPayload(parsed)) throw new Error("Invalid order shape");
    return parsed;
  } catch {
    throw new GeminiOrderError("Gemini returned invalid JSON. Please try again.", 502, "INVALID_JSON");
  }
}

function isGeminiOrderPayload(value: unknown): value is GeminiOrderPayload {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.items)) return false;
  return isNullableString(data.deliveryDate)
    && isNullableString(data.deliveryTime)
    && isNullableString(data.specialInstructions)
    && typeof data.confidence === "number"
    && data.items.every(isGeminiOrderItem);
}

function isGeminiOrderItem(value: unknown): value is { name: string; quantity: number } {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.name === "string" && typeof item.quantity === "number";
}

function isNullableString(value: unknown) {
  return value === null || typeof value === "string";
}

function normalizeOrder(value: GeminiOrderPayload): StructuredOrder {
  const items = value.items
    .filter((item) => item.name.trim() && Number.isFinite(item.quantity) && item.quantity > 0)
    .map((item): OrderItem => ({ id: crypto.randomUUID(), name: item.name.trim(), quantity: item.quantity, unit: null }));

  if (!items.length) {
    throw new GeminiOrderError("The transcript did not contain any order items. Review the transcript and try again.", 422, "EMPTY_ORDER");
  }

  return {
    customer: null,
    items,
    delivery: {
      date: stringOrNull(value.deliveryDate),
      time: stringOrNull(value.deliveryTime),
    },

    specialInstructions: stringOrNull(value.specialInstructions),
    confidence: Math.max(0, Math.min(100, Math.round(value.confidence))),
  };
}

function stringOrNull(value: string | null) {
  return value?.trim() || null;
}

function getProviderErrorBody(message: string): unknown {
  try {
    return JSON.parse(message);
  } catch {
    return undefined;
  }
}
