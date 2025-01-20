'use client'

import { useState } from 'react'
import { Lead } from '../../types'

export default function PublicLeadForm() {
  const [formData, setFormData] = useState<Lead>({
    name: '',
    'email ': '',
    'phone ': '',
    'company ': '',
    'message ': '',
    source: 'Web Form'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Submit to our Next.js API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit lead')
      }

      const result = await response.json()
      console.log('Lead submitted:', result)

      // Only send to Make.com if API call succeeds
      await fetch('https://hook.eu2.make.com/z2t98fek6llh43lihtjknw27iga7sirc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      setSuccess(true)
      setFormData({
        name: '',
        'email ': '',
        'phone ': '',
        'company ': '',
        'message ': '',
        source: 'Web Form'
      })
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'Error submitting lead. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Contact Us</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-700">Thank you for your interest! We'll be in touch soon.</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email "
                  id="email"
                  required
                  value={formData['email ']}
                  onChange={(e) => setFormData(prev => ({ ...prev, 'email ': e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone "
                  id="phone"
                  required
                  value={formData['phone ']}
                  onChange={(e) => setFormData(prev => ({ ...prev, 'phone ': e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company "
                  id="company"
                  required
                  value={formData['company ']}
                  onChange={(e) => setFormData(prev => ({ ...prev, 'company ': e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                name="message "
                rows={4}
                required
                value={formData['message ']}
                onChange={(e) => setFormData(prev => ({ ...prev, 'message ': e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Please describe your needs..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 