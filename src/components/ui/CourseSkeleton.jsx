import React from "react";

const CourseSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full max-w-[350px] lg:max-w-[420px] h-full flex flex-col">
      {/* Image Skeleton - matches Card h-48 */}
      <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
      </div>

      {/* Content Skeleton - matches Card p-6 flex flex-col flex-1 */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title Skeleton - matches text-xl font-semibold mb-3 line-clamp-2 */}
        <div className="mb-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden w-4/5 mb-1">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden w-3/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
        </div>

        {/* Description Skeleton - matches text-sm mb-4 line-clamp-3 flex-1 */}
        <div className="mb-4 flex-1 space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden w-5/6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden w-4/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
        </div>

        {/* Meta Info Skeleton - matches gap-4 mb-6 text-sm */}
        <div className="flex items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden w-16">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden w-12">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Buttons Skeleton - matches flex-col lg:flex-row flex gap-3 mt-auto */}
        <div className="flex-col lg:flex-row flex gap-3 mt-auto">
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryFilterSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded px-6 py-3 relative overflow-hidden"
          style={{
            width: `${80 + index * 15}px`, // More consistent widths
            animationDelay: `${index * 0.1}s`, // Staggered animation
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export { CourseSkeleton, CategoryFilterSkeleton };
export default CourseSkeleton;
