import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/src/components/Navbar";
import { AuthGuard } from "@/src/components/AuthGuard";
import "@/src/styles/globals.css";

export const metadata: Metadata = {
  title: "StudySync - Academic & Study Planner",
  description: "Aplikasi pencatat tugas kuliah, jadwal kegiatan, dan catatan perkuliahan mahasiswa.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">
          <AuthGuard>{children}</AuthGuard>
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          StudySync &copy; 2026 &mdash; Final Project Web Development I
        </footer>
      </body>
    </html>
  );
}