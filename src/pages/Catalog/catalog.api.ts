// src/pages/Catalog/catalog.api.ts
import type { Offer } from "./catalog.types";

const MOCK_OFFERS: Offer[] = [
  {
    id: "1",
    title: "BMW X5 xDrive 40d • M Paket",
    price: 58900,
    currency: "$",
    year: 2019,
    km: 98000,
    fuel: "diesel",
    powerHp: 340,
    location: "Chișinău",
    imageUrl: "https://picsum.photos/seed/bmw/900/600",
    isNew: true,
    discountPct: 7,
  },
  {
    id: "2",
    title: "Audi A6 • 2.0 TDI • S-Line",
    price: 26900,
    currency: "€",
    year: 2017,
    km: 156000,
    fuel: "diesel",
    powerHp: 190,
    location: "Bălți",
    imageUrl: "https://picsum.photos/seed/audi/900/600",
  },
  {
    id: "3",
    title: "Tesla Model 3 Long Range",
    price: 32900,
    currency: "€",
    year: 2020,
    km: 82000,
    fuel: "electric",
    powerHp: 351,
    location: "Chișinău",
    imageUrl: "https://picsum.photos/seed/tesla/900/600",
    isNew: true,
  },
  {
    id: "4",
    title: "Toyota RAV4 Hybrid • AWD",
    price: 24900,
    currency: "€",
    year: 2018,
    km: 125000,
    fuel: "hybrid",
    powerHp: 197,
    location: "Orhei",
    imageUrl: "https://picsum.photos/seed/rav4/900/600",
  },
  {
    id: "5",
    title: "Mercedes-Benz C220d • AMG",
    price: 29900,
    currency: "€",
    year: 2019,
    km: 112000,
    fuel: "diesel",
    powerHp: 194,
    location: "Chișinău",
    imageUrl: "https://picsum.photos/seed/merc/900/600",
    discountPct: 5,
  },
  {
    id: "6",
    title: "Volkswagen Golf 7 • 1.6 TDI",
    price: 9900,
    currency: "€",
    year: 2016,
    km: 198000,
    fuel: "diesel",
    powerHp: 110,
    location: "Cahul",
    imageUrl: "https://picsum.photos/seed/golf/900/600",
  },
];

export async function fetchOffers(): Promise<Offer[]> {
  // simulare request
  await new Promise((r) => setTimeout(r, 450));
  return MOCK_OFFERS;
}