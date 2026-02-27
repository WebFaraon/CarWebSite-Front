// src/pages/Catalog/components/CatalogFilters.tsx
import type { Filters } from "../catalog.types";

export default function CatalogFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
}) {
  const v = value;

  return (
    <div className="p-4">
      <div className="mb-3">
        <div className="text-lg font-black text-slate-900">Filters</div>
        <div className="text-sm text-slate-500">Narrow down your search</div>
      </div>

      <label className="block text-xs font-extrabold text-slate-700 mb-2">
        Search
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <span className="text-slate-400">🔎</span>
        <input
          value={v.q}
          onChange={(e) => onChange({ ...v, q: e.target.value })}
          className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          placeholder="Audi A6, SUV, diesel..."
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-2">
            Min price
          </label>
          <input
            type="number"
            value={v.minPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-orange-100"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-2">
            Max price
          </label>
          <input
            type="number"
            value={v.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-orange-100"
            placeholder="50000"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-2">
            Year from
          </label>
          <input
            type="number"
            value={v.yearFrom ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                yearFrom: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-orange-100"
            placeholder="2015"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-2">
            Year to
          </label>
          <input
            type="number"
            value={v.yearTo ?? ""}
            onChange={(e) =>
              onChange({
                ...v,
                yearTo: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-orange-100"
            placeholder="2025"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-extrabold text-slate-700 mb-2">
          Fuel
        </label>
        <select
          value={v.fuel ?? ""}
          onChange={(e) => onChange({ ...v, fuel: e.target.value as any })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-orange-100"
        >
          <option value="">Any</option>
          <option value="diesel">Diesel</option>
          <option value="petrol">Petrol</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
          <option value="gas">Gas</option>
        </select>
      </div>

      <div className="mt-5 flex gap-3">
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
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 font-extrabold text-slate-700 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}