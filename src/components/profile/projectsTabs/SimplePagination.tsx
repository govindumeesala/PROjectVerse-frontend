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
        Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={prev} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50">
          Prev
        </button>
        <button onClick={next} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </nav>
  );
};

export default SimplePagination;
