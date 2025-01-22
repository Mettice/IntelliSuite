'use client'

import React, { useState, useEffect } from 'react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

interface ContentHistoryProps {
  type: 'blog' | 'social' | 'email'
}

export default function ContentHistory({ type }: ContentHistoryProps) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/content/history?type=${type}`)
        const data = await response.json()
        setHistory(data)
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [type])

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Content</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{item.prompt}</p>
                </div>
                <button
                  onClick={() => handleCopy(item.content, item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {copiedId === item.id ? (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <p>{item.content.substring(0, 200)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 