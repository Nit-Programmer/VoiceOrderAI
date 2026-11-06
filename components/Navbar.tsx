import Link from "next/link";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "Contact", href: "#contact" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Order History", href: "/order-history" },
];

/** Renders the responsive site navigation and primary conversion link. */
export default function Navbar() {
  return (
    <header className="relative z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        <a href="#home" className="flex items-center gap-2.5" aria-label="VoiceOrder AI home">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-indigo-200">
            <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M6 11a6 6 0 0 0 12 0M12 17v4M8.5 21h7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-950">VoiceOrder <span className="text-indigo-600">AI</span></span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => item.href.startsWith("/") ? <Link key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">{item.label}</Link> : <a key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">{item.label}</a>)}
        </div>

        <a href="#get-started" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition-transform hover:-translate-y-0.5 hover:bg-indigo-600 sm:px-5">
          Get Started
        </a>
      </nav>
    </header>
  );
}
