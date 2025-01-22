'use client'

import { useState } from 'react'
import ContentTemplates from './ContentTemplates'

interface ContentGeneratorProps {
  type: 'blog' | 'social' | 'email'
}

export default function ContentGenerator({ type }: ContentGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [showTemplates, setShowTemplates] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleTemplateSelect = (template: any) => {
    setPrompt(template.prompt)
    setShowTemplates(false)
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate content')
      }

      const data = await response.json()
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {showTemplates ? (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Choose a Template</h3>
          <ContentTemplates type={type} onSelect={handleTemplateSelect} />
          <button 
            onClick={() => setShowTemplates(false)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Or start from scratch
          </button>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Brief
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full h-32 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-between">
            <button 
              onClick={() => setShowTemplates(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to templates
            </button>
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="btn-primary"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
          {content && (
            <div className="mt-4 p-4 bg-white rounded shadow">
              <pre className="whitespace-pre-wrap">{content}</pre>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 rounded shadow">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 