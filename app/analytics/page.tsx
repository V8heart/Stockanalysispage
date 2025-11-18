"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { createClient } from "@/lib/supabaseClient";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const DEFAULT_STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "NFLX",
  "JPM",
  "UNH",
];

export default function AnalyticsPage() {
  const [selected, setSelected] = useState("AAPL");
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showMovingAverage, setShowMovingAverage] = useState(true); // 이동 평균선 표시 여부

  // 이동 평균선 계산 함수
  const calculateMovingAverage = (data: number[], period: number) => {
    const ma: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        ma.push(sum / period);
      }
    }
    return ma;
  };

  useEffect(() => {
    async function loadStockData(symbol: string) {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: history, error } = await supabase
          .from("stock_history")
          .select("date, close")
          .eq("symbol", symbol)
          .order("date", { ascending: true });

        if (error) {
          console.error("❌ Supabase 데이터 가져오기 실패:", error.message);
          setChartData(null);
          setLoading(false);
          return;
        }

        if (!history || history.length === 0) {
          console.warn(`⚠️ ${symbol}: Supabase에 데이터 없음`);
          setChartData(null);
          setLoading(false);
          return;
        }

        const dates = history.map((row) => row.date);
        const closes = history.map((row) => row.close);

        const datasets = [
          {
            label: `${symbol} Closing Price`,
            data: closes,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.2,
          },
        ];

        if (showMovingAverage) {
          const movingAverage = calculateMovingAverage(closes, 20); // 20일 이동 평균선
          datasets.push({
            label: `${symbol} 20-Day MA`,
            data: movingAverage as number[],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
            tension: 0.2,
          });
        }

        setChartData({
          labels: dates,
          datasets: datasets,
        });
      } catch (err) {
        console.error("❌ 데이터 처리 중 에러:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStockData(selected);
  }, [selected, showMovingAverage]); // showMovingAverage가 변경될 때도 useEffect 재실행

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Stock Analytics (Supabase)</h1>
      <p className="text-gray-500">
        Chart data fetched from Supabase.
      </p>

      <div className="flex items-center space-x-4">
        <select
          className="border p-2 rounded"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {DEFAULT_STOCKS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showMovingAverage}
            onChange={(e) => setShowMovingAverage(e.target.checked)}
            className="form-checkbox"
          />
          <span>20일 이동 평균선 표시</span>
        </label>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <p>⏳ Loading data for {selected}...</p>
        ) : chartData ? (
          <Line data={chartData} />
        ) : (
          <p>No data available. Please run `npm run update-stocks` twice to populate historical data.</p>
        )}
      </div>
    </div>
  );
}
