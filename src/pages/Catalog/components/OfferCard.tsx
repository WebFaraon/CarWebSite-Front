import { useNavigate } from "react-router-dom";
import type { Offer } from "../catalog.types";
import "../catalogstyles.css";

const FUEL_LABEL: Record<string, string> = {
  diesel: "Diesel",
  petrol: "Petrol",
  hybrid: "Hybrid",
  electric: "Electric",
  gas: "Gas",
};

const TX_LABEL: Record<string, string> = {
  automatic: "Auto",
  manual: "Manual",
};

export default function OfferCard({
  offer,
  isFavorite,
  onToggleFavorite,
}: {
  offer: Offer;
  isFavorite: boolean;
  onToggleFavorite: (offerId: string) => void;
}) {
  const navigate = useNavigate();
  const priceFormatted = new Intl.NumberFormat("de-DE").format(offer.price);
  const kmFormatted = new Intl.NumberFormat("de-DE").format(offer.km);

  const goToCarDetails = () => {
    navigate("/car-details", {
      state: {
        offer,
      },
    });
  };

  return (
    <article
      className="offer-card offer-card--clickable"
      onClick={goToCarDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToCarDetails();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Open details for ${offer.title}`}
    >
      {/* Image section */}
      <div className="offer-card__media">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="offer-card__img"
          loading="lazy"
        />

        {/* Badges top-left */}
        {(offer.isNew || (offer.discountPct ?? 0) > 0) && (
          <div className="offer-card__badges">
            {offer.isNew && <span className="badge badge--new">NEW</span>}
            {(offer.discountPct ?? 0) > 0 && (
              <span className="badge badge--discount">-{offer.discountPct}%</span>
            )}
          </div>
        )}

        {/* Fav button top-right */}
        <button
          type="button"
          className={`offer-card__fav${isFavorite ? " is-active" : ""}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(offer.id);
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.25 10.55 19C5.4 14.36 2 11.28 2 7.5A5.38 5.38 0 0 1 7.5 2 6.16 6.16 0 0 1 12 4.09 6.16 6.16 0 0 1 16.5 2 5.38 5.38 0 0 1 22 7.5c0 3.78-3.4 6.86-8.55 11.51L12 20.25Z" />
          </svg>
        </button>
      </div>

      {/* Info section below image */}
      <div className="offer-card__body">
        <h3 className="offer-card__title">{offer.title}</h3>

        <div className="offer-card__price">
          {priceFormatted} <span className="offer-card__currency">{offer.currency}</span>
        </div>

        <div className="offer-card__meta">
          <span>{offer.year}</span>
          {offer.transmission && (
            <>
              <span className="offer-card__dot">&middot;</span>
              <span>{TX_LABEL[offer.transmission]}</span>
            </>
          )}
          <span className="offer-card__dot">&middot;</span>
          <span>{FUEL_LABEL[offer.fuel] ?? offer.fuel}</span>
          <span className="offer-card__dot">&middot;</span>
          <span>{kmFormatted} km</span>
          {offer.powerHp && (
            <>
              <span className="offer-card__dot">&middot;</span>
              <span>{offer.powerHp} hp</span>
            </>
          )}
        </div>

        <div className="offer-card__footer">
          <span className="offer-card__location">{offer.location}</span>
          <button
            type="button"
            className="offer-card__cta"
            onClick={(event) => {
              event.stopPropagation();
              goToCarDetails();
            }}
          >
            View details
          </button>
        </div>
      </div>
    </article>
  );
}
