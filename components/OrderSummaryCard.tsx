"use client";

import ConfidenceBadge from "@/components/ConfidenceBadge";
import OrderEditor from "@/components/OrderEditor";
import OrderItem from "@/components/OrderItem";
import type { StructuredOrder } from "@/types/order";

type OrderSummaryCardProps = {
  order: StructuredOrder;
  draft: StructuredOrder;
  isEditing: boolean;
  confirmation: string | null;
  warnings: string[];
  onDraftChange: (order: StructuredOrder) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onBack: () => void;
  onConfirm: () => void;
};

/** Presents the AI-extracted order for review, edit, and future handoff. */
export default function OrderSummaryCard({ order, draft, isEditing, confirmation, warnings, onDraftChange, onEdit, onSave, onCancelEdit, onBack, onConfirm }: OrderSummaryCardProps) {
  return (
    <section className="w-full rounded-2xl border border-indigo-100 bg-white/95 p-5 shadow-xl shadow-indigo-100/60 backdrop-blur sm:p-6" aria-label="AI order summary">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">AI Order Understanding</p><h2 className="mt-1 text-xl font-bold text-slate-950">AI Order Summary</h2></div>{order.confidence !== null && <ConfidenceBadge confidence={order.confidence} />}</div>
      {warnings.length > 0 && <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert"><ul className="space-y-1">{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
      {isEditing ? <OrderEditor order={draft} onChange={onDraftChange} onSave={onSave} onCancel={onCancelEdit} /> : <div className="mt-5 space-y-5"><div><h3 className="text-sm font-bold text-slate-900">Items</h3><ul className="mt-3 space-y-2">{order.items.map((item) => <OrderItem key={item.id} item={item} />)}</ul></div><div className="grid gap-3 sm:grid-cols-2"><Detail label="Delivery date" value={order.delivery.date} /><Detail label="Delivery time" value={order.delivery.time} /></div>{order.specialInstructions && <Detail label="Special instructions" value={order.specialInstructions} />}</div>}
      {!isEditing && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={onBack} className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Back to transcript</button><div className="flex flex-col gap-2 sm:flex-row"><button type="button" onClick={onEdit} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-indigo-100 bg-white px-3.5 py-2.5 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Edit order</button><button type="button" onClick={onConfirm} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-300 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Confirm order <span aria-hidden="true">→</span></button></div></div>}
      {confirmation && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">{confirmation}</p>}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value || "Not specified"}</p></div>;
}
