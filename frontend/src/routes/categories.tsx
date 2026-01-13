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
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import * as React from "react";

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

function CategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);

  const handleCreateCategory = async (category: CategoryModel) => {
    try {
      await axiosInstance.post("/category", category);
      showSuccessToast("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      showErrorToast("Failed to create category");
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axiosInstance.delete(`/category/${id}`);
        showSuccessToast("Category deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch (error) {
        showErrorToast("Failed to delete category");
        console.error(error);
      }
    }
  };

  const handleEditCategory = async (category: CategoryModel) => {
    // For now just console log, or implement update logic similar to create
    console.log("Edit category", category);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <CategoryForm handleSubmit={handleCreateCategory} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
            <React.Suspense fallback={<CategoriesListShimmer />}>
              <CategoriesList
                categories={categories}
                allTodos={[]} // Pass empty todos for now
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onOpenAddDialog={() => {}} // No-op as form is visible
              />
            </React.Suspense>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
