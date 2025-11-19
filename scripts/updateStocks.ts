// scripts/updateStocks.ts
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { fetchAndUpdateStocks } from "../lib/fetchAndUpdateStocks";

const DEFAULT_STOCKS = [
  "AAPL","MSFT","GOOGL","AMZN","TSLA",
  "NVDA","META","NFLX","JPM","UNH"
];

(async () => {
  console.log("Supabase URL:", process.env.SUPABASE_URL);
  console.log("Supabase Anon Key:", process.env.SUPABASE_ANON_KEY ? 'Loaded' : 'Not Loaded');
  console.log("🚀 Stock data update started...");

  // ✅ 올바른 호출 (인자 1개)
  await fetchAndUpdateStocks(DEFAULT_STOCKS);

  console.log("✅ Stock data update finished.");
})();
