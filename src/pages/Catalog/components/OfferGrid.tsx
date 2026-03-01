// src/pages/Catalog/components/OfferGrid.tsx
import OfferCard from "./OfferCard";
import type { Offer } from "../catalog.types";
import "../catalogstyles.css";

export default function OfferGrid({
  offers,
  loading,
}: {
  offers: Offer[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="offer-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="offer-skeleton" />
        ))}
      </div>
    );
  }

  if (!offers?.length) {
    return <div className="offer-grid-empty">No results.</div>;
  }

  return (
    <div className="offer-grid">
      {offers.map((o) => (
        <OfferCard key={o.id} offer={o} />
      ))}
    </div>
  );
}