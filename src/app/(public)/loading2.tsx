export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav Loading */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="animate-pulse flex justify-between items-center">
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
          <div className="hidden md:flex space-x-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Hero Section Loading */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mx-auto mb-6"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded mx-auto mb-8"></div>
          <div className="h-12 w-64 bg-gray-300 rounded-full mx-auto"></div>
          <div className="flex justify-center space-x-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 w-full bg-gray-200 rounded-lg mt-10"></div>
        </div>
      </div>

      {/* Trusted Brands Loading */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Categories Loading */}
      <div className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-6 w-64 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                <div className="h-8 w-24 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wanted Items Loading */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Loading */}
      <div className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white p-3 rounded shadow-sm">
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Limited-Time Deals Loading */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white p-3 rounded shadow-sm">
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-1/3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Loading */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="h-8 w-32 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 w-3/4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-8 w-32 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-3/4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-8 w-32 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-3/4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-8 w-32 bg-gray-300 rounded mb-6"></div>
              <div className="flex space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}