import type { CategoryModel } from "@/models/CategoryModel";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

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
    handleSubmit(category);
    if (!selectedCategory) {
      setCategory({
        id: 0,
        name: "",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 m-4 p-4 border border-gray-200 rounded w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">
        {selectedCategory ? "Edit Category" : "Add Category"}
      </h2>

      <input
        type="text"
        name="name"
        value={category.name}
        onChange={(e) => setCategory({ ...category, name: e.target.value })}
        className="p-2 border border-gray-300 rounded"
        placeholder="Category Name"
        required
      />

      <button
        className="ml-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={onSubmit}
        disabled={!category.name.trim()}
      >
        <Plus /> {selectedCategory ? "Update Category" : "Add Category"}
      </button>
    </div>
  );
};

export default CategoryForm;
