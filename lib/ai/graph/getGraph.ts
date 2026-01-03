/**
 * Knowledge Graph Query Service
 * Retrieves and filters the knowledge graph
 */

import type {
  KnowledgeGraph,
  GraphNode,
  GraphEdge,
  GraphQueryResult,
  NodeType
} from '../shared/types'
import { buildFullGraph, calculateNodePositions } from './buildGraph'
import { prisma } from '@/lib/db'

// In-memory cache for the graph
let cachedGraph: KnowledgeGraph | null = null
let cacheTimestamp: Date | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Get the full knowledge graph
 */
export async function getFullGraph(forceRefresh: boolean = false): Promise<KnowledgeGraph> {
  // Check cache
  if (!forceRefresh && cachedGraph && cacheTimestamp) {
    const cacheAge = Date.now() - cacheTimestamp.getTime()
    if (cacheAge < CACHE_TTL) {
      return cachedGraph
    }
  }

  // Build fresh graph
  const graph = await buildFullGraph()
  const positionedGraph = calculateNodePositions(graph)

  // Update cache
  cachedGraph = positionedGraph
  cacheTimestamp = new Date()

  return positionedGraph
}

/**
 * Get graph filtered by node type
 */
export async function getGraphByType(types: NodeType[]): Promise<KnowledgeGraph> {
  const fullGraph = await getFullGraph()

  const filteredNodes = fullGraph.nodes.filter(node => types.includes(node.type))
  const nodeIds = new Set(filteredNodes.map(n => n.id))

  const filteredEdges = fullGraph.edges.filter(edge =>
    nodeIds.has(edge.source) && nodeIds.has(edge.target)
  )

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
    metadata: {
      nodeCount: filteredNodes.length,
      edgeCount: filteredEdges.length,
      lastUpdated: fullGraph.metadata.lastUpdated,
      version: fullGraph.metadata.version
    }
  }
}

/**
 * Get subgraph around a specific node
 */
export async function getNodeSubgraph(
  nodeId: string,
  depth: number = 1
): Promise<GraphQueryResult> {
  const fullGraph = await getFullGraph()

  // Find the target node
  const targetNode = fullGraph.nodes.find(n => n.id === nodeId)
  if (!targetNode) {
    throw new Error(`Node not found: ${nodeId}`)
  }

  // BFS to find neighbors up to specified depth
  const visited = new Set<string>([nodeId])
  const queue: { id: string; depth: number }[] = [{ id: nodeId, depth: 0 }]
  const neighbors: GraphNode[] = []
  const relevantEdges: GraphEdge[] = []

  while (queue.length > 0) {
    const current = queue.shift()!
    
    if (current.depth >= depth) continue

    // Find all edges connected to current node
    for (const edge of fullGraph.edges) {
      let neighborId: string | null = null

      if (edge.source === current.id && !visited.has(edge.target)) {
        neighborId = edge.target
        relevantEdges.push(edge)
      } else if (edge.target === current.id && !visited.has(edge.source)) {
        neighborId = edge.source
        relevantEdges.push(edge)
      }

      if (neighborId) {
        visited.add(neighborId)
        queue.push({ id: neighborId, depth: current.depth + 1 })

        const neighborNode = fullGraph.nodes.find(n => n.id === neighborId)
        if (neighborNode) {
          neighbors.push(neighborNode)
        }
      }
    }
  }

  // Get related books, episodes, speakers
  const relatedBooks = neighbors
    .filter(n => n.type === 'book')
    .map(n => ({
      id: n.properties.originalId as string,
      title: n.label,
      titleAr: n.labelAr,
      author: n.properties.author as string,
      mentionedAt: [],
      relevance: 1,
      context: ''
    }))

  const relatedEpisodes = neighbors
    .filter(n => n.type === 'episode')
    .map(n => ({
      id: n.properties.originalId as string,
      title: n.label,
      titleAr: n.labelAr,
      date: n.properties.date as Date
    }))

  const relatedSpeakers = neighbors
    .filter(n => n.type === 'speaker')
    .map(n => ({
      id: n.properties.originalId as string,
      name: n.label
    }))

  return {
    node: targetNode,
    neighbors,
    edges: relevantEdges,
    relatedBooks,
    relatedEpisodes,
    relatedSpeakers
  }
}

/**
 * Search nodes by label
 */
