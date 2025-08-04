import React from 'react';

const OrderListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 lg:grid lg:gap-x-4 lg:px-4 lg:grid-cols-2 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <div className="h-10 bg-gray-300 rounded w-24"></div>
            <div className="h-10 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderListSkeleton;