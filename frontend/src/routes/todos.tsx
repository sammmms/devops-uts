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
  TodosListShimmer,
  CategoriesListShimmer,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Dialog,
  Button,
  SmartFAB,
} from "@/components";
import * as React from "react";
import { Filter, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";

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
      const params: any = {};
      if (categoryId !== null && categoryId !== undefined) {
        params.category_id = categoryId;
      }
      if (filters?.completed !== undefined)
        params.completed = filters.completed;
      if (filters?.overdue !== undefined) params.overdue = filters.overdue;

      const res = await axiosInstance.get("/todo", { params });
      return res.data.todos;
    },
  });

// Define search param structure with zod for robustness if needed, but using manual here
export const Route = createFileRoute("/todos")({
  component: TodosPage,
  validateSearch: (
    search: Record<string, unknown>
  ): { filter?: string; categoryId?: number } => {
    return {
      filter: (search.filter as string) || undefined,
      categoryId: search.categoryId ? Number(search.categoryId) : undefined,
    };
  },
});

function TodosPage() {
  const navigate = Route.useNavigate();
  const { filter, categoryId: selectedCategoryIdParam } = Route.useSearch();
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

  // Category Filter State - Derived from URL
  const selectedCategoryId = selectedCategoryIdParam ?? null;
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

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

  const handleCategoryChange = (id: number | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        categoryId: id || undefined,
      }),
    });
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
    try {
      await axiosInstance.delete(`/category/${categoryId}`);
      showSuccessToast("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (selectedCategoryId === categoryId) {
        handleCategoryChange(null);
      }
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Error deleting category"
      );
      console.error("Error deleting category:", error);
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
        <div className="max-w-7xl mx-auto px-4 pb-4 pt-0 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Categories Section */}
            <div className="lg:col-span-1">
              <React.Suspense fallback={<CategoriesListShimmer />}>
                <CategoriesSection
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={handleCategoryChange}
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

        {/* Smart FAB */}
        <SmartFAB
          className="sm:hidden"
          actions={[
            {
              id: "add_task",
              label: "Add Task",
              icon: <Plus className="w-6 h-6" />,
              onClick: handleOpenAddTodoDialog,
            },
            {
              id: "filter",
              label: "Filter Tasks",
              icon: <Filter className="w-5 h-5" />,
              onClick: () => setIsFilterDialogOpen(true),
            },
            {
              id: "add_category",
              label: "Add Category",
              icon: <Plus className="w-5 h-5" />,
              onClick: handleOpenAddDialog,
            },
          ]}
        />

        {/* Mobile Filter Dialog (Controlled State) */}
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <AnimatePresence>
            {isFilterDialogOpen && (
              <DialogPrimitive.Portal forceMount>
                <DialogPrimitive.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                  />
                </DialogPrimitive.Overlay>
                <DialogPrimitive.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                    animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl focus:outline-none glass-card border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <DialogPrimitive.Title className="text-xl font-bold">
                        Filter Tasks
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Close asChild>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <X size={24} />
                        </button>
                      </DialogPrimitive.Close>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        {["all", "completed", "pending", "overdue"].map((f) => (
                          <Button
                            key={f}
                            variant={
                              filters.completed ===
                                (f === "completed"
                                  ? true
                                  : f === "pending"
                                    ? false
                                    : undefined) &&
                              filters.overdue ===
                                (f === "overdue" ? true : undefined)
                                ? "default"
                                : "outline"
                            }
                            className="justify-start capitalize h-12 text-base"
                            onClick={() => {
                              navigate({
                                search: (prev) => ({
                                  ...prev,
                                  filter: f === "all" ? undefined : f,
                                }),
                              });
                              setIsFilterDialogOpen(false);
                            }}
                          >
                            {f === "all" ? "All Tasks" : f}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            )}
          </AnimatePresence>
        </Dialog>
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
  const navigate = Route.useNavigate();
  const { filter } = Route.useSearch();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: todos } = useSuspenseQuery(
    todosQuery(selectedCategoryId, filters)
  );

  const handleFilterChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        filter: value === "all" ? undefined : value,
      }),
    });
  };

  let selectedCategory: CategoryModel | undefined;

  if (selectedCategoryId === null) {
    selectedCategory = { id: -1, name: "All Tasks" };
  } else if (selectedCategoryId === -1) {
    selectedCategory = { id: -1, name: "Uncategorized" };
  } else if (selectedCategoryId) {
    selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
  }

  /* Placeholder removed to show All Tasks by default */

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 min-h-125">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 min-w-0 pr-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={selectedCategory?.name || "all-tasks"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate"
              >
                {selectedCategory?.name}
              </motion.h2>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* Filter Badge Removed */}
                <div className="w-[140px]">
                  <Select
                    value={filter || "all"}
                    onValueChange={handleFilterChange}
                  >
                    <SelectTrigger className="h-11 text-sm bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                onClick={handleOpenAddTodoDialog}
                className="flex items-center gap-2 px-5 h-11 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Plus size={18} />
                <span>Add Task</span>
              </button>
            </div>

            {/* Mobile Controls (FABs) - Replaced by SmartFAB */}
          </div>
        </div>

        <TodosList
          key={selectedCategoryId ?? "all"}
          todos={todos}
          handleDelete={(index) => handleDeleteTodo(index, todos)}
          handleEdit={(index) => handleEditTodo(index, todos)}
          handleToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}
