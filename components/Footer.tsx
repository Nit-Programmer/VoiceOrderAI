/** Closes the page with a compact brand and technology attribution. */
export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left lg:px-10"><div className="flex items-center gap-2 font-bold text-slate-900"><span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xs text-white">⌁</span> VoiceOrder AI</div><p className="text-sm text-slate-500">Built with Next.js and Tailwind CSS</p><p className="text-xs text-slate-400">© 2026 VoiceOrder AI</p></div>
    </footer>
  );
}
