import type { CategoryModel } from "@/models/CategoryModel";
import CategoryCard from "./CategoryCard";

interface CategoriesListProps {
  categories: CategoryModel[];
  handleDelete: (index: number) => void;
  handleEdit: (index: number, category: CategoryModel) => void;
}

const CategoriesList = ({
  categories,
  handleDelete,
  handleEdit,
}: CategoriesListProps) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No categories yet. Create your first category!
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-3">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Categories ({categories.length})
      </h2>
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          handleEdit={(cat) => handleEdit(index, cat)}
          handleDelete={() => handleDelete(index)}
        />
      ))}
    </div>
  );
};

export default CategoriesList;
