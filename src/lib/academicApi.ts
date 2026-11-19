import { supabase } from "./supabase";
import type { TaskStatus } from "@/src/types/academic";

// --- COURSES ---
export async function getCourses() {
  const { data, error } = await supabase.from("courses").select("*").order("code");
  if (error) throw new Error("Gagal memuat daftar mata kuliah.");
  return data;
}

export async function createCourse(payload: { code: string; name: string; lecturer?: string }) {
  const { error } = await supabase.from("courses").insert(payload);
  if (error) {
    if (error.code === "23505") throw new Error("Kode mata kuliah sudah terdaftar.");
    throw new Error(`Gagal menambahkan mata kuliah: ${error.message}`);
  }
}

export async function updateCourse(
  id: string,
  payload: { code: string; name: string; lecturer?: string | null }
) {
  const { error } = await supabase.from("courses").update(payload).eq("id", id);
  if (error) {
    if (error.code === "23505") throw new Error("Kode mata kuliah sudah terdaftar.");
    throw new Error(`Gagal memperbarui mata kuliah: ${error.message}`);
  }
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus mata kuliah.");
}

// --- TASKS (CRUD) ---
export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, courses(name, code)")
    .order("deadline", { ascending: true });
  if (error) throw new Error("Gagal memuat daftar tugas.");
  return data;
}

export async function createTask(payload: { title: string; course_id: string; deadline: string }) {
  const { error } = await supabase.from("tasks").insert(payload);
  if (error) throw new Error("Gagal menambahkan tugas baru.");
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
  if (error) throw new Error("Gagal memperbarui status tugas.");
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus tugas.");
}

// --- SCHEDULES (CRUD) ---
export async function getSchedules() {
  const { data, error } = await supabase
    .from("schedules")
    .select("*, courses(name)")
    .order("start_time", { ascending: true });
  if (error) throw new Error("Gagal memuat jadwal.");
  return data;
}

export async function createSchedule(payload: {
  activity_name: string;
  course_id: string | null;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location: string;
}) {
  const { error } = await supabase.from("schedules").insert(payload);
  if (error) throw new Error("Gagal menambah jadwal.");
}

export async function deleteSchedule(id: string) {
  const { error } = await supabase.from("schedules").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus jadwal.");
}

// --- NOTES (CREATE, READ, DELETE) ---
export async function getNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("*, courses(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Gagal memuat catatan.");
  return data;
}

export async function createNote(payload: { course_id: string; title: string; content: string }) {
  const { error } = await supabase.from("notes").insert(payload);
  if (error) throw new Error("Gagal menyimpan catatan.");
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus catatan.");
}