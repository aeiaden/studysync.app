import type { Metadata } from "next";
import { ScheduleManager } from "@/src/modules/schedule/ScheduleManager";

export const metadata: Metadata = {
  title: "Schedule | StudySync",
  description: "Atur jadwal kuliah mingguan dan kegiatan akademik mahasiswa.",
};

export default function SchedulePage() {
  return <ScheduleManager />;
}