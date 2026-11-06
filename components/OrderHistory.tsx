"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteOrder, getOrders, type SavedOrder } from "@/services/orderHistory";

/** Displays locally stored confirmed orders in reverse chronological order. */
export default function OrderHistory() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setOrders(getOrders());
      setIsLoading(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const removeOrder = (orderId: string) => {
    deleteOrder(orderId);
    setOrders(getOrders());
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">VoiceOrder AI</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Order History</h1><p className="mt-2 text-sm text-slate-600">Confirmed orders saved on this device.</p></div><Link href="/" className="inline-flex min-h-10 items-center rounded-lg border border-indigo-100 bg-white px-3.5 py-2.5 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create order</Link></div>

        {isLoading ? <div className="mt-8 rounded-2xl border border-indigo-100 bg-white p-6 text-sm text-slate-600 shadow-sm" aria-live="polite">Loading your saved orders…</div> : orders.length === 0 ? <div className="mt-8 rounded-2xl border border-indigo-100 bg-white p-6 text-sm text-slate-600 shadow-sm">No confirmed orders are saved yet.</div> : <ul className="mt-8 space-y-4">{orders.map((savedOrder) => <li key={savedOrder.id} className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Confirmed {formatTimestamp(savedOrder.createdAt)}</p><h2 className="mt-1 text-lg font-bold text-slate-950">{savedOrder.order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</h2></div><button type="button" onClick={() => removeOrder(savedOrder.id)} className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">Delete</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Detail label="Delivery date" value={savedOrder.order.delivery.date} /><Detail label="Delivery time" value={savedOrder.order.delivery.time} /></div>{savedOrder.order.specialInstructions && <Detail label="Special instructions" value={savedOrder.order.specialInstructions} />}</li>)}</ul>}
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return <div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value || "Not specified"}</p></div>;
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "at an unknown time" : date.toLocaleString();
}
