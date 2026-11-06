type LoadingStateProps = {
  fileName: string;
};

/** Displays the non-interactive transcription progress state. */
export default function LoadingState({ fileName }: LoadingStateProps) {
  return (
    <section className="w-full rounded-2xl border border-indigo-100 bg-white/95 p-6 text-center shadow-xl shadow-indigo-100/60 backdrop-blur sm:p-8" aria-live="polite" aria-busy="true">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200">
        <span className="size-6 animate-spin rounded-full border-2 border-indigo-200 border-t-white" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-bold text-slate-950">Converting speech to text</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Preparing <span className="font-semibold text-slate-700">{fileName}</span> and turning it into text.</p>
      <div className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm">
        <ProgressItem label="Uploading audio" complete />
        <ProgressItem label="Converting speech to text" active />
        <ProgressItem label="Preparing your transcript" />
      </div>
      <p className="mt-6 text-xs text-slate-400">This usually takes a few seconds.</p>
    </section>
  );
}

function ProgressItem({ label, complete = false, active = false }: { label: string; complete?: boolean; active?: boolean }) {
  return <div className="flex items-center gap-3"><span className={`grid size-5 place-items-center rounded-full text-[11px] ${complete ? "bg-emerald-100 text-emerald-600" : active ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>{complete ? "✓" : active ? <span className="size-2 animate-pulse rounded-full bg-indigo-500" /> : "3"}</span><span className={active ? "font-semibold text-slate-800" : "text-slate-500"}>{label}</span></div>;
}
