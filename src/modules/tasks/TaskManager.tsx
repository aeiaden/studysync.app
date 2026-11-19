"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  getCourses,
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "@/src/lib/academicApi";
import type { Course, Task, TaskStatus } from "@/src/types/academic";

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // State untuk Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // State untuk Form Tambah Tugas
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  async function fetchData() {
    try {
      setIsLoading(true);
      setLoadError("");
      const [tasksData, coursesData] = await Promise.all([getTasks(), getCourses()]);
      setTasks(tasksData || []);
      setCourses(coursesData || []);
      if (coursesData && coursesData.length > 0 && !courseId) {
        setCourseId(coursesData[0].id);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat daftar tugas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormMessage("");
    setFormError("");

    if (!title.trim() || !courseId || !deadline) {
      setFormError("Nama tugas, mata kuliah, dan deadline wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createTask({
        title: title.trim(),
        course_id: courseId,
        deadline,
      });
      setTitle("");
      setDeadline("");
      setFormMessage("Tugas berhasil ditambahkan!");
      await fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan tugas.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: TaskStatus) {
    try {
      await updateTaskStatus(id, newStatus);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
      );
    } catch {
      alert("Gagal memperbarui status tugas. Silakan coba lagi.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch {
      alert("Gagal menghapus tugas. Silakan coba lagi.");
    }
  }

  // Filter & Search Array saat render
  const filteredTasks = tasks.filter((task) => {
    const matchName = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCourse = filterCourse === "All" || task.course_id === filterCourse;
    const matchStatus = filterStatus === "All" || task.status === filterStatus;
    return matchName && matchCourse && matchStatus;
  });

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Task Manager</h1>
        <p className="mt-1 text-sm text-slate-600">
          Catat tugas kuliah, pantau deadline, dan kelola progres pengerjaanmu.
        </p>
      </div>

      {/* FORM TAMBAH TUGAS */}
      <form
        onSubmit={handleAddTask}
        noValidate
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">Tambah Tugas Baru</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-700">
              Nama Tugas
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Laporan Praktikum 1"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="task-course" className="block text-sm font-medium text-slate-700">
              Mata Kuliah
            </label>
            <select
              id="task-course"
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
            <label htmlFor="task-deadline" className="block text-sm font-medium text-slate-700">
              Deadline
            </label>
            <input
              id="task-deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
            />
          </div>
        </div>

        {formError && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {formError}
          </p>
        )}
        {formMessage && (
          <p role="status" className="text-sm font-medium text-green-600">
            {formMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Tugas"}
        </button>
      </form>

      {/* SEARCH & FILTER BAR */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div>
          <label htmlFor="search-task" className="block text-sm font-medium text-slate-700">
            Cari Tugas
          </label>
          <input
            id="search-task"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik judul tugas..."
            className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="filter-course" className="block text-sm font-medium text-slate-700">
            Filter Mata Kuliah
          </label>
          <select
            id="filter-course"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
          >
            <option value="All">Semua Mata Kuliah</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-status" className="block text-sm font-medium text-slate-700">
            Filter Status
          </label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
          >
            <option value="All">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {/* DAFTAR TUGAS */}
      {isLoading ? (
        <p className="text-slate-600">Memuat daftar tugas...</p>
      ) : loadError ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </p>
      ) : filteredTasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Belum ada tugas atau tidak ada tugas yang sesuai filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <article
              key={task.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {task.courses?.name ?? "Umum"}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{task.title}</h3>
                <p className="mt-2 text-xs text-slate-500">
                  Deadline:{" "}
                  <span className="font-medium text-slate-700">
                    {new Date(task.deadline).toLocaleString("id-ID")}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <select
                  aria-label={`Ubah status ${task.title}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
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