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

## Environment

- Copy `.env.example` to `backend/.env` and set `PORT`, `JWT_SECRET` (if using auth).

## Security

- Input validation via NestJS DTOs + `class-validator`
- Rate limiting on redeem (and login) endpoints
