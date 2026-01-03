'use client'

import { useEffect } from 'react'
import { Button } from './components/ui/button'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        {/* Error Message */}
        <h1 className="text-2xl font-changa font-bold text-brand-black mb-2">
          حدث خطأ ما
        </h1>
        <p className="text-brand-gray font-tajawal mb-8">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>
        
        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-right">
            <p className="text-sm text-red-600 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-400 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={reset} className="gap-2 w-full sm:w-auto">
            <RefreshCcw className="w-4 h-4" />
            حاول مرة أخرى
          </Button>
          <Button variant="outline" asChild className="gap-2 w-full sm:w-auto">
            <a href="/">
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}



