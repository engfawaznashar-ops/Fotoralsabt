// أنواع العقد في خريطة المعرفة
export type NodeType = 'فكرة' | 'كتاب' | 'حلقة' | 'متحدث'

// عقدة في الخريطة
export interface Node {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  description?: string
  stats?: {
    episodeCount?: number
    mentionCount?: number
    duration?: string
  }
  meta?: {
    author?: string // للكتب
    episodeNumber?: number // للحلقات
    expertise?: string // للمتحدثين
    icon?: string // أيقونة اختيارية
  }
}

// رابط بين عقدتين
export interface Edge {
  id: string
  source: string // node id
  target: string // node id
  weight: 1 | 2 | 3 // قوة العلاقة (1 ضعيف، 3 قوي)
  reason: string // شرح عربي للعلاقة
  tags?: string[] // تصنيفات اختيارية
}

// حالة الخريطة
export interface MapState {
  selectedNode: Node | null
  hoveredNode: Node | null
  highlightedNodes: Set<string>
  highlightedEdges: Set<string>
  activeFilter: NodeType | 'الكل'
  searchQuery: string
  storyMode: StoryPath | null
  transform: {
    scale: number
    translateX: number
    translateY: number
  }
}

// مسار قصصي
export interface StoryPath {
  id: string
  title: string
  description: string
  steps: Array<{
    nodeId: string
    explanation: string
    duration: number // بالثواني
  }>
  currentStep: number
}

// توصيات مرتبطة بعقدة
export interface NodeRecommendations {
  books: Array<{ id: string; title: string; author: string }>
  episodes: Array<{ id: string; title: string; number: number }>
  speakers: Array<{ id: string; name: string; expertise: string }>
  ideas: Array<{ id: string; label: string; description: string }>
}

