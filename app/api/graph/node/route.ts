/**
 * Graph Node API Endpoint
 * Returns information about a specific node and its neighbors
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { getNodeSubgraph, searchNodes, getMostConnectedNodes, findPath } from '@/lib/ai/graph/getGraph'
import type { NodeType } from '@/lib/ai/shared/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nodeId = searchParams.get('nodeId')
    const search = searchParams.get('search')
    const topConnected = searchParams.get('topConnected')
    const pathFrom = searchParams.get('pathFrom')
    const pathTo = searchParams.get('pathTo')
    const depth = parseInt(searchParams.get('depth') || '1')
    const type = searchParams.get('type') as NodeType | null

    // Search for nodes
    if (search) {
      const types = type ? [type] : undefined
      const results = await searchNodes(search, types)

      return NextResponse.json(
        createAPIResponse(true, {
          query: search,
          results: results.slice(0, 20),
          count: results.length
        })
      )
    }

    // Get top connected nodes
    if (topConnected) {
      const limit = parseInt(topConnected) || 10
      const results = await getMostConnectedNodes(limit, type || undefined)

      return NextResponse.json(
        createAPIResponse(true, {
          topConnected: results,
          type: type || 'all'
        })
      )
    }

    // Find path between nodes
    if (pathFrom && pathTo) {
      const path = await findPath(pathFrom, pathTo, depth)

      if (path) {
        return NextResponse.json(
          createAPIResponse(true, {
            pathFound: true,
            path: path.path.map(n => ({ id: n.id, label: n.label, type: n.type })),
            edges: path.edges,
            pathLength: path.path.length - 1
          })
        )
      } else {
        return NextResponse.json(
          createAPIResponse(true, {
            pathFound: false,
            message: 'No path found between nodes',
            messageAr: 'لم يتم العثور على مسار بين العقدتين'
          })
        )
      }
    }

    // Get node subgraph
    if (!nodeId) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_PARAMS',
          message: 'nodeId, search, topConnected, or pathFrom/pathTo is required',
          messageAr: 'معرف العقدة أو معامل البحث مطلوب'
        }),
        { status: 400 }
      )
    }

    const subgraph = await getNodeSubgraph(nodeId, depth)

    return NextResponse.json(
      createAPIResponse(true, {
        node: subgraph.node,
        neighbors: subgraph.neighbors,
        edges: subgraph.edges,
        relatedContent: {
          books: subgraph.relatedBooks,
          episodes: subgraph.relatedEpisodes,
          speakers: subgraph.relatedSpeakers
        },
        depth
      })
    )

  } catch (error) {
    console.error('Get node error:', error)

    const message = error instanceof Error ? error.message : 'Failed to retrieve node'

    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'NODE_ERROR',
        message,
        messageAr: message.includes('not found') ? 'العقدة غير موجودة' : 'فشل في جلب العقدة'
      }),
      { status: message.includes('not found') ? 404 : 500 }
    )
  }
}



