# CasaPerks Rewards Dashboard — Plan

## 1. Similar Product Research

| Product | Focus | Relevant features for CasaPerks |
|---------|-------|---------------------------------|
| Bilt Rewards | Rent payments + loyalty (70% of top property managers) | Points balance, transaction history, multiple redemption options (travel, fitness, rent, gift cards), resident app/dashboard, property-manager analytics. Strong reference for UX: clear points display, catalog of redemptions, one-tap redeem. |
| Livly Rewards | Property hub + digital gift cards | Digital gift cards (Amazon, Uber, DoorDash, etc.), push/email notifications, cash-back wallet. Good pattern: “resident receives reward → redeem in app.” |
| Giftly | Leasing/renewal incentives | Flexible payout (Visa, ACH, PayPal), customizable programs. Lesson: offer choice of redemption type. |
| RealPage Community Rewards | On-demand virtual cards | 100+ brands, dashboard tracking, reporting. Emphasizes audit trail and reporting. |
| Homebody (Entrata) | PMS-integrated rewards | Rewards inside property management system. Lesson: design API so it can later plug into a PMS. |

**Takeaways for CasaPerks:**

- Show points balance prominently; list transactions with date, description, and +/- points.
- Gift card catalog with clear point cost and “Redeem” action.
- After redemption: deduct points and add a transaction record (audit trail).
- Keep data shapes and APIs simple so you can later add notifications, analytics, or PMS integration.

---

## 2. Main Features (from requirements + research)

- **Points balance** — Single current balance for the resident (e.g. header or card).
- **Transaction history** — List of transactions (earn, spend, adjustments) with date, description, amount, running or closing balance (optional).
- **Gift card catalog** — List of available gift cards (name, brand, point cost, maybe image); “Redeem” button per item.
- **Redeem flow** — Validate balance ≥ cost, deduct points, create transaction record, return updated balance and new transaction (and optionally updated catalog if you ever “restrict” items).
- **API backend** — Mock data for: residents (id, name, points balance), transactions, gift card catalog; endpoints to read balance/history/catalog and to redeem.
- **One meaningful security control** — Choose at least one: auth (e.g. simple login + JWT), input validation (e.g. DTOs + class-validator), or rate limiting (e.g. redemption endpoint). Recommended minimum: input validation on all inputs + rate limiting on redeem (and optionally login).

---

## 3. Tech Stack Decision

**Proposed:** React (TypeScript) + NestJS, no DB (in-memory mock data).

### Frontend: React + TypeScript

- Fits “TypeScript preferred” and is standard for dashboards.
- Alternatives: Vue + TS or Angular — same capability; React has larger ecosystem and is often faster to scaffold for a small dashboard.
- **Verdict:** React + TS is a strong default for this scope.

### Backend: NestJS vs Express

- **NestJS:** Structured (modules, controllers, services, DTOs), built-in validation (class-validator), guards (auth), interceptors (rate limit, logging), Swagger, TypeScript-first. Slightly more boilerplate; better for consistency and growth.
- **Express:** Minimal, flexible, fewer conventions; you wire validation and auth yourself. Faster for a 2–3 endpoint prototype.
- **Verdict:** For a “small but production-like” app with security considerations (validation, rate limiting, optional JWT), NestJS is better: built-in pipes, guards, and interceptors map directly to your requirements and keep the codebase clear. Express is fine if you want the smallest possible backend and don’t mind adding middleware manually.

### Data: Mock only

- In-memory arrays or a simple DataService that holds residents, transactions, and catalog; reset on restart.
- No DB keeps setup to “single command” and is sufficient for the challenge.

---

## 4. Architecture (Frontend + Backend)

**Backend (NestJS):** HTTP → Guards and Pipes → Controllers → Services → Mock Data

**Frontend (React TS):** Pages and Components → API client (fetch/axios)

### Frontend

