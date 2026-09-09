export const PRIORITIES = ["Low", "Medium", "High", "None"] as const;
export const TAGS = ["Work", "School", "Personal", "Others"] as const;

export type Priority = (typeof PRIORITIES)[number];
export type Tag = (typeof TAGS)[number];

export interface Task {
  _id: string;
  title: string;
  dueDate?: string | null;
  done: boolean;
  priority: Priority;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}
