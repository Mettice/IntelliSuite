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
          borderWidth: 3, // Thicker line for better visibility
          tension: 0.5, // Smoother curve
          pointRadius: 0, // No points for minimal design
          fill: true,
          backgroundColor: (context) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height)
            gradient.addColorStop(0, `${color}40`) // Stronger gradient at the top
            gradient.addColorStop(1, `${color}02`) // Faded gradient at the bottom
            return gradient
          },
          hoverBackgroundColor: `${color}30`, // Interactive hover effect
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }, // Disable tooltips for minimal design
        },
        scales: {
          x: { display: false }, // Hide x-axis
          y: { display: false }, // Hide y-axis
        },
        animation: {
          duration: 1000, // Smooth animation duration
          easing: 'easeOutQuart', // Smooth easing function
        },
        interaction: {
          mode: 'nearest', // Highlight nearest point on hover
          intersect: false,
        },
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, color])

  return (
    <div className="relative w-full h-10">
      <canvas 
        ref={chartRef} 
        className="w-full h-full"
        aria-label="Mini chart" 
        role="img"
      />
    </div>
  )
}