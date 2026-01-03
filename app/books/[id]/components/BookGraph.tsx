'use client'

import { useRef, useState, useEffect } from 'react'
import { Share2, Sparkles, BookOpen, Mic, User, Lightbulb, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import type { GraphData } from '@/lib/api/books'

interface BookGraphProps {
  graph: GraphData | null
  bookTitle: string
}

interface NodePosition {
  x: number
  y: number
  node: {
    id: string
    label: string
    type: string
    labelAr?: string
  }
}

export function BookGraph({ graph, bookTitle }: BookGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<NodePosition | null>(null)
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [conceptAnalysis, setConceptAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return null
  }

  // Layout constants
  const centerX = 200
  const centerY = 150
  const radius = 100

  // Categorize nodes
  const centralNode = graph.nodes.find(n => n.type === 'book') || graph.nodes[0]
  const otherNodes = graph.nodes.filter(n => n.id !== centralNode?.id).slice(0, 8)

  // Calculate positions for orbital nodes
  const getNodePositions = () => {
    const positions: NodePosition[] = []
    
    // Central node
    if (centralNode) {
      positions.push({
        x: centerX,
        y: centerY,
        node: {
          id: centralNode.id,
          label: centralNode.label,
          type: centralNode.type,
          labelAr: centralNode.labelAr,
        }
      })
    }

    // Orbital nodes
    otherNodes.forEach((node, index) => {
      const angle = (index / otherNodes.length) * Math.PI * 2 - Math.PI / 2
      positions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        node: {
          id: node.id,
          label: node.label,
          type: node.type,
          labelAr: node.labelAr,
        }
      })
    })

    return positions
  }

  const positions = getNodePositions()

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'book': return '#F2C94C'
      case 'episode': return '#60A5FA'
      case 'speaker': return '#34D399'
      case 'concept': return '#A78BFA'
      case 'topic': return '#FB923C'
      default: return '#9CA3AF'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen
      case 'episode': return Mic
      case 'speaker': return User
      case 'concept':
      case 'topic': return Lightbulb
      default: return Sparkles
    }
  }

  const handleNodeClick = (node: NodePosition['node']) => {
    if (node.type === 'episode') {
      router.push(`/episodes/${node.id}`)
    } else if (node.type === 'speaker') {
      router.push(`/speakers/${node.id}`)
    } else if (node.type === 'book' && node.id !== centralNode?.id) {
      router.push(`/books/${node.id}`)
    } else if (node.type === 'concept' || node.type === 'topic') {
      setSelectedConcept(node.labelAr || node.label)
      analyzeConceptClick(node.labelAr || node.label)
    }
  }

  const analyzeConceptClick = async (concept: string) => {
    setIsAnalyzing(true)
    setConceptAnalysis(null)

    try {
      const response = await fetch('/api/analyze/concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept }),
      })

      if (response.ok) {
        const data = await response.json()
        setConceptAnalysis(data.data?.explanation || 'جاري تطوير تحليل هذا المفهوم...')
      } else {
        setConceptAnalysis('عذراً، حدث خطأ أثناء التحليل.')
      }
    } catch {
      setConceptAnalysis('عذراً، حدث خطأ في الاتصال.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-sand/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center">
            <Share2 className="w-6 h-6 text-brand-yellow" />
          </div>
          <div>
            <h2 className="font-changa font-bold text-xl text-brand-black">
              شبكة المعرفة
            </h2>
            <p className="text-sm text-brand-gray font-tajawal">
              العلاقات بين الكتاب والحلقات والمتحدثين
            </p>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="p-6">
        <div
          ref={containerRef}
          className="relative bg-gradient-to-br from-brand-sand/20 to-white rounded-2xl border border-brand-sand overflow-hidden"
          style={{ height: 320 }}
        >
          {/* SVG Canvas */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 300"
            className="select-none"
          >
            {/* Draw edges first */}
            {positions.slice(1).map((pos, index) => (
              <line
                key={`edge-${index}`}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke="#F2C94C"
                strokeWidth="2"
                strokeOpacity="0.3"
                strokeDasharray="4 2"
              />
            ))}

            {/* Draw nodes */}
            {positions.map((pos, index) => {
              const Icon = getNodeIcon(pos.node.type)
              const isCenter = index === 0
              const nodeSize = isCenter ? 24 : 18
              
              return (
                <g
                  key={pos.node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(pos.node)}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect()
                    if (rect) {
                      setHoveredNode(pos)
                    }
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Pulse animation for center */}
                  {isCenter && (
                    <circle
                      r={nodeSize + 8}
                      fill={getNodeColor(pos.node.type)}
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Node circle */}
                  <circle
                    r={nodeSize}
                    fill={getNodeColor(pos.node.type)}
                    className="transition-all duration-200 hover:opacity-90"
                    style={{
                      filter: hoveredNode?.node.id === pos.node.id ? 'brightness(1.1)' : 'none',
                      transform: hoveredNode?.node.id === pos.node.id ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />

                  {/* Node icon */}
                  <foreignObject
                    x={-nodeSize / 2}
                    y={-nodeSize / 2}
                    width={nodeSize}
                    height={nodeSize}
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon 
                        className={`${isCenter ? 'w-5 h-5' : 'w-4 h-4'} text-white`}
                      />
                    </div>
                  </foreignObject>

                  {/* Label */}
                  <text
                    y={nodeSize + 14}
                    textAnchor="middle"
                    className="text-xs fill-brand-gray font-tajawal pointer-events-none"
                    style={{ fontSize: '10px' }}
                  >
                    {(pos.node.labelAr || pos.node.label).slice(0, 12)}
                    {(pos.node.labelAr || pos.node.label).length > 12 ? '...' : ''}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredNode && (
            <div
              className="absolute bg-white rounded-xl shadow-lg p-3 z-20 border border-brand-sand pointer-events-none max-w-[180px]"
              style={{
                left: `${(hoveredNode.x / 400) * 100}%`,
                top: `${(hoveredNode.y / 300) * 100}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <p className="text-sm font-changa font-bold text-brand-black text-center">
                {hoveredNode.node.labelAr || hoveredNode.node.label}
              </p>
              <p className="text-xs text-brand-gray font-tajawal text-center mt-1">
                {hoveredNode.node.type === 'book' && 'كتاب'}
                {hoveredNode.node.type === 'episode' && 'حلقة'}
                {hoveredNode.node.type === 'speaker' && 'متحدث'}
                {(hoveredNode.node.type === 'concept' || hoveredNode.node.type === 'topic') && 'مفهوم'}
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl p-2 flex flex-wrap gap-2 text-xs font-tajawal">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F2C94C' }} />
              كتاب
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#60A5FA' }} />
              حلقة
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#34D399' }} />
              متحدث
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A78BFA' }} />
              مفهوم
            </span>
          </div>
        </div>

        {/* Concept Analysis Panel */}
        {selectedConcept && (
          <div className="mt-4 bg-gradient-to-l from-brand-yellow/10 to-brand-sand/30 rounded-2xl p-5 border border-brand-yellow/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-brand-yellow" />
                <h3 className="font-changa font-bold text-brand-black">
                  تحليل: {selectedConcept}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedConcept(null)
                  setConceptAnalysis(null)
                }}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-brand-gray font-tajawal">
                <div className="w-4 h-4 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                جاري التحليل...
              </div>
            ) : (
              <p className="text-brand-gray font-tajawal leading-relaxed">
                {conceptAnalysis}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default BookGraph



