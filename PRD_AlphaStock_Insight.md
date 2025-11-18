# PRD — AlphaStock Insight

**Purpose:** Build a web app that fetches 10 major stock prices via Alpha Vantage, stores summaries in Supabase, and visualizes trends.

## Target Users
- University students, investment beginners, course participants.

## Core Features
- Must: Fetch real-time/daily prices, list 10 core symbols, chart one symbol.
- Must: Supabase table for last known price per symbol.
- Should: Symbol selector, basic search.
- Nice: Simple trend indicator (change vs previous close).

## Tech
- Frontend: Next.js + TailwindCSS
- Data: Alpha Vantage API (TIME_SERIES_DAILY)
- DB: Supabase (Postgres)
- Charts: Chart.js + react-chartjs-2
- Hosting: Vercel

## IA (Top Nav)
- Home `/` — grid of top 10 symbols with last price
- Analytics `/analytics` — line chart for selected symbol
- About `/about` — project info

## Milestones
1. PRD & IA — Week 1
2. API + DB wiring — Week 2
3. UI + charts — Week 3
4. Deploy — Week 4

## Success Metrics
- Loads without errors; 3 pages work
- Chart renders for at least one symbol
- Supabase table reachable; read succeeds
