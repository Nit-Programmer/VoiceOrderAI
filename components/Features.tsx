const features = [
  { icon: "🎤", title: "Voice Recording", description: "Record customer orders directly in the browser." },
  { icon: "📝", title: "Speech to Text", description: "Convert spoken conversations into accurate text." },
  { icon: "🧠", title: "AI Understanding", description: "Extract products, quantities, prices, and customer information." },
  { icon: "📦", title: "Structured Order", description: "Generate a clean order summary ready for business use." },
];

const benefits = [
  { number: "01", title: "Fast Processing", description: "Move from a spoken order to a clear summary in seconds." },
  { number: "02", title: "High Accuracy", description: "Capture the crucial details that keep every order on track." },
  { number: "03", title: "Easy to Use", description: "A focused workflow your team can use from day one." },
];

/** Shows product capabilities and the core reasons to choose VoiceOrder AI. */
export default function Features() {
  return (
    <>
      <section id="features" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading eyebrow="Everything you need" title="Built for better order taking." description="A simple workflow that turns every customer conversation into a business-ready order." />
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => <article key={feature.title} className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-6 transition-all hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50"><span className="grid size-11 place-items-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-slate-100">{feature.icon}</span><h3 className="mt-5 text-base font-bold text-slate-900">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p><span className="mt-5 inline-block text-sm font-bold text-indigo-600 transition-transform group-hover:translate-x-1">Learn more →</span></article>)}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
        <div className="absolute -right-32 top-0 size-96 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading dark eyebrow="Why choose VoiceOrder AI" title="A calmer way to keep business moving." description="Designed to give small teams more confidence in every customer order." />
          <div className="mt-11 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => <article key={benefit.number} className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"><span className="text-sm font-bold text-indigo-300">{benefit.number}</span><h3 className="mt-10 text-xl font-bold text-white">{benefit.title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">{benefit.description}</p><div className="mt-7 h-px bg-gradient-to-r from-indigo-400 to-transparent" /></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

/** Reusable heading treatment for the feature blocks. */
function SectionHeading({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description: string; dark?: boolean }) {
  return <div className="max-w-2xl"><p className={`text-sm font-bold uppercase tracking-[0.16em] ${dark ? "text-indigo-300" : "text-indigo-600"}`}>{eyebrow}</p><h2 className={`mt-3 text-3xl font-bold tracking-[-0.035em] sm:text-4xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2><p className={`mt-4 text-base leading-7 ${dark ? "text-slate-300" : "text-slate-500"}`}>{description}</p></div>;
}
