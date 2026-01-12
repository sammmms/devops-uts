import CategoryForm from "@/components/CategoryForm";
import type { CategoryModel } from "@/models/CategoryModel";
import axiosInstance from "@/utils/axios_instance";
import { createFileRoute } from "@tanstack/react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { CategoriesList } from "@/components";

const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<CategoryModel[]> => {
    const res = await axiosInstance.get("/category");
    return res.data.categories;
  },
});

export const Route = createFileRoute("/categories")({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(categoriesQuery);
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryModel | undefined
  >(undefined);

  const handleOnAddCategory = async (category: CategoryModel) => {
    await axiosInstance.post("/category", { name: category.name });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const handleOnEditCategory = async (category: CategoryModel) => {
    if (selectedCategory?.id) {
      await axiosInstance.put(`/category/${selectedCategory.id}`, category);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setSelectedCategory(undefined);
    }
  };

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/category/${id}`);
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const handleEdit = (category: CategoryModel) => {
    setSelectedCategory(category);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 flex flex-col gap-4 items-center">
      <CategoryForm
        handleSubmit={(category) =>
          selectedCategory === undefined
            ? handleOnAddCategory(category)
            : handleOnEditCategory(category)
        }
        selectedCategory={selectedCategory}
      />

      <CategoriesList
        categories={categories}
        allTodos={[]}
        selectedCategoryId={selectedCategory?.id ?? null}
        onSelectCategory={(id) => {
          const category = categories.find((c) => c.id === id);
          if (category) setSelectedCategory(category);
        }}
        onDeleteCategory={handleDelete}
        onEditCategory={handleEdit}
        onOpenAddDialog={() => setSelectedCategory(undefined)}
      />
    </div>
  );
}
