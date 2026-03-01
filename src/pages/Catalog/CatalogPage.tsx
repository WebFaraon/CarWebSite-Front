// src/pages/Catalog/CatalogPage.tsx
import CatalogFilters from "./components/CatalogFilters";
import SortBar from "./components/SortBar";
import OfferGrid from "./components/OfferGrid";
import Pagination from "./components/Pagination";
import useCatalog from "./hooks/useCatalog";
import "./catalogstyles.css";

export default function CatalogPage() {
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

  return (
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
              <OfferGrid offers={filteredOffers} loading={isLoading} />
            </div>

            <div className="catalog-pagination">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}