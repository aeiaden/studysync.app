# StudySync — Academic & Study Planner

Aplikasi web manajemen akademik mahasiswa untuk mencatat tugas beserta *deadline*, mengatur jadwal perkuliahan dan kegiatan mingguan, serta menyimpan catatan materi perkuliahan per mata kuliah.

## Fitur Utama
- **Dashboard Ringkas:** Menampilkan statistik jumlah tugas tertunda, tugas selesai, jadwal kegiatan, catatan tersimpan, serta *deadline* terdekat.
- **Task Manager (CRUD + Search & Filter):** Menambah tugas baru, mengubah status pengerjaan (`Pending`, `In Progress`, `Done`), menghapus tugas, mencari tugas berdasarkan nama, serta memfilter berdasarkan mata kuliah dan status.
- **Schedule & Mata Kuliah (CRUD):** Mengelola daftar mata kuliah semester dan mengatur jadwal kegiatan mingguan (hari, jam mulai–selesai, dan lokasi).
- **Lecture Notes:** Menyimpan dan mengelola catatan ringkasan materi perkuliahan berdasarkan mata kuliah.

## Tech Stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS (Mobile-first Responsive Design)
- **Database & Backend:** Supabase (PostgreSQL + Row Level Security)
- **Deployment:** Vercel

## Cara Menjalankan di Lokal (Setup)
1. Clone repository ini:
   ```bash
   git clone https://github.com/aeiaden/studysync.app.git
cd studysync.app