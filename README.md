# Challange – Rewards Dashboard

Hello my name is Nomin. This is a resident rewards dashboard for property management. Residents can view their points balance, redeem points for gift cards, see transaction history, and discover ways to earn more points.

---

## Project overview

**Reward Dashboard** is a points-based rewards platform: residents earn points (e.g. on-time rent, referrals, activities) and spend them on gift cards. This repo contains a small web app that delivers:

- **Points balance** and a welcome card on every main screen
- **Gift card catalog** with category filters (Drinks, Shopping, Beauty, Brands) and redemption
- **My Gift Cards** – list of redeemed cards with detail modal and share (email placeholder)
- **Profile** – name, milestone/rank progress (Bronze → Platinum), and transaction history with month/year filters and pagination
- **Earn Points** – cards describing ways to earn (share, quiz, refer, lucky wheel, gatherings, renew contract) with example point amounts

The backend serves mock data (no database) and implements JWT auth, validation, and rate limiting.

---

## Main features

| Feature                 | Description                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login**               | Email/password; JWT stored in `localStorage`; protected routes redirect to login                                                                                                |
| **Points balance**      | Shown on welcome card; clicking points links to Profile → Transaction history                                                                                                   |
| **Featured gift cards** | Horizontal scroll on Home; click opens modal with slide-to-redeem                                                                                                               |
| **Rewards**             | All gift cards in a grid; filter by All / Drinks / Shopping / Beauty / Brands                                                                                                   |
| **My Cards**            | Redeemed gift cards; click for detail modal (image, code, expiry) and Share (email form, success message only)                                                                  |
| **Profile**             | Sign out (top right), name, milestone card (earned points, rank tiers, progress bar, “points away from next level”), transaction history with year/month filters and pagination |
| **Earn Points**         | Six idea cards with example point amounts (e.g. “Up to 25 pts”, “500 pts per referral”)                                                                                         |

---

## Tech stack

| Layer        | Choice                                    | Notes                                                                                    |
| ------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Frontend** | React 18, TypeScript, Vite                | SPA with client-side routing                                                             |
| **Styling**  | Tailwind CSS                              | Utility-first; theme colors `#30cfd0` (teal), `#330867` (purple)                         |
| **Routing**  | React Router v6                           | Login (public), Home / Rewards / My Cards / Profile (protected)                          |
| **Backend**  | NestJS (Node.js)                          | REST API; modules: auth, residents, gift-cards, data                                     |
| **Auth**     | JWT (Passport)                            | Login returns `access_token`; resident endpoints require `Authorization: Bearer <token>` |
| **Data**     | In-memory mock                            | No database; entities: Resident, Transaction, GiftCard, RedeemedGiftCard                 |
| **API docs** | Swagger                                   | Available when backend is running (e.g. `/api` or root)                                  |
| **Security** | DTOs + class-validator, @nestjs/throttler | Input validation; rate limiting on login and redeem                                      |

---

## Setup instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Install and run (single command)

From the **project root**:

```bash
npm run install:all
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Swagger (API docs):** http://localhost:3000/api

`npm run dev` runs both via `concurrently` (see root `package.json`).

### Run backend or frontend only

```bash
npm run dev:backend   # backend only (port 3000)
npm run dev:frontend  # frontend only (port 5173)
```

### Environment

- **Backend:** `cp backend/.env.example backend/.env` and set `PORT` (optional, default 3000) and `JWT_SECRET` (required for JWT).
- **Frontend:** Optional. Only if the API is not at `http://localhost:3000`: `cp frontend/.env.example frontend/.env` and set `VITE_API_URL`.
- Do **not** commit `.env` files (they are in `.gitignore`).

### Try the app

1. Open http://localhost:5173
2. Log in with `alex@example.com` / `password123` (or `jordan@example.com` / `password123`)
3. Use Home, Rewards, My Cards, and Profile from the nav

---

## Project folder structure

