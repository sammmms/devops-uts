import type { CategoryModel } from "@/models/CategoryModel";
import type { TodoModel } from "@/models/TodoModel";
import { Link } from "@tanstack/react-router";
import { Plus, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CategoryCard from "./CategoryCard";

interface CategoriesListProps {
  categories: CategoryModel[];
  allTodos: TodoModel[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  onEditCategory: (category: CategoryModel) => void;
  onDeleteCategory: (id: number) => void;
  onOpenAddDialog: () => void;
  variant?: "sidebar" | "manage";
}

export const CategoriesList = ({
  categories,
  allTodos,
  selectedCategoryId,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  onOpenAddDialog,
  variant = "sidebar",
}: CategoriesListProps) => {
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/40 dark:border-white/10 shadow-xl">
      {variant === "sidebar" && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Categories
          </h2>
          <div className="flex items-center gap-2">
            <Link
              to="/categories"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Manage Categories"
            >
              <Settings size={18} />
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAddDialog}
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              <Plus size={18} />
              Add
            </motion.button>
          </div>
        </div>
      )}

      <motion.div layout className="space-y-3">
        <AnimatePresence initial={false}>
          {/* All Option */}
          {variant === "sidebar" && (
            <motion.div
              key="all"
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(null)}
              className={`relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                selectedCategoryId === null
                  ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30"
                  : "bg-white/50 dark:bg-gray-800/40 border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:shadow-md"
              }`}
            >
              <div className="flex-1 z-10">
                <h3
                  className={`font-bold text-sm sm:text-base transition-colors ${
                    selectedCategoryId === null
                      ? "text-white"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  All Tasks
                </h3>
                <p
                  className={`text-xs transition-colors ${
                    selectedCategoryId === null
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {allTodos.length} tasks
                </p>
              </div>
            </motion.div>
          )}

          {categories.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm"
            >
              No other categories yet.
            </motion.p>
          ) : (
            categories.map((category) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                  overflow: "hidden",
                }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectCategory(category.id)}
                className="cursor-pointer"
              >
                <CategoryCard
                  category={category}
                  isActive={selectedCategoryId === category.id}
                  handleEdit={(cat) => {
                    onEditCategory(cat);
                  }}
                  handleDelete={() => onDeleteCategory(category.id)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
