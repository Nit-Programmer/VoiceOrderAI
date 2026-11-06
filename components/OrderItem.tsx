import type { OrderItem as OrderItemType } from "@/types/order";

type OrderItemProps = { item: OrderItemType };

export default function OrderItem({ item }: OrderItemProps) {
  return <li className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3"><div><p className="font-semibold text-slate-800">{item.name}</p>{item.unit && <p className="mt-0.5 text-xs text-slate-500">Unit: {item.unit}</p>}</div><span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-bold text-indigo-700">× {item.quantity}</span></li>;
}
