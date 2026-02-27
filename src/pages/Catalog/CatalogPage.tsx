// src/pages/Catalog/CatalogPage.tsx
import CatalogFilters from "./components/CatalogFilters";
import SortBar from "./components/SortBar";
import OfferGrid from "./components/OfferGrid";
import Pagination from "./components/Pagination";
import useCatalog from "./hooks/useCatalog"; 

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
    <div className="min-h-screen bg-slate-50">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-32 left-1/3 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Offers</h1>
            <p className="text-slate-500">
              {isLoading ? "Loading..." : `${totalCount} results`}
            </p>
          </div>

          <SortBar value={sort} onChange={setSort} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr] items-start">
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <CatalogFilters value={filters} onChange={setFilters} />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-4">
              <OfferGrid offers={filteredOffers} loading={isLoading} />
            </div>

            <div className="mt-4">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}