'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Competitor } from '../../../types/market'

interface CompetitorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (competitor: Competitor) => void
}

export default function CompetitorModal({ isOpen, onClose, onSave }: CompetitorModalProps) {
  const [formData, setFormData] = useState<Competitor>({
    name: '',
    website: '',
    strengths: [''],
    weaknesses: [''],
    marketShare: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError('Failed to save competitor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addField = (type: 'strengths' | 'weaknesses') => {
    setFormData((prev: Competitor) => ({
      ...prev,
      [type]: [...prev[type], '']
    }))
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform bg-white p-6 rounded-lg shadow-xl">
              <Dialog.Title className="text-lg font-medium mb-4">
                Add New Competitor
              </Dialog.Title>
              
              {error && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData((prev: Competitor) => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="text"
                    required
                    value={formData.website}
                    onChange={e => setFormData((prev: Competitor) => ({ ...prev, website: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Market Share</label>
                  <input
                    type="text"
                    required
                    value={formData.marketShare}
                    onChange={e => setFormData((prev: Competitor) => ({ ...prev, marketShare: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 