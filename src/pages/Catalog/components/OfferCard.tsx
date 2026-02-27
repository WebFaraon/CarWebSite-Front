// src/pages/Catalog/components/OfferCard.tsx
import type { Offer } from "../catalog.types";
import "../catalogstyles.css";

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="offer-card">
      <div className="offer-card__media">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="offer-card__img"
          loading="lazy"
        />

        <div className="offer-card__badges">
          {offer.isNew && <span className="badge badge--new">NEW</span>}
          {offer.discountPct && offer.discountPct > 0 && (
            <span className="badge badge--discount">-{offer.discountPct}%</span>
          )}
        </div>

        <button
          className="offer-card__fav"
          aria-label="Favorite"
          type="button"
        >
          <span className="offer-card__fav-icon">♡</span>
        </button>
      </div>

      <div className="offer-card__body">
        <h3 className="offer-card__title">{offer.title}</h3>

        <div className="offer-card__price-row">
          <div className="offer-card__price">
            {new Intl.NumberFormat("de-DE").format(offer.price)} {offer.currency}
          </div>
          <div className="offer-card__verified">Verified listing</div>
        </div>

        <div className="offer-card__specs">
          <Spec label="Year" value={offer.year} />
          <Spec
            label="Mileage"
            value={`${new Intl.NumberFormat("de-DE").format(offer.km)} km`}
          />
          <Spec label="Fuel" value={offer.fuel} />
          <Spec label="Power" value={offer.powerHp ? `${offer.powerHp} hp` : "-"} />
        </div>

        <div className="offer-card__footer">
          <div className="offer-card__location">📍 {offer.location}</div>
          <button className="offer-card__cta" type="button">
            View →
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: any }) {
  return (
    <div className="spec">
      <div className="spec__label">{label}</div>
      <div className="spec__value">{value}</div>
    </div>
  );
}