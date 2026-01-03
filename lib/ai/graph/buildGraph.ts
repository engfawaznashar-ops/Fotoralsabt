/**
 * Knowledge Graph Builder Service
 * Builds nodes and edges for the knowledge graph
 */

import type {
  GraphNode,
  GraphEdge,
  KnowledgeGraph,
  NodeType,
  EdgeType,
  EpisodeAnalysis,
  TopicData,
  BookData,
  SpeakerData,
  QuoteData
} from '../shared/types'
import { generateId } from '../shared/utils'
import { prisma } from '@/lib/db'

// ============================================
// NODE BUILDERS
// ============================================

/**
 * Build episode node
 */
export function buildEpisodeNode(episode: {
  id: string
  title: string
  titleAr?: string
  date?: Date
}): GraphNode {
  return {
    id: `episode-${episode.id}`,
    type: 'episode',
    label: episode.title,
    labelAr: episode.titleAr || episode.title,
    properties: {
      originalId: episode.id,
      date: episode.date,
      nodeType: 'episode'
    }
  }
}

/**
 * Build book node
 */
export function buildBookNode(book: BookData): GraphNode {
  return {
    id: `book-${book.id}`,
    type: 'book',
    label: book.title,
    labelAr: book.titleAr,
    properties: {
      originalId: book.id,
      author: book.author,
      category: book.category,
      relevance: book.relevance
    },
    color: '#27AE60' // Green for books
  }
}

/**
 * Build speaker node
 */
export function buildSpeakerNode(speaker: SpeakerData): GraphNode {
  return {
    id: `speaker-${speaker.id}`,
    type: 'speaker',
    label: speaker.name,
    labelAr: speaker.name,
    properties: {
      originalId: speaker.id,
      sentiment: speaker.sentiment,
      speakingTime: speaker.speakingTime
    },
    color: '#4F4F4F' // Dark gray for speakers
  }
}

/**
 * Build concept/topic node
 */
export function buildConceptNode(topic: TopicData): GraphNode {
  return {
    id: `concept-${topic.id}`,
    type: 'concept',
    label: topic.name,
    labelAr: topic.nameAr,
    properties: {
      originalId: topic.id,
      confidence: topic.confidence,
      relevance: topic.relevance,
      mentions: topic.mentions,
      relatedConcepts: topic.relatedConcepts
    },
    color: '#F2C94C', // Yellow for concepts
    size: 30 + topic.relevance * 20 // Size based on relevance
  }
}

/**
 * Build quote node
 */
export function buildQuoteNode(quote: QuoteData): GraphNode {
  return {
    id: `quote-${quote.id}`,
    type: 'quote',
    label: quote.text.slice(0, 50) + (quote.text.length > 50 ? '...' : ''),
    labelAr: quote.textAr.slice(0, 50) + (quote.textAr.length > 50 ? '...' : ''),
    properties: {
      originalId: quote.id,
      fullText: quote.text,
      speaker: quote.speaker,
      timestamp: quote.timestamp,
      impact: quote.impact,
      themes: quote.themes
    },
    color: '#9B51E0' // Purple for quotes
  }
}

// ============================================
// EDGE BUILDERS
// ============================================

/**
 * Build edge between nodes
 */
export function buildEdge(
  sourceId: string,
  targetId: string,
  type: EdgeType,
  weight: number = 1,
  properties?: Record<string, unknown>
): GraphEdge {
  return {
    id: generateId(),
    source: sourceId,
    target: targetId,
    type,
    weight,
    properties
  }
}

/**
 * Build edges from episode analysis
 */
