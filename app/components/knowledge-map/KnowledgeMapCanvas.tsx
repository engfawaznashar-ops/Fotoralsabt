'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import type { Node, Edge, NodeType } from './types'
import { BookOpen, Mic, User, Lightbulb } from 'lucide-react'

interface KnowledgeMapCanvasProps {
  nodes: Node[]
  edges: Edge[]
  selectedNode: Node | null
  hoveredNode: Node | null
  onNodeClick: (node: Node) => void
  onNodeHover: (node: Node | null) => void
  highlightedNodes: Set<string>
  highlightedEdges: Set<string>
  activeFilter: NodeType | 'الكل'
  storyHighlightedNode: string | null
  showEdgeWeight?: boolean // خاصية جديدة
}

// دالة للحصول على لون حسب نوع العقدة
const getNodeColor = (type: NodeType): string => {
  const colors = {
    'فكرة': '#F2C94C',
    'كتاب': '#2D9CDB',
    'حلقة': '#27AE60',
    'متحدث': '#EB5757'
  }
  return colors[type]
}

// دالة للحصول على الأيقونة
const NodeIcon = ({ type, size = 16 }: { type: NodeType; size?: number }) => {
  const iconProps = { width: size, height: size, strokeWidth: 2.5 }
  
  switch (type) {
    case 'كتاب':
      return <BookOpen {...iconProps} />
    case 'حلقة':
      return <Mic {...iconProps} />
    case 'متحدث':
      return <User {...iconProps} />
    case 'فكرة':
      return <Lightbulb {...iconProps} />
  }
}

