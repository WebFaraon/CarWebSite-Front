// src/pages/Catalog/components/SortBar.tsx
import type { SortKey } from "../catalog.types";

export default function SortBar({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-bold text-slate-500">Sort</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-orange-100"
      >
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="year_desc">Year: Newest</option>
        <option value="km_asc">Mileage: Lowest</option>
      </select>
    </div>
  );
}