- **Pages:** Dashboard (balance + recent transactions + catalog), optional Login (if you add auth).
- **Components:** Balance card, transaction list, gift card list item, redeem button/modal.
- **State:** React state or a small context for “current user” and balance; no need for Redux for this size.
- **API:** One module (e.g. `api/client.ts`) calling backend base URL; types shared with backend DTOs (or duplicated in a `types/` folder).

### Backend

- **Modules:** ResidentsModule, TransactionsModule, GiftCardsModule (or a single RewardsModule with three domains).
- **Controllers:** e.g. `GET /residents/:id/balance`, `GET /residents/:id/transactions`, `GET /gift-cards`, `POST /residents/:id/redeem` (body: `{ giftCardId, quantity? }`).
- **Services:** In-memory reads/writes; redeem = validate → deduct points → append transaction.
- **Guards/Pipes:** Optional auth guard on protected routes; ValidationPipe + DTOs globally; rate limit on `POST /redeem` (and `/auth/login` if present).

---

## 5. Bottlenecks and Risks

- **Concurrency:** In-memory state is not safe under concurrent redeem requests (race on balance). For a demo, single-threaded Node is enough. If you need concurrency later, use a DB with transactions or a simple lock around “read balance → validate → deduct → write.”
- **Scalability:** Mock data and single process don’t scale. First step to scale: persist in a DB (e.g. SQLite/Postgres) and add proper transactions.
- **Security:** Without auth, anyone who knows or guesses residentId can redeem. Mitigation: add simple login + JWT and validate residentId from token (or session).
- **Single command:** Use a monorepo (e.g. root package.json with concurrently: `npm run dev` starts both Nest and Vite/CRA). Document in README.

---

## 6. Main Workflow

| Step | User | Frontend | Backend | Data |
|------|------|----------|---------|------|
| Open dashboard | Opens app | GET /residents/:id/balance, GET .../transactions, GET /gift-cards | Validate auth, read data | Return JSON |
| View | — | Show balance, history, catalog | — | — |
| Click Redeem | Clicks redeem on gift card | POST /residents/:id/redeem `{ giftCardId }` | Validate balance & giftCardId; deduct points; append transaction | Update in-memory |
| Done | Sees success | 200 + updated balance and new transaction; update UI | — | — |

**Resident identification:** With mock data only, use a fixed residentId (e.g. 1) or a query param for demo. With auth, residentId comes from the JWT (no client-supplied id on redeem).

---

## 7. Git and Repo Structure

**Recommended:** single repo (monorepo) for “single command” and shared types/docs.

### Option A — Monorepo (recommended)

