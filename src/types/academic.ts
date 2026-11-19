export type Course = {
  id: string;
  code: string;
  name: string;
  lecturer?: string;
};

export type TaskStatus = "Pending" | "In Progress" | "Done";

export type Task = {
  id: string;
  course_id: string;
  title: string;
  deadline: string;
  status: TaskStatus;
  courses?: { name: string; code: string };
};

export type Schedule = {
  id: string;
  course_id: string | null;
  activity_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location?: string;
  courses?: { name: string };
};

export type Note = {
  id: string;
  course_id: string;
  title: string;
  content: string;
  created_at: string;
  courses?: { name: string };
};