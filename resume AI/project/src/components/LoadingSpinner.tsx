import React from 'react'
import { Sparkles } from 'lucide-react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4 animate-pulse">
          <Sparkles className="h-8 w-8 text-white animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading...</h2>
        <p className="text-slate-600">Setting up your workspace</p>
      </div>
    </div>
  )
}

export default LoadingSpinner