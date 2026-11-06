"use client";

import type { InputHTMLAttributes } from "react";

import type { OrderItem, StructuredOrder } from "@/types/order";

type OrderEditorProps = {
  order: StructuredOrder;
  onChange: (order: StructuredOrder) => void;
  onSave: () => void;
  onCancel: () => void;
};

/** Provides controlled editing for every order field before confirmation. */
export default function OrderEditor({ order, onChange, onSave, onCancel }: OrderEditorProps) {
  const updateItem = (id: string, update: Partial<OrderItem>) => onChange({ ...order, items: order.items.map((item) => item.id === id ? { ...item, ...update } : item) });
  const removeItem = (id: string) => onChange({ ...order, items: order.items.filter((item) => item.id !== id) });
  const addItem = () => onChange({ ...order, items: [...order.items, { id: crypto.randomUUID(), name: "", quantity: 1, unit: null }] });

  return (
    <div className="mt-5 space-y-5">
      <div className="space-y-3">{order.items.map((item, index) => <div key={item.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3"><div className="mb-2 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Item {index + 1}</p><button type="button" onClick={() => removeItem(item.id)} disabled={order.items.length === 1} className="text-xs font-semibold text-rose-600 disabled:cursor-not-allowed disabled:opacity-40">Remove</button></div><div className="grid gap-2 sm:grid-cols-[1fr_96px_120px]"><Input label="Product name" value={item.name} onChange={(value) => updateItem(item.id, { name: value })} /><Input label="Quantity" type="number" min="0.1" step="0.1" value={String(item.quantity)} onChange={(value) => updateItem(item.id, { quantity: Number(value) || 0 })} /><Input label="Unit" value={item.unit ?? ""} onChange={(value) => updateItem(item.id, { unit: value || null })} /></div></div>)}</div>
      <button type="button" onClick={addItem} className="inline-flex min-h-10 items-center rounded-lg border border-dashed border-indigo-200 px-3.5 py-2 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">+ Add item</button>
      <div className="grid gap-3 sm:grid-cols-2"><Input label="Delivery date" type="date" value={order.delivery.date ?? ""} onChange={(value) => onChange({ ...order, delivery: { ...order.delivery, date: value || null } })} /><Input label="Delivery time" value={order.delivery.time ?? ""} placeholder="e.g. After 6 PM" onChange={(value) => onChange({ ...order, delivery: { ...order.delivery, time: value || null } })} /></div>
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Special instructions<textarea value={order.specialInstructions ?? ""} onChange={(event) => onChange({ ...order, specialInstructions: event.target.value || null })} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Add handling or delivery notes" /></label>
      <div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={onCancel} className="inline-flex min-h-10 items-center rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Cancel</button><button type="button" onClick={onSave} disabled={!isOrderValid(order)} className="inline-flex min-h-10 items-center rounded-lg bg-slate-950 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-slate-300 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save changes</button></div>
    </div>
  );
}

function Input({ label, onChange, ...inputProps }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & { label: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}<input {...inputProps} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label>;
}

function isOrderValid(order: StructuredOrder) {
  return order.items.length > 0 && order.items.every((item) => item.name.trim() && Number.isFinite(item.quantity) && item.quantity > 0);
}
