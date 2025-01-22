'use client'

import { useState } from 'react'
import ContentCard from '../../../components/dashboard/ContentCard'
import ContentModal from '../../../components/dashboard/ContentModal'
import ContentHistory from '../../../components/dashboard/ContentHistory'
import ContentAnalytics from '../../../components/dashboard/ContentAnalytics'

export default function ContentStudio() {
  const [selectedType, setSelectedType] = useState<'blog' | 'social' | 'email' | null>(null)
  const [activeTab, setActiveTab] = useState<'blog' | 'social' | 'email'>('blog')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <section className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Studio</h1>
              <p className="mt-1 text-sm text-gray-500">Generate and manage your content</p>
            </div>
            <button className="btn-primary">New Content</button>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ContentAnalytics />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {['blog', 'social', 'email'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type as any)}
                className={`${
                  activeTab === type
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Content Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div onClick={() => setSelectedType('blog')}>
                <ContentCard
                  title="Blog Posts"
                  description="AI-generated blog posts optimized for SEO"
                  icon="📝"
                />
              </div>
              <div onClick={() => setSelectedType('social')}>
                <ContentCard
                  title="Social Media"
                  description="Engaging posts for your social platforms"
                  icon="📱"
                />
              </div>
              <div onClick={() => setSelectedType('email')}>
                <ContentCard
                  title="Email Templates"
                  description="Professional email templates"
                  icon="📧"
                />
              </div>
            </div>
          </div>

          {/* Content History */}
          <div className="lg:col-span-1">
            <ContentHistory type={activeTab} />
          </div>
        </div>
      </div>

      {/* Content Generation Modal */}
      <ContentModal
        isOpen={selectedType !== null}
        onClose={() => setSelectedType(null)}
        type={selectedType || 'blog'}
      />
    </div>
  )
}
