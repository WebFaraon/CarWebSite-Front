// src/pages/Catalog/components/OfferGrid.tsx
import OfferCard from "./OfferCard";
import type { Offer } from "../catalog.types";

export default function OfferGrid({
  offers,
  loading,
}: {
  offers: Offer[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-[340px] rounded-2xl border border-slate-200 bg-slate-50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!offers?.length) {
    return <div className="p-6 text-slate-500">No results.</div>;
  }

  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
      {offers.map((o) => (
        <OfferCard key={o.id} offer={o} />
      ))}
    </div>
  );
}