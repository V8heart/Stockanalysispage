# AlphaStock Insight

A minimal starter for a stocks analytics site using **Alpha Vantage** and **Supabase**.

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Set env
cp .env.example .env.local
# edit .env.local with your Supabase + Alpha Vantage keys

# 3) Run
npm run dev
```

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_KEY=...
NEXT_PUBLIC_ALPHA_KEY=...
```

## Supabase Table (SQL)

```sql
create table if not exists public.stocks (
  symbol text primary key,
  last_price numeric,
  updated_at timestamptz default now()
);
```

## Notes
- Free Alpha Vantage tier enforces rate limits. Avoid requesting too frequently.
- This template uses Next.js App Router and Chart.js via react-chartjs-2.


## Supabase Schema v2
See `supabase_schema_v2.sql` for full historic data schema.

## v3 — Auto-sync on refresh
- `/analytics` 페이지 로드/새로고침 시 Alpha Vantage에서 최신 데이터를 가져와 `stock_history`/`stocks`에 upsert.
- 차트는 최근 60일 데이터를 렌더링.
- 환경변수: `NEXT_PUBLIC_ALPHA_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY` 필요.
- 주의: Alpha Vantage 무료 플랜 호출 제한(분당 5회).