export function buildEdgesFromAnalysis(analysis: EpisodeAnalysis): GraphEdge[] {
  const edges: GraphEdge[] = []
  const episodeNodeId = `episode-${analysis.episodeId}`

  // Episode -> Books
  for (const book of analysis.books) {
    edges.push(buildEdge(
      episodeNodeId,
      `book-${book.id}`,
      'discusses',
      book.relevance,
      { mentionedAt: book.mentionedAt }
    ))
  }

  // Episode -> Speakers
  for (const speaker of analysis.speakers) {
    edges.push(buildEdge(
      `speaker-${speaker.id}`,
      episodeNodeId,
      'appears_in',
      speaker.speakingTime / 60, // weight by minutes
      { speakingTime: speaker.speakingTime }
    ))
  }

  // Episode -> Topics
  for (const topic of analysis.topics) {
    edges.push(buildEdge(
      episodeNodeId,
      `concept-${topic.id}`,
      'discusses',
      topic.relevance
    ))
  }

  // Quotes -> Episode, Speaker, Book
  for (const quote of analysis.quotes) {
    edges.push(buildEdge(
      `quote-${quote.id}`,
      episodeNodeId,
      'quoted_in',
      quote.impact / 100
    ))

    if (quote.speaker) {
      edges.push(buildEdge(
        `speaker-${quote.speaker}`,
        `quote-${quote.id}`,
        'speaks_about',
        0.8
      ))
    }

    if (quote.bookId) {
      edges.push(buildEdge(
        `quote-${quote.id}`,
        `book-${quote.bookId}`,
        'related_to',
        0.7
      ))
    }
  }

  // Speaker -> Book (if speaker mentioned the book)
  for (const speaker of analysis.speakers) {
    for (const book of analysis.books) {
      edges.push(buildEdge(
        `speaker-${speaker.id}`,
        `book-${book.id}`,
        'mentions',
        0.5
      ))
    }
  }

  // Topic -> Topic (related concepts)
  for (const topic of analysis.topics) {
    for (const relatedConcept of topic.relatedConcepts) {
      const relatedTopic = analysis.topics.find(t => 
        t.name === relatedConcept || t.nameAr === relatedConcept
      )
      if (relatedTopic) {
        edges.push(buildEdge(
          `concept-${topic.id}`,
          `concept-${relatedTopic.id}`,
          'related_to',
          0.6
        ))
      }
    }
  }

  return edges
}

// ============================================
// GRAPH BUILDER
// ============================================

/**
 * Build complete knowledge graph from episode analysis
 */
export function buildGraphFromAnalysis(analysis: EpisodeAnalysis): KnowledgeGraph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // Build episode node
  nodes.push(buildEpisodeNode({
    id: analysis.episodeId,
    title: analysis.title,
    titleAr: analysis.title
  }))

  // Build book nodes
  for (const book of analysis.books) {
    nodes.push(buildBookNode(book))
  }

  // Build speaker nodes
  for (const speaker of analysis.speakers) {
    nodes.push(buildSpeakerNode(speaker))
  }

  // Build concept nodes
  for (const topic of analysis.topics) {
    nodes.push(buildConceptNode(topic))
  }

  // Build quote nodes
  for (const quote of analysis.quotes) {
    nodes.push(buildQuoteNode(quote))
  }

  // Build edges
  edges.push(...buildEdgesFromAnalysis(analysis))

  return {
    nodes,
    edges,
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      lastUpdated: new Date(),
      version: '1.0'
    }
  }
}

/**
 * Merge two knowledge graphs
 */
export function mergeGraphs(graph1: KnowledgeGraph, graph2: KnowledgeGraph): KnowledgeGraph {
  // Merge nodes (deduplicate by id)
  const nodeMap = new Map<string, GraphNode>()
  
  for (const node of [...graph1.nodes, ...graph2.nodes]) {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, node)
    }
  }

  // Merge edges (deduplicate by source+target+type)
  const edgeMap = new Map<string, GraphEdge>()
  
  for (const edge of [...graph1.edges, ...graph2.edges]) {
    const key = `${edge.source}-${edge.target}-${edge.type}`
    if (!edgeMap.has(key)) {
      edgeMap.set(key, edge)
    } else {
      // Combine weights for duplicate edges
      const existing = edgeMap.get(key)!
      existing.weight = Math.max(existing.weight, edge.weight)
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values()),
    metadata: {
      nodeCount: nodeMap.size,
      edgeCount: edgeMap.size,
      lastUpdated: new Date(),
      version: '1.0'
    }
  }
}

