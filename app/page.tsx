"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTasks, getSchedules, getNotes } from "@/src/lib/academicApi";
import type { Task, Schedule, Note } from "@/src/types/academic";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const [tasksData, schedulesData, notesData] = await Promise.all([
          getTasks(),
          getSchedules(),
          getNotes(),
        ]);
        setTasks(tasksData || []);
        setSchedules(schedulesData || []);
        setNotes(notesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const pendingTasks = tasks.filter((t) => t.status !== "Done");
  const completedTasks = tasks.filter((t) => t.status === "Done");

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Selamat Datang di StudySync</h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Pantau deadline tugas, jadwal kuliah, dan ringkasan catatan perkuliahanmu dalam satu tempat.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            + Kelola Tugas
          </Link>
          <Link
            href="/schedule"
            className="rounded-lg border border-blue-400 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Lihat Jadwal
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p className="text-slate-600">Memuat ringkasan akademik...</p>
      ) : error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <>
          {/* Kartu Statistik */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Tugas Belum Selesai</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{pendingTasks.length}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Tugas Selesai</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{completedTasks.length}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Jadwal Kegiatan</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{schedules.length}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Catatan Tersimpan</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{notes.length}</p>
            </article>
          </div>

          {/* Ringkasan Tugas Terdekat & Jadwal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Deadline Terdekat</h2>
                <Link href="/tasks" className="text-sm font-medium text-blue-600 hover:underline">
                  Semua tugas &rarr;
                </Link>
              </div>
              {pendingTasks.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">Tidak ada tugas tertunda. Mantap!</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {pendingTasks.slice(0, 4).map((task) => (
                    <li key={task.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-blue-600">{task.courses?.name}</p>
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Deadline: {new Date(task.deadline).toLocaleString("id-ID")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Jadwal Kuliah & Kegiatan</h2>
                <Link href="/schedule" className="text-sm font-medium text-blue-600 hover:underline">
                  Kelola jadwal &rarr;
                </Link>
              </div>
              {schedules.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">Belum ada jadwal yang ditambahkan.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {schedules.slice(0, 4).map((item) => (
                    <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-blue-600">
                          {item.day_of_week}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-slate-900">{item.activity_name}</p>
                      {item.location && (
                        <p className="text-xs text-slate-500">Lokasi: {item.location}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}