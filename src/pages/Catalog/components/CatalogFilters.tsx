// src/pages/Catalog/components/CatalogFilters.tsx
import type { Filters } from "../catalog.types";
import "../catalogstyles.css";

export default function CatalogFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
}) {
  const v = value;

  return (
    <div className="filters">
      <div className="filters-head">
        <div className="filters-title">Filters</div>
        <div className="filters-subtitle">Narrow down your search</div>
      </div>

      <label className="filters-label">Search</label>
      <div className="filters-search">
        <span className="filters-search-icon">🔎</span>
        <input
          value={v.q}
          onChange={(e) => onChange({ ...v, q: e.target.value })}
          className="filters-search-input"
          placeholder="Audi A6, SUV, diesel..."
        />
      </div>

      <div className="filters-grid2">
        <div className="filters-field">
          <label className="filters-label">Min price</label>
          <input
            type="number"
            value={v.minPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="filters-control"
            placeholder="0"
          />
        </div>

        <div className="filters-field">
          <label className="filters-label">Max price</label>
          <input
            type="number"
            value={v.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="filters-control"
            placeholder="50000"
          />
        </div>
      </div>

      <div className="filters-grid2">
        <div className="filters-field">
          <label className="filters-label">Year from</label>
          <input
            type="number"
            value={v.yearFrom ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                yearFrom: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="filters-control"
            placeholder="2015"
          />
        </div>

        <div className="filters-field">
          <label className="filters-label">Year to</label>
          <input
            type="number"
            value={v.yearTo ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                yearTo: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="filters-control"
            placeholder="2025"
          />
        </div>
      </div>

      <div className="filters-block">
        <label className="filters-label">Fuel</label>
        <select
          value={v.fuel ?? ""}
          onChange={(e) => onChange({ ...v, fuel: e.target.value as any })}
          className="filters-control"
        >
          <option value="">Any</option>
          <option value="diesel">Diesel</option>
          <option value="petrol">Petrol</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
          <option value="gas">Gas</option>
        </select>
      </div>

      <div className="filters-actions">
        <button
          type="button"
          onClick={() =>
            onChange({
              q: "",
              fuel: "",
              minPrice: undefined,
              maxPrice: undefined,
              yearFrom: undefined,
              yearTo: undefined,
            })
          }
          className="filters-reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}