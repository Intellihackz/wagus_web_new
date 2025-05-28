import React from 'react'
import Sidebar from '@/components/sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 ml-16 transition-all duration-300 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
