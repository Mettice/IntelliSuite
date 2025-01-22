'use client'

import { useState } from 'react'

interface Template {
  id: string
  title: string
  description: string
  prompt: string
  type: 'blog' | 'social' | 'email'
  category: 'marketing' | 'sales' | 'support' | 'general'
  variables: string[]  // For customization
}

const templates: Record<string, Template[]> = {
  blog: [
    {
      id: 'blog-1',
      title: 'How-to Guide',
      description: 'Step-by-step tutorial format',
      prompt: 'Write a detailed how-to guide about [topic] with [number] steps and examples for [audience].',
      type: 'blog',
      category: 'general',
      variables: ['topic', 'number', 'audience']
    },
    {
      id: 'blog-2',
      title: 'Product Review',
      description: 'In-depth product analysis',
      prompt: 'Create a detailed review of [product] focusing on [features] for [audience].',
      type: 'blog',
      category: 'marketing',
      variables: ['product', 'features', 'audience']
    }
  ],
  social: [
    {
      id: 'social-1',
      title: 'Product Launch',
      description: 'New product announcement',
      prompt: 'Create a [platform] post announcing [product] highlighting [benefits].',
      type: 'social',
      category: 'marketing',
      variables: ['platform', 'product', 'benefits']
    }
  ],
  email: [
    {
      id: 'email-1',
      title: 'Welcome Email',
      description: 'New user onboarding',
      prompt: 'Write a welcome email for [product] users focusing on [features].',
      type: 'email',
      category: 'support',
      variables: ['product', 'features']
    }
  ]
}

export default function ContentTemplates({ type, onSelect }: { 
  type: 'blog' | 'social' | 'email'
  onSelect: (template: Template) => void 
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const filteredTemplates = templates[type].filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  )

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {['all', 'marketing', 'sales', 'support', 'general'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {template.variables.map(variable => (
                <span key={variable} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {variable}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 