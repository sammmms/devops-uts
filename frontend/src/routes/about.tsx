import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        About This Project
      </h1>

      <div className="prose dark:prose-invert">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          This is a Todo application built as part of a DevOps & Cloud Computing
          course.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Tech Stack
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Frontend: React with Vite & TailwindCSS
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Backend: FastAPI (Python)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Infrastructure: Kubernetes & Docker
            </li>
          </ul>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Version 1.0.0 • Developed by Group 13
        </p>
      </div>
    </div>
  );
}
