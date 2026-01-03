'use client'

import { useState } from 'react'
import { Brain, Zap, BookOpen, User, X } from 'lucide-react'
import { Button } from './ui/button'
import { AiBadge } from './ui/ai-badge'
import { Card, CardContent } from './ui/card'
import { analyzeConcept } from '@/lib/ai/analyzeConcept'
import type { ConceptNode, ConceptLink, ConceptAnalysis } from '@/types'

// Node data with additional info for popovers
const nodes: (ConceptNode & { 
  description: string
  relatedBooks: string[]
  relatedSpeakers: string[]
})[] = [
  { 
    id: 1, x: 200, y: 150, label: 'العادات', size: 45, color: '#F2C94C',
    description: 'أنماط متكررة تشكل حياتنا اليومية.',
    relatedBooks: ['العادات الذرية', 'قوة العادات'],
    relatedSpeakers: ['أحمد السالم', 'سارة الخالد']
  },
  { 
    id: 2, x: 350, y: 100, label: 'القراءة', size: 35, color: '#4F4F4F',
    description: 'أداة قوية لتوسيع المعرفة والتفكير.',
    relatedBooks: ['كيف تقرأ كتاباً', 'فن القراءة'],
    relatedSpeakers: ['محمد العتيبي']
  },
  { 
    id: 3, x: 130, y: 280, label: 'الإنتاجية', size: 38, color: '#F2C94C',
    description: 'إنجاز الأهم وليس الأكثر.',
    relatedBooks: ['الشيء الوحيد', 'اعمل أربع ساعات فقط'],
    relatedSpeakers: ['أحمد السالم']
  },
  { 
    id: 4, x: 320, y: 250, label: 'التفكير', size: 32, color: '#4F4F4F',
    description: 'التمييز بين التفكير السريع والبطيء.',
    relatedBooks: ['التفكير السريع والبطيء'],
    relatedSpeakers: ['نورة القحطاني']
  },
  { 
    id: 5, x: 470, y: 180, label: 'الذكاء', size: 36, color: '#F2C94C',
    description: 'قدرة يمكن تطويرها بالتعلم المستمر.',
    relatedBooks: ['العقلية', 'الذكاء العاطفي'],
    relatedSpeakers: ['عبدالله الفيصل']
  },
  { 
    id: 6, x: 80, y: 130, label: 'الوعي', size: 28, color: '#4F4F4F',
    description: 'أساس التطور الشخصي والتغيير.',
    relatedBooks: ['قوة الآن', 'الوعي الذاتي'],
    relatedSpeakers: ['لمياء الحربي']
  },
  { 
    id: 7, x: 420, y: 320, label: 'النجاح', size: 34, color: '#F2C94C',
    description: 'التوازن بين الإنجاز والسعادة.',
    relatedBooks: ['العادات السبع', 'فكر وازدد ثراء'],
    relatedSpeakers: ['محمد العتيبي', 'أحمد السالم']
  },
]

const links: ConceptLink[] = [
  { source: 1, target: 2 },
  { source: 1, target: 3 },
  { source: 2, target: 4 },
  { source: 3, target: 4 },
  { source: 4, target: 5 },
  { source: 1, target: 6 },
  { source: 5, target: 7 },
  { source: 4, target: 7 },
  { source: 3, target: 7 },
]

