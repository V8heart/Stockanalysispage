// scripts/updateStocks.ts
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { fetchAndUpdateStocks } from "./../lib/fetchAndUpdateStocks";
import { createClient as createSupabaseServerClient } from "./../lib/supabaseServerClient"; // 새로 생성된 서버 클라이언트 임포트

const DEFAULT_STOCKS = [
  "AAPL","MSFT","GOOGL","AMZN","TSLA",
  "NVDA","META","NFLX","JPM","UNH"
];

(async () => {
  console.log("Supabase URL:", process.env.SUPABASE_URL);
  console.log("Supabase Anon Key:", process.env.SUPABASE_ANON_KEY ? 'Loaded' : 'Not Loaded');
  console.log("🚀 Stock data update started...");

  // fetchAndUpdateStocks 함수에 서버 클라이언트 전달
  await fetchAndUpdateStocks(DEFAULT_STOCKS, createSupabaseServerClient());
  console.log("✅ Stock data update finished.");
})();