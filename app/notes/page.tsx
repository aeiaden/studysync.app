import type { Metadata } from "next";
import { NoteManager } from "@/src/modules/notes/NoteManager";

export const metadata: Metadata = {
  title: "Lecture Notes | StudySync",
  description: "Simpan dan baca kembali catatan perkuliahan berdasarkan mata kuliah.",
};

export default function NotesPage() {
  return <NoteManager />;
}