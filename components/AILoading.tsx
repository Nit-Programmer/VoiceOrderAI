/** Displays the non-interactive AI order-understanding progress state. */
export default function AILoading() {
  return (
    <section className="w-full rounded-2xl border border-indigo-100 bg-white/95 p-6 text-center shadow-xl shadow-indigo-100/60 backdrop-blur sm:p-8" aria-live="polite" aria-busy="true">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl shadow-lg shadow-indigo-200" aria-hidden="true">🤖</span>
      <h2 className="mt-5 text-xl font-bold text-slate-950">AI is understanding your order</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Reviewing the conversation and preparing your order summary.</p>
      <div className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm">
        <ProgressItem label="Finding products" complete />
        <ProgressItem label="Extracting quantities" active />
        <ProgressItem label="Checking delivery details" />
        <ProgressItem label="Almost done" />
      </div>
      <p className="mt-6 text-xs text-slate-400">This usually takes a few seconds.</p>
    </section>
  );
}

function ProgressItem({ label, complete = false, active = false }: { label: string; complete?: boolean; active?: boolean }) {
  return <div className="flex items-center gap-3"><span className={`grid size-5 place-items-center rounded-full text-[11px] ${complete ? "bg-emerald-100 text-emerald-600" : active ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>{complete ? "✓" : active ? <span className="size-2 animate-pulse rounded-full bg-indigo-500" /> : "·"}</span><span className={active ? "font-semibold text-slate-800" : "text-slate-500"}>{label}</span></div>;
}
