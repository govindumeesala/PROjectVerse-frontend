// src/components/profile/SimplePagination.tsx
import React from "react";

const SimplePagination: React.FC<{
  page: number;
  setPage: (p: number) => void;
  total: number;
  limit: number;
}> = ({ page, setPage, total, limit }) => {
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(totalPages, page + 1));

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          disabled={page <= 1}
          aria-label="Previous page"
          className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-medium shadow-sm hover:border-blue-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <button
          onClick={next}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="px-4 py-2 rounded-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default SimplePagination;
