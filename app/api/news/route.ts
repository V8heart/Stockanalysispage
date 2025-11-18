import { NextResponse } from 'next/server';

export async function GET() {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  console.log('NEWS_API_KEY:', NEWS_API_KEY ? 'Loaded' : 'Not Loaded');
  const query = 'stock market'; // 주식 관련 뉴스를 가져오기 위한 쿼리
  const language = 'en'; // 일단 영어로 설정
  const pageSize = 10; // 가져올 뉴스 기사 수

  if (!NEWS_API_KEY) {
    console.error('Error: NEWS_API_KEY is not defined');
    return NextResponse.json({ error: 'NEWS_API_KEY is not defined' }, { status: 500 });
  }

  try {
    // newsdata.io API 엔드포인트로 추정하여 수정
    const apiUrl = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${query}&language=${language}`;
    console.log('Fetching news from:', apiUrl);
    const response = await fetch(apiUrl);
    console.log('News API raw response:', response); // Raw Response 객체 로깅
    console.log('News API response status:', response.status);
    console.log('News API response.ok:', response.ok); // 응답 성공 여부 확인
    const data = await response.json();
    console.log('News API response data:', data);

    if (data.status === 'error') {
      console.error('News API returned an error:', data.message);
      throw new Error(data.message);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
