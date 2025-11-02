export interface TodoModel {
  id: number;
  name: string;
  description?: string;
  deadline?: string; // Format: "YYYY-MM-DD"
  completed: boolean;
  category_id?: number;
}
