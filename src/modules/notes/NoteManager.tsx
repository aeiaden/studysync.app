"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getCourses, getNotes, createNote, deleteNote } from "@/src/lib/academicApi";
import type { Course, Note } from "@/src/types/academic";

export function NoteManager() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // State Form Catatan
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  async function fetchData() {
    try {
      setIsLoading(true);
      const [notesData, coursesData] = await Promise.all([getNotes(), getCourses()]);
      setNotes(notesData || []);
      setCourses(coursesData || []);
      if (coursesData && coursesData.length > 0 && !courseId) {
        setCourseId(coursesData[0].id);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat catatan.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleAddNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormMessage("");
    setFormError("");

    if (!courseId || !title.trim() || !content.trim()) {
      setFormError("Mata kuliah, judul catatan, dan isi catatan wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createNote({
        course_id: courseId,
        title: title.trim(),
        content: content.trim(),
      });
      setTitle("");
      setContent("");
      setFormMessage("Catatan perkuliahan berhasil disimpan!");
      await fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan catatan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert("Gagal menghapus catatan.");
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Lecture Notes</h1>
        <p className="mt-1 text-sm text-slate-600">
          Simpan rangkuman materi dan catatan penting dari setiap pertemuan kuliah.
        </p>
      </div>

      {/* FORM SIMPAN CATATAN */}
      <form
        onSubmit={handleAddNote}
        noValidate
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">Buat Catatan Baru</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="note-course" className="block text-sm font-medium text-slate-700">
              Mata Kuliah
            </label>
            <select
              id="note-course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-slate-700">
              Judul Catatan / Topik Pertemuan
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pertemuan 5 - Integrasi Supabase"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="note-content" className="block text-sm font-medium text-slate-700">
            Isi Catatan
          </label>
          <textarea
            id="note-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis poin-poin penting materi kuliah di sini..."
            className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
          />
        </div>

        {formError && <p role="alert" className="text-sm font-medium text-red-600">{formError}</p>}
        {formMessage && <p role="status" className="text-sm font-medium text-green-600">{formMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Catatan"}
        </button>
      </form>

      {/* DAFTAR CATATAN */}
      {isLoading ? (
        <p className="text-slate-600">Memuat catatan...</p>
      ) : loadError ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{loadError}</p>
      ) : notes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Belum ada catatan perkuliahan tersimpan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <article
              key={note.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {note.courses?.name ?? "Umum"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(note.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{note.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleDelete(note.id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Hapus Catatan
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}