```
reward/
├── README.md                 # This file
├── package.json              # Root scripts: install:all, dev (concurrently)
├── .env.example              # Pointer to backend/frontend .env examples
├── backend/
│   ├── src/
│   │   ├── main.ts           # Bootstrap; Swagger, global prefix
│   │   ├── app.module.ts     # Imports: Auth, Residents, GiftCards, Data
│   │   ├── auth/             # JWT login, guard, strategy, current-user decorator
│   │   ├── residents/        # balance, profile, transactions, my-gift-cards, redeem
│   │   ├── gift-cards/       # GET /gift-cards (catalog)
│   │   └── data/             # entities, mock-data, data.service (in-memory store)
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.tsx          # React root
    │   ├── App.tsx           # Routes, ProtectedRoute, Layout
    │   ├── api/              # client.ts – fetch wrapper, getBalance, getGiftCards, redeem, etc.
    │   ├── context/          # AuthContext – token, residentId, name, pointsBalance, login, logout
    │   ├── types/            # Balance, Transaction, GiftCard, RedeemedGiftCard, etc.
    │   ├── pages/            # Home, Login, Rewards, MyCards, Profile
    │   └── components/      # Layout, Nav, WelcomeCard, FeaturedGiftCards, GiftCardsGrid,
    │                        # GiftCardModal, SlideToRedeem, MyGiftCards, MyGiftCardDetailModal,
    │                        # ProfileMilestone, ProfileTransactionHistory
    ├── index.html
    ├── .env.example
    └── package.json
```

---

## Architecture and code structure

### Backend

- **Modular:** Auth, Residents, GiftCards, Data are NestJS modules. Data holds in-memory arrays and is injected where needed.
- **Layers:** Controllers call services; services use `DataService` for reads/writes. DTOs and `class-validator` for request bodies.
- **Auth:** Login issues JWT (payload: `sub` = residentId). `JwtAuthGuard` + `@CurrentUser()` on resident routes; guard validates token and attaches user to request.
- **Residents:** One controller for balance, profile, transactions (with optional month/year query params), my-gift-cards, and redeem. Redeem deducts points and appends a transaction and redeemed gift card records.

### Frontend

- **Single SPA:** React Router with `/login` and `/` (Layout with nested Home, Rewards, My Cards, Profile).
- **Auth:** `AuthContext` loads token/residentId from `localStorage` on init, fetches balance for name/points. Login stores token + residentId and redirects to Home. Logout clears storage.
- **API:** One `api/client.ts` with `request()` (base URL from `VITE_API_URL`, auth header when token present). Exposes `login`, `getBalance`, `getGiftCards`, `getMyGiftCards`, `getTransactions`, `redeem`.
- **Components:** Pages compose shared components (e.g. Profile uses `ProfileMilestone` and `ProfileTransactionHistory`). Modals (GiftCardModal, MyGiftCardDetailModal) are controlled by parent state.

---

## Main workflow

### Backend

1. **Request** → NestJS pipeline (CORS, body parser, routes).
2. **Protected routes:** `JwtAuthGuard` runs → JwtStrategy validates Bearer token → `user` (e.g. `residentId`) attached to request.
3. **Controller** parses params/query/body (e.g. `:id`, `page`, `limit`, `month`, `year` for transactions).
4. **Service** checks resident exists, applies filters (e.g. transactions by month/year), reads/writes via `DataService`, returns DTOs.
5. **Redeem:** Validate gift card and balance, deduct points, create transaction and redeemed gift card(s), return new balance + transaction + redeemed cards.

### Frontend

1. **App load** → AuthContext reads `localStorage`; if token, fetches balance (name, points); else sets loading false and shows login for protected routes.
2. **Login** → POST `/auth/login` → store token + residentId, fetch balance, redirect to Home.
3. **Protected pages** → Call API with token in header (e.g. getGiftCards, getTransactions); render data and handle loading/error locally.
4. **Redeem** → POST `/residents/:id/redeem` with `giftCardId` → on success, refresh balance and optionally update “my cards” list; modal closes.

---

## Requirements: fulfilled vs suggested

### Fulfilled

- Display resident’s **points balance** – WelcomeCard and Profile.
- **Transaction history** – Profile, with month/year filters and pagination.
- **Gift card catalog** and **redemption** – Rewards (and Home featured), redeem via modal (slide-to-redeem).
- **Backend** with mock data – NestJS, in-memory residents/transactions/gift cards.
- **Security** – JWT auth, input validation (DTOs), rate limiting on sensitive endpoints.
- **Single command** – `npm run install:all` then `npm run dev` runs both apps.

### Suggested / extra features added

