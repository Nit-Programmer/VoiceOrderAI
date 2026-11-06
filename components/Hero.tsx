import SpeechToTextFlow from "./SpeechToTextFlow";

/** Builds the introduction and visual product preview for the landing page. */
export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_18%_22%,rgba(199,210,254,0.8),transparent_30%),radial-gradient(circle_at_78%_30%,rgba(191,219,254,0.65),transparent_28%)]" />
      <div className="mx-auto max-w-7xl px-5 pb-18 pt-18 sm:px-8 sm:pt-24 lg:px-10 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-2 text-sm font-semibold text-indigo-700 shadow-sm"><span className="size-2 rounded-full bg-indigo-500" />The smarter way to capture orders</div>
          <h1 className="mt-6 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[3.55rem] lg:leading-[1.06]">Turn voice orders into <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">structured business orders</span> with AI.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Upload a customer conversation from any device, or record one directly in your browser. VoiceOrder AI turns speech into structured orders, helping small businesses reduce mistakes and save time.</p>
        </div>

        <SpeechToTextFlow />
        <div className="mt-5 flex flex-col items-center gap-4 text-sm text-slate-500 sm:flex-row sm:justify-center sm:gap-6"><a href="#demo" className="inline-flex items-center gap-2 font-bold text-indigo-700 transition-colors hover:text-indigo-900"><span className="grid size-5 place-items-center rounded-full bg-indigo-50 text-[10px] text-indigo-600" aria-hidden="true">▶</span>Watch Demo</a><span className="flex items-center gap-2"><span className="text-emerald-500">✓</span>Stored locally</span><span className="flex items-center gap-2"><span className="text-emerald-500">✓</span>Browser-based</span></div>

        <div className="mt-16"><DashboardPreview /></div>
      </div>
    </section>
  );
}

/** Provides a polished, static dashboard illustration without external assets. */
function DashboardPreview() {
  const waveform = [35, 58, 28, 76, 46, 88, 39, 62, 29, 72, 51, 82, 42, 64, 34, 55, 25, 68];
  return (
    <div id="demo" className="relative mx-auto w-full max-w-5xl">
      <div className="absolute -inset-8 -z-10 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl shadow-indigo-200/60 ring-1 ring-slate-200/70">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5"><div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-rose-300" /><span className="size-2.5 rounded-full bg-amber-300" /><span className="size-2.5 rounded-full bg-emerald-300" /></div><div className="rounded-md bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-400">app.voiceorder.ai</div><span className="size-5" /></div>
        <div className="grid min-h-[370px] grid-cols-[110px_1fr] bg-slate-50 sm:min-h-[405px] sm:grid-cols-[128px_1fr]">
          <aside className="hidden border-r border-slate-100 bg-white p-4 sm:block"><div className="mb-7 flex items-center gap-2 text-xs font-bold text-slate-900"><span className="size-5 rounded-md bg-indigo-600" />VoiceOrder</div>{["Overview", "Orders", "Recordings", "Analytics"].map((item, index) => <div key={item} className={`mb-2 rounded-lg px-2.5 py-2 text-[10px] font-medium ${index === 1 ? "bg-indigo-50 text-indigo-700" : "text-slate-400"}`}>{item}</div>)}</aside>
          <div className="col-span-2 p-4 sm:col-span-1 sm:p-6">
            <div className="flex items-start justify-between"><div><p className="text-[11px] font-medium text-slate-400">Tuesday, November 03</p><h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">Good morning, Olivia</h2></div><span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">OL</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-lg shadow-indigo-200"><p className="text-[10px] font-medium text-indigo-100">Order captured</p><p className="mt-1 text-sm font-semibold">#VO-2048</p><p className="mt-5 text-[10px] text-indigo-100">Ready to review <span className="float-right text-base text-white">→</span></p></div><div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex justify-between"><p className="text-[10px] font-medium text-slate-400">This week</p><span className="text-[10px] text-emerald-500">+18%</span></div><p className="mt-2 text-xl font-bold text-slate-900">24</p><p className="text-[10px] text-slate-400">Orders processed</p></div></div>
            <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-800">Uploaded conversation</p><p className="mt-1 text-[10px] text-slate-400">Maya&apos;s Bakery · 00:18</p></div><span className="flex size-8 items-center justify-center rounded-full bg-indigo-50"><span className="size-2.5 rounded-sm bg-indigo-500" /></span></div><div className="mt-5 flex h-8 items-center justify-between gap-1">{waveform.map((height, index) => <span key={index} className="w-full rounded-full bg-gradient-to-t from-blue-500 to-indigo-400" style={{ height: `${height}%` }} />)}</div></div>
            <div className="mt-4 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[10px] font-bold text-slate-800">Extracted items</p><span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">98% confidence</span></div><div className="mt-3 flex justify-between border-t border-slate-50 pt-2 text-[10px]"><span className="text-slate-500">2× Sourdough loaves</span><span className="font-semibold text-slate-700">$14.00</span></div><div className="mt-2 flex justify-between text-[10px]"><span className="text-slate-500">1× Blueberry muffins</span><span className="font-semibold text-slate-700">$8.00</span></div></div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl shadow-slate-300/40 sm:flex"><span className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-500">✓</span><div><p className="text-xs font-bold text-slate-800">Order ready</p><p className="text-[10px] text-slate-400">AI processed in seconds</p></div></div>
    </div>
  );
}
