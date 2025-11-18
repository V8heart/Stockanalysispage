// scripts/updateStocks.ts
import 'dotenv/config';
import { fetchAndUpdateStocks } from "./../lib/fetchAndUpdateStocks";
const DEFAULT_STOCKS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
    "NVDA", "META", "NFLX", "JPM", "UNH"
];
(async () => {
    console.log("🚀 Stock data update started...");
    await fetchAndUpdateStocks(DEFAULT_STOCKS);
    console.log("✅ Stock data update finished.");
})();
