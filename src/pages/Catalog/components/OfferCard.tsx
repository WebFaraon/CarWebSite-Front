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
  automatic: "Automatic",
  manual: "Manual",
};

const CURRENCY_LABEL: Record<Offer["currency"], string> = {
  EUR: "EUR",
  "$": "USD",
  MDL: "MDL",
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

  const goToCarDetails = () => {
    navigate("/car-details", { state: { offer } });
  };

  const priceFormatted = new Intl.NumberFormat("de-DE").format(offer.price);
  const kmFormatted = new Intl.NumberFormat("de-DE").format(offer.km);
  const imageUrl = offer.imageUrl ?? undefined;


  const specs = [
    `~${kmFormatted} km`,
    offer.transmission ? TX_LABEL[offer.transmission] : null,
    FUEL_LABEL[offer.fuel] ?? offer.fuel,
    offer.powerHp ? `${offer.powerHp} hp` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className="oc oc--clickable"
      onClick={goToCarDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToCarDetails();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Open details for ${offer.title}`}
    >
      {/* Image */}
      <div className="oc__media">
      { imageUrl ? (
        <img
          src={imageUrl}
          alt={offer.title}
          className="oc__img"
          loading="lazy"
        />
  ) : (
    <div className="oc__img oc__img--placeholder" aria-label="No image available">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      <span>No image</span>
    </div>
  )}

        {/* Fav button */}
        <button
          type="button"
          className={`oc__fav${isFavorite ? " is-active" : ""}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(offer.id); }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.25 10.55 19C5.4 14.36 2 11.28 2 7.5A5.38 5.38 0 0 1 7.5 2 6.16 6.16 0 0 1 12 4.09 6.16 6.16 0 0 1 16.5 2 5.38 5.38 0 0 1 22 7.5c0 3.78-3.4 6.86-8.55 11.51L12 20.25Z" />
          </svg>
        </button>

      </div>

      {/* Body */}
      <div className="oc__body">
        <h3 className="oc__title">{offer.title}</h3>
        <p className="oc__price">
          {priceFormatted} <span className="oc__currency">{CURRENCY_LABEL[offer.currency]}</span>
        </p>
        <p className="oc__desc">
          {specs}
        </p>
        <p className="oc__location">{offer.location}</p>
      </div>
    </article>
  );
}
