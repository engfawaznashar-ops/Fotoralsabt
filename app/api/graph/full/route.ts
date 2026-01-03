/**
 * Full Knowledge Graph API Endpoint
 * Returns the complete knowledge graph
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { getFullGraph, getGraphStats, getGraphByType } from '@/lib/ai/graph/getGraph'
import type { NodeType } from '@/lib/ai/shared/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const typesParam = searchParams.get('types')
    const includeStats = searchParams.get('includeStats') === 'true'
    const forceRefresh = searchParams.get('forceRefresh') === 'true'

    let graph

    if (typesParam) {
      const types = typesParam.split(',') as NodeType[]
      graph = await getGraphByType(types)
    } else {
      graph = await getFullGraph(forceRefresh)
    }

    let stats = null
    if (includeStats) {
      stats = await getGraphStats()
    }

    return NextResponse.json(
      createAPIResponse(true, {
        graph: {
          nodes: graph.nodes,
          edges: graph.edges
        },
        metadata: graph.metadata,
        stats,
        retrievedAt: new Date().toISOString()
      })
    )

  } catch (error) {
    console.error('Get graph error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'GRAPH_ERROR',
        message: 'Failed to retrieve knowledge graph',
        messageAr: 'فشل في جلب خريطة المعرفة'
      }),
      { status: 500 }
    )
  }
}



