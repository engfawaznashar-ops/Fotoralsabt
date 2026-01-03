'use client'

import { useState } from 'react'
import { Menu, X, Search, BookOpen, Users, Mic, Home, MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const navLinks = [
  { label: 'الرئيسية', href: '/', icon: Home },
  { label: 'الحلقات', href: '/episodes', icon: Mic },
  { label: 'الكتب الذكية', href: '/books/smart', icon: BookOpen, badge: 'ذكي' },
  { label: 'المتحدثون', href: '/speakers', icon: Users },
  { label: 'الاقتباسات', href: '/quotes', icon: MessageCircle },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Book Paper Background - Bold & Elegant */}
      <div className="absolute inset-0 bg-[#FFFBF0] backdrop-blur-md border-b border-brand-yellow/25 shadow-md overflow-visible">
        {/* Paper texture - subtle lines */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 24px,
                rgba(0, 0, 0, 0.02) 24px,
                rgba(0, 0, 0, 0.02) 25px
              )
            `
          }}
        />
        
        {/* BOLD Watercolor Book Vectors */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-visible">
          {/* Right watercolor - prominent */}
          <div className="absolute right-0 top-0 w-[400px] h-[120px] opacity-[0.18] hidden lg:block" style={{ mixBlendMode: 'multiply' }}>
            <Image
              src="/vectors/watercolor-book-wash-right.svg"
              alt=""
              fill
              className="object-cover object-left"
              aria-hidden="true"
            />
          </div>
          
          {/* Left watercolor - prominent */}
          <div className="absolute left-0 top-0 w-[400px] h-[120px] opacity-[0.18] hidden lg:block" style={{ mixBlendMode: 'multiply' }}>
            <Image
              src="/vectors/watercolor-book-wash-left.svg"
              alt=""
              fill
              className="object-cover object-right"
              aria-hidden="true"
            />
          </div>
          
          {/* Tablet - medium opacity */}
          <div className="absolute right-0 top-0 w-[250px] h-[100px] opacity-[0.14] hidden md:block lg:hidden">
            <Image
              src="/vectors/watercolor-book-wash-right.svg"
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
            />
          </div>
          
          {/* Mobile - minimal */}
          <div className="absolute inset-0 opacity-[0.08] md:hidden">
            <div className="absolute left-0 top-0 w-32 h-full">
              <Image
                src="/vectors/watercolor-book-wash-left.svg"
                alt=""
                width={128}
                height={80}
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-yellow/[0.04] via-transparent to-brand-sand/[0.02]" />
      </div>
      
      <div className="container-custom relative">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Circular Design */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-yellow/40 to-brand-yellow/20 blur-lg group-hover:blur-xl transition-all" />
              
              {/* Logo container - Circular with yellow background */}
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-brand-yellow shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-105 overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="فطور السبت" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Brand name - visible on larger screens */}
            <div className="hidden md:flex flex-col">
              <span className="font-changa font-bold text-lg lg:text-xl text-brand-black leading-tight">
                فطور السبت
              </span>
              <span className="font-tajawal text-xs text-brand-gray">
                المعرفة بصوت جديد
              </span>
            </div>
          </a>

          {/* Desktop Navigation - "Book Chapters" Style */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2.5 text-brand-gray font-tajawal font-medium hover:text-brand-black transition-all duration-250 group"
                >
                  {/* Chapter number indicator */}
                  <span className="absolute top-0 right-2 text-[9px] font-changa text-brand-gray/40 group-hover:text-brand-yellow transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                    {/* AI Badge - Unified */}
                    {link.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-yellow text-brand-black">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  
                  {/* Underline - Unified */}
                  <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-gradient-to-l from-brand-yellow via-brand-yellow to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-right" />
                  
                  {/* Hover glow background - Unified */}
                  <div className="absolute inset-0 bg-brand-yellow/0 group-hover:bg-brand-yellow/[0.12] rounded-lg transition-all duration-250" />
                  
                  {/* Active page bookmark */}
                  <div className="absolute -bottom-0.5 right-1/2 translate-x-1/2 w-1 h-1 bg-brand-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-brand-yellow/25 hover:shadow-sm transition-all duration-200"
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            {/* Audiobook CTA - Bold & Clear */}
            <div className="relative group">
              {/* Main button */}
              <Button 
                className="relative rounded-xl bg-brand-black text-white hover:bg-brand-black/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-250 gap-2.5 px-5 overflow-visible"
              >
                {/* Play icon in circle */}
                <div className="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Mic className="w-3.5 h-3.5 text-brand-black" />
                </div>
                <span className="font-tajawal font-semibold">استمع الآن</span>
                {/* Pulse indicator */}
                <span className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </Button>
              
              {/* Subtitle - appears on hover */}
              <div className="absolute -bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-[10px] font-tajawal text-brand-gray/70 bg-white/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  آخر فصل متاح الآن
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-card overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container-custom py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-gray font-tajawal font-medium hover:bg-brand-sand transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </a>
            )
          })}
          <div className="pt-4 border-t border-border flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Search className="w-4 h-4" />
              بحث
            </Button>
            <Button className="flex-1">
              استمع الآن
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}



