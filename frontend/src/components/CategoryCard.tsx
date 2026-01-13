import type { CategoryModel } from "@/models/CategoryModel";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

interface CategoryCardProps {
  category: CategoryModel;
  handleEdit: (category: CategoryModel) => void;
  handleDelete: () => void;
}

const CategoryCard = ({
  category,
  handleEdit,
  handleDelete,
}: CategoryCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onConfirmDelete = () => {
    handleDelete();
    setIsDeleteOpen(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl p-3 sm:p-5 hover:shadow-lg transition-all duration-300 bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
              {category.name}
            </h3>
          </div>
        </div>

        <div className="ml-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleEdit(category)}
            aria-label={`Edit ${category.name}`}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={`Delete ${category.name}`}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
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
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </Dialog.Close>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onConfirmDelete}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
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
      </div>
    </motion.article>
  );
};

export default CategoryCard;