- **Earn Points** section on Home (idea cards with example point amounts).
- **Profile milestone** – rank tiers (Bronze → Platinum), progress bar, “points away from next level.”
- **Category filters** on Rewards (All, Drinks, Shopping, Beauty, Brands).
- **My Gift Cards** detail modal and Share flow (email form, success message).
- **Points link** on welcome card → scroll to transaction history on Profile.
- **Profile** split into smaller components (ProfileMilestone, ProfileTransactionHistory).

---

## Git workflow

- **Branching:** Backend and shared work on `main`; frontend developed on a **feature branch** (e.g. `feature/frontend`).
- **Incremental changes:** Changes were added in small, logical steps (e.g. login + protected routes, then Home layout, then Rewards filters, then Profile sections) instead of one large frontend commit.
- **Review:** Pull requests were used to review code before merging; each PR could be accepted as-is, accepted with edits, or rejected with a reason.
- **Merge:** Feature branch merged into `main` after review (e.g. merge `feature/frontend` into `main`).

---

## AI and design tools

### Tool used

**Cursor** (AI-assisted editor).

### How Cursor was used

- **Plan mode first:** For each feature or refactor, planning started in Cursor’s plan mode. From the requirements we:
  - Pointed out the **main workflow** (e.g. login → balance, redeem flow, transaction history).
  - Decided **technical choices** (stack, auth, data shape).
  - Chose **code structure** and **architecture** for both backend and frontend (modules, layers, component split).
- **Implementation:** After the plan was agreed, Cursor was used to generate or edit code (components, API client, NestJS modules, refactors like splitting Profile or adding Rewards filters).

### Figma Make (design)

- **Product research and inspiration:** Used Figma Make to research similar products and understand main workflows and design patterns.
- **Design decisions:** Decided how the dashboard would look, then chose **main theme colors** (e.g. teal `#30cfd0`, purple `#330867`).
- **Generated design:** Generated the dashboard **home section** in Figma Make (nav, welcome card, gift cards, layout).
- **Implementation:** Brought that design (and screens/references) into Cursor and implemented the UI (Tailwind, components) to match.

### What was accepted

- **Main workflows** and the planned architecture (BE modules, FE pages + context + api client).
- Implementations that matched requirements and kept the stack consistent (React + TypeScript, NestJS, Tailwind).
- Suggestions that improved structure (e.g. ProfileMilestone, ProfileTransactionHistory) or UX (Earn Points cards, milestone bar, filters).

### Issues encountered

- **TypeScript errors:** Some generated or edited code triggered TS errors (e.g. unsafe assignment, missing types); these were fixed by tightening types or adding explicit annotations.
- **Prettier / ESLint:** Formatting and lint rules (e.g. multi-line vs single-line imports, quote style) sometimes conflicted with generated code; fixes were applied to satisfy the project’s Prettier and ESLint config.

---

## Plan file structure (Cursor)

Plans in Cursor were structured roughly as follows so that each feature or change had a clear scope and checklist:

1. **Overview** – Short description of the goal (e.g. “Add category filters on Rewards and show all gift cards in a grid”).
2. **Current state** – What exists today (relevant files, existing behavior).
3. **Approach** – High-level steps (e.g. backend: add `category`; frontend: filter state, chips, grid).
4. **Backend / Frontend sections** – Per-area tasks (entity changes, API changes, new components, state).
5. **Files to touch** – Table or list of files and the change in each.
6. **Edge cases** – Empty states, missing data, validation.
7. **Todos** – Checklist (e.g. “Backend: add category”, “Frontend: GiftCardsGrid”, “Rewards: filter + grid”) used to track progress; marked in progress and completed as work was done.

This structure kept changes incremental and reviewable (e.g. one plan per feature or refactor).

---

## Auth (API)

- **Login (no auth):** `POST /auth/login` with `{ "email", "password" }` → `{ "access_token" }`.
- **Protected routes:** Send `Authorization: Bearer <access_token>`.
- **Mock users:** `alex@example.com` / `password123` (resident 1), `jordan@example.com` / `password123` (resident 2).
- **Public:** `GET /gift-cards` (catalog) does not require auth.

---

## Security

- **Input validation:** NestJS DTOs with `class-validator` (e.g. email, giftCardId).
- **Rate limiting:** Throttler applied on login and redeem to reduce abuse.
- **Secrets:** JWT signing uses `JWT_SECRET` from env; `.env` is not committed.
