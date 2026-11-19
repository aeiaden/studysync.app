import type { Metadata } from "next";
import { TaskManager } from "@/src/modules/tasks/TaskManager";

export const metadata: Metadata = {
  title: "Task Manager | StudySync",
  description: "Kelola daftar tugas kuliah, cari berdasarkan nama, dan filter status pengerjaan.",
};

export default function TasksPage() {
  return <TaskManager />;
}