/** Offers the final, high-visibility invitation to upload an order recording. */
export default function CTA() {
  return (
    <section id="get-started" className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-14 text-center shadow-2xl shadow-indigo-200 sm:px-12 sm:py-18">
        <div className="absolute -left-16 -top-24 size-72 rounded-full bg-white/10" /><div className="absolute -bottom-32 -right-12 size-96 rounded-full bg-indigo-400/25" />
        <div className="relative mx-auto max-w-2xl"><span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 text-2xl ring-1 ring-white/20">↥</span><h2 className="mt-6 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">Ready to simplify order management?</h2><p className="mt-4 text-base leading-7 text-indigo-100">Upload your next customer conversation, then turn it into an organized order in just a few clicks.</p><div className="mt-8 flex justify-center"><a href="#audio-upload" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-transform hover:-translate-y-0.5">Upload a recording <span aria-hidden="true">→</span></a></div></div>
      </div>
    </section>
  );
}
