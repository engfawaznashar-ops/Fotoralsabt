/**
 * User Personalization API Endpoint
 * Builds and retrieves user profiles
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { buildUserProfile, getPersonalizedSummary, updateUserProfile } from '@/lib/ai/recommendations/personalizeUser'
import type { UserProfile } from '@/lib/ai/shared/types'

// In-memory user profiles (use database in production)
const userProfiles = new Map<string, UserProfile>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, personalizationData } = body

    if (!userId) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_USER_ID',
          message: 'User ID is required',
          messageAr: 'معرف المستخدم مطلوب'
        }),
        { status: 400 }
      )
    }

    // Build user profile
    const profile = await buildUserProfile(userId, {
      episodesWatched: personalizationData?.episodesWatched || [],
      booksViewed: personalizationData?.booksViewed || [],
      speakersFollowed: personalizationData?.speakersFollowed || [],
      quotesSaved: personalizationData?.quotesSaved || [],
      searchQueries: personalizationData?.searchQueries || [],
      timeSpentPerEpisode: personalizationData?.timeSpentPerEpisode || []
    })

    // Store profile
    userProfiles.set(userId, profile)

    // Get personalized summary
    const summary = await getPersonalizedSummary(profile)

    return NextResponse.json(
      createAPIResponse(true, {
        userId,
        profile: {
          favoriteTopics: profile.favoriteTopics.slice(0, 5),
          preferredMood: profile.preferredMood,
          preferredTone: profile.preferredTone,
          engagementScore: profile.engagementScore,
          averageWatchDuration: profile.averageWatchDuration,
          preferences: profile.preferences
        },
        summary,
        createdAt: new Date().toISOString()
      })
    )

  } catch (error) {
    console.error('User profile error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'PROFILE_ERROR',
        message: 'Failed to build user profile',
        messageAr: 'فشل في بناء ملف المستخدم'
      }),
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_USER_ID',
          message: 'User ID is required',
          messageAr: 'معرف المستخدم مطلوب'
        }),
        { status: 400 }
      )
    }

    const profile = userProfiles.get(userId)

    if (!profile) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'PROFILE_NOT_FOUND',
          message: 'User profile not found. Create one first with POST.',
          messageAr: 'ملف المستخدم غير موجود. قم بإنشائه أولاً.'
        }),
        { status: 404 }
      )
    }

    const summary = await getPersonalizedSummary(profile)

    return NextResponse.json(
      createAPIResponse(true, {
        userId,
        profile: {
          favoriteTopics: profile.favoriteTopics,
          preferredMood: profile.preferredMood,
          preferredTone: profile.preferredTone,
          engagementScore: profile.engagementScore,
          averageWatchDuration: profile.averageWatchDuration,
          listeningHistory: profile.listeningHistory.slice(0, 10),
          lastActive: profile.lastActive,
          preferences: profile.preferences
        },
        summary
      })
    )

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch user profile',
        messageAr: 'فشل في جلب ملف المستخدم'
      }),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, interaction } = body

    if (!userId || !interaction) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_PARAMS',
          message: 'userId and interaction are required',
          messageAr: 'معرف المستخدم والتفاعل مطلوبان'
        }),
        { status: 400 }
      )
    }

    let profile = userProfiles.get(userId)

    if (!profile) {
      // Create new profile with interaction
      profile = await buildUserProfile(userId, {
        episodesWatched: interaction.type === 'episode' ? [interaction.id] : [],
        booksViewed: interaction.type === 'book' ? [interaction.id] : [],
        speakersFollowed: interaction.type === 'speaker' ? [interaction.id] : [],
        quotesSaved: interaction.type === 'quote' ? [interaction.id] : [],
        searchQueries: interaction.type === 'search' ? [interaction.id] : [],
        timeSpentPerEpisode: []
      })
    } else {
      // Update existing profile
      profile = await updateUserProfile(profile, interaction)
    }

    userProfiles.set(userId, profile)

    return NextResponse.json(
      createAPIResponse(true, {
        userId,
        updated: true,
        engagementScore: profile.engagementScore,
        lastActive: profile.lastActive
      })
    )

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'UPDATE_ERROR',
        message: 'Failed to update user profile',
        messageAr: 'فشل في تحديث ملف المستخدم'
      }),
      { status: 500 }
    )
  }
}



