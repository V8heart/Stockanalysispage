-- Supabase schema for AlphaStock Insight
create table if not exists public.stocks (
  symbol text primary key,
  last_price numeric,
  updated_at timestamptz default now()
);
