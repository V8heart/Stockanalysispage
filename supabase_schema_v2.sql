-- Supabase SQL Schema v2 — AlphaStock Insight

-- ① 종목 기본정보
create table if not exists public.symbols (
  symbol text primary key,
  company_name text,
  sector text,
  created_at timestamptz default now()
);

-- ② Alpha Vantage 히스토릭 데이터
create table if not exists public.stock_history (
  id bigint generated always as identity primary key,
  symbol text references public.symbols(symbol) on delete cascade,
  date date not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  volume bigint,
  created_at timestamptz default now(),
  unique(symbol, date)
);

-- ③ 최신 주가 캐시
create table if not exists public.stocks (
  symbol text primary key references public.symbols(symbol),
  last_price numeric,
  previous_close NUMERIC, -- Added for daily change calculation
  last_date date,
  updated_at timestamptz default now()
);

-- ④ 최근 7일 평균가 뷰
create or replace view public.recent_avg_price as
select 
  symbol,
  avg(close) as avg_close_7d
from public.stock_history
where date > current_date - interval '7 days'
group by symbol;

-- ⑤ 인덱스
create index if not exists idx_history_symbol_date 
on public.stock_history(symbol, date desc);

-- ⑥ 초기 심볼 데이터
insert into public.symbols (symbol, company_name, sector)
values
  ('AAPL', 'Apple Inc.', 'Technology'),
  ('MSFT', 'Microsoft Corporation', 'Technology'),
  ('GOOGL', 'Alphabet Inc.', 'Communication Services'),
  ('AMZN', 'Amazon.com, Inc.', 'Consumer Discretionary'),
  ('TSLA', 'Tesla, Inc.', 'Automotive'),
  ('NVDA', 'NVIDIA Corporation', 'Semiconductors'),
  ('META', 'Meta Platforms, Inc.', 'Communication Services'),
  ('NFLX', 'Netflix, Inc.', 'Communication Services'),
  ('JPM', 'JPMorgan Chase & Co.', 'Financials'),
  ('UNH', 'UnitedHealth Group Incorporated', 'Healthcare')
on conflict (symbol) do nothing;
