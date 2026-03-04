import "../catalogstyles.css";

export default function BrandBar({
  brands,
  active,
  onChange,
}: {
  brands: string[];
  active: string;
  onChange: (brand: string) => void;
}) {
  if (!brands.length) return null;

  return (
    <div className="brand-bar">
      {brands.map((brand) => (
        <button
          key={brand}
          type="button"
          className={`brand-chip${active === brand ? " brand-chip--active" : ""}`}
          onClick={() => onChange(active === brand ? "" : brand)}
        >
          {brand}
        </button>
      ))}
    </div>
  );
}
