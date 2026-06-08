// AutoMarket — Homepage prototype
// One component, parameterized by theme + viewport. Runs inside each artboard.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- mock data ---------- */

const CARS = [
  { id: 1, brand: "Audi",          model: "A6 Avant",      year: 2022, price: 42800, mileage: "18,400 km", engine: "3.0L V6", fuel: "Diesel",   transmission: "Automatic", tag: "Estate" },
  { id: 2, brand: "BMW",           model: "M340i",         year: 2023, price: 56900, mileage: "12,100 km", engine: "3.0L I6", fuel: "Petrol",   transmission: "Automatic", tag: "Sedan" },
  { id: 3, brand: "Porsche",       model: "Taycan 4S",     year: 2024, price: 98500, mileage: "4,200 km",  engine: "Dual EV", fuel: "Electric", transmission: "Automatic", tag: "Sport" },
  { id: 4, brand: "Mercedes-Benz", model: "GLC 300",       year: 2022, price: 48200, mileage: "26,700 km", engine: "2.0L I4", fuel: "Petrol",   transmission: "Automatic", tag: "SUV" },
  { id: 5, brand: "Volkswagen",    model: "Golf GTI",      year: 2023, price: 34900, mileage: "9,800 km",  engine: "2.0L I4", fuel: "Petrol",   transmission: "Manual",    tag: "Hatch" },
  { id: 6, brand: "Toyota",        model: "RAV4 Hybrid",   year: 2023, price: 36500, mileage: "14,200 km", engine: "2.5L H4", fuel: "Hybrid",   transmission: "Automatic", tag: "SUV" },
];

const HERO_WORDS = ["car", "deal", "ride"];

const BRANDS = ["BMW", "Audi", "Tesla", "Toyota", "Mercedes-Benz", "Honda", "Volkswagen", "Ford"];

const HERO_BRAND_GRID = ["Volkswagen", "BMW", "Mercedes", "Audi", "Porsche", "Honda", "Toyota", "Skoda"];

/* ---------- tiny SVG icons ---------- */

