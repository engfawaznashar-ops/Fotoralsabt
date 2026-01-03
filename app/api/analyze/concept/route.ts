/**
 * Concept Analysis API Endpoint
 * Analyzes a concept and returns related content
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { openaiLLM } from '@/lib/ai/shared/llm'
import { extractJSONFromResponse } from '@/lib/ai/shared/utils'
import { semanticSearch } from '@/lib/ai/embeddings/semanticSearch'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { concept, depth = 'shallow', includeRelated = true } = body

    if (!concept) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_CONCEPT',
          message: 'Concept is required',
          messageAr: 'المفهوم مطلوب'
        }),
        { status: 400 }
      )
    }

    // Generate AI explanation
    const depthLabel = depth === 'deep' ? 'مفصلاً' : 'مختصراً'
    const detailedInstructions = depth === 'deep' 
      ? `اشرح:
1. التعريف
2. الأهمية
3. التطبيقات العملية
4. الأمثلة
5. المفاهيم المرتبطة` 
      : 'قدم تعريفاً موجزاً وأهميته.'

    const prompt = `قدم شرحاً ${depthLabel} لمفهوم "${concept}".

${detailedInstructions}

أجب بصيغة JSON:
{
  "definition": "التعريف",
  "definitionAr": "التعريف بالعربية",
  "importance": "الأهمية",
  "importanceAr": "الأهمية بالعربية",
  "examples": ["مثال1", "مثال2"],
  "applications": ["تطبيق1", "تطبيق2"],
  "relatedConcepts": ["مفهوم1", "مفهوم2"]
}`

    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const explanation = JSON.parse(json)

    // Find related content if requested
    let relatedContent: any = {}

    if (includeRelated) {
      // Search episodes
      const episodes = await prisma.episode.findMany({
        where: {
          OR: [
            { title: { contains: concept } },
            { topicsAI: { contains: concept } },
            { summaryAI: { contains: concept } }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          summaryAI: true
        }
      })

      // Search books
      const books = await prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: concept } },
            { description: { contains: concept } }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          author: true
        }
      })

      // Search quotes
      const quotes = await prisma.quote.findMany({
        where: {
          text: { contains: concept }
        },
        take: 5,
        include: {
          speaker: { select: { name: true } }
        }
      })

      relatedContent = {
        episodes: episodes.map(e => ({
          id: e.id,
          title: e.title,
          snippet: e.summaryAI?.slice(0, 150)
        })),
        books: books.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author
        })),
        quotes: quotes.map(q => ({
          id: q.id,
          text: q.text.slice(0, 200),
          speaker: q.speaker?.name
        }))
      }
    }

    return NextResponse.json(
      createAPIResponse(true, {
        concept,
        explanation,
        relatedContent,
        analyzedAt: new Date().toISOString()
      })
    )

  } catch (error) {
    console.error('Concept analysis error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'ANALYSIS_ERROR',
        message: 'Failed to analyze concept',
        messageAr: 'فشل في تحليل المفهوم'
      }),
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const concept = searchParams.get('concept')

  if (!concept) {
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'MISSING_CONCEPT',
        message: 'Concept query parameter is required',
        messageAr: 'معامل المفهوم مطلوب'
      }),
      { status: 400 }
    )
  }

  // Redirect to POST with default options
  const body = {
    concept,
    depth: searchParams.get('depth') || 'shallow',
    includeRelated: searchParams.get('includeRelated') !== 'false'
  }

  // Create a mock request for POST handler
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return POST(postRequest)
}

