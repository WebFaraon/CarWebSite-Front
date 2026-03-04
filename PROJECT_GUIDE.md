# PROJECT GUIDE

## 1) State Management

This project uses **React Context + local component state (`useState`) + browser storage**.

- Global state:
  - `ThemeContext` in `src/context/ThemeContext.tsx`
  - Exposes `theme` and `toggleTheme` via `useTheme()`
  - Persists theme in `localStorage` and applies it on `<html data-theme="...">`
- Feature/local state:
  - `Home`, `CatalogPage`, and `Favorites` each manage favorites UI state with `useState`
  - `Favorites` also manages compare selection (`compareIds`)
  - Catalog filtering, sorting, and pagination are handled inside `useCatalog`
- Persistence:
  - `src/utils/favoritesStorage.ts` stores favorite IDs in `localStorage` (`favoriteCars`)

There is **no Redux, Zustand, Recoil, MobX, or React Query** in the current codebase.

## 2) Routing

Routing is defined in `src/App.tsx` using `react-router-dom` (`BrowserRouter`, `Routes`, `Route`).

| Route | Page component |
|---|---|
| `/` | `Home` |
| `/favorites` | `Favorites` |
| `/sell` | `SellCar` |
| `/login` | `Login` |
| `/signup` | `Signup` |
| `/contact-us` | `ContactUs` |
| `/car-details` | `CarDetails` |
| `/forgot-password` | `ForgotPassword` |
| `/offers` | `CatalogPage` |
| `/help` | `Help` |

## 3) Component Hierarchy

High-level tree:

```txt
main.tsx
  ThemeProvider
    App
      ThemeProvider
        BrowserRouter
          AppRoutes
            Routes
              Route -> Page Component
```

Page composition pattern:

- Most pages render `Navbar` at the top.
- Many pages render `SiteFooter` at the bottom (`Home`, `SellCar`, `Help`, `ContactUs`, `Favorites`).
- There is **no shared Layout component** (header/footer are composed directly in pages).

Key page hierarchies:

- `Home`
  - `Navbar`
  - `HeroSection`
  - `FeaturedCarsSection`
    - `CarCard`
  - `WhyChooseUsSection`
  - `SiteFooter`
- `CatalogPage` (Offers)
  - `Navbar`
  - `SortBar`
  - `CatalogFilters`
  - `BrandBar`
  - `OfferGrid`
    - `OfferCard`
  - `Pagination`
- `Favorites`
  - `Navbar`
  - Favorites list (`favorite-card` items)
  - Optional comparison grid
  - `SiteFooter`

## 4) Custom Hooks

`/src/hooks` directory is currently **not present**, so there are no root-level shared hooks there.

Custom hooks found in the project:

- `useTheme` (`src/context/ThemeContext.tsx`)
  - Context consumer hook for theme state and toggle action
- `useCatalog` (`src/pages/Catalog/hooks/useCatalog.ts`)
  - Fetches offers
  - Computes derived filter options (`brands`, `locations`)
  - Applies filtering + sorting
  - Handles pagination
  - Exposes UI-ready state and setters to `CatalogPage`

## 5) API Layer

Current data fetching is centralized for offers in:

- `src/pages/Catalog/catalog.api.ts`
  - `fetchOffers()` returns mocked `Offer[]` (`MOCK_OFFERS`) after an artificial delay
  - No Axios instance
  - No React Query/SWR cache layer
  - No external service module folder yet (`services/` or `api/`)

Data flow for offers:

```txt
CatalogPage -> useCatalog -> fetchOffers (catalog.api.ts) -> MOCK_OFFERS
```

## 6) Notes for Future Refactors

- `ThemeProvider` is mounted in both `main.tsx` and `App.tsx`; one provider layer would be sufficient.
- A shared layout component could reduce repeated `Navbar`/`SiteFooter` composition across pages.
