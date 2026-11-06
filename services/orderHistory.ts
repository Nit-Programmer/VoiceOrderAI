import type { OrderItem, StructuredOrder } from "@/types/order";

const ORDER_HISTORY_STORAGE_KEY = "voiceorder-ai.order-history.v1";

export type SavedOrder = {
  id: string;
  createdAt: string;
  order: StructuredOrder;
};

/** Saves a confirmed order locally without changing the order's schema. */
export function saveOrder(order: StructuredOrder): SavedOrder {
  const savedOrder: SavedOrder = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    order,
  };
  const orders = getOrders();

  writeOrders([savedOrder, ...orders]);
  return savedOrder;
}

/** Returns saved orders from newest to oldest. */
export function getOrders(): SavedOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(isSavedOrder).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  } catch {
    return [];
  }
}

/** Removes one saved order by its history-record ID. */
export function deleteOrder(orderId: string) {
  writeOrders(getOrders().filter((savedOrder) => savedOrder.id !== orderId));
}

/** Removes all locally saved orders. */
export function clearOrders() {
  writeOrders([]);
}

function writeOrders(orders: SavedOrder[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orders));
}

function isSavedOrder(value: unknown): value is SavedOrder {
  if (typeof value !== "object" || value === null) return false;
  const savedOrder = value as Record<string, unknown>;
  return typeof savedOrder.id === "string"
    && typeof savedOrder.createdAt === "string"
    && isStructuredOrder(savedOrder.order);
}

function isStructuredOrder(value: unknown): value is StructuredOrder {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Record<string, unknown>;
  if (!Array.isArray(order.items) || typeof order.delivery !== "object" || order.delivery === null) return false;

  const delivery = order.delivery as Record<string, unknown>;
  return isNullableString(order.customer)
    && isNullableString(delivery.date)
    && isNullableString(delivery.time)
    && isNullableString(order.specialInstructions)
    && (order.confidence === null || typeof order.confidence === "number")
    && order.items.every(isOrderItem);
}

function isOrderItem(value: unknown): value is OrderItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string"
    && typeof item.name === "string"
    && typeof item.quantity === "number"
    && isNullableString(item.unit);
}

function isNullableString(value: unknown) {
  return value === null || typeof value === "string";
}

function createOrderId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `order-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
