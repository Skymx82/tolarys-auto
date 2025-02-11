'use client';

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDemo = pathname === '/student-portal'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {isDemo && (
              <Link href="/demo" className="mr-3 group">
                <ArrowLeftIcon className="h-6 w-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </Link>
            )}
            <Link href="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/Logo.png"
                alt="Tolarys"
              />
              <span className="ml-4 text-xl font-semibold text-gray-900">
                Tolarys - Portail Élève
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
