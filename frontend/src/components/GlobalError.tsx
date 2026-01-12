import { useRouter } from "@tanstack/react-router";
import { AlertCircle, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: unknown;
  reset?: () => void;
}

export function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      router.invalidate();
    }
  };

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  const isNetworkError =
    errorMessage.toLowerCase().includes("network error") ||
    errorMessage.toLowerCase().includes("failed to fetch");

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        {isNetworkError ? "Connection Error" : "Something went wrong"}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        {isNetworkError
          ? "We couldn't connect to the server. Please check your internet connection and verify that the backend services are running."
          : errorMessage}
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium border border-gray-200 dark:border-gray-700"
        >
          Go Home
        </button>
      </div>

      {!isNetworkError && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 max-w-lg w-full text-left overflow-auto">
          <p className="text-xs font-mono text-gray-500 break-all">
            Error Details:{" "}
            {JSON.stringify(error, Object.getOwnPropertyNames(error))}
          </p>
        </div>
      )}
    </div>
  );
}
