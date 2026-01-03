import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center">
      <div className="text-center">
        {/* Animated Circular Logo */}
        <div className="relative mb-8 mx-auto">
          {/* Outer glow - animated */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-yellow/50 to-brand-yellow/30 blur-3xl animate-pulse" />
          
          {/* Logo container - Circular */}
          <div className="relative w-32 h-32 mx-auto rounded-full bg-brand-yellow shadow-2xl animate-pulse overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="فطور السبت" 
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-xl font-changa font-bold text-brand-black mb-2">
          فطور السبت
        </h2>
        <p className="text-brand-gray font-tajawal">جاري التحميل...</p>
        
        {/* Loading Bar */}
        <div className="w-48 h-1 bg-brand-yellow/20 rounded-full mt-6 mx-auto overflow-hidden">
          <div className="h-full w-1/3 bg-brand-yellow rounded-full animate-bounce-x" />
        </div>
      </div>
    </div>
  )
}

