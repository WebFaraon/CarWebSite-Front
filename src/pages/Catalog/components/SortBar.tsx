import type { SortKey } from "../catalog.types";
import "../catalogstyles.css";

export default function SortBar({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <div className="sortbar">
      <div className="sortbar__label">Sort</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="sortbar__select"
      >
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="year_desc">Year: Newest</option>
        <option value="km_asc">Mileage: Lowest</option>
      </select>
    </div>
  );
}