export function KnowledgeMapCanvas({
  nodes,
  edges,
  selectedNode,
  hoveredNode,
  onNodeClick,
  onNodeHover,
  highlightedNodes,
  highlightedEdges,
  activeFilter,
  storyHighlightedNode,
  showEdgeWeight = false
}: KnowledgeMapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // تصفية العقد حسب الفلتر
  const filteredNodes = useMemo(() => {
    if (activeFilter === 'الكل') return nodes
    return nodes.filter(n => n.type === activeFilter)
  }, [nodes, activeFilter])

  // الحصول على IDs العقد المصفاة
  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map(n => n.id)),
    [filteredNodes]
  )

  // تصفية الروابط (فقط بين العقد المصفاة)
  const filteredEdges = useMemo(() => {
    return edges.filter(
      e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    )
  }, [edges, filteredNodeIds])

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.5), 2)
    }))
  }

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).tagName === 'svg') {
      setIsDragging(true)
      setDragStart({ x: e.clientX - transform.translateX, y: e.clientY - transform.translateY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        translateX: e.clientX - dragStart.x,
        translateY: e.clientY - dragStart.y
      }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ 
        x: touch.clientX - transform.translateX, 
        y: touch.clientY - transform.translateY 
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0]
      setTransform(prev => ({
        ...prev,
        translateX: touch.clientX - dragStart.x,
        translateY: touch.clientY - dragStart.y
      }))
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // تحديد opacity للعقد والروابط - محسّن للوضوح
  const getNodeOpacity = (nodeId: string): number => {
    if (storyHighlightedNode === nodeId) return 1
    if (storyHighlightedNode) return 0.15
    if (highlightedNodes.size === 0) return 1
    return highlightedNodes.has(nodeId) ? 1 : 0.15 // خفيف جداً للعقد غير المرتبطة
  }

  const getEdgeOpacity = (edgeId: string): number => {
    if (storyHighlightedNode) return 0.1
    if (highlightedEdges.size === 0) return 0.35
    return highlightedEdges.has(edgeId) ? 0.9 : 0.08 // إبراز قوي للروابط المرتبطة
  }

  return (
    <div className="relative w-full h-full min-h-[500px] bg-white rounded-3xl shadow-card overflow-hidden">
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-3xl"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 35px,
              rgba(0, 0, 0, 0.02) 35px,
              rgba(0, 0, 0, 0.02) 36px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(242, 201, 76, 0.01) 40px,
              rgba(242, 201, 76, 0.01) 41px
            )
          `,
          borderRadius: '1.5rem'
        }}
      />
      
      {/* Inner shadow for depth */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.03), inset 0 -2px 4px rgba(242, 201, 76, 0.02)'
        }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-brand-sand/50">
        <p className="text-xs font-tajawal text-brand-gray mb-2 font-semibold">أنواع العقد:</p>
        <div className="space-y-1.5">
          {(['فكرة', 'كتاب', 'حلقة', 'متحدث'] as NodeType[]).map(type => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getNodeColor(type) }}
              />
              <span className="text-xs font-tajawal text-brand-gray">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 700 450"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        <defs>
          {/* Shadow filter */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2" />
          </filter>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Transform group */}
        <g transform={`translate(${transform.translateX}, ${transform.translateY}) scale(${transform.scale})`}>
          {/* Edges */}
          <g className="edges">
            {filteredEdges.map(edge => {
              const source = nodes.find(n => n.id === edge.source)
              const target = nodes.find(n => n.id === edge.target)
              if (!source || !target) return null

              const opacity = getEdgeOpacity(edge.id)
              // سماكة محسّنة بناءً على الـweight
              const baseWidth = showEdgeWeight ? 2 : 1.5
              const strokeWidth = edge.weight * baseWidth
              
              // لون حسب الـweight (اختياري)
              const edgeColor = showEdgeWeight 
                ? edge.weight === 3 ? '#F2C94C' : edge.weight === 2 ? '#E5B83D' : '#D4A933'
                : '#F2C94C'

              return (
                <g key={edge.id}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={edgeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    className="transition-all duration-300"
                    strokeLinecap="round"
                  />
                  {/* Weight label - يظهر فقط عند التفعيل والإبراز */}
                  {showEdgeWeight && highlightedEdges.has(edge.id) && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2}
                      textAnchor="middle"
                      className="font-tajawal text-[10px] fill-brand-black pointer-events-none"
                      opacity="0.7"
                    >
                      {edge.weight === 3 ? 'قوي' : edge.weight === 2 ? 'متوسط' : 'خفيف'}
                    </text>
                  )}
                </g>
              )
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id
              const isHovered = hoveredNode?.id === node.id
              const isHighlighted = highlightedNodes.has(node.id)
              const opacity = getNodeOpacity(node.id)
              const color = getNodeColor(node.type)
              const size = node.type === 'فكرة' ? 35 : node.type === 'كتاب' ? 32 : node.type === 'حلقة' ? 28 : 30
              // Scale محسّن: 12% للـhover, 10% للـselected
              const scale = isHovered ? 1.12 : isSelected ? 1.10 : storyHighlightedNode === node.id ? 1.15 : 1

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => onNodeClick(node)}
                  onMouseEnter={() => onNodeHover(node)}
                  onMouseLeave={() => onNodeHover(null)}
                  opacity={opacity}
                  style={{
                    transform: `translate(${node.x}px, ${node.y}px) scale(${scale})`,
                    transformOrigin: 'center',
                  }}
                >
                  {/* Pulse ring for story mode */}
                  {storyHighlightedNode === node.id && (
                    <circle
                      cx={0}
                      cy={0}
                      r={size + 15}
                      fill="none"
                      stroke={color}
                      strokeWidth="3"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Enhanced Glow on hover/select/highlight */}
                  {(isSelected || isHovered || (isHighlighted && highlightedNodes.size > 0)) && (
                    <>
                      <circle
                        cx={0}
                        cy={0}
                        r={size + 12}
                        fill={color}
                        opacity={isHovered ? "0.4" : "0.25"}
                        filter="url(#glow)"
                        className="transition-opacity duration-200"
                      />
                      {isHovered && (
                        <circle
                          cx={0}
                          cy={0}
                          r={size + 18}
                          fill={color}
                          opacity="0.15"
                          className="animate-ping"
                          style={{ animationDuration: '1.5s' }}
                        />
                      )}
                    </>
                  )}

                  {/* Main circle */}
                  <circle
                    cx={0}
                    cy={0}
                    r={size}
                    fill={color}
                    filter="url(#shadow)"
                    className="transition-all duration-200"
                  />

                  {/* Label */}
                  <text
                    x={0}
                    y={size + 18}
                    textAnchor="middle"
                    className="font-tajawal text-xs font-medium fill-brand-black pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </g>
        </g>
      </svg>

      {/* Enhanced Controls hint */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-brand-sand/50">
        <div className="flex items-center gap-4 text-xs font-tajawal text-brand-gray/70">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            استخدم العجلة للتكبير
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            اسحب للتنقل
          </span>
        </div>
        <span className="text-xs font-tajawal font-medium text-brand-black">
          {Math.round(transform.scale * 100)}%
        </span>
      </div>
    </div>
  )
}

