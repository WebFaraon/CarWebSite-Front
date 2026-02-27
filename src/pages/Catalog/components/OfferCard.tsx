// src/pages/Catalog/components/OfferCard.tsx
import type { Offer } from "../catalog.types";

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex gap-2">
          {offer.isNew && (
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-600">
              NEW
            </span>
          )}
          {offer.discountPct && offer.discountPct > 0 && (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-600">
              -{offer.discountPct}%
            </span>
          )}
        </div>

        <button
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/90 backdrop-blur hover:bg-white"
          aria-label="Favorite"
          type="button"
        >
          <span className="text-orange-500 text-lg">♡</span>
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-slate-900 font-black leading-snug line-clamp-2">
          {offer.title}
        </h3>

        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="text-slate-900 text-lg font-black">
            {new Intl.NumberFormat("de-DE").format(offer.price)} {offer.currency}
          </div>
          <div className="text-xs text-slate-500">Verified listing</div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Spec label="Year" value={offer.year} />
          <Spec label="Mileage" value={`${new Intl.NumberFormat("de-DE").format(offer.km)} km`} />
          <Spec label="Fuel" value={offer.fuel} />
          <Spec label="Power" value={offer.powerHp ? `${offer.powerHp} hp` : "-"} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500">📍 {offer.location}</div>
          <button
            className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-black text-orange-600 hover:bg-orange-100"
            type="button"
          >
            View →
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="text-[11px] font-extrabold text-slate-500">{label}</div>
      <div className="text-sm font-black text-slate-800">{value}</div>
    </div>
  );
}