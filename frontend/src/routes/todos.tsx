import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { ProtectedRoute } from "@/components";
import type { CategoryModel } from "@/models/CategoryModel";
import type { TodoModel } from "@/models/TodoModel";
import axiosInstance from "@/utils/axios_instance";
import { Plus } from "lucide-react";
import {
  TodosList,
  CategoriesList,
  CreateCategoryDialog,
  CreateTodoDialog,
  CategoriesListShimmer,
  TodosListShimmer,
} from "@/components";
import * as React from "react";

const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<CategoryModel[]> => {
    const res = await axiosInstance.get("/category");
    return res.data.categories;
  },
});

const todosQuery = (
  categoryId?: number | null,
  filters?: { completed?: boolean; overdue?: boolean }
) =>
  queryOptions({
    queryKey: ["todos", categoryId, filters],
    queryFn: async (): Promise<TodoModel[]> => {
      const params: any = { category_id: categoryId };
      if (filters?.completed !== undefined)
        params.completed = filters.completed;
      if (filters?.overdue !== undefined) params.overdue = filters.overdue;

      const res = await axiosInstance.get("/todo", { params });
      return res.data.todos;
    },
  });

export const Route = createFileRoute("/todos")({
  component: TodosPage,
  validateSearch: (search: Record<string, unknown>): { filter?: string } => {
    return {
      filter: (search.filter as string) || undefined,
    };
  },
});

function TodosPage() {
  const { filter } = Route.useSearch();
  const queryClient = useQueryClient();

  // Category Dialog State
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");

  // Todo Dialog State
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | undefined>(
    undefined
  );
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);

  // Category Filter State
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    -1
  );

  // Derived filters based on 'filter' search param
  const filters = {
    completed:
      filter === "completed" ? true : filter === "pending" ? false : undefined,
    overdue: filter === "overdue" ? true : undefined,
  };

  // Handlers
  const handleOpenAddDialog = () => {
    setEditingCategory(null);
    setCategoryName("");
    setIsCategoryDialogOpen(true);
  };

  const handleOpenEditDialog = (category: CategoryModel) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsCategoryDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await axiosInstance.put(`/category/${editingCategory.id}`, {
          id: editingCategory.id,
          name: categoryName,
        });
        showSuccessToast("Category updated successfully!");
      } else {
        await axiosInstance.post("/category", { name: categoryName });
        showSuccessToast("Category created successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleCloseDialog();
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Error saving category"
      );
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axiosInstance.delete(`/category/${categoryId}`);
        showSuccessToast("Category deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        if (selectedCategoryId === categoryId) {
          setSelectedCategoryId(null);
        }
      } catch (error) {
        showErrorToast(
          error instanceof Error ? error.message : "Error deleting category"
        );
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleTodoSubmit = async (todo: TodoModel) => {
    try {
      if (selectedTodo === undefined) {
        await axiosInstance.post("/todo", todo);
        showSuccessToast("Todo created successfully!");
      } else {
        if (selectedTodo.id) {
          await axiosInstance.put(`/todo/${selectedTodo.id}`, todo);
          showSuccessToast("Todo updated successfully!");
        }
      }
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsTodoDialogOpen(false);
      setSelectedTodo(undefined);
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Error saving todo"
      );
      console.error("Error saving todo:", error);
    }
  };

  const handleDeleteTodo = async (
    index: number,
    filteredTodos: TodoModel[]
  ) => {
    try {
      const todoToDelete = filteredTodos[index];
      if (todoToDelete?.id) {
        await axiosInstance.delete(`/todo/${todoToDelete.id}`);
        showSuccessToast("Todo deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      }
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Error deleting todo"
      );
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditTodo = (index: number, filteredTodos: TodoModel[]) => {
    setSelectedTodo(filteredTodos[index]);
    setIsTodoDialogOpen(true);
  };

  const handleToggleComplete = async (todo: TodoModel) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axiosInstance.put(`/todo/${todo.id}`, updatedTodo);
      showSuccessToast(
        updatedTodo.completed ? "Todo completed!" : "Todo marked as pending!"
      );
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Error updating todo"
      );
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleOpenAddTodoDialog = () => {
    setSelectedTodo(undefined);
    setIsTodoDialogOpen(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Categories Section */}
            <div className="lg:col-span-1">
              <React.Suspense fallback={<CategoriesListShimmer />}>
                <CategoriesSection
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  onOpenAddDialog={handleOpenAddDialog}
                  onDeleteCategory={handleDeleteCategory}
                  onEditCategory={handleOpenEditDialog}
                />
              </React.Suspense>
            </div>

            {/* Todos Section */}
            <div className="lg:col-span-2">
              <React.Suspense fallback={<TodosListShimmer />}>
                <TodosSection
                  selectedCategoryId={selectedCategoryId}
                  filters={filters}
                  handleOpenAddTodoDialog={handleOpenAddTodoDialog}
                  handleDeleteTodo={handleDeleteTodo}
                  handleEditTodo={handleEditTodo}
                  handleToggleComplete={handleToggleComplete}
                />
              </React.Suspense>
            </div>
          </div>
        </div>

        <CreateCategoryDialog
          isOpen={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
          editingCategory={editingCategory}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          onSave={handleSaveCategory}
          onClose={handleCloseDialog}
        />

        <CreateTodoDialog
          isOpen={isTodoDialogOpen}
          onOpenChange={setIsTodoDialogOpen}
          selectedTodo={selectedTodo}
          onSubmit={handleTodoSubmit}
          selectedCategoryId={selectedCategoryId}
        />
      </div>
    </ProtectedRoute>
  );
}

function CategoriesSection({
  selectedCategoryId,
  onSelectCategory,
  onOpenAddDialog,
  onDeleteCategory,
  onEditCategory,
}: any) {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  // Fetch all todos for counting purposes. Ideally backend should provide counts.
  const { data: allTodos } = useSuspenseQuery(todosQuery(null));

  return (
    <CategoriesList
      categories={categories}
      allTodos={allTodos}
      selectedCategoryId={selectedCategoryId}
      onSelectCategory={onSelectCategory}
      onEditCategory={onEditCategory}
      onDeleteCategory={onDeleteCategory}
      onOpenAddDialog={onOpenAddDialog}
    />
  );
}

function TodosSection({
  selectedCategoryId,
  filters,
  handleOpenAddTodoDialog,
  handleDeleteTodo,
  handleEditTodo,
  handleToggleComplete,
}: any) {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: todos } = useSuspenseQuery(
    todosQuery(selectedCategoryId, filters)
  );

  let selectedCategory: CategoryModel | undefined;

  if (selectedCategoryId === -1) {
    selectedCategory = { id: -1, name: "Uncategorized" };
  } else if (selectedCategoryId) {
    selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
  }

  if (!selectedCategoryId) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 min-h-125 flex flex-col items-center justify-center">
        <div className="text-gray-300 dark:text-gray-700 mb-6">
          <svg
            className="mx-auto h-32 w-32 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select a Category
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Select a category from the sidebar to view your tasks, or create a new
          category to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 min-h-125">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[60%]">
            {selectedCategory?.name}
          </h2>
          <button
            onClick={handleOpenAddTodoDialog}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white text-sm sm:text-base rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <TodosList
          todos={todos}
          handleDelete={(index) => handleDeleteTodo(index, todos)}
          handleEdit={(index) => handleEditTodo(index, todos)}
          handleToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}
