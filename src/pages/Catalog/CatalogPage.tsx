// src/pages/Catalog/CatalogPage.tsx
import { useEffect, useState } from "react";
import CatalogFilters from "./components/CatalogFilters";
import SortBar from "./components/SortBar";
import OfferGrid from "./components/OfferGrid";
import Pagination from "./components/Pagination";
import Navbar from "../../components/navbar/Navbar";
import useCatalog from "./hooks/useCatalog";
import { getFavoriteIds, setFavoriteIds } from "../../utils/favoritesStorage";
import "./catalogstyles.css";

export default function CatalogPage() {
  const [favoriteIds, setFavoriteIdsState] = useState<number[]>(() => getFavoriteIds());

  const {
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
    const numericId = Number.parseInt(offerId, 10);
    if (!Number.isInteger(numericId)) return;

    setFavoriteIdsState((prev) => {
      if (prev.includes(numericId)) {
        return prev.filter((id) => id !== numericId);
      }
      return [...prev, numericId];
    });
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
                {isLoading ? "Loading..." : `${totalCount} results`}
              </p>
            </div>

            <SortBar value={sort} onChange={setSort} />
          </div>

          <div className="catalog-layout">
            <aside className="catalog-aside">
              <div className="catalog-card">
                <CatalogFilters value={filters} onChange={setFilters} />
              </div>
            </aside>

            <main className="catalog-main">
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
    </>
  );
}
