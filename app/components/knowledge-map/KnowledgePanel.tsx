'use client'

import { X, BookOpen, Mic, User, Lightbulb, Play, ExternalLink, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import type { Node, Edge } from './types'
import { Button } from '../ui/button'

interface KnowledgePanelProps {
  node: Node
  relatedEdges: Edge[]
  allNodes: Node[]
  onClose: () => void
}

const getNodeIcon = (type: Node['type']) => {
  const iconProps = { className: 'w-5 h-5' }
  switch (type) {
    case 'فكرة': return <Lightbulb {...iconProps} />
    case 'كتاب': return <BookOpen {...iconProps} />
    case 'حلقة': return <Mic {...iconProps} />
    case 'متحدث': return <User {...iconProps} />
  }
}

const getNodeColor = (type: Node['type']): string => {
  const colors = {
    'فكرة': '#F2C94C',
    'كتاب': '#2D9CDB',
    'حلقة': '#27AE60',
    'متحدث': '#EB5757'
  }
  return colors[type]
}

const getNodeBadgeStyle = (type: Node['type']) => {
  const styles = {
    'فكرة': 'bg-brand-yellow/20 text-brand-black',
    'كتاب': 'bg-blue-100 text-blue-700',
    'حلقة': 'bg-green-100 text-green-700',
    'متحدث': 'bg-red-100 text-red-700'
  }
  return styles[type]
}

export function KnowledgePanel({ node, relatedEdges, allNodes, onClose }: KnowledgePanelProps) {
  const [copied, setCopied] = useState(false)

  // الحصول على العقد المرتبطة حسب النوع
  const getRelatedByType = (type: Node['type']) => {
    const relatedIds = relatedEdges
      .filter(e => e.source === node.id || e.target === node.id)
      .map(e => e.source === node.id ? e.target : e.source)
    
    return allNodes.filter(n => n.type === type && relatedIds.includes(n.id))
  }

  const relatedBooks = getRelatedByType('كتاب')
  const relatedEpisodes = getRelatedByType('حلقة')
  const relatedSpeakers = getRelatedByType('متحدث')
  const relatedIdeas = getRelatedByType('فكرة')

  // الحصول على أهم الروابط مع الأسباب
  const topConnections = relatedEdges
    .filter(e => e.source === node.id || e.target === node.id)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4)
    .map(edge => {
      const connectedNodeId = edge.source === node.id ? edge.target : edge.source
      const connectedNode = allNodes.find(n => n.id === connectedNodeId)
      return { edge, connectedNode }
    })
    .filter(item => item.connectedNode)

  const handleCopy = () => {
    const text = `${node.label}: ${node.description || ''}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full lg:w-96 bg-white rounded-3xl shadow-card-hover p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getNodeColor(node.type) }}
          >
            {getNodeIcon(node.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-changa font-bold text-xl text-brand-black">{node.label}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-tajawal ${getNodeBadgeStyle(node.type)}`}>
                {node.type}
              </span>
            </div>
            {node.meta?.author && (
              <p className="text-sm text-brand-gray font-tajawal">بقلم: {node.meta.author}</p>
            )}
            {node.meta?.episodeNumber && (
              <p className="text-sm text-brand-gray font-tajawal">الحلقة #{node.meta.episodeNumber}</p>
            )}
            {node.meta?.expertise && (
              <p className="text-sm text-brand-gray font-tajawal">{node.meta.expertise}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brand-sand hover:bg-brand-yellow/30 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4 text-brand-gray" />
        </button>
      </div>

      {/* Description */}
      {node.description && (
        <p className="text-sm font-tajawal text-brand-gray leading-relaxed mb-4 pb-4 border-b border-brand-sand">
          {node.description}
        </p>
      )}

      {/* Stats */}
      {node.stats && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-brand-sand">
          {node.stats.episodeCount && (
            <div className="inline-flex items-center gap-1.5 bg-brand-sand px-3 py-1.5 rounded-lg">
              <Mic className="w-3.5 h-3.5 text-brand-gray" />
              <span className="text-xs font-tajawal text-brand-gray">{node.stats.episodeCount} حلقات</span>
            </div>
          )}
          {node.stats.mentionCount && (
            <div className="inline-flex items-center gap-1.5 bg-brand-sand px-3 py-1.5 rounded-lg">
              <span className="text-xs font-tajawal text-brand-gray">{node.stats.mentionCount} ذِكر</span>
            </div>
          )}
          {node.stats.duration && (
            <div className="inline-flex items-center gap-1.5 bg-brand-sand px-3 py-1.5 rounded-lg">
              <span className="text-xs font-tajawal text-brand-gray">المدة: {node.stats.duration}</span>
            </div>
          )}
        </div>
      )}

      {/* لماذا مرتبطة؟ */}
      {topConnections.length > 0 && (
        <div className="mb-4">
          <h4 className="font-changa font-bold text-sm text-brand-black mb-3">لماذا مرتبطة؟</h4>
          <div className="space-y-2">
            {topConnections.map(({ edge, connectedNode }) => (
              <div key={edge.id} className="bg-brand-sand/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: getNodeColor(connectedNode!.type) }}>
                    {getNodeIcon(connectedNode!.type)}
                  </div>
                  <span className="text-sm font-tajawal font-medium text-brand-black">{connectedNode!.label}</span>
                </div>
                <p className="text-xs font-tajawal text-brand-gray leading-relaxed">{edge.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الاقتراحات */}
      <div className="mb-4">
        <h4 className="font-changa font-bold text-sm text-brand-black mb-3">اقتراحات مرتبطة</h4>
        <div className="space-y-3">
          {/* كتب */}
          {relatedBooks.length > 0 && (
            <div>
              <p className="text-xs text-brand-gray font-tajawal mb-2 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> كتب ({relatedBooks.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {relatedBooks.slice(0, 3).map(book => (
                  <a
                    key={book.id}
                    href="#"
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-tajawal transition-colors"
                  >
                    {book.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* حلقات */}
          {relatedEpisodes.length > 0 && (
            <div>
              <p className="text-xs text-brand-gray font-tajawal mb-2 flex items-center gap-1">
                <Mic className="w-3 h-3" /> حلقات ({relatedEpisodes.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {relatedEpisodes.slice(0, 3).map(ep => (
                  <a
                    key={ep.id}
                    href="#"
                    className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-tajawal transition-colors"
                  >
                    {ep.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* متحدثون */}
          {relatedSpeakers.length > 0 && (
            <div>
              <p className="text-xs text-brand-gray font-tajawal mb-2 flex items-center gap-1">
                <User className="w-3 h-3" /> متحدثون ({relatedSpeakers.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {relatedSpeakers.slice(0, 3).map(speaker => (
                  <a
                    key={speaker.id}
                    href="#"
                    className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg font-tajawal transition-colors"
                  >
                    {speaker.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* أفكار */}
          {relatedIdeas.length > 0 && (
            <div>
              <p className="text-xs text-brand-gray font-tajawal mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> أفكار ({relatedIdeas.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {relatedIdeas.slice(0, 3).map(idea => (
                  <a
                    key={idea.id}
                    href="#"
                    className="text-xs bg-brand-sand hover:bg-brand-yellow/30 text-brand-black px-2.5 py-1 rounded-lg font-tajawal transition-colors"
                  >
                    {idea.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {node.type === 'حلقة' && (
          <Button size="sm" className="gap-2 flex-1">
            <Play className="w-3.5 h-3.5" />
            استمع للحلقة
          </Button>
        )}
        {node.type === 'كتاب' && (
          <Button size="sm" variant="outline" className="gap-2 flex-1">
            <BookOpen className="w-3.5 h-3.5" />
            تصفح الكتاب
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              نسخ
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

