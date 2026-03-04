// src/pages/Catalog/CatalogPage.tsx
import { useEffect, useState } from "react";
import CatalogFilters from "./components/CatalogFilters";
import SortBar from "./components/SortBar";
import OfferGrid from "./components/OfferGrid";
import BrandBar from "./components/BrandBar";
import Pagination from "./components/Pagination";
import Navbar from "../../components/navbar/Navbar";
import SiteFooter from "../../components/home/SiteFooter";
import { toCatalogFavoriteId } from "./catalog.api";
import useCatalog from "./hooks/useCatalog";
import { getFavoriteIds, setFavoriteIds } from "../../utils/favoritesStorage";
import "./catalogstyles.css";

const socialLinks = [
  { platform: "facebook", href: "#" },
  { platform: "instagram", href: "#" },
  { platform: "x", href: "#" },
  { platform: "linkedin", href: "#" },
] as const;

export default function CatalogPage() {
  const [favoriteIds, setFavoriteIdsState] = useState<number[]>(() => getFavoriteIds());

  const {
    brands,
    locations,
    filteredOffers,
    totalCount,
    page,
    totalPages,
    setPage,
    filters,
    setFilters,
    sort,
    setSort,
    isLoading,
  } = useCatalog();

  useEffect(() => {
    setFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  const toggleFavorite = (offerId: string) => {
    const favoriteId = toCatalogFavoriteId(offerId);
    if (favoriteId == null) return;
    setFavoriteIdsState((prev) =>
      prev.includes(favoriteId) ? prev.filter((id) => id !== favoriteId) : [...prev, favoriteId]
    );
  };

  return (
    <>
      <Navbar />
      <div className="catalog-page">
        <div className="catalog-bg">
          <div className="catalog-blob catalog-blob--blue" />
          <div className="catalog-blob catalog-blob--orange" />
        </div>

        <div className="catalog-container">
          <div className="catalog-header">
            <div>
              <h1 className="catalog-title">Offers</h1>
              <p className="catalog-subtitle">
                {isLoading ? "Loading…" : `${totalCount} results`}
              </p>
            </div>
            <SortBar value={sort} onChange={setSort} />
          </div>

          <div className="catalog-layout">
            <aside className="catalog-aside">
              <div className="catalog-card">
                <CatalogFilters value={filters} onChange={setFilters} locations={locations} />
              </div>
            </aside>

            <main className="catalog-main">
              <BrandBar
                brands={brands}
                active={filters.brand ?? ""}
                onChange={(b) => setFilters({ ...filters, brand: b })}
              />

              <div className="catalog-card catalog-card--padded">
                <OfferGrid
                  offers={filteredOffers}
                  loading={isLoading}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={toggleFavorite}
                />
              </div>

              <div className="catalog-pagination">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </main>
          </div>
        </div>
      </div>
      <SiteFooter socialLinks={[...socialLinks]} />
    </>
  );
}
