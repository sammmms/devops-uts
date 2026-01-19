export type Priority = "low" | "medium" | "high" | "urgent";

export interface TodoModel {
  id: number;
  name: string;
  description?: string;
  deadline?: string; // Format: "YYYY-MM-DD"
  completed: boolean;
  priority: Priority;
  category_id?: number;
}
