'use client'

import { useState } from 'react'
import { Brain, Sparkles, BookOpen, User, Mic, Lightbulb, X, Zap } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { PageHeader } from '@/app/components/page-header'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { AiBadge } from '@/app/components/ui/ai-badge'

// Knowledge graph data
interface KnowledgeNode {
  id: string
  label: string
  type: 'concept' | 'book' | 'speaker'
  x: number
  y: number
  size: number
  description: string
  relatedBook?: string
  relatedEpisode?: string
  relatedSpeaker?: string
}

interface KnowledgeLink {
  source: string
  target: string
}

const nodes: KnowledgeNode[] = [
  // Primary concepts (yellow)
  { id: 'c1', label: 'العادات', type: 'concept', x: 400, y: 250, size: 50, description: 'أنماط سلوكية متكررة تشكل حياتنا اليومية', relatedBook: 'العادات الذرية', relatedEpisode: 'الحلقة 156' },
  { id: 'c2', label: 'القيادة', type: 'concept', x: 600, y: 180, size: 45, description: 'فن التأثير والإلهام لتحقيق الأهداف المشتركة', relatedBook: 'ابدأ بلماذا', relatedSpeaker: 'أحمد السالم' },
  { id: 'c3', label: 'التفكير', type: 'concept', x: 250, y: 350, size: 40, description: 'العملية العقلية لمعالجة المعلومات واتخاذ القرارات', relatedBook: 'التفكير السريع والبطيء', relatedEpisode: 'الحلقة 148' },
  { id: 'c4', label: 'الإنتاجية', type: 'concept', x: 500, y: 400, size: 42, description: 'القدرة على إنجاز المهام بكفاءة وفعالية', relatedEpisode: 'الحلقة 145' },
  { id: 'c5', label: 'النجاح', type: 'concept', x: 700, y: 350, size: 38, description: 'تحقيق الأهداف والطموحات الشخصية والمهنية', relatedSpeaker: 'محمد العتيبي' },
  
  // Secondary concepts (gray)
  { id: 'c6', label: 'الذكاء العاطفي', type: 'concept', x: 150, y: 200, size: 35, description: 'القدرة على فهم وإدارة المشاعر', relatedBook: 'الذكاء العاطفي' },
  { id: 'c7', label: 'التواصل', type: 'concept', x: 550, y: 100, size: 32, description: 'فن نقل الأفكار والمشاعر بفعالية', relatedSpeaker: 'سارة الخالد' },
  { id: 'c8', label: 'الوعي', type: 'concept', x: 200, y: 450, size: 30, description: 'الإدراك الواعي للذات والمحيط', relatedBook: 'فن اللامبالاة' },
  { id: 'c9', label: 'التعلم', type: 'concept', x: 750, y: 200, size: 36, description: 'اكتساب المعرفة والمهارات الجديدة', relatedEpisode: 'الحلقة 140' },
  { id: 'c10', label: 'الإلهام', type: 'concept', x: 350, y: 150, size: 34, description: 'الدافع الداخلي للإبداع والتميز', relatedSpeaker: 'نورة القحطاني' },
  
  // Books
  { id: 'b1', label: 'العادات الذرية', type: 'book', x: 300, y: 300, size: 28, description: 'كتاب جيمس كلير عن بناء العادات', relatedBook: 'العادات الذرية', relatedEpisode: 'الحلقة 156' },
  { id: 'b2', label: 'ابدأ بلماذا', type: 'book', x: 650, y: 280, size: 26, description: 'كتاب سايمون سينك عن القيادة', relatedBook: 'ابدأ بلماذا', relatedSpeaker: 'أحمد السالم' },
  
  // Speakers
  { id: 's1', label: 'أحمد السالم', type: 'speaker', x: 500, y: 150, size: 30, description: 'خبير في التنمية البشرية', relatedSpeaker: 'أحمد السالم', relatedEpisode: 'الحلقة 156' },
  { id: 's2', label: 'سارة الخالد', type: 'speaker', x: 450, y: 450, size: 28, description: 'كاتبة ومؤلفة', relatedSpeaker: 'سارة الخالد', relatedEpisode: 'الحلقة 152' },
]

