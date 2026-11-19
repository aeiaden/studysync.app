"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-center">
      <h2 className="text-xl font-bold text-red-600">Terjadi Kesalahan</h2>
      <p className="mt-2 text-sm text-slate-600">
        Maaf, halaman gagal dimuat. Silakan coba muat ulang.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Coba Lagi
      </button>
    </div>
  );
}