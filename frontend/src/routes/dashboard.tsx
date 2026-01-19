import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios_instance";
import { ProtectedRoute } from "@/components";
import {
  CheckCircle2,
  Circle,
  ListTodo,
  Folder,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import type { TodoModel } from "@/models/TodoModel";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/stats");
      return res.data.data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center text-red-600">
            <p>Failed to load dashboard stats</p>
            <p className="text-sm text-gray-500 mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>No dashboard data available</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const statCards = [
    {
      title: "Total Todos",
      value: stats?.total_todos || 0,
      icon: ListTodo,
      color: "bg-blue-500",
      delay: 0,
    },
    {
      title: "Completed",
      value: stats?.completed_todos || 0,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      delay: 0.1,
    },
    {
      title: "Pending",
      value: stats?.pending_todos || 0,
      icon: Circle,
      color: "bg-amber-500",
      delay: 0.2,
    },
    {
      title: "Categories",
      value: stats?.total_categories || 0,
      icon: Folder,
      color: "bg-indigo-500",
      delay: 0.3,
    },
  ];

  const categoryData = (stats?.category_distribution || []) as Array<{
    name: string;
    value: number;
  }>;
  const maxCount = Math.max(...(categoryData.map((d) => d.value) || [1]), 1);

  const priorityData = (stats?.priority_distribution || []) as Array<{
    name: string;
    value: number;
    color: string;
  }>;
  const priorityMaxCount = Math.max(
    ...(priorityData.map((d) => d.value) || [1]),
    1
  );
  const priorityLabels: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const linkProps =
              card.title === "Completed"
                ? { to: "/todos", search: { filter: "completed" } }
                : card.title === "Pending"
                  ? { to: "/todos", search: { filter: "pending" } }
                  : card.title === "Total Todos"
                    ? { to: "/todos" }
                    : null;

            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay }}
                className="glass-card p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60 cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {card.title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {card.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl shadow-lg ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );

            return linkProps ? (
              <Link key={index} {...linkProps} className="block">
                {CardContent}
              </Link>
            ) : (
              <div key={index}>{CardContent}</div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Category Distribution
              </h3>
              <div className="space-y-4">
                {categoryData.length > 0 ? (
                  categoryData.map((item: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {item.name}
                        </span>
                        <span className="text-gray-500">
                          {item.value} tasks
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(item.value / maxCount) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No category data available
                  </div>
                )}
              </div>
            </motion.div>

            {/* Priority Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Priority Distribution
              </h3>
              <div className="space-y-4">
                {priorityData.some((item) => item.value > 0) ? (
                  priorityData.map((item, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {priorityLabels[item.name] || item.name}
                        </span>
                        <span className="text-gray-500">
                          {item.value} tasks
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(item.value / priorityMaxCount) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No priority data available
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Task Lists Section */}
          <div className="space-y-6">
            {/* Overdue Tasks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-xl bg-white/60 dark:bg-gray-800/60"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Overdue Tasks
                </h3>
              </div>
              {stats?.overdue_todos && stats.overdue_todos.length > 0 ? (
                <div className="space-y-3">
                  {stats.overdue_todos.slice(0, 5).map((todo: TodoModel) => (
                    <div
                      key={todo.id}
                      className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30"
                    >
                      <p className="font-medium text-red-800 dark:text-red-200 truncate">
                        {todo.name}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                        Due: {todo.deadline}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No overdue tasks! 🎉</p>
              )}
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Upcoming Deadlines
                </h3>
              </div>
              {stats?.upcoming_todos && stats.upcoming_todos.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcoming_todos.slice(0, 5).map((todo: TodoModel) => (
                    <div
                      key={todo.id}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30"
                    >
                      <p className="font-medium text-blue-800 dark:text-blue-200 truncate">
                        {todo.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        Due: {todo.deadline}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming deadlines.</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
