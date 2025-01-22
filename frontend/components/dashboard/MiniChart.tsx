'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface MiniChartProps {
  data: number[]
  color: string
}

export default function MiniChart({ data, color }: MiniChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i.toString()),
        datasets: [{
          data,
          borderColor: color,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          fill: true,
          backgroundColor: (context) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height)
            gradient.addColorStop(0, `${color}20`)
            gradient.addColorStop(1, `${color}05`)
            return gradient
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, color])

  return <canvas ref={chartRef} height="40" />
} 