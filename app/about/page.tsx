export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">About AlphaStock Insight</h1>
      <p>
        AlphaStock Insight는 AI 프로그래밍 학습을 위한 데모 프로젝트입니다.
        이 사이트는 Alpha Vantage API를 통해 실시간 주식 데이터를 가져와 Supabase 데이터베이스에 저장하고, 
        사용자에게 주식 시세, 분석 차트, 최신 뉴스 등 다양한 금융 정보를 제공합니다.
        개별 종목의 과거 데이터 추이와 이동 평균선 분석을 통해 시장의 흐름을 파악하고,
        관련 뉴스 기사로 투자 결정에 필요한 정보를 얻을 수 있습니다.
      </p>
      <p>
        주요 기술 스택: Next.js, Tailwind CSS, Supabase, Chart.js
      </p>
    </div>
  )
}
