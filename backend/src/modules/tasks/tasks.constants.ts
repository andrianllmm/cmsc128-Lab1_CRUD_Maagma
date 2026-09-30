export const PRIORITIES = ["None", "Low", "Medium", "High"] as const;
export const TAGS = ["Work", "School", "Personal", "Others"] as const;
export const TITLE_MAX_LENGTH = 200;

export type Priority = (typeof PRIORITIES)[number];
export type Tag = (typeof TAGS)[number];
