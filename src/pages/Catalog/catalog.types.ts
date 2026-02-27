// src/pages/Catalog/catalog.types.ts

export type Fuel = "diesel" | "petrol" | "hybrid" | "electric" | "gas";

export type Offer = {
  id: string;
  title: string;
  price: number;
  currency: "€" | "$" | "MDL";
  year: number;
  km: number;
  fuel: Fuel;
  powerHp?: number;
  location: string;
  imageUrl: string;
  isNew?: boolean;
  discountPct?: number;
};

export type Filters = {
  q: string;
  minPrice?: number;
  maxPrice?: number;
  yearFrom?: number;
  yearTo?: number;
  fuel?: Fuel | "";
};

export type SortKey =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "year_desc"
  | "km_asc";