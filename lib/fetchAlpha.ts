import { createClient } from "./supabaseClient";

export type SeriesDaily = Record<string, {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}>

/**
 * Fetch latest daily data from Alpha Vantage and upsert into Supabase.
 * Returns recent N days for chart rendering.
 * - Executed on client side when Analytics page loads or symbol changes.
 * - Free plan has rate limits: avoid rapid repeated calls.
 */
export async function fetchAndSyncStock(symbol: string, days = 60) {
  const supabase = createClient(); // Supabase 클라이언트 생성

  const apiKey = process.env.NEXT_PUBLIC_ALPHA_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${symbol}&apikey=${apiKey}`;

  const res = await fetch(url, { cache: 'no-store' });
  const json = await res.json();
  const series: SeriesDaily | undefined = json?.['Time Series (Daily)'];

  if (!series) {
    console.error('Alpha Vantage response missing series:', json);
    return [];
  }

  // Build upsert rows for stock_history
  const rows = Object.entries(series).map(([date, v]) => ({
    symbol,
    date,
    open: parseFloat(v['1. open']),
    high: parseFloat(v['2. high']),
    low: parseFloat(v['3. low']),
    close: parseFloat(v['4. close']),
    volume: parseInt(v['5. volume']),
  }));

  // Upsert into Supabase (client-side anon key; acceptable for demo)
  try {
    await supabase.from('stock_history').upsert(rows, { onConflict: 'symbol,date' });
  } catch (e) {
    console.error('Supabase upsert(stock_history) failed', e);
  }

  // Update latest cache table
  const latestDate = Object.keys(series)[0];
  const latestClose = parseFloat(series[latestDate]['4. close']);
  try {
    await supabase.from('stocks').upsert({
      symbol,
      last_price: latestClose,
      last_date: latestDate
    });
  } catch (e) {
    console.error('Supabase upsert(stocks) failed', e);
  }

  // Prepare recent N days for chart
  const lastN = Object.entries(series)
    .slice(0, days)
    .map(([date, v]) => ({ date, close: parseFloat(v['4. close']) }))
    .reverse();

  return lastN;
}
