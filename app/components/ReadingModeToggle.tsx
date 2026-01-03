'use client'

import { useState, useEffect } from 'react'
import { BookOpenCheck, BookOpen } from 'lucide-react'
import { Button } from './ui/button'

export function ReadingModeToggle() {
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load reading mode state from localStorage
    const savedMode = localStorage.getItem('reading-mode')
    if (savedMode === 'true') {
      setIsReadingMode(true)
      document.documentElement.classList.add('reading-mode')
    }
  }, [])

  const toggleReadingMode = () => {
    const newMode = !isReadingMode
    setIsReadingMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('reading-mode')
      localStorage.setItem('reading-mode', 'true')
    } else {
      document.documentElement.classList.remove('reading-mode')
      localStorage.setItem('reading-mode', 'false')
    }
  }

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleReadingMode}
      className={`gap-2 font-tajawal text-sm transition-all ${
        isReadingMode
          ? 'bg-brand-yellow/20 text-brand-black hover:bg-brand-yellow/30'
          : 'text-brand-gray hover:text-brand-black hover:bg-brand-sand'
      }`}
      aria-label={isReadingMode ? 'إلغاء وضع القراءة' : 'تفعيل وضع القراءة'}
    >
      {isReadingMode ? (
        <>
          <BookOpenCheck className="w-4 h-4" />
          وضع القراءة مُفعّل
        </>
      ) : (
        <>
          <BookOpen className="w-4 h-4" />
          وضع القراءة
        </>
      )}
    </Button>
  )
}

