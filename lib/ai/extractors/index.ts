/**
 * AI Extractors - Main Export
 */

export { extractTopics, categorizeTopics, findRelatedTopics, analyzeTopicTrends } from './extractTopics'
export { extractBooks, validateBook, suggestBookCategory, findSimilarBooks, generateBookSummary } from './extractBooks'
export { extractSpeakers, identifySpeakerFromAudio, analyzeSpeakerPersona, calculateSpeakerStats, compareSpeakers, mergeDuplicateSpeakers } from './extractSpeakers'
export { extractQuotes, rankQuotes, generateQuoteCard, findSimilarQuotes, analyzeQuoteThemes, validateQuoteInTranscript } from './extractQuotes'
export { extractHighlights, generateTakeaways, rankHighlights, groupHighlightsByTopic, generateHighlightsSummary } from './extractHighlights'
export { extractSentiment, analyzeSegmentSentiments, getMoodColor, getMoodDescription, calculateSentimentTrend } from './extractSentiment'
export { extractChapterTimestamps, refineChapterTitles, mergeShortChapters, generateChapterSummary, formatChaptersForYouTube, formatChaptersForPodcast } from './extractChapterTimestamps'

// Types re-export
export type { ExtractTopicsOptions } from './extractTopics'
export type { ExtractBooksOptions } from './extractBooks'
export type { ExtractSpeakersOptions } from './extractSpeakers'
export type { ExtractQuotesOptions } from './extractQuotes'
export type { ExtractHighlightsOptions } from './extractHighlights'
export type { SentimentAnalysisOptions } from './extractSentiment'
export type { ExtractChaptersOptions } from './extractChapterTimestamps'



