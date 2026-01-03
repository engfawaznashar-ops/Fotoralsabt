import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'فطور السبت | المعرفة بصوت جديد',
  description: 'منصة فطور السبت - بودكاست معرفي أسبوعي يستعرض الكتب والأفكار والمتحدثين المؤثرين',
  keywords: ['بودكاست', 'كتب', 'معرفة', 'فطور السبت', 'عربي'],
  authors: [{ name: 'فطور السبت' }],
  creator: 'فطور السبت',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://fotoralalsabt.com',
    siteName: 'فطور السبت',
    title: 'فطور السبت | المعرفة بصوت جديد',
    description: 'منصة فطور السبت - بودكاست معرفي أسبوعي يستعرض الكتب والأفكار والمتحدثين المؤثرين',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'فطور السبت',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فطور السبت | المعرفة بصوت جديد',
    description: 'منصة فطور السبت - بودكاست معرفي أسبوعي',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#F2C94C" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}



