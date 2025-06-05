export function PropertyListingSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-64 bg-gray-200">
        <div className="absolute top-3 left-3">
          <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Price skeleton */}
        <div className="mb-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Title skeleton */}
        <div className="mb-2">
          <div className="h-5 w-full bg-gray-200 rounded mb-1"></div>
          <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
        </div>

        {/* Location skeleton */}
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Details skeleton */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
          <div className="h-4 w-8 bg-gray-200 rounded mr-1"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Property type skeleton */}
        <div className="mt-auto">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
