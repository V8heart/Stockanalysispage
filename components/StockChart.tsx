'use client'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

type Props = { labels: string[]; closes: number[]; title?: string }

export default function StockChart({ labels, closes, title }: Props) {
  const data = {
    labels,
    datasets: [
      { label: title ?? 'Close', data: closes }
    ]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false
  }
  return (
    <div className="h-80 card">
      <Line data={data} options={options as any} />
    </div>
  )
}
