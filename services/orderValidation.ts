import type { OrderItem, StructuredOrder } from "@/types/order";

export const DEFAULT_LOW_CONFIDENCE_THRESHOLD = 60;

export type OrderValidationOptions = {
  lowConfidenceThreshold?: number;
};

export type OrderValidationResult = {
  order: StructuredOrder;
  warnings: string[];
};

/**
 * Produces a display-safe order without mutating the supplied AI response.
 * Duplicate items are merged case-insensitively when both their trimmed names
 * and units match; their quantities are added and the first item's ID is kept.
 */
export function validateOrder(
  order: StructuredOrder,
  { lowConfidenceThreshold = DEFAULT_LOW_CONFIDENCE_THRESHOLD }: OrderValidationOptions = {},
): OrderValidationResult {
  const warnings: string[] = [];
  const itemsByKey = new Map<string, OrderItem>();
  let removedItemCount = 0;
  let mergedItemCount = 0;

  for (const item of order.items) {
    const name = item.name.trim();
    if (!name || !Number.isFinite(item.quantity) || item.quantity <= 0) {
      removedItemCount += 1;
      continue;
    }

    const unit = trimOrNull(item.unit);
    const key = `${name.toLocaleLowerCase()}\u0000${unit?.toLocaleLowerCase() ?? ""}`;
    const existing = itemsByKey.get(key);

    if (existing) {
      existing.quantity += item.quantity;
      mergedItemCount += 1;
      continue;
    }

    itemsByKey.set(key, { ...item, name, unit });
  }

  if (removedItemCount) {
    warnings.push(`${removedItemCount} invalid ${removedItemCount === 1 ? "item was" : "items were"} removed from this order.`);
  }
  if (mergedItemCount) {
    warnings.push(`${mergedItemCount} duplicate ${mergedItemCount === 1 ? "item was" : "items were"} combined.`);
  }

  const confidence = normalizeConfidence(order.confidence);
  if (confidence !== null && confidence < lowConfidenceThreshold) {
    warnings.push("AI confidence is low. Please review and edit this order carefully before confirming.");
  }

  return {
    order: {
      ...order,
      customer: trimOrNull(order.customer),
      items: [...itemsByKey.values()],
      delivery: {
        date: trimOrNull(order.delivery.date),
        time: trimOrNull(order.delivery.time),
      },
      specialInstructions: trimOrNull(order.specialInstructions),
      confidence,
    },
    warnings,
  };
}

function trimOrNull(value: string | null) {
  return value?.trim() || null;
}

function normalizeConfidence(value: number | null) {
  if (value === null || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}
