// src/pages/Catalog/hooks/useCatalog.ts
import { useEffect, useMemo, useState } from "react";
import { fetchOffers } from "../catalog.api";
import type { Filters, Offer, SortKey } from "../catalog.types";

const DEFAULT_FILTERS: Filters = {
  q: "",
  brand: "",
  location: "",
  fuel: "",
  transmission: "",
  minPrice: undefined,
  maxPrice: undefined,
  yearFrom: undefined,
  yearTo: undefined,
  maxKm: undefined,
};

export default function useCatalog() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("relevance");

  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchOffers();
        if (alive) setOffers(data);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  // Derived filter options from data
  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const o of offers) set.add(o.title.split(" ")[0]);
    return Array.from(set).sort();
  }, [offers]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const o of offers) set.add(o.location);
    return Array.from(set).sort();
  }, [offers]);

  const filteredOffers = useMemo(() => {
    const q = (filters.q ?? "").trim().toLowerCase();
    const brand = (filters.brand ?? "").toLowerCase();

    return offers.filter((o) => {
      if (q) {
        const hay = `${o.title} ${o.location} ${o.fuel} ${o.year}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (brand && !o.title.toLowerCase().startsWith(brand)) return false;
      if (filters.location && o.location !== filters.location) return false;
      if (filters.fuel && o.fuel !== filters.fuel) return false;
      if (filters.transmission && o.transmission !== filters.transmission) return false;
      if (filters.minPrice != null && o.price < filters.minPrice) return false;
      if (filters.maxPrice != null && o.price > filters.maxPrice) return false;
      if (filters.yearFrom != null && o.year < filters.yearFrom) return false;
      if (filters.yearTo != null && o.year > filters.yearTo) return false;
      if (filters.maxKm != null && o.km > filters.maxKm) return false;
      return true;
    });
  }, [offers, filters]);

  const sortedOffers = useMemo(() => {
    const arr = [...filteredOffers];
    switch (sort) {
      case "price_asc":  arr.sort((a, b) => a.price - b.price); break;
      case "price_desc": arr.sort((a, b) => b.price - a.price); break;
      case "year_desc":  arr.sort((a, b) => b.year - a.year);   break;
      case "km_asc":     arr.sort((a, b) => a.km - b.km);       break;
    }
    return arr;
  }, [filteredOffers, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedOffers.length / pageSize));

  const pagedOffers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedOffers.slice(start, start + pageSize);
  }, [sortedOffers, page]);

  return {
    offers,
    brands,
    locations,
    filteredOffers: pagedOffers,
    totalCount: sortedOffers.length,
    pageSize,
    page,
    totalPages,
    setPage,
    filters,
    setFilters,
    sort,
    setSort,
    isLoading,
  };
}
