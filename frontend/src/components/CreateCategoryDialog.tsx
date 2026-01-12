import type { CategoryModel } from "@/models/CategoryModel";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: CategoryModel | null;
  categoryName: string;
  setCategoryName: (name: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const CreateCategoryDialog = ({
  isOpen,
  onOpenChange,
  editingCategory,
  categoryName,
  setCategoryName,
  onSave,
  onClose,
}: CreateCategoryDialogProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl focus:outline-none glass-card border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-bold">
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Form to {editingCategory ? "edit" : "create"} a todo
                    category
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <X size={24} />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                    placeholder="Enter category name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSave();
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Dialog.Close asChild>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={onSave}
                    disabled={!categoryName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    {editingCategory ? "Update" : "Create"}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
