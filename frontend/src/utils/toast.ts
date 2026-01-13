import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const updateToast = (
  id: string | number,
  message: string,
  type: "success" | "error" = "success"
) => {
  toast.dismiss(id);
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
  });
};
