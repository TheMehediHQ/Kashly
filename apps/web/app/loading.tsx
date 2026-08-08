"use client";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Navbar Skeleton */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>

        {/* Table Skeleton */}
        <div>
          <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}