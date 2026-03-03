import type { ReactNode } from "react";
import type { Offer } from "../catalog.types";
import "../catalogstyles.css";

export default function OfferCard({
  offer,
  isFavorite,
  onToggleFavorite,
}: {
  offer: Offer;
  isFavorite: boolean;
  onToggleFavorite: (offerId: string) => void;
}) {
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
          className={`offer-card__fav ${isFavorite ? "is-active" : ""}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          type="button"
          onClick={() => onToggleFavorite(offer.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.25 10.55 19C5.4 14.36 2 11.28 2 7.5A5.38 5.38 0 0 1 7.5 2 6.16 6.16 0 0 1 12 4.09 6.16 6.16 0 0 1 16.5 2 5.38 5.38 0 0 1 22 7.5c0 3.78-3.4 6.86-8.55 11.51L12 20.25Z" />
          </svg>
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
          <div className="offer-card__location">Location: {offer.location}</div>
          <button className="offer-card__cta" type="button">
            View details
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="spec">
      <div className="spec__label">{label}</div>
      <div className="spec__value">{value}</div>
    </div>
  );
}
