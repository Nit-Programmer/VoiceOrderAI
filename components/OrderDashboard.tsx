"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getOrderDashboardStats } from "@/services/orderDashboard";
import { getOrders, type SavedOrder } from "@/services/orderHistory";

/** Presents client-computed activity metrics from the local order history. */
export default function OrderDashboard() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setOrders(getOrders());
      setIsLoading(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const stats = useMemo(() => getOrderDashboardStats(orders), [orders]);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">VoiceOrder AI</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Order Dashboard</h1><p className="mt-2 text-sm text-slate-600">A quick view of confirmed orders saved on this device.</p></div><div className="flex gap-2"><Link href="/order-history" className="inline-flex min-h-10 items-center rounded-lg border border-indigo-100 bg-white px-3.5 py-2.5 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Order history</Link><Link href="/" className="inline-flex min-h-10 items-center rounded-lg bg-slate-950 px-3.5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create order</Link></div></div>

        {isLoading ? <div className="mt-8 rounded-2xl border border-indigo-100 bg-white p-6 text-sm text-slate-600 shadow-sm" aria-live="polite">Loading your order activity…</div> : <><section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Order statistics">
          <MetricCard label="Total orders" value={stats.totalOrders.toString()} />
          <MetricCard label="Orders today" value={stats.ordersToday.toString()} />
          <MetricCard label="Total items ordered" value={stats.totalItemsOrdered.toString()} />
          <MetricCard label="Average AI confidence" value={stats.averageConfidence === null ? "Not available" : `${stats.averageConfidence}%`} />
          <MetricCard label="Most ordered item" value={stats.mostFrequentlyOrderedItem ? `${stats.mostFrequentlyOrderedItem.name} × ${stats.mostFrequentlyOrderedItem.quantity}` : "Not available"} />
          <MetricCard label="Different items" value={stats.totalDifferentItems.toString()} />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold text-slate-950">Top ordered items</h2>{stats.topItems.length === 0 ? <p className="mt-4 text-sm text-slate-600">Confirm an order to see item activity.</p> : <ol className="mt-4 space-y-3">{stats.topItems.map((item, index) => <li key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-sm font-semibold text-slate-800"><span className="mr-3 text-indigo-600">{index + 1}</span>{item.name}</span><span className="text-sm font-bold text-slate-950">{item.quantity}</span></li>)}</ol>}</div><div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold text-slate-950">Confidence distribution</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><ConfidenceStat label="High (80–100%)" value={stats.confidenceDistribution.high} tone="bg-emerald-50 text-emerald-700" /><ConfidenceStat label="Medium (60–79%)" value={stats.confidenceDistribution.medium} tone="bg-amber-50 text-amber-700" /><ConfidenceStat label="Low (below 60%)" value={stats.confidenceDistribution.low} tone="bg-rose-50 text-rose-700" /><ConfidenceStat label="Not available" value={stats.confidenceDistribution.unavailable} tone="bg-slate-100 text-slate-700" /></div><div className="mt-5 rounded-xl bg-slate-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Latest order</p><p className="mt-1 text-sm font-semibold text-slate-800">{formatTimestamp(stats.latestOrderTime)}</p></div></div></section></>}
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950">{value}</p></div>;
}

function ConfidenceStat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className={`rounded-xl px-4 py-3 ${tone}`}><p className="text-xs font-bold uppercase tracking-wide">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>;
}

function formatTimestamp(value: string | null) {
  if (!value) return "No confirmed orders yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}