const links: KnowledgeLink[] = [
  // Concept connections
  { source: 'c1', target: 'c4' },
  { source: 'c1', target: 'c3' },
  { source: 'c2', target: 'c5' },
  { source: 'c2', target: 'c7' },
  { source: 'c3', target: 'c6' },
  { source: 'c4', target: 'c5' },
  { source: 'c5', target: 'c9' },
  { source: 'c6', target: 'c8' },
  { source: 'c7', target: 'c10' },
  { source: 'c10', target: 'c2' },
  
  // Book connections
  { source: 'b1', target: 'c1' },
  { source: 'b1', target: 'c4' },
  { source: 'b2', target: 'c2' },
  { source: 'b2', target: 'c10' },
  
  // Speaker connections
  { source: 's1', target: 'c2' },
  { source: 's1', target: 'b2' },
  { source: 's2', target: 'c7' },
  { source: 's2', target: 'c6' },
]

interface AIAnalysis {
  explanation: string
  connections: string
  recommendations: string[]
}

export default function KnowledgeGraphPage() {
  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null)
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'concept': return '#F2C94C'
      case 'book': return '#27AE60'
      case 'speaker': return '#4F4F4F'
      default: return '#F2C94C'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'concept': return <Lightbulb className="w-4 h-4 text-white" />
      case 'book': return <BookOpen className="w-4 h-4 text-white" />
      case 'speaker': return <User className="w-4 h-4 text-white" />
      default: return null
    }
  }

  const handleAnalyzeConcept = async (node: KnowledgeNode) => {
    setSelectedNode(node)
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setAiAnalysis({
      explanation: `${node.label} هو مفهوم محوري في منظومة فطور السبت المعرفية. ${node.description}. يرتبط هذا المفهوم بعدة أفكار أخرى ويشكل جزءاً أساسياً من المحتوى الذي نقدمه.`,
      connections: `يتصل هذا المفهوم بـ ${links.filter(l => l.source === node.id || l.target === node.id).length} عقد أخرى في الخريطة، مما يجعله مفهوماً مركزياً في شبكة المعرفة.`,
      recommendations: [
        node.relatedBook ? `كتاب "${node.relatedBook}" للتعمق أكثر` : 'كتاب العادات الذرية',
        node.relatedEpisode ? `استمع إلى ${node.relatedEpisode}` : 'استمع إلى الحلقة الأخيرة',
        node.relatedSpeaker ? `تابع ${node.relatedSpeaker}` : 'تصفح المتحدثين',
      ],
    })
    setIsAnalyzing(false)
  }

  const closeAnalysis = () => {
    setSelectedNode(null)
    setAiAnalysis(null)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand/50 to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <PageHeader
            title="خريطة المعرفة الكاملة"
            subtitle="استكشف الروابط بين الأفكار والكتب والمتحدثين"
            icon={<Brain className="w-6 h-6 text-brand-black" />}
          />

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm text-brand-gray font-tajawal">المفتاح:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-brand-yellow" />
              <span className="text-sm font-tajawal text-brand-gray">أفكار</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-tajawal text-brand-gray">كتب</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-brand-gray" />
              <span className="text-sm font-tajawal text-brand-gray">متحدثون</span>
            </div>
          </div>

          {/* Knowledge Graph */}
          <Card className="shadow-warm-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-white min-h-[600px]">
                {/* Background Pattern */}
                <div className="absolute inset-0 pattern-dots opacity-5" />
                
                <svg 
                  viewBox="0 0 900 550" 
                  className="w-full h-auto"
                  style={{ minHeight: '550px' }}
                >
                  {/* Links */}
                  {links.map((link, index) => {
                    const source = nodes.find(n => n.id === link.source)
                    const target = nodes.find(n => n.id === link.target)
                    if (!source || !target) return null
                    
                    const isHighlighted = hoveredNode && 
                      (link.source === hoveredNode.id || link.target === hoveredNode.id)
                    
                    return (
                      <line
                        key={index}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isHighlighted ? '#F2C94C' : '#E5E5E5'}
                        strokeWidth={isHighlighted ? 3 : 1.5}
                        strokeOpacity={isHighlighted ? 1 : 0.5}
                        className="transition-all duration-300"
                      />
                    )
                  })}

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const isHovered = hoveredNode?.id === node.id
                    const scale = isHovered ? 1.15 : 1
                    
                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleAnalyzeConcept(node)}
                        style={{
                          transformOrigin: `${node.x}px ${node.y}px`,
                          transform: `scale(${scale})`,
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        {/* Glow effect */}
                        {isHovered && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size + 15}
                            fill={getNodeColor(node.type)}
                            opacity={0.2}
                          />
                        )}
                        
                        {/* Node circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size}
                          fill={getNodeColor(node.type)}
                          className="drop-shadow-md"
                          style={{
                            animation: `pulse ${2 + Math.random()}s infinite ease-in-out`,
                            animationDelay: `${Math.random()}s`,
                          }}
                        />
                        
                        {/* Label */}
                        <text
                          x={node.x}
                          y={node.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize={node.size / 3.5}
                          fontWeight="bold"
                          fontFamily="Changa, sans-serif"
                          className="pointer-events-none"
                        >
                          {node.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* Hover Popover */}
                {hoveredNode && !selectedNode && (
                  <div 
                    className="absolute bg-white rounded-xl shadow-lg p-4 max-w-xs z-10 border border-brand-sand animate-fade-in"
                    style={{
                      left: Math.min(hoveredNode.x + 60, 700),
                      top: Math.max(hoveredNode.y - 50, 10),
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getNodeColor(hoveredNode.type) }}
                      >
                        {getNodeIcon(hoveredNode.type)}
                      </div>
                      <span className="font-changa font-bold text-brand-black">{hoveredNode.label}</span>
                    </div>
                    <p className="text-sm text-brand-gray font-tajawal mb-3">
                      {hoveredNode.description}
                    </p>
                    {hoveredNode.relatedBook && (
                      <p className="text-xs text-brand-gray/70 font-tajawal">
                        📖 {hoveredNode.relatedBook}
                      </p>
                    )}
                    {hoveredNode.relatedEpisode && (
                      <p className="text-xs text-brand-gray/70 font-tajawal">
                        🎙️ {hoveredNode.relatedEpisode}
                      </p>
                    )}
                    <div className="mt-3 pt-2 border-t border-brand-sand">
                      <span className="text-xs text-brand-yellow font-tajawal flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        انقر للتحليل بالذكاء الاصطناعي
                      </span>
                    </div>
                  </div>
                )}

                {/* Hint */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-brand-gray/60">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-tajawal">مرر الفأرة على العقد واضغط للتحليل</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-changa font-bold text-brand-yellow">
                  {nodes.filter(n => n.type === 'concept').length}
                </p>
                <p className="text-sm text-brand-gray font-tajawal">فكرة</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-changa font-bold text-emerald-500">
                  {nodes.filter(n => n.type === 'book').length}
                </p>
                <p className="text-sm text-brand-gray font-tajawal">كتاب</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-changa font-bold text-brand-gray">
                  {nodes.filter(n => n.type === 'speaker').length}
                </p>
                <p className="text-sm text-brand-gray font-tajawal">متحدث</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* AI Analysis Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-warm-lg animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                  >
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <h3 className="font-changa font-bold text-xl text-brand-black">{selectedNode.label}</h3>
                    <AiBadge text="تحليل AI" variant="subtle" />
                  </div>
                </div>
                <button onClick={closeAnalysis} className="text-brand-gray hover:text-brand-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isAnalyzing ? (
                <div className="text-center py-10">
                  <div className="w-10 h-10 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-brand-gray font-tajawal">جاري التحليل بالذكاء الاصطناعي...</p>
                </div>
              ) : aiAnalysis && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-changa font-bold text-brand-black mb-2">شرح الفكرة</h4>
                    <p className="text-sm text-brand-gray font-tajawal leading-relaxed">
                      {aiAnalysis.explanation}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-changa font-bold text-brand-black mb-2">الروابط</h4>
                    <p className="text-sm text-brand-gray font-tajawal leading-relaxed">
                      {aiAnalysis.connections}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-changa font-bold text-brand-black mb-2">توصيات</h4>
                    <ul className="space-y-1.5">
                      {aiAnalysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-brand-gray font-tajawal flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 gap-2">
                  <Sparkles className="w-4 h-4" />
                  استكشف المزيد
                </Button>
                <Button variant="outline" onClick={closeAnalysis}>
                  إغلاق
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </>
  )
}



