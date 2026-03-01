// src/pages/Catalog/components/Pagination.tsx
import "../catalogstyles.css";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (!totalPages || totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="pagination">
      <button
        disabled={prevDisabled}
        onClick={() => onChange(page - 1)}
        className="pagination-btn"
      >
        Prev
      </button>

      <div className="pagination-info">
        {page} / {totalPages}
      </div>

      <button
        disabled={nextDisabled}
        onClick={() => onChange(page + 1)}
        className="pagination-btn"
      >
        Next
      </button>
    </div>
  );
}