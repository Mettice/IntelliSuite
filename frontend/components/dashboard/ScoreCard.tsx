'use client'

import { ScoreCardProps } from '../../types'

const bgColors = {
  hot: 'bg-red-100',
  warm: 'bg-yellow-100',
  cold: 'bg-blue-100'
}

const textColors = {
  hot: 'text-red-800',
  warm: 'text-yellow-800',
  cold: 'text-blue-800'
}

export default function ScoreCard({ title, count, category }: ScoreCardProps) {
  return (
    <div className={`${bgColors[category]} rounded-lg shadow p-5`}>
      <h3 className={`${textColors[category]} text-lg font-medium`}>{title}</h3>
      <p className="mt-2 text-3xl font-semibold">{count}</p>
    </div>
  )
} 