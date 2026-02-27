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
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2019%20BMW%20X5%20xDrive40i%20rear%203.24.19.jpg?width=900",
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
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2017%20Audi%20A6%202.0.jpg?width=900",
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
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2020%20Tesla%20Model%203.jpg?width=900",
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
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2018%20Toyota%20RAV4%20Hybrid%20Icon%20Tech%20TSS%20HEV%204X4%202.5.jpg?width=900",
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
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2019%20Mercedes-Benz%20C220%20AMG%20Line%20Premium%20Diesel%20Estate%202.0%20Front.jpg?width=900",
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
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Volkswagen%20Golf%20VII%20(2016)%20TSI%20en%20Valencia.jpg?width=900",
  },
];

export async function fetchOffers(): Promise<Offer[]> {
  await new Promise((r) => setTimeout(r, 450));
  return MOCK_OFFERS;
}