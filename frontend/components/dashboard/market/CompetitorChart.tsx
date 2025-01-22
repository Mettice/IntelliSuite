'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { Competitor } from '@/types/market'

interface CompetitorChartProps {
  competitors: Competitor[]
}

export default function CompetitorChart({ competitors }: CompetitorChartProps) {
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

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: competitors.map(c => c.name),
        datasets: [{
          data: competitors.map(c => parseFloat(c.marketShare.replace('%', ''))),
          backgroundColor: [
            '#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Market Share Distribution'
          }
        }
      }
    })

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [competitors])

  return <canvas ref={chartRef} />
} 