import React from "react";

const InboxListSkeleton: React.FC = () => {
  return (
    <div className="py-4 px-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-1">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
            <div className="h-3 w-8 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxListSkeleton;