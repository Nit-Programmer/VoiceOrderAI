import type { SavedOrder } from "@/services/orderHistory";

export type RankedItem = {
  name: string;
  quantity: number;
};

export type OrderDashboardStats = {
  totalOrders: number;
  ordersToday: number;
  totalItemsOrdered: number;
  averageConfidence: number | null;
  mostFrequentlyOrderedItem: RankedItem | null;
  totalDifferentItems: number;
  latestOrderTime: string | null;
  topItems: RankedItem[];
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
    unavailable: number;
  };
};

/** Calculates dashboard metrics from browser-saved orders without mutating them. */
export function getOrderDashboardStats(orders: SavedOrder[], now?: Date ): OrderDashboardStats {
  const currentDate = now ?? new Date();
  const itemTotals = new Map<string, RankedItem>();
  const confidences: number[] = [];
  const confidenceDistribution = { high: 0, medium: 0, low: 0, unavailable: 0 };
  let totalItemsOrdered = 0;
  let ordersToday = 0;

  for (const savedOrder of orders) {
    const orderDate = new Date(savedOrder.createdAt);
    if (!Number.isNaN(orderDate.getTime()) && isSameLocalDay(orderDate, currentDate)) ordersToday += 1;

    const confidence = savedOrder.order.confidence;
    if (confidence === null) {
      confidenceDistribution.unavailable += 1;
    } else {
      confidences.push(confidence);
      if (confidence >= 80) confidenceDistribution.high += 1;
      else if (confidence >= 60) confidenceDistribution.medium += 1;
      else confidenceDistribution.low += 1;
    }

    for (const item of savedOrder.order.items) {
      totalItemsOrdered += item.quantity;
      const key = item.name.trim().toLocaleLowerCase();
      const existing = itemTotals.get(key);
      if (existing) existing.quantity += item.quantity;
      else itemTotals.set(key, { name: item.name.trim(), quantity: item.quantity });
    }
  }

  const topItems = [...itemTotals.values()].sort((left, right) => right.quantity - left.quantity || left.name.localeCompare(right.name)).slice(0, 5);

  return {
    totalOrders: orders.length,
    ordersToday,
    totalItemsOrdered,
    averageConfidence: confidences.length ? Math.round(confidences.reduce((sum, confidence) => sum + confidence, 0) / confidences.length) : null,
    mostFrequentlyOrderedItem: topItems[0] ?? null,
    totalDifferentItems: itemTotals.size,
    latestOrderTime: orders.reduce<string | null>((latest, savedOrder) => !latest || savedOrder.createdAt > latest ? savedOrder.createdAt : latest, null),
    topItems,
    confidenceDistribution,
  };
}

function isSameLocalDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}
