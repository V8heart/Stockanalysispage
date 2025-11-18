// lib/fetchAndUpdateStocks.ts
import { createClient } from './supabaseClient';
const ALPHA_KEY = process.env.NEXT_PUBLIC_ALPHA_KEY;
const API_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=';
export async function fetchAndUpdateStocks(symbols) {
    const supabase = createClient();
    for (const symbol of symbols) {
        try {
            const res = await fetch(`${API_URL}${symbol}&apikey=${ALPHA_KEY}`);
            const data = await res.json();
            const timeSeries = data['Time Series (Daily)'];
            if (!timeSeries) {
                console.warn(`⚠️ ${symbol}: Alpha Vantage 데이터 없음`);
                continue;
            }
            // ✅ 최신 종가 추출
            const [latestDate, latestVals] = Object.entries(timeSeries)[0];
            const latestClose = parseFloat(latestVals['4. close']);
            // 이전 값 가져오기 (previous_close를 업데이트하기 위함)
            const { data: existingStock, error: fetchError } = await supabase
                .from('stocks')
                .select('last_price')
                .eq('symbol', symbol)
                .single();
            const previousClose = existingStock?.last_price || null;
            // ✅ ① stocks 테이블 업데이트 (요약 테이블)
            await supabase.from('stocks').upsert({
                symbol,
                last_price: latestClose,
                previous_close: previousClose, // 이전 종가 업데이트
                last_date: latestDate,
                updated_at: new Date().toISOString(),
            });
            // ✅ ② stock_history 테이블 업데이트 (히스토리)
            const historyRows = Object.entries(timeSeries).map(([date, v]) => ({
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
        }
        catch (err) {
            console.error(`❌ ${symbol} 업데이트 실패:`, err);
        }
    }
}
