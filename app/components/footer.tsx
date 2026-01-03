'use client'

import { Github, Twitter, Instagram, Youtube, Heart, ExternalLink, Mail } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { label: 'الرئيسية', href: '/' },
      { label: 'الحلقات', href: '/episodes' },
      { label: 'الكتب', href: '/books' },
      { label: 'المتحدثون', href: '/speakers' },
      { label: 'الاقتباسات', href: '/quotes' },
    ],
    resources: [
      { label: 'خريطة المعرفة', href: '/knowledge-map' },
      { label: 'البحث الذكي', href: '/search' },
      { label: 'الملخصات الأسبوعية', href: '/digest' },
      { label: 'API', href: '/api-docs' },
    ],
    about: [
      { label: 'من نحن', href: '/about' },
      { label: 'تواصل معنا', href: '/contact' },
      { label: 'سياسة الخصوصية', href: '/privacy' },
      { label: 'الشروط والأحكام', href: '/terms' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/fotoralalsabt', label: 'تويتر' },
    { icon: Instagram, href: 'https://instagram.com/fotoralalsabt', label: 'انستغرام' },
    { icon: Youtube, href: 'https://youtube.com/fotoralalsabt', label: 'يوتيوب' },
    { icon: Github, href: 'https://github.com/fotoralalsabt', label: 'جيثب' },
  ]

  return (
    <footer className="bg-brand-black text-white">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              {/* Circular Logo */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-yellow/50 to-brand-yellow/30 blur-xl" />
                <div className="relative w-20 h-20 rounded-full bg-brand-yellow shadow-2xl overflow-hidden">
                  <Image 
                    src="/logo.png" 
                    alt="فطور السبت" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Brand Text */}
              <div>
                <h3 className="font-changa font-bold text-xl text-white">فطور السبت</h3>
                <p className="text-sm text-white/70 font-tajawal">المعرفة بصوت جديد</p>
              </div>
            </div>
            <p className="text-white/70 font-tajawal leading-relaxed mb-6 max-w-sm">
              بودكاست أسبوعي يقدم لك أفضل الكتب والأفكار من خلال حوارات ملهمة ومناقشات عميقة.
              انضم إلينا في رحلة المعرفة كل سبت.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-tajawal text-white/80">اشترك في النشرة الأسبوعية</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-brand-yellow"
                />
                <Button className="flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-changa font-bold text-lg mb-4">المنصة</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-brand-yellow transition-colors font-tajawal text-sm animated-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-changa font-bold text-lg mb-4">الموارد</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-brand-yellow transition-colors font-tajawal text-sm animated-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-changa font-bold text-lg mb-4">عن المنصة</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-brand-yellow transition-colors font-tajawal text-sm animated-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-all"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>

          {/* Tech Badges */}
          <div className="flex items-center gap-4">
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-tajawal"
            >
              <span>Built with Next.js</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-2 text-white/60 text-sm font-tajawal">
              <span>Powered by AI</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </span>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-white/60 text-sm font-tajawal">
            <span>© {currentYear} فطور السبت</span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1">
              صنع بـ <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}



