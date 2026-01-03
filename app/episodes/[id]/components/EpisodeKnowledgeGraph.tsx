'use client'

import { useState, useMemo } from 'react'
import { Network, Maximize2, BookOpen, Users, Lightbulb, MessageSquare, Radio, ArrowLeft } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import type { GraphData } from '@/lib/api/episodes'
import type { GraphNode, GraphEdge, NodeType } from '@/lib/ai/shared/types'

interface EpisodeKnowledgeGraphProps {
  graph: GraphData
  episodeTitle: string
  className?: string
}

// Node type configurations
const nodeTypeConfig: Record<NodeType, { icon: typeof BookOpen; color: string; bgColor: string }> = {
  episode: { icon: Radio, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  book: { icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  speaker: { icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  quote: { icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-100' },
  concept: { icon: Lightbulb, color: 'text-brand-black', bgColor: 'bg-brand-yellow/30' },
  topic: { icon: Lightbulb, color: 'text-teal-600', bgColor: 'bg-teal-100' },
}

// Simple force-directed layout simulation
function useGraphLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  return useMemo(() => {
    if (nodes.length === 0) return []

    // Find central node (episode)
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    // Position nodes in a circular layout around center
    return nodes.map((node, index) => {
      if (node.type === 'episode') {
        return { ...node, x: centerX, y: centerY }
      }

      const angle = (2 * Math.PI * (index - 1)) / (nodes.length - 1) - Math.PI / 2
      const nodeRadius = radius * (0.8 + Math.random() * 0.4)
      
      return {
        ...node,
        x: centerX + Math.cos(angle) * nodeRadius,
        y: centerY + Math.sin(angle) * nodeRadius,
      }
    })
  }, [nodes, edges, width, height])
}

export function EpisodeKnowledgeGraph({ graph, episodeTitle, className }: EpisodeKnowledgeGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  const width = 600
  const height = 400
  const layoutNodes = useGraphLayout(graph.nodes, graph.edges, width, height)

  if (graph.nodes.length === 0) return null

  // Get node position by ID
  const getNodePosition = (nodeId: string) => {
    const node = layoutNodes.find(n => n.id === nodeId)
    return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 }
  }

  // Get connected nodes for a given node
  const getConnectedNodes = (nodeId: string) => {
    const connectedIds = new Set<string>()
    graph.edges.forEach(edge => {
      if (edge.source === nodeId) connectedIds.add(edge.target)
      if (edge.target === nodeId) connectedIds.add(edge.source)
    })
    return graph.nodes.filter(n => connectedIds.has(n.id))
  }

  return (
    <section className={cn('py-12 lg:py-16 bg-brand-sand', className)}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Network className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl font-changa font-bold text-brand-black">
                خريطة المعرفة
              </h2>
              <p className="text-sm text-brand-gray font-tajawal">
                الروابط بين الأفكار والكتب والمتحدثين
              </p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <a href="/knowledge">
              استكشف الخريطة الكاملة
              <ArrowLeft className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Graph Container */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Graph SVG */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-brand-sand p-4 overflow-hidden">
            <svg 
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto"
              style={{ minHeight: '300px' }}
            >
              {/* Edges */}
              <g>
                {graph.edges.map((edge) => {
                  const sourcePos = getNodePosition(edge.source)
                  const targetPos = getNodePosition(edge.target)
                  const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target
                  
                  return (
                    <line
                      key={edge.id}
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isHighlighted ? '#F2C94C' : '#E5E7EB'}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeOpacity={isHighlighted ? 1 : 0.6}
                      className="transition-all duration-200"
                    />
                  )
                })}
              </g>

              {/* Nodes */}
              <g>
                {layoutNodes.map((node) => {
                  const config = nodeTypeConfig[node.type as NodeType] || nodeTypeConfig.concept
                  const isHovered = hoveredNode === node.id
                  const isEpisode = node.type === 'episode'
                  const size = isEpisode ? 50 : (node.size || 30)
                  
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Node circle */}
                      <circle
                        r={size / 2}
                        fill={isEpisode ? '#F2C94C' : node.color || '#FFF7D9'}
                        stroke={isHovered ? '#000' : '#E5E7EB'}
                        strokeWidth={isHovered ? 2 : 1}
                        className="transition-all duration-200"
                      />
                      
                      {/* Node label */}
                      <text
                        y={size / 2 + 14}
                        textAnchor="middle"
                        className="text-xs fill-current text-brand-gray font-tajawal"
                        style={{ fontSize: '10px' }}
                      >
                        {(node.labelAr || node.label).slice(0, 12)}
                        {(node.labelAr || node.label).length > 12 ? '...' : ''}
                      </text>

                      {/* Pulse animation for hovered */}
                      {isHovered && (
                        <circle
                          r={size / 2 + 5}
                          fill="none"
                          stroke="#F2C94C"
                          strokeWidth={2}
                          className="animate-pulse-slow"
                          opacity={0.5}
                        />
                      )}
                    </g>
                  )
                })}
              </g>
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-brand-sand">
              {Object.entries(nodeTypeConfig).slice(0, 5).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', config.bgColor)}>
                      <Icon className={cn('w-3 h-3', config.color)} />
                    </div>
                    <span className="text-xs font-tajawal text-brand-gray">
                      {type === 'episode' ? 'حلقة' : 
                       type === 'book' ? 'كتاب' : 
                       type === 'speaker' ? 'متحدث' : 
                       type === 'quote' ? 'اقتباس' : 'فكرة'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Node Details */}
          <div className="bg-white rounded-2xl shadow-card border border-brand-sand p-6">
            {selectedNode ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const config = nodeTypeConfig[selectedNode.type as NodeType] || nodeTypeConfig.concept
                    const Icon = config.icon
                    return (
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bgColor)}>
                        <Icon className={cn('w-5 h-5', config.color)} />
                      </div>
                    )
                  })()}
                  <div>
                    <h3 className="font-changa font-bold text-brand-black">
                      {selectedNode.labelAr || selectedNode.label}
                    </h3>
                    <p className="text-xs text-brand-gray">
                      {selectedNode.type === 'episode' ? 'حلقة' : 
                       selectedNode.type === 'book' ? 'كتاب' : 
                       selectedNode.type === 'speaker' ? 'متحدث' : 
                       selectedNode.type === 'quote' ? 'اقتباس' : 'فكرة'}
                    </p>
                  </div>
                </div>

                {/* Connected Nodes */}
                <div className="space-y-3">
                  <p className="text-sm font-tajawal text-brand-gray">مرتبط بـ:</p>
                  <div className="space-y-2">
                    {getConnectedNodes(selectedNode.id).slice(0, 5).map(connectedNode => {
                      const config = nodeTypeConfig[connectedNode.type as NodeType] || nodeTypeConfig.concept
                      const Icon = config.icon
                      return (
                        <button
                          key={connectedNode.id}
                          onClick={() => setSelectedNode(connectedNode)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-brand-sand transition-colors text-right"
                        >
                          <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', config.bgColor)}>
                            <Icon className={cn('w-3 h-3', config.color)} />
                          </div>
                          <span className="text-sm font-tajawal text-brand-black truncate">
                            {connectedNode.labelAr || connectedNode.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Link to detail page */}
                {selectedNode.type !== 'concept' && selectedNode.type !== 'topic' && (
                  <Button variant="outline" className="w-full mt-4 gap-2" asChild>
                    <a href={`/${selectedNode.type}s/${selectedNode.id}`}>
                      عرض التفاصيل
                      <ArrowLeft className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Network className="w-12 h-12 text-brand-sand mx-auto mb-3" />
                <p className="text-sm font-tajawal text-brand-gray">
                  انقر على أي عنصر في الخريطة لعرض تفاصيله
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EpisodeKnowledgeGraph