export async function searchNodes(
  query: string,
  types?: NodeType[]
): Promise<GraphNode[]> {
  const fullGraph = await getFullGraph()

  const normalizedQuery = query.toLowerCase().trim()

  return fullGraph.nodes.filter(node => {
    // Filter by type if specified
    if (types && types.length > 0 && !types.includes(node.type)) {
      return false
    }

    // Match by label
    return (
      node.label.toLowerCase().includes(normalizedQuery) ||
      node.labelAr.toLowerCase().includes(normalizedQuery)
    )
  })
}

/**
 * Get most connected nodes
 */
export async function getMostConnectedNodes(
  limit: number = 10,
  type?: NodeType
): Promise<{ node: GraphNode; connections: number }[]> {
  const fullGraph = await getFullGraph()

  // Count connections for each node
  const connectionCounts = new Map<string, number>()

  for (const edge of fullGraph.edges) {
    connectionCounts.set(
      edge.source,
      (connectionCounts.get(edge.source) || 0) + 1
    )
    connectionCounts.set(
      edge.target,
      (connectionCounts.get(edge.target) || 0) + 1
    )
  }

  // Filter and sort nodes
  let nodes = fullGraph.nodes
  if (type) {
    nodes = nodes.filter(n => n.type === type)
  }

  const nodesWithCounts = nodes.map(node => ({
    node,
    connections: connectionCounts.get(node.id) || 0
  }))

  nodesWithCounts.sort((a, b) => b.connections - a.connections)

  return nodesWithCounts.slice(0, limit)
}

/**
 * Get path between two nodes
 */
export async function findPath(
  sourceId: string,
  targetId: string,
  maxDepth: number = 5
): Promise<{ path: GraphNode[]; edges: GraphEdge[] } | null> {
  const fullGraph = await getFullGraph()

  // BFS to find shortest path
  const visited = new Set<string>()
  const queue: { nodeId: string; path: string[]; edges: GraphEdge[] }[] = [
    { nodeId: sourceId, path: [sourceId], edges: [] }
  ]

  while (queue.length > 0) {
    const current = queue.shift()!

    if (current.nodeId === targetId) {
      // Found path
      const pathNodes = current.path.map(id =>
        fullGraph.nodes.find(n => n.id === id)!
      )
      return { path: pathNodes, edges: current.edges }
    }

    if (current.path.length > maxDepth) continue
    if (visited.has(current.nodeId)) continue

    visited.add(current.nodeId)

    // Find neighbors
    for (const edge of fullGraph.edges) {
      let neighborId: string | null = null

      if (edge.source === current.nodeId) {
        neighborId = edge.target
      } else if (edge.target === current.nodeId) {
        neighborId = edge.source
      }

      if (neighborId && !visited.has(neighborId)) {
        queue.push({
          nodeId: neighborId,
          path: [...current.path, neighborId],
          edges: [...current.edges, edge]
        })
      }
    }
  }

  return null
}

/**
 * Get graph statistics
 */
export async function getGraphStats(): Promise<{
  totalNodes: number
  totalEdges: number
  nodesByType: Record<NodeType, number>
  avgConnections: number
  density: number
}> {
  const fullGraph = await getFullGraph()

  // Count nodes by type
  const nodesByType: Record<NodeType, number> = {
    'episode': 0,
    'book': 0,
    'speaker': 0,
    'concept': 0,
    'quote': 0,
    'topic': 0
  }

  for (const node of fullGraph.nodes) {
    nodesByType[node.type]++
  }

  // Calculate average connections
  const connectionCounts: number[] = []
  const connectionMap = new Map<string, number>()

  for (const edge of fullGraph.edges) {
    connectionMap.set(edge.source, (connectionMap.get(edge.source) || 0) + 1)
    connectionMap.set(edge.target, (connectionMap.get(edge.target) || 0) + 1)
  }

  for (const count of connectionMap.values()) {
    connectionCounts.push(count)
  }

  const avgConnections = connectionCounts.length > 0
    ? connectionCounts.reduce((a, b) => a + b, 0) / connectionCounts.length
    : 0

  // Calculate density (edges / possible edges)
  const n = fullGraph.nodes.length
  const maxEdges = (n * (n - 1)) / 2
  const density = maxEdges > 0 ? fullGraph.edges.length / maxEdges : 0

  return {
    totalNodes: fullGraph.nodes.length,
    totalEdges: fullGraph.edges.length,
    nodesByType,
    avgConnections: Math.round(avgConnections * 100) / 100,
    density: Math.round(density * 10000) / 10000
  }
}

/**
 * Invalidate graph cache
 */
export function invalidateGraphCache(): void {
  cachedGraph = null
  cacheTimestamp = null
}

export default getFullGraph

