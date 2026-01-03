/**
 * Audio Upload API Endpoint
 * Accepts audio files and stores them temporarily
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse, generateId } from '@/lib/ai/shared/utils'

// In production, use cloud storage (S3, GCS, etc.)
const tempStorage = new Map<string, { url: string; uploadedAt: Date; size: number }>()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_FILE',
          message: 'No audio file provided',
          messageAr: 'لم يتم تحميل ملف صوتي'
        }),
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg']
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'INVALID_FILE_TYPE',
          message: 'Invalid audio file type. Allowed: MP3, WAV, M4A, OGG',
          messageAr: 'نوع الملف غير صالح. المسموح: MP3, WAV, M4A, OGG'
        }),
        { status: 400 }
      )
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'FILE_TOO_LARGE',
          message: 'File too large. Maximum size is 500MB',
          messageAr: 'الملف كبير جداً. الحد الأقصى 500 ميجابايت'
        }),
        { status: 400 }
      )
    }

    // Generate unique file ID
    const fileId = generateId()
    const fileName = `${fileId}-${audioFile.name}`

    // In production, upload to cloud storage
    // For now, create a placeholder URL
    const fileUrl = `/api/audio/${fileId}`

    // Store reference
    tempStorage.set(fileId, {
      url: fileUrl,
      uploadedAt: new Date(),
      size: audioFile.size
    })

    // Clean up old files (older than 24 hours)
    cleanupOldFiles()

    return NextResponse.json(
      createAPIResponse(true, {
        fileId,
        fileName,
        url: fileUrl,
        size: audioFile.size,
        type: audioFile.type,
        uploadedAt: new Date().toISOString()
      })
    )

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'UPLOAD_ERROR',
        message: 'Failed to upload file',
        messageAr: 'فشل في تحميل الملف'
      }),
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Return upload status/info
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')

  if (fileId) {
    const file = tempStorage.get(fileId)
    if (file) {
      return NextResponse.json(
        createAPIResponse(true, {
          fileId,
          ...file,
          exists: true
        })
      )
    }
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'FILE_NOT_FOUND',
        message: 'File not found',
        messageAr: 'الملف غير موجود'
      }),
      { status: 404 }
    )
  }

  // Return general info
  return NextResponse.json(
    createAPIResponse(true, {
      maxFileSize: '500MB',
      allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'],
      endpoint: '/api/upload',
      method: 'POST',
      formField: 'audio'
    })
  )
}

function cleanupOldFiles() {
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours
  const now = Date.now()

  for (const [fileId, file] of tempStorage.entries()) {
    if (now - file.uploadedAt.getTime() > maxAge) {
      tempStorage.delete(fileId)
    }
  }
}



