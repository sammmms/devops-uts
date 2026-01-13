import type { CategoryModel } from "@/models/CategoryModel";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

interface CategoryCardProps {
  category: CategoryModel;
  isActive: boolean;
  handleEdit: (category: CategoryModel) => void;
  handleDelete: () => void;
}

const CategoryCard = ({
  category,
  isActive,
  handleEdit,
  handleDelete,
}: CategoryCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onConfirmDelete = () => {
    handleDelete();
    setIsDeleteOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
        isActive
          ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30"
          : "bg-white/50 dark:bg-gray-800/40 border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:shadow-md"
      }`}
    >
      <div className="flex-1 min-w-0 z-10">
        <h3
          className={`font-bold text-sm sm:text-base truncate pr-20 transition-colors ${
            isActive ? "text-white" : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {category.name}
        </h3>
        <p
          className={`text-xs transition-colors ${
            isActive ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {category.todos_count || 0} tasks
        </p>
      </div>

      <div className="absolute right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(category);
          }}
          aria-label={`Edit ${category.name}`}
          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteOpen(true);
              }}
              aria-label={`Delete ${category.name}`}
              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl z-50 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Category
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Are you sure you want to delete "{category.name}"? This
                      action cannot be undone.
                    </Dialog.Description>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Dialog.Close asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </motion.button>
                  </Dialog.Close>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </motion.button>
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
