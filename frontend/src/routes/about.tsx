import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components";
import { motion } from "motion/react";
import {
  Code,
  Server,
  Boxes,
  Rocket,
  Github,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const techStack = [
    {
      name: "React 19 + Vite",
      description: "Lightning-fast dev server with HMR",
      icon: Code,
      color: "bg-blue-500",
      delay: 0,
    },
    {
      name: "Python FastAPI",
      description: "Modern async Python framework",
      icon: Server,
      color: "bg-green-500",
      delay: 0.1,
    },
    {
      name: "Kubernetes",
      description: "k3s lightweight container orchestration",
      icon: Boxes,
      color: "bg-purple-500",
      delay: 0.2,
    },
  ];

  const features = [
    "Complete Todo Management with deadlines and categories",
    "Real-time Dashboard with statistics and analytics",
    "User Authentication with JWT tokens",
    "Automatic Scaling via Horizontal Pod Autoscaler (HPA)",
    "Zero-Downtime Deployment with rolling updates",
    "24/7 Availability with high availability setup",
    "Responsive UI with dark mode support",
    "Automated CI/CD pipeline with GitHub Actions",
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-4 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-6"
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Todo App – Kubernetes & CI/CD
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A production-grade Task Management Application demonstrating modern
            DevOps practices with containerization, Kubernetes orchestration,
            and automated CI/CD pipeline.
          </p>
        </motion.div>

        {/* Tech Stack Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tech.delay + 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-3 rounded-xl ${tech.color} shadow-lg mb-4 group-hover:shadow-2xl transition-shadow`}
                >
                  <tech.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {tech.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <div className="glass-card p-8 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Key Features
            </h2>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              Team Info
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Developed by
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Group 13
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Version
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    1.0.0
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Course
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    DevOps & Cloud Computing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="inline-block glass-card px-8 py-4 rounded-full border border-white/40 dark:border-white/10 shadow-xl bg-white/60 dark:bg-gray-800/60">
            <p className="text-gray-600 dark:text-gray-400">
              Built with ❤️ using modern web technologies
            </p>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
