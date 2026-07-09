export type Fuel = "diesel" | "petrol" | "hybrid" | "electric" | "gas";
export type Transmission = "manual" | "automatic";

export type Offer = {
  id: string;
  title: string;
  price: number;
  currency: "EUR" | "$" | "MDL";
  year: number;
  km: number;
  fuel: Fuel;
  transmission?: Transmission;
  powerHp?: number;
  location: string;
  description: string;
  bodyType?: string;
  condition?: string;
  color?: string;
  doors?: number;
  seats?: number;
  engineSize?: string;
  vin?: string;
  features?: string[];
  negotiable?: boolean;
  showPhone?: boolean;
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  imageUrl: string | null;
  images: string[];
  isNew?: boolean;
  discountPct?: number;
};

export type Filters = {
  q: string;
  brand?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  yearFrom?: number;
  yearTo?: number;
  fuel?: Fuel | "";
  transmission?: Transmission | "";
  maxKm?: number;
};

export type SortKey =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "year_desc"
  | "km_asc";
