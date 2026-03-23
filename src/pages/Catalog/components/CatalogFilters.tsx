import type { Filters, Fuel, Transmission } from "../catalog.types";
import "../catalogstyles.css";

function NumberInput({
  value,
  onChange,
  placeholder,
  min = 0,
  step = 1000,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder: string;
  min?: number;
  step?: number;
}) {
  const raw = value ?? "";

  const increment = () => onChange(Math.max(min, (value ?? 0) + step));
  const decrement = () => {
    const next = (value ?? 0) - step;
    onChange(next <= min ? undefined : next);
  };

  return (
    <div className="num-input">
      <input
        type="number"
        min={min}
        value={raw}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(e.target.value === "" ? undefined : Math.max(min, n));
        }}
        className="num-input__field"
        placeholder={placeholder}
      />
      <div className="num-input__spinners">
        <button type="button" className="num-input__spin" onClick={increment} aria-label="Increase">
          <svg viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button type="button" className="num-input__spin" onClick={decrement} aria-label="Decrease">
          <svg viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const fuelOptions: Fuel[] = ["diesel", "petrol", "hybrid", "electric", "gas"];
const fuelLabels: Record<Fuel, string> = {
  diesel: "Diesel",
  petrol: "Petrol",
  hybrid: "Hybrid",
  electric: "Electric",
  gas: "Gas",
};

const KM_OPTIONS = [
  { label: "Any mileage", value: "" },
  { label: "< 50 000 km",  value: "50000" },
  { label: "< 100 000 km", value: "100000" },
  { label: "< 150 000 km", value: "150000" },
  { label: "< 200 000 km", value: "200000" },
  { label: "< 250 000 km", value: "250000" },
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
  const totalCount = brandOptions.reduce((s, b) => s + b.count, 0);
  const hasActive =
    v.q || v.brand || v.location || v.fuel || v.transmission ||
    v.minPrice != null || v.maxPrice != null ||
    v.yearFrom != null || v.yearTo != null || v.maxKm != null;

  return (
    <div className="fbar">
      {/* Row 1: search, brand, location, transmission, sort */}
      <div className="fbar__row">
        <div className="fbar__search">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            value={v.q}
            onChange={(e) => onChange({ ...v, q: e.target.value })}
            className="fbar__search-input"
            placeholder="Search make, model…"
          />
        </div>

        <select
          value={v.brand ?? ""}
          onChange={(e) => onChange({ ...v, brand: e.target.value })}
          className="fbar__select"
        >
          <option value="">All brands ({totalCount})</option>
          {brandOptions.map((b) => (
            <option key={b.name} value={b.name}>{b.name} ({b.count})</option>
          ))}
        </select>

        <select
          value={v.location ?? ""}
          onChange={(e) => onChange({ ...v, location: e.target.value })}
          className="fbar__select"
        >
          <option value="">Any location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={v.maxKm ?? ""}
          onChange={(e) =>
            onChange({ ...v, maxKm: e.target.value ? Number(e.target.value) : undefined })
          }
          className="fbar__select"
        >
          {KM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActive && (
          <button type="button" className="fbar__reset" onClick={() => onChange(DEFAULT)}>
            Clear
          </button>
        )}
      </div>

      {/* Row 2: fuel chips, transmission chips, price, year */}
      <div className="fbar__row fbar__row--secondary">
        <div className="fbar__group">
          <span className="fbar__group-label">Fuel</span>
          <div className="fbar__chips">
            {fuelOptions.map((fuel) => (
              <button
                key={fuel}
                type="button"
                className={`fbar__chip${v.fuel === fuel ? " fbar__chip--active" : ""}`}
                onClick={() => onChange({ ...v, fuel: v.fuel === fuel ? "" : fuel })}
              >
                {fuelLabels[fuel]}
              </button>
            ))}
          </div>
        </div>

        <div className="fbar__group">
          <span className="fbar__group-label">Transmission</span>
          <div className="fbar__chips">
            {(["automatic", "manual"] as Transmission[]).map((tx) => (
              <button
                key={tx}
                type="button"
                className={`fbar__chip${v.transmission === tx ? " fbar__chip--active" : ""}`}
                onClick={() => onChange({ ...v, transmission: v.transmission === tx ? "" : tx })}
              >
                {tx === "automatic" ? "Automatic" : "Manual"}
              </button>
            ))}
          </div>
        </div>

        <div className="fbar__group">
          <span className="fbar__group-label">Price</span>
          <div className="fbar__range">
            <NumberInput value={v.minPrice} onChange={(n) => onChange({ ...v, minPrice: n })} placeholder="Min" />
            <span className="fbar__range-sep">–</span>
            <NumberInput value={v.maxPrice} onChange={(n) => onChange({ ...v, maxPrice: n })} placeholder="Max" />
          </div>
        </div>

        <div className="fbar__group">
          <span className="fbar__group-label">Year</span>
          <div className="fbar__range">
            <NumberInput value={v.yearFrom} onChange={(n) => onChange({ ...v, yearFrom: n })} placeholder="From" step={1} min={1900} />
            <span className="fbar__range-sep">–</span>
            <NumberInput value={v.yearTo} onChange={(n) => onChange({ ...v, yearTo: n })} placeholder="To" step={1} min={1900} />
          </div>
        </div>
      </div>
    </div>
  );
}
