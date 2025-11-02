import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CategoryModel } from "@/models/CategoryModel";
import type { TodoModel } from "@/models/TodoModel";
import axiosInstance from "@/utils/axios_instance";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Form, TodosList } from "@/components";
import * as Dialog from "@radix-ui/react-dialog";

const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<CategoryModel[]> => {
    const res = await axiosInstance.get("/category");
    return res.data.categories;
  },
});

const todosQuery = queryOptions({
  queryKey: ["todos"],
  queryFn: async (): Promise<TodoModel[]> => {
    const res = await axiosInstance.get("/todo");
    return res.data.todos;
  },
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    return Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(todosQuery),
    ]);
  },
  component: App,
});

function App() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: allTodos } = useSuspenseQuery(todosQuery);
  const queryClient = useQueryClient();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | undefined>(
    undefined
  );
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);

  // Filter todos by selected category
  const filteredTodos = selectedCategoryId
    ? allTodos.filter((todo) => todo.category_id === selectedCategoryId)
    : [];

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

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
      } else {
        await axiosInstance.post("/category", { name: categoryName });
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axiosInstance.delete(`/category/${categoryId}`);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        if (selectedCategoryId === categoryId) {
          setSelectedCategoryId(null);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleOnAddTodo = async (todo: TodoModel) => {
    await axiosInstance.post("/todo", todo);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    setIsTodoDialogOpen(false);
    setSelectedTodo(undefined);
  };

  const handleOnEditTodo = async (todo: TodoModel) => {
    if (selectedTodo?.id) {
      await axiosInstance.put(`/todo/${selectedTodo.id}`, todo);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setSelectedTodo(undefined);
      setIsTodoDialogOpen(false);
    }
  };

  const handleDeleteTodo = async (index: number) => {
    const todoToDelete = filteredTodos[index];
    if (todoToDelete?.id) {
      await axiosInstance.delete(`/todo/${todoToDelete.id}`);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  };

  const handleEditTodo = (index: number, _todo: TodoModel) => {
    setSelectedTodo(filteredTodos[index]);
    setIsTodoDialogOpen(true);
  };

  const handleOpenAddTodoDialog = () => {
    setSelectedTodo(undefined);
    setIsTodoDialogOpen(true);
  };

  // Note: Closing of the Todo dialog is handled via Radix onOpenChange

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                <button
                  onClick={handleOpenAddDialog}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No categories yet. Create one to get started!
                  </p>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedCategoryId === category.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {
                            allTodos.filter(
                              (t) => t.category_id === category.id
                            ).length
                          }{" "}
                          todos
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditDialog(category);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Todos Section */}
          <div className="lg:col-span-2">
            {selectedCategoryId ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCategory?.name} - Todos
                    </h2>
                    <button
                      onClick={handleOpenAddTodoDialog}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Plus size={20} />
                      Add Todo
                    </button>
                  </div>

                  <TodosList
                    todos={filteredTodos}
                    handleDelete={handleDeleteTodo}
                    handleEdit={handleEditTodo}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-24 w-24"
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Category
                </h3>
                <p className="text-gray-500">
                  Choose a category from the list to view and manage its todos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Dialog (Radix) */}
      <Dialog.Root
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {editingCategory ? "Edit Category" : "Add Category"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveCategory();
                  }
                }}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Dialog.Close asChild>
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSaveCategory}
                disabled={!categoryName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Todo Dialog (Radix) */}
      <Dialog.Root open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {selectedTodo ? "Edit Todo" : "Add Todo"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            <Form
              handleSubmit={(todo) => {
                const todoWithCategory = {
                  ...todo,
                  category_id: selectedCategoryId ?? undefined,
                };
                return selectedTodo === undefined
                  ? handleOnAddTodo(todoWithCategory)
                  : handleOnEditTodo(todoWithCategory);
              }}
              selectedTodo={selectedTodo}
              hideCategory={true}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
