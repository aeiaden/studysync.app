"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <nav
        aria-label="Navigasi Utama"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4"
      >
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-600">
          StudySync
        </Link>

        {userEmail ? (
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700 sm:gap-6">
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

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <span className="hidden text-xs text-slate-500 md:inline">{userEmail}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                Keluar
              </button>
            </div>
          </div>
        ) : (
          pathname !== "/login" && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Masuk / Daftar
              </Link>
            </div>
          )
        )}
      </nav>
    </header>
  );
}