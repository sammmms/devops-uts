export interface TodoModel {
  id: number;
  name: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
}
