'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import ContentGenerator from './ContentGenerator'

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'blog' | 'social' | 'email'
}

export default function ContentModal({ isOpen, onClose, type }: ContentModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl transform bg-white p-6 rounded-lg shadow-xl">
              <Dialog.Title className="text-lg font-medium mb-4">
                Generate {type.charAt(0).toUpperCase() + type.slice(1)} Content
              </Dialog.Title>
              <ContentGenerator type={type} />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 