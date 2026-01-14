import { createFileRoute } from "@tanstack/react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios_instance";
import {
  CategoriesList,
  CategoriesListShimmer,
  CategoryForm,
  ProtectedRoute,
} from "@/components";
import type { CategoryModel } from "@/models/CategoryModel";
import { motion } from "motion/react";
import * as React from "react";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<CategoryModel[]> => {
    const res = await axiosInstance.get("/category");
    return res.data.categories;
  },
});

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

function CategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);
  const [editingCategory, setEditingCategory] = React.useState<
    CategoryModel | undefined
  >(undefined);

  const handleCreateCategory = async (category: CategoryModel) => {
    try {
      if (editingCategory) {
        await axiosInstance.put(`/category/${category.id}`, category);
        showSuccessToast("Category updated successfully");
      } else {
        await axiosInstance.post("/category", category);
        showSuccessToast("Category created successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(undefined);
    } catch (error) {
      showErrorToast(
        editingCategory
          ? "Failed to update category"
          : "Failed to create category"
      );
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axiosInstance.delete(`/category/${id}`);
        showSuccessToast("Category deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        if (selectedCategoryId === id) setSelectedCategoryId(null);
        if (editingCategory?.id === id) setEditingCategory(undefined);
      } catch (error) {
        showErrorToast("Failed to delete category");
        console.error(error);
      }
    }
  };

  const handleEditCategory = async (category: CategoryModel) => {
    setEditingCategory(category);
    // Scroll to top of form on mobile if needed, or just focus
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ProtectedRoute>
      <motion.div
        className="min-h-screen p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-3xl font-bold mb-6" variants={itemVariants}>
          Categories
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <div className="sticky top-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <CategoryForm
                selectedCategory={editingCategory}
                handleSubmit={handleCreateCategory}
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Existing Categories</h2>
              {editingCategory && (
                <button
                  onClick={() => setEditingCategory(undefined)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <React.Suspense fallback={<CategoriesListShimmer />}>
              <CategoriesList
                categories={categories}
                allTodos={[]} // Pass empty todos for now
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onOpenAddDialog={() => setEditingCategory(undefined)}
                variant="manage"
              />
            </React.Suspense>
          </motion.div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}
