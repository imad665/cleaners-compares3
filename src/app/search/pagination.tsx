import Link from "next/link"

export function Pagination({
  currentPage,
  totalPages,
  baseUrl
}: {
  currentPage: number
  totalPages: number
  baseUrl: string
}) {
  const getPageUrl = (page: number) => {
    return `${baseUrl}&page=${page}`
  }

  return (
    <nav className="flex items-center justify-center space-x-2">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
            page === currentPage
              ? 'bg-primary text-white'
              : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </nav>
  )
}