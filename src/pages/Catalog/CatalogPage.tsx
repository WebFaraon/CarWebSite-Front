import Navbar from "../../components/navbar/Navbar";
import SiteFooter from "../../components/home/SiteFooter";
import CatalogFilters from "./components/CatalogFilters";
import SortBar from "./components/SortBar";
import OfferGrid from "./components/OfferGrid";
import Pagination from "./components/Pagination";
import useCatalog from "./hooks/useCatalog";
import "./catalogstyles.css";

const socialLinks = [
  { platform: "facebook", href: "#" },
  { platform: "instagram", href: "#" },
  { platform: "x", href: "#" },
  { platform: "linkedin", href: "#" },
] as const;

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
    <>
      <Navbar />
      <main className="catalog-page">
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

            <section className="catalog-main">
              <div className="catalog-card catalog-card--padded">
                <OfferGrid offers={filteredOffers} loading={isLoading} />
              </div>

              <div className="catalog-pagination">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter socialLinks={[...socialLinks]} />
    </>
  );
}