export function KnowledgeMap() {
  const [activeNode, setActiveNode] = useState<typeof nodes[0] | null>(null)
  const [hoveredNode, setHoveredNode] = useState<typeof nodes[0] | null>(null)
  const [analysis, setAnalysis] = useState<ConceptAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleNodeClick = (node: typeof nodes[0]) => {
    setActiveNode(activeNode?.id === node.id ? null : node)
    setAnalysis(null)
  }

  const handleAnalyzeConcept = async () => {
    if (!activeNode) return
    setIsAnalyzing(true)
    try {
      const result = await analyzeConcept(activeNode.label)
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing concept:', error)
    }
    setIsAnalyzing(false)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 gradient-warm relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pattern-dots opacity-10" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          <AiBadge 
            text="مدعوم بالذكاء الاصطناعي" 
            variant="default"
            icon="brain"
            className="mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-changa font-bold text-brand-black mb-3">
            خريطة المعرفة
          </h2>
          <p className="text-base font-tajawal text-brand-gray max-w-2xl mx-auto">
            استكشف الروابط بين الأفكار والكتب والمتحدثين في رحلة معرفية تفاعلية
          </p>
        </div>

        {/* Knowledge Graph Container */}
        <div className="relative bg-white rounded-3xl shadow-card p-4 md:p-6 mb-6">
          <svg viewBox="0 0 550 400" className="w-full h-auto max-h-[400px]">
            {/* Definitions for filters */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
              </filter>
            </defs>

            {/* Links */}
            {links.map((link, index) => {
              const source = nodes.find(n => n.id === link.source)
              const target = nodes.find(n => n.id === link.target)
              if (!source || !target) return null
              const isActive = activeNode && (activeNode.id === link.source || activeNode.id === link.target)
              return (
                <line
                  key={index}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isActive ? '#F2C94C' : '#F2C94C'}
                  strokeWidth={isActive ? 3 : 2}
                  strokeOpacity={isActive ? 0.8 : 0.25}
                  className="transition-all duration-300"
                />
              )
            })}
            
            {/* Nodes */}
            {nodes.map((node, index) => {
              const isActive = activeNode?.id === node.id
              const isHovered = hoveredNode?.id === node.id
              const animationDelay = index * 0.2

              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Pulse Animation Ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size + 8}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="2"
                    strokeOpacity={isActive ? 0.5 : 0}
                    className="animate-ping"
                    style={{ 
                      animationDuration: '2s',
                      animationDelay: `${animationDelay}s`,
                      transformOrigin: `${node.x}px ${node.y}px`
                    }}
                  />
                  
                  {/* Glow Effect on hover/active */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size + 12}
                    fill={node.color}
                    opacity={isActive || isHovered ? 0.2 : 0}
                    className="transition-opacity duration-300"
                  />
                  
                  {/* Main Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    filter="url(#shadow)"
                    className="transition-all duration-300"
                    style={{
                      transform: isActive || isHovered ? 'scale(1.1)' : 'scale(1)',
                      transformOrigin: `${node.x}px ${node.y}px`,
                    }}
                  />
                  
                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    className="font-changa font-bold pointer-events-none"
                    style={{ fontSize: Math.max(10, node.size / 3.5) }}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Hover Popover */}
          {hoveredNode && !activeNode && (
            <div 
              className="absolute bg-white rounded-2xl shadow-card-hover p-4 max-w-xs z-20 animate-fade-in pointer-events-none"
              style={{
                left: `${(hoveredNode.x / 550) * 100}%`,
                top: `${(hoveredNode.y / 400) * 100}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <h4 className="font-changa font-bold text-brand-black mb-1">{hoveredNode.label}</h4>
              <p className="text-xs text-brand-gray font-tajawal mb-2">{hoveredNode.description}</p>
              <div className="flex flex-wrap gap-1">
                {hoveredNode.relatedBooks.slice(0, 2).map((book, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs bg-brand-sand px-2 py-0.5 rounded-full">
                    <BookOpen className="w-3 h-3" />
                    {book}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Hint */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-brand-gray/60">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-tajawal">انقر على العقد لاستكشاف المزيد</span>
          </div>
        </div>

        {/* Active Node Panel */}
        {activeNode && (
          <Card className="mb-6 animate-slide-up border-brand-yellow/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: activeNode.color }}
                  >
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-changa font-bold text-xl text-brand-black">{activeNode.label}</h3>
                    <p className="text-sm text-brand-gray font-tajawal">{activeNode.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setActiveNode(null); setAnalysis(null); }}
                  className="w-8 h-8 rounded-full bg-brand-sand flex items-center justify-center hover:bg-brand-yellow/30 transition-colors"
                >
                  <X className="w-4 h-4 text-brand-gray" />
                </button>
              </div>

              {/* Related Content */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-brand-gray font-tajawal mb-2 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> كتب ذات صلة
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.relatedBooks.map((book, i) => (
                      <span key={i} className="text-sm bg-brand-sand px-3 py-1 rounded-full font-tajawal">
                        {book}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-gray font-tajawal mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" /> متحدثون
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.relatedSpeakers.map((speaker, i) => (
                      <span key={i} className="text-sm bg-brand-yellow/20 px-3 py-1 rounded-full font-tajawal">
                        {speaker}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analyze Button */}
              <Button 
                onClick={handleAnalyzeConcept}
                disabled={isAnalyzing}
                className="gap-2"
              >
                <Brain className="w-4 h-4" />
                {isAnalyzing ? 'جاري التحليل...' : 'حلّل هذه الفكرة'}
              </Button>

              {/* Analysis Result */}
              {analysis && (
                <div className="mt-4 p-4 bg-brand-sand/50 rounded-xl animate-fade-in">
                  <h4 className="font-changa font-bold text-brand-black mb-2">تحليل الذكاء الاصطناعي</h4>
                  <p className="text-sm text-brand-gray font-tajawal mb-3">{analysis.explanation}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs text-brand-gray">📖 كتاب مقترح:</span>
                    <span className="text-sm font-tajawal bg-white px-3 py-1 rounded-full">
                      {analysis.recommendedBook.title} - {analysis.recommendedBook.author}
                    </span>
                  </div>
                  
                  <blockquote className="border-r-4 border-brand-yellow pr-4 text-sm font-tajawal text-brand-gray italic">
                    "{analysis.quote}"
                  </blockquote>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="gap-2">
            <Brain className="w-5 h-5" />
            استكشف الخريطة الكاملة
          </Button>
        </div>
      </div>
    </section>
  )
}
