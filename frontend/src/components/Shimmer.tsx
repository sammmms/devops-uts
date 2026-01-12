export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded-lg ${className}`}
    />
  );
}

export function CategoriesListShimmer() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="h-8 w-32" />
        <Shimmer className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-xl"
          >
            <Shimmer className="h-5 w-24" />
            <Shimmer className="h-5 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TodosListShimmer() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-card p-4 rounded-2xl border border-white/40 dark:border-white/10"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-2">
              <Shimmer className="h-6 w-48" />
              <Shimmer className="h-4 w-32" />
            </div>
            <Shimmer className="h-8 w-8 rounded-full" />
          </div>
          <Shimmer className="h-16 w-full mt-4" />
        </div>
      ))}
    </div>
  );
}
