export interface CategoryModel {
  id: number;
  name: string;
  todos_count?: number;
  user_id?: string;
}

export interface CategoryCreateModel {
  name: string;
}
