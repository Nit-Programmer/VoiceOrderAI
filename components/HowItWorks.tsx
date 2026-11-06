const steps = [
  { number: "01", title: "Record Voice", description: "Start a recording right in your browser as your customer speaks.", icon: "🎤" },
  { number: "02", title: "Speech Recognition", description: "VoiceOrder AI turns the conversation into searchable text.", icon: "✦" },
  { number: "03", title: "AI Order Understanding", description: "AI identifies the details that matter in every order.", icon: "⌘" },
  { number: "04", title: "Structured Order Summary", description: "Review a clean, actionable order before your team fulfils it.", icon: "✓" },
];

/** Explains the four-step path from conversation to order summary. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">How it works</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">From conversation to clarity.</h2><p className="mt-4 text-base leading-7 text-slate-500">A simple four-step flow that keeps the details organized.</p></div>
        <ol className="relative mt-14 grid gap-5 md:grid-cols-4 md:gap-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200 md:block" aria-hidden="true" />
          {steps.map((step) => <li key={step.number} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="relative z-10 grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">{step.icon}</div><span className="absolute right-6 top-6 text-xs font-bold text-slate-300">{step.number}</span><h3 className="mt-7 text-base font-bold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p><span className="mt-5 inline-block text-indigo-300 md:hidden" aria-hidden="true">↓</span></li>)}
        </ol>
      </div>
    </section>
  );
}
