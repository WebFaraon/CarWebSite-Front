import type { Filters, Fuel, Transmission } from "../catalog.types";
import "../catalogstyles.css";

const fuelOptions: Fuel[] = ["diesel", "petrol", "hybrid", "electric", "gas"];
const fuelLabels: Record<Fuel, string> = {
  diesel: "Diesel",
  petrol: "Petrol",
  hybrid: "Hybrid",
  electric: "Electric",
  gas: "Gas",
};

const transmissionOptions: { value: Transmission | ""; label: string }[] = [
  { value: "", label: "Any" },
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
];

const KM_OPTIONS = [
  { label: "Any",          value: "" },
  { label: "< 50,000 km",  value: "50000" },
  { label: "< 100,000 km", value: "100000" },
  { label: "< 150,000 km", value: "150000" },
  { label: "< 200,000 km", value: "200000" },
  { label: "< 250,000 km", value: "250000" },
];

const DEFAULT: Filters = {
  q: "",
  brand: "",
  location: "",
  fuel: "",
  transmission: "",
  minPrice: undefined,
  maxPrice: undefined,
  yearFrom: undefined,
  yearTo: undefined,
  maxKm: undefined,
};

function parseNonNegativeNumber(raw: string): number | undefined {
  if (!raw) return undefined;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.max(0, parsed);
}

export default function CatalogFilters({
  value,
  onChange,
  locations,
  brandOptions,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
  locations: string[];
  brandOptions: Array<{ name: string; count: number }>;
}) {
  const v = value;
  const totalBrandCount = brandOptions.reduce((sum, brand) => sum + brand.count, 0);
  const hasActive =
    v.q || v.brand || v.location || v.fuel || v.transmission ||
    v.minPrice != null || v.maxPrice != null ||
    v.yearFrom != null || v.yearTo != null || v.maxKm != null;

  return (
    <div className="filters">
      <div className="filters-head">
        <div className="filters-title">Filters</div>
        {hasActive && (
          <button type="button" className="filters-reset-sm" onClick={() => onChange(DEFAULT)}>
            Reset all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="filters-section">
        <div className="filters-search">
          <svg className="filters-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            value={v.q}
            onChange={(e) => onChange({ ...v, q: e.target.value })}
            className="filters-search-input"
            placeholder="BMW, Audi, SUV…"
          />
        </div>
      </div>

      {/* Brand */}
      <div className="filters-section">
        <label className="filters-label">Brand</label>
        <select
          value={v.brand ?? ""}
          onChange={(e) => onChange({ ...v, brand: e.target.value })}
          className="filters-control"
        >
          <option value="">Any brand ({totalBrandCount})</option>
          {brandOptions.map((brand) => (
            <option key={brand.name} value={brand.name}>
              {brand.name} ({brand.count})
            </option>
          ))}
        </select>
      </div>

      {/* Fuel chips */}
      <div className="filters-section">
        <label className="filters-label">Fuel type</label>
        <div className="filters-chips">
          {fuelOptions.map((fuel) => (
            <button
              key={fuel}
              type="button"
              className={`filters-chip${v.fuel === fuel ? " filters-chip--active" : ""}`}
              onClick={() => onChange({ ...v, fuel: v.fuel === fuel ? "" : fuel })}
            >
              {fuelLabels[fuel]}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="filters-section">
        <label className="filters-label">Transmission</label>
        <div className="filters-chips">
          {transmissionOptions.slice(1).map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filters-chip${v.transmission === opt.value ? " filters-chip--active" : ""}`}
              onClick={() =>
                onChange({ ...v, transmission: v.transmission === opt.value ? "" : (opt.value as Transmission) })
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="filters-section">
        <label className="filters-label">Location</label>
        <select
          value={v.location ?? ""}
          onChange={(e) => onChange({ ...v, location: e.target.value })}
          className="filters-control"
        >
          <option value="">Any city</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="filters-section">
        <label className="filters-label">Price</label>
        <div className="filters-grid2">
          <input
            type="number"
            min={0}
            value={v.minPrice ?? ""}
            onChange={(e) =>
              onChange({ ...v, minPrice: parseNonNegativeNumber(e.target.value) })
            }
            className="filters-control"
            placeholder="Min"
          />
          <input
            type="number"
            min={0}
            value={v.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ ...v, maxPrice: parseNonNegativeNumber(e.target.value) })
            }
            className="filters-control"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Year */}
      <div className="filters-section">
        <label className="filters-label">Year</label>
        <div className="filters-grid2">
          <input
            type="number"
            min={0}
            value={v.yearFrom ?? ""}
            onChange={(e) =>
              onChange({ ...v, yearFrom: parseNonNegativeNumber(e.target.value) })
            }
            className="filters-control"
            placeholder="From"
          />
          <input
            type="number"
            min={0}
            value={v.yearTo ?? ""}
            onChange={(e) =>
              onChange({ ...v, yearTo: parseNonNegativeNumber(e.target.value) })
            }
            className="filters-control"
            placeholder="To"
          />
        </div>
      </div>

      {/* Max mileage */}
      <div className="filters-section">
        <label className="filters-label">Max mileage</label>
        <select
          value={v.maxKm ?? ""}
          onChange={(e) =>
            onChange({ ...v, maxKm: e.target.value ? Number(e.target.value) : undefined })
          }
          className="filters-control"
        >
          {KM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Bottom CTA */}
      <div className="filters-cta">
        <div className="filters-count">
          {hasActive && <span className="filters-active-dot" />}
          Active filters applied
        </div>
        <button
          type="button"
          className="filters-reset-full"
          onClick={() => onChange(DEFAULT)}
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
