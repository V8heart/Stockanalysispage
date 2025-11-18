"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import StockCard from "@/components/StockCard";

const DEFAULT_STOCKS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
  "NVDA", "META", "NFLX", "JPM", "UNH",
];

export default function HomePage() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        console.log("Home Page: Starting data load...");

        // 1️⃣ Alpha Vantage → Supabase 최신화 (이 부분은 사용자가 수동으로 스크립트를 실행)
        // console.log("Home Page: Calling fetchAndUpdateStocks...");
        // await fetchAndUpdateStocks(DEFAULT_STOCKS, supabase);
        // console.log("Home Page: fetchAndUpdateStocks completed.");

        // 2️⃣ Supabase → 최신가 읽기
        console.log("Home Page: Fetching from Supabase 'stocks' table...");
        const { data, error } = await supabase
          .from("stocks")
          .select("symbol, last_price, previous_close") // previous_close 추가
          .in("symbol", DEFAULT_STOCKS);

        if (error) {
          console.error("❌ Supabase fetch error:", error);
          setErrorMsg("데이터를 불러오지 못했습니다.");
        } else if (data) {
          console.log("Home Page: Supabase data fetched successfully.", data);
          const map: Record<string, number> = {};
          const changeMap: Record<string, { percentage: number; color: string }> = {};
          data.forEach((row) => {
            map[row.symbol] = row.last_price;
            if (row.previous_close !== null && row.previous_close !== undefined && row.previous_close !== 0) {
              const change = row.last_price - row.previous_close;
              const percentage = (change / row.previous_close) * 100;
              const color = percentage >= 0 ? "red" : "blue";
              changeMap[row.symbol] = { percentage, color };
            }
          });
          setPrices(map);
          setStockChanges(changeMap);
        }
      } catch (err) {
        console.error("❌ Home Page 로딩 중 오류:", err);
        setErrorMsg("API 호출 중 문제가 발생했습니다.");
      } finally {
        console.log("Home Page: Data load finished. Setting loading to false.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const [stockChanges, setStockChanges] = useState<Record<string, { percentage: number; color: string }>>({});

  // ✅ 여기서 괄호 구조를 명확히 닫아줍니다
  return (
    <>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-bold mb-2">Top 10 Stocks</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Alpha Vantage + Supabase demo
          </p>
        </section>

        {loading && (
          <p className="text-center text-gray-500">
            ⏳ Loading latest prices...
          </p>
        )}

        {errorMsg && (
          <p className="text-center text-red-500">{errorMsg}</p>
        )}

        {!loading && !errorMsg && (
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DEFAULT_STOCKS.map((s) => (
              <StockCard
                key={s}
                symbol={s}
                price={prices[s]}
                changePercentage={stockChanges[s]?.percentage} // changePercentage 전달
                changeColor={stockChanges[s]?.color} // changeColor 전달
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}
