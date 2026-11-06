import type { Metadata } from "next";

import OrderDashboard from "@/components/OrderDashboard";

export const metadata: Metadata = {
  title: "Dashboard | VoiceOrder AI",
};

export default function DashboardPage() {
  return <OrderDashboard />;
}
