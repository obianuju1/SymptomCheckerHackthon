'use client'

import React from 'react'
import Link from 'next/link'
import { Home, History, Plus } from 'lucide-react'

const DashboardNavigation = () => {
    return (
    <div className="px-4 py-3">
      {/* Vertical Navigation Links */}
      <div className="flex flex-col space-y-2">
          <Link
            href="/home"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-green-500/10 text-green-500 border border-green-500/20"
          >
            <Home className="h-4 w-4 mr-3" />
            Home
          </Link>
          <Link
            href="/diagnoses"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <History className="h-4 w-4 mr-3" />
            Past Diagnoses
          </Link>
          <Link
            href="/predict"
            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-200 font-medium"
          >
            <Plus className="h-4 w-4 mr-3" />
            New Prediction
          </Link>
        </div>
      </div>
  )
}

export default DashboardNavigation
