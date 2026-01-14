import type { CategoryModel } from "@/models/CategoryModel";
import { Plus, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";

interface CategoryFormProps {
  selectedCategory?: CategoryModel;
  handleSubmit: (category: CategoryModel) => void;
}

const CategoryForm = ({
  selectedCategory,
  handleSubmit,
}: CategoryFormProps) => {
  const [category, setCategory] = useState<CategoryModel>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    } else {
      setCategory({
        id: 0,
        name: "",
      });
    }
  }, [selectedCategory]);

  const onSubmit = () => {
    if (!category.name.trim()) return;
    handleSubmit(category);
    if (!selectedCategory) {
      setCategory({
        id: 0,
        name: "",
      });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Plus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {selectedCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedCategory
              ? "Update existing category details"
              : "Create a new category to organize tasks"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            label="Category Name"
            placeholder="e.g., Work, Personal, Shopping"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !!category.name.trim()) {
                onSubmit();
              }
            }}
            className="h-11"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onSubmit}
            disabled={!category.name.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 shadow-lg shadow-blue-500/20 transition-all font-medium"
          >
            {selectedCategory ? (
              <>
                <Save className="w-4 h-4 mr-2" /> Update Category
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
