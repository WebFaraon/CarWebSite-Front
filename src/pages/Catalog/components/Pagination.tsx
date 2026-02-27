// src/pages/Catalog/components/Pagination.tsx
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
    <div className="flex items-center justify-center gap-2">
      <button
        disabled={prevDisabled}
        onClick={() => onChange(page - 1)}
        className="h-10 px-3 rounded-xl border border-slate-200 bg-white font-black text-slate-700 disabled:opacity-40 hover:bg-slate-50"
      >
        Prev
      </button>

      <div className="h-10 px-4 rounded-xl border border-slate-200 bg-white grid place-items-center font-black text-slate-700">
        {page} / {totalPages}
      </div>

      <button
        disabled={nextDisabled}
        onClick={() => onChange(page + 1)}
        className="h-10 px-3 rounded-xl border border-slate-200 bg-white font-black text-slate-700 disabled:opacity-40 hover:bg-slate-50"
      >
        Next
      </button>
    </div>
  );
}