const Icon = ({ d, size = 18, fill = "none", stroke = "currentColor", strokeWidth = 1.5, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24"
       fill={fill} stroke={stroke} strokeWidth={strokeWidth}
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const Search   = (p) => <Icon {...p} d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35" />;
const Close    = (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />;
const Sun      = (p) => <Icon {...p} d="M12 4V2M12 22v-2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />;
const Moon     = (p) => <Icon {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;
const Heart    = (p) => <Icon {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />;
const Menu     = (p) => <Icon {...p} d="M3 6h18M3 12h18M3 18h18" />;
const Sliders  = (p) => <Icon {...p} d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0 M14 4v4M8 10v4M16 16v4" />;
const ArrowRight = (p) => <Icon {...p} d="M5 12h14M13 5l7 7-7 7" />;
const Plus = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;

const SOCIAL = {
  facebook: "M22 12a10 10 0 1 0-11.6 9.87v-6.99H7.9V12h2.5V9.8c0-2.47 1.47-3.84 3.72-3.84 1.08 0 2.21.2 2.21.2v2.43h-1.25c-1.23 0-1.61.77-1.61 1.55V12h2.75l-.44 2.88h-2.31v6.99A10 10 0 0 0 22 12z",
  instagram: "M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3zm-4.5 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm5.25-8.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z",
  x: "M18 3h3l-7.5 8.57L22 21h-6.56l-5.13-6.7L4.5 21H1.5l8.06-9.2L1.5 3h6.72l4.6 6.1L18 3z",
  linkedin: "M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 21V9.5h4V21H3zm7-11.5h3.85v1.65h.05c.54-1 1.86-2.05 3.83-2.05C21.4 9.1 22 11 22 14.07V21h-4v-6.13c0-1.46-.03-3.35-2.04-3.35-2.05 0-2.36 1.6-2.36 3.25V21H10V9.5z",
};

/* ---------- Filter modal (advanced search) ---------- */

const BRAND_MODELS = {
  BMW: ["1 Series", "3 Series", "5 Series", "X1", "X3", "X5", "M340i"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "e-tron"],
  Mercedes: ["A-Class", "C-Class", "E-Class", "GLA", "GLC", "EQS"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  Toyota: ["Yaris", "Corolla", "RAV4", "Camry", "Highlander"],
  Volkswagen: ["Polo", "Golf", "Passat", "Tiguan", "ID.4"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Jazz"],
  Ford: ["Focus", "Fiesta", "Mondeo", "Kuga", "Mustang"],
  Skoda: ["Fabia", "Octavia", "Kodiaq", "Superb"],
};

function FilterModal({ open, onClose, value, onApply }) {
  const [draft, setDraft] = useState(value);
  const dialogRef = useRef(null);

  useEffect(() => { if (open) setDraft(value); }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const reset = () => setDraft({});

  return (
    <div className="am-modal-scrim"
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="am-modal" role="dialog" aria-modal="true" aria-label="Advanced filters" ref={dialogRef}>
        <div className="am-modal-head">
          <div className="am-modal-title">Advanced filters</div>
          <button className="am-iconbtn" onClick={onClose} aria-label="Close filters"><Close /></button>
        </div>

        <div className="am-modal-body">

          <section>
            <div className="am-fset-label">Vehicle</div>
            <div className="am-fset-grid">
              <Field label="Brand">
                <select className="am-select" value={draft.brand || ""} onChange={(e) => set("brand", e.target.value)}>
                  <option value="">Any brand</option>
                  {Object.keys(BRAND_MODELS).map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Model">
                <select className="am-select" value={draft.model || ""} onChange={(e) => set("model", e.target.value)} disabled={!draft.brand}>
                  <option value="">{draft.brand ? "Any model" : "Pick a brand"}</option>
                  {(BRAND_MODELS[draft.brand] || []).map((m) => <option key={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Body type">
                <select className="am-select" value={draft.body || ""} onChange={(e) => set("body", e.target.value)}>
                  <option value="">Any</option>
                  {["Sedan","SUV","Hatchback","Estate","Coupe","Convertible","Pickup"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
            </div>
          </section>

          <section>
            <div className="am-fset-label">Year &amp; mileage</div>
            <div className="am-fset-grid">
              <Field label="Year range">
                <div className="am-range">
                  <input className="am-input" placeholder="From" value={draft.yearFrom || ""} onChange={(e) => set("yearFrom", e.target.value)} />
                  <span className="am-range-sep">–</span>
                  <input className="am-input" placeholder="To"   value={draft.yearTo   || ""} onChange={(e) => set("yearTo",   e.target.value)} />
                </div>
              </Field>
              <Field label="Mileage (km)">
                <div className="am-range">
                  <input className="am-input" placeholder="Min" value={draft.kmMin || ""} onChange={(e) => set("kmMin", e.target.value)} />
                  <span className="am-range-sep">–</span>
                  <input className="am-input" placeholder="Max" value={draft.kmMax || ""} onChange={(e) => set("kmMax", e.target.value)} />
                </div>
              </Field>
              <Field label="Engine (L)">
                <input className="am-input" placeholder="e.g. 2.0" value={draft.engine || ""} onChange={(e) => set("engine", e.target.value)} />
              </Field>
            </div>
          </section>

          <section>
            <div className="am-fset-label">Drivetrain</div>
            <div className="am-fset-grid">
              <Field label="Fuel type">
                <select className="am-select" value={draft.fuel || ""} onChange={(e) => set("fuel", e.target.value)}>
                  <option value="">Any</option>
                  {["Petrol","Diesel","Hybrid","Electric","LPG"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
              <Field label="Transmission">
                <select className="am-select" value={draft.transmission || ""} onChange={(e) => set("transmission", e.target.value)}>
                  <option value="">Any</option>
                  {["Manual","Automatic","Semi-automatic"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
              <Field label="Drive type">
                <select className="am-select" value={draft.drive || ""} onChange={(e) => set("drive", e.target.value)}>
                  <option value="">Any</option>
                  {["FWD","RWD","AWD","4x4"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
            </div>
          </section>

          <section>
            <div className="am-fset-label">Price &amp; specifics</div>
            <div className="am-fset-grid">
              <Field label="Price (€)">
                <div className="am-range">
                  <input className="am-input" placeholder="Min" value={draft.priceMin || ""} onChange={(e) => set("priceMin", e.target.value)} />
                  <span className="am-range-sep">–</span>
                  <input className="am-input" placeholder="Max" value={draft.priceMax || ""} onChange={(e) => set("priceMax", e.target.value)} />
                </div>
              </Field>
              <Field label="Condition">
                <select className="am-select" value={draft.condition || ""} onChange={(e) => set("condition", e.target.value)}>
                  <option value="">Any</option>
                  <option>New</option><option>Used</option>
                </select>
              </Field>
              <Field label="Color">
                <select className="am-select" value={draft.color || ""} onChange={(e) => set("color", e.target.value)}>
                  <option value="">Any</option>
                  {["Black","White","Silver","Grey","Blue","Red","Green","Beige"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Doors">
                <select className="am-select" value={draft.doors || ""} onChange={(e) => set("doors", e.target.value)}>
                  <option value="">Any</option>
                  {["2","3","4","5"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </section>

        </div>

        <div className="am-modal-foot">
          <button className="am-btn am-btn--ghost" onClick={reset}>Reset</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="am-btn am-btn--outline" onClick={onClose}>Cancel</button>
            <button className="am-btn am-btn--primary" onClick={() => { onApply(draft); onClose(); }}>Apply filters</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="am-field">
    <span className="am-field-label">{label}</span>
    {children}
  </label>
);

/* ---------- Car card ---------- */

function CarCard({ car, isFav, onFav }) {
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // would route to /car-details in real app
    }
  };
  return (
    <article className="am-card" role="link" tabIndex={0} onKeyDown={handleKey}
             aria-label={`${car.brand} ${car.model} ${car.year}, €${car.price.toLocaleString()}`}>
      <div className="am-card-media">
        <div className="am-placeholder" aria-hidden="true">
          <div className="am-placeholder-name">{car.brand}</div>
          <div className="am-placeholder-spec">
            <b>{car.tag}</b>
            <span>{car.year}</span>
          </div>
          <div className="am-placeholder-tag">car photo · {car.brand.toLowerCase()}-{car.id}.jpg</div>
        </div>
        <button className="am-card-fav" aria-pressed={isFav} aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                onClick={(e) => { e.stopPropagation(); onFav(car.id); }}>
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="am-card-body">
        <div className="am-card-row">
          <div className="am-card-title">{car.brand} {car.model} <span style={{ color: "var(--muted)", fontWeight: 400 }}>{car.year}</span></div>
          <div className="am-card-price">€{car.price.toLocaleString()}</div>
        </div>
        <div className="am-card-meta">{car.mileage} · {car.engine} · {car.fuel} · {car.transmission}</div>
      </div>
    </article>
  );
}

/* ---------- Typewriter hook ---------- */

function useTypewriter(words, { typeMs = 90, holdMs = 1400, eraseMs = 50 } = {}) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => {
    if (reducedMotion.current) { setText(words[idx]); return; }
    let timer;
    const word = words[idx];
    let i = 0;
    const type = () => {
      i++;
      setText(word.slice(0, i));
      if (i < word.length) timer = setTimeout(type, typeMs);
      else timer = setTimeout(erase, holdMs);
    };
    const erase = () => {
      i--;
      setText(word.slice(0, i));
      if (i > 0) timer = setTimeout(erase, eraseMs);
      else { timer = setTimeout(() => setIdx((p) => (p + 1) % words.length), 200); }
    };
    timer = setTimeout(type, typeMs);
    return () => clearTimeout(timer);
  }, [idx, words, typeMs, holdMs, eraseMs]);

  return text || "\u00A0";
}

/* ---------- Hero visual: small "verified brands" grid ---------- */

function HeroVisual({ vp }) {
  return (
    <div className="am-hero-visual" aria-hidden="true">
      <div className="am-placeholder">
        <div className="am-placeholder-name">Today on the lot</div>
        <div className="am-placeholder-spec">
          <b>Porsche</b>
          <span>Taycan 4S · 2024</span>
        </div>
        <div className="am-placeholder-tag">hero image · porsche-taycan.jpg</div>
      </div>
      <div style={{
        position: "absolute",
        left: 16, right: 16, bottom: 16,
        display: "grid",
        gridTemplateColumns: vp === "mobile" ? "repeat(4,1fr)" : "repeat(4,1fr)",
        gap: 6,
      }}>
        {HERO_BRAND_GRID.map((b) => (
          <div key={b} style={{
            padding: "10px 6px",
            background: "color-mix(in oklab, var(--surface) 86%, transparent)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            textAlign: "center",
            fontFamily: "var(--ff-sans)",
            fontSize: 11,
            color: "var(--text-2)",
            letterSpacing: "-0.005em",
            backdropFilter: "blur(6px)",
          }}>{b}</div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Homepage ---------- */

function AutoMarketHome({ theme, vp, loggedIn = false }) {
  const word = useTypewriter(HERO_WORDS);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [favs, setFavs] = useState(() => new Set());
  const [mobOpen, setMobOpen] = useState(false);
  const resultsRef = useRef(null);

  const filterCount = useMemo(() => Object.values(filters).filter(Boolean).length, [filters]);

  const results = useMemo(() => {
    if (!submittedQuery && filterCount === 0) return [];
    const q = submittedQuery.toLowerCase();
    return CARS.filter((c) => {
      const blob = `${c.brand} ${c.model} ${c.year} ${c.fuel} ${c.transmission} ${c.tag}`.toLowerCase();
      if (q && !blob.includes(q)) return false;
      if (filters.brand && c.brand !== filters.brand && !c.brand.startsWith(filters.brand)) return false;
      if (filters.fuel && c.fuel !== filters.fuel) return false;
      if (filters.transmission && c.transmission !== filters.transmission) return false;
      return true;
    });
  }, [submittedQuery, filters, filterCount]);

  const showResults = submittedQuery !== "" || filterCount > 0;

  const onSubmit = (e) => {
    e?.preventDefault();
    setSubmittedQuery(query);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const clearAll = () => { setQuery(""); setSubmittedQuery(""); setFilters({}); };

  const toggleFav = useCallback((id) => {
    setFavs((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }, []);

  return (
    <div className="am" data-theme={theme} data-vp={vp}>
      <div className="am-scroll">

        {/* NAV */}
        <header className="am-nav">
          <div className="am-shell am-nav-row">
            <a href="#/" className="am-brand">
              <span className="am-brand-mark">A</span>
              <span>AutoMarket</span>
            </a>
            <nav className="am-nav-links" aria-label="Primary">
              <a href="#/" className="am-nav-link" aria-current="page">Home</a>
              <a href="#/offers" className="am-nav-link">Offers</a>
              <a href="#/sell" className="am-nav-link">Sell</a>
              <a href="#/my-listings" className="am-nav-link">My listings</a>
              <a href="#/help" className="am-nav-link">Help</a>
              <a href="#/contact-us" className="am-nav-link">Contact</a>
            </nav>
            <div className="am-nav-right">
              <button className="am-iconbtn" aria-label="Toggle theme" title="Theme">
                {theme === "light" ? <Moon /> : <Sun />}
              </button>
              <a href="#/favorites" className="am-iconbtn" aria-label="Favorites"><Heart /></a>
              {vp === "desktop" ? (
                loggedIn ? (
                  <>
                    <span style={{ fontSize: "var(--fs-14)", color: "var(--text-2)", padding: "0 8px" }}>Hi, Alex</span>
                    <button className="am-btn am-btn--outline">Log out</button>
                  </>
                ) : (
                  <>
                    <a href="#/login"  className="am-btn am-btn--ghost">Log in</a>
                    <a href="#/signup" className="am-btn am-btn--primary">Sign up</a>
                  </>
                )
              ) : (
                <button className="am-iconbtn" aria-label="Menu" onClick={() => setMobOpen((o) => !o)}>
                  {mobOpen ? <Close /> : <Menu />}
                </button>
              )}
            </div>
          </div>
          {vp === "mobile" && mobOpen && (
            <div className="am-mobsheet">
              {["Home","Offers","Sell","My listings","Help","Contact"].map((l) => (
                <a key={l} href="#" onClick={() => setMobOpen(false)}>{l}</a>
              ))}
              <div className="am-mobsheet-row">
                <a href="#/login" className="am-btn am-btn--outline">Log in</a>
                <a href="#/signup" className="am-btn am-btn--primary">Sign up</a>
              </div>
            </div>
          )}
        </header>

        {/* HERO */}
        <section className="am-shell am-hero">
          <div className="am-hero-grid">
            <div>
              <div className="am-eyebrow">Verified marketplace · 2026</div>
              <h1 className="am-display">
                Find your perfect{" "}
                <span className="am-display-accent">{word}</span>
                <br />
                today.
              </h1>
              <p className="am-sub">
                Browse {(14300).toLocaleString()}+ verified listings from trusted private sellers and dealers. No fees, no clutter — just cars.
              </p>
              <div className="am-cta-row">
                <a href="#/offers" className="am-btn am-btn--primary am-btn--lg">
                  Browse cars <ArrowRight size={16} />
                </a>
                <a href="#/sell" className="am-btn am-btn--outline am-btn--lg">Sell your car</a>
              </div>

              <div className="am-stats">
                <Stat num="14,300+" label="Cars listed" />
                <Stat num="6,800+"  label="Verified sellers" />
                <Stat num="99%"     label="Satisfaction rate" />
                <Stat num="Free"    label="To browse" />
              </div>
            </div>

            {vp === "desktop" && <HeroVisual vp={vp} />}
          </div>

          {/* search integrated into hero band */}
          <div className="am-search-wrap">
            <form className="am-search" onSubmit={onSubmit} role="search">
              <Search size={18} className="am-search-icon" />
              <input
                className="am-search-input"
                placeholder="Search cars — e.g. Audi A6, SUV, diesel, 2018"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search cars"
              />
              {query && (
                <button type="button" className="am-search-clear" aria-label="Clear search" onClick={() => setQuery("")}>
                  <Close size={14} />
                </button>
              )}
              <div className="am-search-divider" />
              <button type="button" className="am-search-filter" onClick={() => setFilterOpen(true)} aria-label="Open filters">
                <Sliders size={16} />
                <span>Filters</span>
                {filterCount > 0 && <span className="am-filter-badge">{filterCount}</span>}
              </button>
              <button type="submit" className="am-search-submit">
                Search
              </button>
            </form>
            {(submittedQuery || filterCount > 0) && (
              <div className="am-clear-row">
                <button className="am-text-link" onClick={clearAll}>Clear search &amp; filters</button>
              </div>
            )}
          </div>
        </section>

        {/* BRANDS */}
        <section className="am-shell am-brands">
          <div className="am-brands-head">
            <div className="am-brands-label">Jump to a brand</div>
            <a href="#/offers" className="am-text-link">All 42 brands →</a>
          </div>
          <div className="am-brands-rail">
            {BRANDS.map((b) => (
              <a key={b} href="#/offers" className="am-brand-chip">{b}</a>
            ))}
          </div>
        </section>

        {/* RESULTS */}
        {showResults && (
          <section className="am-shell am-section" ref={resultsRef}>
            <div className="am-section-head">
              <div>
                <h2 className="am-section-title">Search results</h2>
                <div className="am-section-sub">
                  {results.length} match{results.length === 1 ? "" : "es"}
                  {submittedQuery && <> for “<b style={{ color: "var(--text-2)" }}>{submittedQuery}</b>”</>}
                  {filterCount > 0 && <> · {filterCount} filter{filterCount === 1 ? "" : "s"} active</>}
                </div>
              </div>
              <button className="am-btn am-btn--ghost" onClick={clearAll}>Clear</button>
            </div>
            {results.length === 0 ? (
              <div className="am-empty">No results found for your search.</div>
            ) : (
              <div className="am-grid">
                {results.map((c) => <CarCard key={c.id} car={c} isFav={favs.has(c.id)} onFav={toggleFav} />)}
              </div>
            )}
          </section>
        )}

        {/* POPULAR */}
        <section className="am-shell am-section">
          <div className="am-section-head">
            <div>
              <h2 className="am-section-title">Popular offers</h2>
              <div className="am-section-sub">Hand-picked listings updated this week</div>
            </div>
            <a href="#/offers" className="am-text-link">View all offers →</a>
          </div>
          <div className="am-grid">
            {CARS.map((c) => <CarCard key={c.id} car={c} isFav={favs.has(c.id)} onFav={toggleFav} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--sp-7)" }}>
            <a href="#/offers" className="am-btn am-btn--primary am-btn--lg">
              View more <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="am-shell am-foot">
          <div className="am-foot-grid">
            <div className="am-foot-brand">
              <a href="#/" className="am-brand">
                <span className="am-brand-mark">A</span>
                <span>AutoMarket</span>
              </a>
              <p className="am-foot-tagline">A calmer marketplace for buying and selling cars. Verified sellers, transparent listings, no upsells.</p>
              <div className="am-foot-social">
                {Object.entries(SOCIAL).map(([k, d]) => (
                  <a key={k} href="#" className="am-iconbtn" aria-label={k}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="am-foot-col">
              <h4>Explore</h4>
              <ul>
                <li><a href="#/offers">Browse cars</a></li>
                <li><a href="#/offers">New arrivals</a></li>
                <li><a href="#/offers">Electric vehicles</a></li>
                <li><a href="#/offers">Luxury cars</a></li>
                <li><a href="#/offers">SUVs &amp; crossovers</a></li>
              </ul>
            </div>

            <div className="am-foot-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#/">About us</a></li>
                <li><a href="#/sell">Sell your car</a></li>
                <li><a href="#/contact-us">Contact</a></li>
                <li><a href="#/help">Help center</a></li>
                <li><a href="#/help">FAQ</a></li>
              </ul>
            </div>

            <div className="am-news">
              <h4>Stay in the loop</h4>
              <div className="am-news-line">New listings, market notes, twice a month.</div>
              <form className="am-news-input" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="you@email.com" aria-label="Email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="am-foot-bottom">
            <div>© 2026 AutoMarket. All rights reserved.</div>
            <div className="am-foot-bottom-links">
              <a href="#">Privacy policy</a>
              <a href="#">Terms of service</a>
              <a href="#">Cookie settings</a>
            </div>
          </div>
        </footer>

      </div>

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={filters}
        onApply={(d) => setFilters(d)}
      />
    </div>
  );
}

const Stat = ({ num, label }) => (
  <div>
    <div className="am-stat-num">{num}</div>
    <div className="am-stat-label">{label}</div>
  </div>
);

window.AutoMarketHome = AutoMarketHome;
