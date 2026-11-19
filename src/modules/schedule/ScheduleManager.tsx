"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/src/lib/supabase";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSchedules,
  createSchedule,
  deleteSchedule,
} from "@/src/lib/academicApi";
import type { Course, Schedule } from "@/src/types/academic";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // State Form Mata Kuliah (Tambah & Edit)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseLecturer, setCourseLecturer] = useState("");
  const [courseMsg, setCourseMsg] = useState("");
  const [courseErr, setCourseErr] = useState("");

  // State Form Jadwal (Tambah & Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activityName, setActivityName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Senin");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  async function fetchData() {
    try {
      setIsLoading(true);
      const [schedulesData, coursesData] = await Promise.all([getSchedules(), getCourses()]);
      setSchedules(schedulesData || []);
      setCourses(coursesData || []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLER MATA KULIAH ---
  function resetCourseForm() {
    setEditingCourseId(null);
    setCourseCode("");
    setCourseName("");
    setCourseLecturer("");
  }

  function handleEditCourseClick(course: Course) {
    setEditingCourseId(course.id);
    setCourseCode(course.code);
    setCourseName(course.name);
    setCourseLecturer(course.lecturer ?? "");
    setCourseMsg("");
    setCourseErr("");
  }

  async function handleSaveCourse(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCourseMsg("");
    setCourseErr("");

    if (!courseCode.trim() || !courseName.trim()) {
      setCourseErr("Kode dan nama mata kuliah wajib diisi.");
      return;
    }

    try {
      const payload = {
        code: courseCode.trim().toUpperCase(),
        name: courseName.trim(),
        lecturer: courseLecturer.trim() || null,
      };

      if (editingCourseId) {
        await updateCourse(editingCourseId, payload);
        setCourseMsg("Mata kuliah berhasil diperbarui!");
      } else {
        await createCourse({
          code: payload.code,
          name: payload.name,
          lecturer: payload.lecturer ?? undefined,
        });
        setCourseMsg("Mata kuliah berhasil ditambahkan!");
      }

      resetCourseForm();
      await fetchData();
    } catch (err) {
      setCourseErr(err instanceof Error ? err.message : "Gagal menyimpan mata kuliah.");
    }
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm("Hapus mata kuliah ini? Tugas dan catatan terkait juga akan terhapus.")) return;
    try {
      await deleteCourse(id);
      if (editingCourseId === id) resetCourseForm();
      await fetchData();
    } catch {
      alert("Gagal menghapus mata kuliah.");
    }
  }

  // --- HANDLER JADWAL ---
  function resetForm() {
    setEditingId(null);
    setActivityName("");
    setCourseId("");
    setDayOfWeek("Senin");
    setStartTime("08:00");
    setEndTime("10:00");
    setLocation("");
  }

  function handleEditClick(item: Schedule) {
    setEditingId(item.id);
    setActivityName(item.activity_name);
    setCourseId(item.course_id ?? "");
    setDayOfWeek(item.day_of_week);
    setStartTime(item.start_time.slice(0, 5));
    setEndTime(item.end_time.slice(0, 5));
    setLocation(item.location ?? "");
    setFormMessage("");
    setFormError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormMessage("");
    setFormError("");

    if (!activityName.trim() || !startTime || !endTime) {
      setFormError("Nama kegiatan, jam mulai, dan jam selesai wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        activity_name: activityName.trim(),
        course_id: courseId || null,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        location: location.trim(),
      };

      if (editingId) {
        const { error } = await supabase.from("schedules").update(payload).eq("id", editingId);
        if (error) throw new Error("Gagal memperbarui jadwal.");
        setFormMessage("Jadwal berhasil diperbarui!");
      } else {
        await createSchedule(payload);
        setFormMessage("Jadwal baru berhasil ditambahkan!");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan jadwal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSchedule(id: string) {
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Gagal menghapus jadwal.");
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Schedule &amp; Mata Kuliah</h1>
        <p className="mt-1 text-sm text-slate-600">
          Kelola daftar mata kuliah semester ini serta jadwal kegiatan mingguanmu.
        </p>
      </div>

      {/* BAGIAN 1: KELOLA MATA KULIAH */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingCourseId ? "Edit Mata Kuliah" : "Daftar Mata Kuliah"}
        </h2>
        <form onSubmit={handleSaveCourse} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="course-code" className="block text-xs font-medium text-slate-700">
              Kode Matkul
            </label>
            <input
              id="course-code"
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Contoh: TIF201"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="course-name" className="block text-xs font-medium text-slate-700">
              Nama Mata Kuliah
            </label>
            <input
              id="course-name"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Contoh: Jaringan Komputer"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="course-lecturer" className="block text-xs font-medium text-slate-700">
              Dosen (Opsional)
            </label>
            <input
              id="course-lecturer"
              type="text"
              value={courseLecturer}
              onChange={(e) => setCourseLecturer(e.target.value)}
              placeholder="Nama dosen"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
            >
              {editingCourseId ? "Simpan Perubahan" : "+ Tambah Matkul"}
            </button>
            {editingCourseId && (
              <button
                type="button"
                onClick={resetCourseForm}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {courseErr && <p role="alert" className="text-xs font-medium text-red-600">{courseErr}</p>}
        {courseMsg && <p role="status" className="text-xs font-medium text-green-600">{courseMsg}</p>}

        {/* Daftar Kartu/Chip Mata Kuliah */}
        <div className="flex flex-wrap gap-2 pt-2">
          {courses.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
            >
              <span>
                <strong>{c.code}</strong> - {c.name}
                {c.lecturer ? ` (${c.lecturer})` : ""}
              </span>
              <button
                type="button"
                onClick={() => handleEditCourseClick(c)}
                className="ml-1 font-semibold text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                aria-label={`Hapus mata kuliah ${c.name}`}
                onClick={() => handleDeleteCourse(c.id)}
                className="font-semibold text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* BAGIAN 2: FORM TAMBAH / EDIT JADWAL */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId ? "Edit Jadwal Kegiatan" : "Tambah Jadwal Kegiatan"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="sched-name" className="block text-sm font-medium text-slate-700">
              Nama Kegiatan / Kuliah
            </label>
            <input
              id="sched-name"
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="Contoh: Kuliah WebDev / Rapat Himpunan"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="sched-course" className="block text-sm font-medium text-slate-700">
              Mata Kuliah (Opsional)
            </label>
            <select
              id="sched-course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
            >
              <option value="">-- Kegiatan Umum / Non-Matkul --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sched-day" className="block text-sm font-medium text-slate-700">
              Hari
            </label>
            <select
              id="sched-day"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sched-start" className="block text-sm font-medium text-slate-700">
              Jam Mulai
            </label>
            <input
              id="sched-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="sched-end" className="block text-sm font-medium text-slate-700">
              Jam Selesai
            </label>
            <input
              id="sched-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="sched-loc" className="block text-sm font-medium text-slate-700">
              Lokasi / Ruang
            </label>
            <input
              id="sched-loc"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Ruang E6 / Zoom"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
            />
          </div>
        </div>

        {formError && <p role="alert" className="text-sm font-medium text-red-600">{formError}</p>}
        {formMessage && <p role="status" className="text-sm font-medium text-green-600">{formMessage}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : editingId ? "Update Jadwal" : "Simpan Jadwal"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* BAGIAN 3: DAFTAR JADWAL */}
      {isLoading ? (
        <p className="text-slate-600">Memuat jadwal...</p>
      ) : loadError ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{loadError}</p>
      ) : schedules.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Belum ada jadwal kegiatan. Tambahkan jadwal pertamamu di atas!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    {item.day_of_week}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{item.activity_name}</h3>
                {item.courses?.name && (
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    Matkul: {item.courses.name}
                  </p>
                )}
                {item.location && (
                  <p className="mt-1 text-xs text-slate-500">Lokasi: {item.location}</p>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-4 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleEditClick(item)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSchedule(item.id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}