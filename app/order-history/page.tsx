import type { Metadata } from "next";

import OrderHistory from "@/components/OrderHistory";

export const metadata: Metadata = {
  title: "Order History | VoiceOrder AI",
};

export default function OrderHistoryPage() {
  return <OrderHistory />;
}
