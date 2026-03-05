# Rewards Dashboard

A resident rewards dashboard for property management: points balance, transaction history, and gift card redemptions.

## Tech stack

- **Backend:** NestJS (Node.js)
- **Data:** In-memory mock (no database)

## One-command setup

```bash
npm run install:all
npm run dev
```

- **Backend API:** http://localhost:3000

## Auth (JWT)

Resident endpoints require a JWT. **Login** (no auth):

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
```

Response: `{"access_token":"<JWT>"}`. **Call protected endpoints** with the token:

```bash
export TOKEN="<paste access_token here>"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/residents/1/balance
```

Mock users: `alex@example.com` / `password123` (resident 1), `jordan@example.com` / `password123` (resident 2). `GET /gift-cards` is public.

## Environment

- Copy `.env.example` to `backend/.env` and set `PORT`, `JWT_SECRET` (if using auth).

## Security

- Input validation via NestJS DTOs + `class-validator`
- Rate limiting on redeem (and login) endpoints