/**
 * Build full knowledge graph from database
 */
export async function buildFullGraph(): Promise<KnowledgeGraph> {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  try {
    // Fetch all episodes
    const episodes = await prisma.episode.findMany({
      include: {
        books: { include: { book: true } },
        speakers: { include: { speaker: true } },
        quotes: true
      }
    })

    for (const episode of episodes) {
      // Add episode node
      nodes.push(buildEpisodeNode({
        id: episode.id,
        title: episode.title,
        date: episode.date
      }))

      // Add book nodes and edges
      for (const bookEpisode of episode.books) {
        const bookId = `book-${bookEpisode.book.id}`
        if (!nodes.find(n => n.id === bookId)) {
          nodes.push({
            id: bookId,
            type: 'book',
            label: bookEpisode.book.title,
            labelAr: bookEpisode.book.title,
            properties: {
              originalId: bookEpisode.book.id,
              author: bookEpisode.book.author
            },
            color: '#27AE60'
          })
        }
        edges.push(buildEdge(`episode-${episode.id}`, bookId, 'discusses', 1))
      }

      // Add speaker nodes and edges
      for (const speakerEpisode of episode.speakers) {
        const speakerId = `speaker-${speakerEpisode.speaker.id}`
        if (!nodes.find(n => n.id === speakerId)) {
          nodes.push({
            id: speakerId,
            type: 'speaker',
            label: speakerEpisode.speaker.name,
            labelAr: speakerEpisode.speaker.name,
            properties: {
              originalId: speakerEpisode.speaker.id
            },
            color: '#4F4F4F'
          })
        }
        edges.push(buildEdge(speakerId, `episode-${episode.id}`, 'appears_in', 1))
      }

      // Add quote nodes and edges
      for (const quote of episode.quotes) {
        const quoteId = `quote-${quote.id}`
        nodes.push({
          id: quoteId,
          type: 'quote',
          label: quote.text.slice(0, 50),
          labelAr: quote.text.slice(0, 50),
          properties: {
            originalId: quote.id,
            fullText: quote.text
          },
          color: '#9B51E0'
        })
        edges.push(buildEdge(quoteId, `episode-${episode.id}`, 'quoted_in', 1))
      }
    }

  } catch (error) {
    console.error('Error building full graph:', error)
  }

  return {
    nodes,
    edges,
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      lastUpdated: new Date(),
      version: '1.0'
    }
  }
}

/**
 * Calculate node positions using force-directed layout
 */
export function calculateNodePositions(graph: KnowledgeGraph): KnowledgeGraph {
  // Simple grid-based positioning (in production, use d3-force or similar)
  const nodesByType = new Map<NodeType, GraphNode[]>()
  
  for (const node of graph.nodes) {
    if (!nodesByType.has(node.type)) {
      nodesByType.set(node.type, [])
    }
    nodesByType.get(node.type)!.push(node)
  }

  // Position nodes by type in different regions
  const typePositions: Record<NodeType, { startX: number; startY: number }> = {
    'episode': { startX: 100, startY: 100 },
    'book': { startX: 400, startY: 100 },
    'speaker': { startX: 100, startY: 300 },
    'concept': { startX: 400, startY: 300 },
    'quote': { startX: 250, startY: 500 },
    'topic': { startX: 550, startY: 200 }
  }

  for (const [type, nodes] of nodesByType.entries()) {
    const pos = typePositions[type]
    nodes.forEach((node, idx) => {
      node.x = pos.startX + (idx % 5) * 80
      node.y = pos.startY + Math.floor(idx / 5) * 60
      node.size = node.size || 30
    })
  }

  return graph
}

export default buildGraphFromAnalysis