- **Root:** package.json (workspaces or single root with concurrently), README.md, .env.example.
- **backend/** — NestJS app (its own package.json).
- **frontend/** — React (Vite + TS) app (its own package.json).
- One clone, one npm install at root (or in each folder), one `npm run dev` to run both.

### Option B — Two repos

- Separate casaperks-frontend and casaperks-backend.
- Harder to run “single command” (you’d need a script or docs to start both).
- Use when frontend and backend are owned by different teams or released on different cycles.

**Branching:** One main branch is enough for this size. Optional: develop for integration; feature branches for “add auth,” “add rate limit,” etc.

---

## 8. Security: Login vs JWT vs Other

**Requirement:** “At least one meaningful security consideration.”

### Input validation (recommended minimum)

- NestJS ValidationPipe + DTOs with class-validator on all inputs (e.g. giftCardId UUID, quantity positive integer).
- Prevents malformed data and helps with injection-style bugs.

### Rate limiting (recommended for redeem)

- Throttle POST /redeem (e.g. 5–10 req/min per resident or per IP).
- Use NestJS throttler or express-rate-limit if on Express.
- Reduces abuse and accidental double-clicks.

### Authentication (optional but recommended for “real” demo)

- Simple login page: Form → POST /auth/login with email + password (mock: one hardcoded user).
- **JWT:** Server returns short-lived access token (e.g. 15–30 min); frontend sends `Authorization: Bearer <token>` on API calls.
- **Why JWT:** Stateless, works well with SPA; no session store needed for mock.
- **Backend:** Guard that checks JWT and attaches residentId to request (from sub or custom claim).
- **Resident id:** Never take residentId from URL/body for redeem; use only from token.
- **Security notes:** Use a fixed algorithm (e.g. HS256) and never trust alg from the token; keep secret in env.

### Practical recommendation for the challenge

- **Must-have:** Input validation + rate limiting on redeem (and login if you add it).
- **Nice-to-have:** Simple login + JWT so “resident” is identified by token and redeem is clearly tied to the authenticated user.
- You do not need a full OAuth2 or social login for this scope.

---

## Summary Table

| Topic | Recommendation |
|-------|----------------|
| Stack | React (TypeScript) + NestJS; mock data only |
| Repo | Monorepo: frontend/, backend/, single-command run |
| Security | Validation (DTOs) + rate limiting; optional simple login + JWT |
| Run | Root `npm run dev` starts backend + frontend (document in README) |

If you want, next step can be a concrete file/folder layout for frontend/ and backend/ and exact endpoint list (with DTOs) so you can implement the plan step by step.

---

## Example prompts (how I used AI-assisted coding)

Representative prompts used during the challenge, to show how AI was used from planning through implementation and polish.

### Planning and setup

- *"Give me the steps to build this project starting from BE to FE"*
- *"let's start structuring FE and BE folder structures and initiate the project"*
- *"stop and remove FE let's test the BE requests first and save it to git"*
- *"create a new branch for front end requests and push the changes from that branch"*
- *"merge main branch into front end brach"*

### Backend

- *"add simple login to the BE with JWT to call requests"*
- *"i want image for the gift card to show in FE also add profile and add name on the balance endpoint both of them"*
- *"add pagination on the transaction get request take by 10 at a time"*
- *"how to debug the endpoints where to call it?"* / *"How do i use Swagger"*

### Frontend features

- *"ok now i'm on FE brach let's start implementing the FE features. This is my home design with nav and scrollable gift cards section and my git cards section with welcoming message main theme colors are #30cfd0 and #330867"*
- *"when clicked on gift cards show gift card info on the modal and for redeem action set slide to redeem action which is similar as taking call on iphone"*
- *"when clicked on cards from my gift card show details on the modal picture and everthing else also put share button on it when clicked on share ask email to send someone else no need to implement just give message sent successfully"*
- *"on the rewards section add filter on the gift cards instead of showing featured one show all the gift cards available and set filtering options such drinks, shopping, beauty, brands etc"*
- *"now on Profile section include following features: show my transaction history on top of transaction history part show badges such as rank show it cute way under this show transaction history part with filtering option by each month or year also show with pagination"*
- *"when clicked on points on name card go to transaction history"*
- *"Remove my gift cards section from home instead add Earn Points - Share on social media, Answer daily quiz, Refer a friend, Lucky Wheel, Participate on gatherings, Renew contract... The ideas we can earn points not full implementation just cards and descriptions"*
- *"Suggest how many points we can earn show example points on the cards"*

### UI and polish

- *"FE doesn't get the style it only shows plain texts"*
- *"On profile card show points as a milestone more detailed version... show ranks and point out ongoing section under this 1200 points away from next level"*
- *"ranking is more like this"* (with reference image)
- *"put sign out button on top left of the card remove unlock rewards part instead fix milestone graph it broke bronze to silver connect shows half and point where i'm going there"*
- *"sign out button doesn't have background color relocate it to top right same level with Profile text"*
- *"split the code on Profile comp its too long"*

### Config and docs

- *"how to set when i save the doc it automatically fixes the format"*
- *"ok how to handle my env file"*
- *"also include the plan md file in new notes.md file next to read me"*
- *"on setup instruction add swagger url"*

These prompts illustrate: starting with structure and BE-first, then FE features and design, then incremental UI fixes and refactors, and finally config and documentation.
