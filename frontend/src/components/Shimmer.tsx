export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded-lg ${className}`}
    />
  );
}

export function CategoriesListShimmer() {
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/40 dark:border-white/10 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <Shimmer className="h-8 w-32" />
        <Shimmer className="h-8 w-16 rounded-xl" />
      </div>

      <div className="space-y-3">
        {/* All Tasks Mock */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Shimmer className="h-5 w-24 mb-2" />
          <Shimmer className="h-3 w-16" />
        </div>

        {/* Categories Mock */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center"
          >
            <div>
              <Shimmer className="h-5 w-32 mb-1" />
            </div>
            <div className="flex gap-2">
              <Shimmer className="h-6 w-6 rounded-lg" />
              <Shimmer className="h-6 w-6 rounded-lg" />
            </div>
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
