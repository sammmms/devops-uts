export interface CategoryModel {
  id: number;
  name: string;
  todos_count?: number;
}

export interface CategoryCreateModel {
  name: string;
}
