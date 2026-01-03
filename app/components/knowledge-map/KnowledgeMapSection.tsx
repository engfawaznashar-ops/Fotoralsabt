'use client'

import { useState, useEffect, useMemo } from 'react'
import { Brain } from 'lucide-react'
import { AiBadge } from '../ui/ai-badge'
import { Button } from '../ui/button'
import { KnowledgeMapCanvas } from './KnowledgeMapCanvas'
import { KnowledgePanel } from './KnowledgePanel'
import { KnowledgeMapControls } from './KnowledgeMapControls'
import { mockNodes, mockEdges, storyPaths } from './mockData'
import type { Node, Edge, NodeType, StoryPath } from './types'

export function KnowledgeMapSection() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<NodeType | 'الكل'>('الكل')
  const [activeStoryPath, setActiveStoryPath] = useState<StoryPath | null>(null)
  const [isStoryPlaying, setIsStoryPlaying] = useState(false)
  const [showEdgeWeight, setShowEdgeWeight] = useState(false)

  // حساب العقد والروابط المبرزة
  const { highlightedNodes, highlightedEdges } = useMemo(() => {
    const nodes = new Set<string>()
    const edges = new Set<string>()

    const activeNode = hoveredNode || selectedNode
    if (activeNode) {
      nodes.add(activeNode.id)
      
      mockEdges.forEach(edge => {
        if (edge.source === activeNode.id || edge.target === activeNode.id) {
          edges.add(edge.id)
          nodes.add(edge.source)
          nodes.add(edge.target)
        }
      })
    }

    return { highlightedNodes: nodes, highlightedEdges: edges }
  }, [hoveredNode, selectedNode])

  // البحث والتصفية
  const filteredData = useMemo(() => {
    let nodes = mockNodes
    let edges = mockEdges

    // تطبيق البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      nodes = nodes.filter(n => 
        n.label.toLowerCase().includes(query) ||
        n.description?.toLowerCase().includes(query) ||
        n.meta?.author?.toLowerCase().includes(query)
      )
    }

    // تطبيق الفلتر
    if (activeFilter !== 'الكل') {
      nodes = nodes.filter(n => n.type === activeFilter)
    }

    return { nodes, edges }
  }, [searchQuery, activeFilter])

  // Story Mode Logic
  useEffect(() => {
    if (!activeStoryPath || !isStoryPlaying) return

    const currentStep = activeStoryPath.steps[activeStoryPath.currentStep]
    if (!currentStep) return

    // تحديد العقدة الحالية في المسار
    const currentNode = mockNodes.find(n => n.id === currentStep.nodeId)
    if (currentNode) {
      setSelectedNode(currentNode)
    }

    // الانتقال للخطوة التالية بعد المدة المحددة
    const timer = setTimeout(() => {
      setActiveStoryPath(prev => {
        if (!prev) return null
        
        const nextStep = prev.currentStep + 1
        if (nextStep >= prev.steps.length) {
          // انتهى المسار
          setIsStoryPlaying(false)
          return { ...prev, currentStep: 0 }
        }
        
        return { ...prev, currentStep: nextStep }
      })
    }, currentStep.duration)

    return () => clearTimeout(timer)
  }, [activeStoryPath, isStoryPlaying])

  const handleStoryPathSelect = (path: StoryPath | null) => {
    if (path) {
      setActiveStoryPath({ ...path, currentStep: 0 })
      setIsStoryPlaying(true)
    } else {
      setActiveStoryPath(null)
      setIsStoryPlaying(false)
      setSelectedNode(null)
    }
  }

  const handleStoryNext = () => {
    if (!activeStoryPath) return
    const nextStep = activeStoryPath.currentStep + 1
    if (nextStep < activeStoryPath.steps.length) {
      setActiveStoryPath(prev => prev ? { ...prev, currentStep: nextStep } : null)
    }
  }

  const handleStoryPrevious = () => {
    if (!activeStoryPath) return
    const prevStep = activeStoryPath.currentStep - 1
    if (prevStep >= 0) {
      setActiveStoryPath(prev => prev ? { ...prev, currentStep: prevStep } : null)
    }
  }

  const handleNodeClick = (node: Node) => {
    // إيقاف Story Mode عند النقر اليدوي
    if (isStoryPlaying) {
      setIsStoryPlaying(false)
    }
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }

  // الحصول على الروابط المرتبطة بالعقدة المختارة
  const selectedNodeEdges = selectedNode
    ? mockEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : []

  return (
    <section className="section-padding gradient-warm relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-10" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <AiBadge
            text="مدعوم بالذكاء الاصطناعي"
            variant="default"
            icon="brain"
            className="mb-4"
          />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-changa font-bold text-brand-black mb-3">
            خريطة المعرفة التفاعلية
          </h2>
          <p className="text-base md:text-lg font-tajawal text-brand-gray max-w-2xl mx-auto leading-relaxed">
            استكشف العلاقات بين الأفكار والكتب والحلقات والمتحدثين في رحلة معرفية تفاعلية
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 mb-6">
          {/* Canvas Area */}
          <div className="order-2 lg:order-1">
            {/* Paper texture container */}
            <div className="relative">
              {/* Subtle paper texture */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 35px,
                      rgba(242, 201, 76, 0.05) 35px,
                      rgba(242, 201, 76, 0.05) 36px
                    )
                  `
                }}
              />
              <KnowledgeMapCanvas
                nodes={filteredData.nodes}
                edges={filteredData.edges}
                selectedNode={selectedNode}
                hoveredNode={hoveredNode}
                onNodeClick={handleNodeClick}
                onNodeHover={setHoveredNode}
                highlightedNodes={highlightedNodes}
                highlightedEdges={highlightedEdges}
                activeFilter={activeFilter}
                storyHighlightedNode={
                  activeStoryPath
                    ? activeStoryPath.steps[activeStoryPath.currentStep]?.nodeId
                    : null
                }
                showEdgeWeight={showEdgeWeight}
              />
            </div>
          </div>

          {/* Controls + Panel */}
          <div className="order-1 lg:order-2 lg:w-96 space-y-4">
            {/* Controls */}
            <div className="bg-white rounded-3xl shadow-card p-6">
              <KnowledgeMapControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                storyPaths={storyPaths}
                activeStoryPath={activeStoryPath}
                onStoryPathSelect={handleStoryPathSelect}
                isStoryPlaying={isStoryPlaying}
                showEdgeWeight={showEdgeWeight}
                onEdgeWeightToggle={setShowEdgeWeight}
                onStoryNext={handleStoryNext}
                onStoryPrevious={handleStoryPrevious}
              />
            </div>

            {/* Panel */}
            {selectedNode && (
              <KnowledgePanel
                node={selectedNode}
                relatedEdges={selectedNodeEdges}
                allNodes={mockNodes}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <a href="/map">
              <Brain className="w-5 h-5" />
              استكشف الخريطة الكاملة
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

