'use client'
import { useState } from 'react'
import { Lead } from '../../types'

export default function PublicLeadForm() {
  const [formData, setFormData] = useState<Lead>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
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
      console.log('Lead submitted to API, result:', result)
      
      // Format data for Make.com properly - exact same structure as in Make.com screenshot
      const makeData = {
        lead: {
          id: result.id || `web-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          score: result.score || 5,
          category: (result.category || 'WARM').toUpperCase(),
          reason: result.reason || "Default analysis",
          action: result.action || "Follow up required",
          createdAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        },
        followup: {
          needsImmediate: (result.category === 'HOT'),
          nextActionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          assignedTo: 'sales@example.com'
        },
        system: {
          source: 'website_form',
          qualifiedBy: 'ai_system',
          version: '1.0'
        }
      }
      
      console.log('Sending to Make.com - Exact payload:', JSON.stringify(makeData, null, 2))
      
      // Send the properly structured data to Make.com
      const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/dduf09xlbr3857g1davz382xi4k547qf';
      const makeResponse = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makeData)  // Send the properly structured data
      })
      
      console.log('Make.com response:', makeResponse.status, await makeResponse.text())
      
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">

      <div className="glass-card border border-indigo-300/20 p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Contact Us</h2>
          <p className="mt-2 text-lg text-white">Let's discuss how we can help your business grow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-300/20 text-red-100 p-4 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 border border-green-300/20 text-green-100 p-4 rounded-lg">
              <p className="text-sm font-medium">Thank you for your interest! We'll be in touch soon.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-indigo-300/30 bg-white/10 text-white rounded-lg shadow-sm focus:ring-indigo-400 focus:border-indigo-400 focus:bg-indigo-800/30 sm:text-sm placeholder-indigo-200/70"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-indigo-300/30 bg-white/10 text-white rounded-lg shadow-sm focus:ring-indigo-400 focus:border-indigo-400 focus:bg-indigo-800/30 sm:text-sm placeholder-indigo-200/70"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-white mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-indigo-300/30 bg-white/10 text-white rounded-lg shadow-sm focus:ring-indigo-400 focus:border-indigo-400 focus:bg-indigo-800/30 sm:text-sm placeholder-indigo-200/70"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-white mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                id="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-indigo-300/30 bg-white/10 text-white rounded-lg shadow-sm focus:ring-indigo-400 focus:border-indigo-400 focus:bg-indigo-800/30 sm:text-sm placeholder-indigo-200/70"
                placeholder="Company Inc."
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-white mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-indigo-300/30 bg-white/10 text-white rounded-lg shadow-sm focus:ring-indigo-400 focus:border-indigo-400 focus:bg-indigo-800/30 sm:text-sm placeholder-indigo-200/70"
              placeholder="Please describe your needs..."
            />
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white ${loading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-600/80 hover:bg-indigo-500 transition-all duration-200'}`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}