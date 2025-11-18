// lib/fetchAndUpdateStocks.ts
import { createClient as createSupabaseServerClient } from './supabaseServerClient'; // 올바른 임포트 이름으로 수정

// const ALPHA_KEY = process.env.ALPHA_KEY!;
// console.log('fetchAndUpdateStocks: ALPHA_KEY loaded:', ALPHA_KEY ? 'Yes' : 'No'); // 이제 함수 내부에서 확인

const API_URL =
  'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=';

export async function fetchAndUpdateStocks(symbols: string[], ) {
  const supabase = createSupabaseServerClient();
  const ALPHA_KEY = process.env.ALPHA_KEY!;
  console.log('fetchAndUpdateStocks: ALPHA_KEY loaded:', ALPHA_KEY ? 'Yes' : 'No');

  for (const symbol of symbols) {
    try {
      const res = await fetch(`${API_URL}${symbol}&apikey=${ALPHA_KEY}`);
      const data = await res.json();
      const timeSeries = data['Time Series (Daily)'];

      if (!timeSeries) {
        console.warn(`⚠️ ${symbol}: Alpha Vantage 데이터 없음. 응답:`, data);
        continue;
      }

      // ✅ 최신 종가 및 이전 종가 추출 (시계열 데이터에서 직접 가져옴)
      const dates = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const latestDate = dates[0];
      const previousDate = dates[1]; // 두 번째 최신 날짜

      const latestClose = parseFloat(timeSeries[latestDate]['4. close']);
      const previousClose = previousDate ? parseFloat(timeSeries[previousDate]['4. close']) : null; // 이전 날짜가 없으면 null

      console.log(`fetchAndUpdateStocks: ${symbol} latestClose: ${latestClose}, previousClose: ${previousClose}`);

      // ✅ ① stocks 테이블 업데이트 (요약 테이블)
      await supabase.from('stocks').upsert({
        symbol,
        last_price: latestClose,
        previous_close: previousClose, // 이제 시계열에서 직접 가져온 어제 종가
        last_date: latestDate,
        updated_at: new Date().toISOString(),
      });

      // ✅ ② stock_history 테이블 업데이트 (히스토리) - 다시 추가
      const historyRows = Object.entries(timeSeries).map(([date, v]: any) => ({
        symbol,
        date,
        open: parseFloat(v['1. open']),
        high: parseFloat(v['2. high']),
        low: parseFloat(v['3. low']),
        close: parseFloat(v['4. close']),
        volume: parseInt(v['5. volume']),
      }));

      await supabase.from('stock_history').upsert(historyRows, {
        onConflict: 'symbol,date',
      });

      console.log(`✅ ${symbol} 업데이트 완료 (${Object.keys(timeSeries).length}일치)`);
    } catch (err) {
      console.error(`❌ ${symbol} 업데이트 실패:`, err);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 12000)); // 12초 딜레이
    }
  }
}
