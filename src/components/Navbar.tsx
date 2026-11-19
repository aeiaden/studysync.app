import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <nav
        aria-label="Navigasi Utama"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4"
      >
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-600">
          StudySync
        </Link>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700 sm:gap-6">
          <Link href="/" className="transition hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/tasks" className="transition hover:text-blue-600">
            Task Manager
          </Link>
          <Link href="/schedule" className="transition hover:text-blue-600">
            Schedule
          </Link>
          <Link href="/notes" className="transition hover:text-blue-600">
            Notes
          </Link>
        </div>
      </nav>
    </header>
  );
}