import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
interface Episode {
  id: string
  title: string
  date: Date
  audioUrl?: string
  summaryAI?: string
  topicsAI?: string
}

interface Book {
  id: string
  title: string
  author?: string
  aiCoverUrl?: string
  description?: string
}

interface Speaker {
  id: string
  name: string
  avatarAI?: string
  bioAI?: string
  sentiment?: string
}

interface Quote {
  id: string
  text: string
  episodeId?: string
  speakerId?: string
  bookId?: string
}

interface SearchResult {
  type: 'episode' | 'book' | 'speaker' | 'quote'
  id: string
  title: string
  subtitle?: string
}

// Store Interface
interface AppState {
  // Data
  episodes: Episode[]
  books: Book[]
  speakers: Speaker[]
  quotes: Quote[]
  
  // UI State
  isPlaying: boolean
  currentEpisodeId: string | null
  searchQuery: string
  searchResults: SearchResult[]
  isSearching: boolean
  
  // Actions
  setEpisodes: (episodes: Episode[]) => void
  setBooks: (books: Book[]) => void
  setSpeakers: (speakers: Speaker[]) => void
  setQuotes: (quotes: Quote[]) => void
  
  // Player Actions
  playEpisode: (episodeId: string) => void
  pauseEpisode: () => void
  togglePlay: () => void
  
  // Search Actions
  setSearchQuery: (query: string) => void
  setSearchResults: (results: SearchResult[]) => void
  setIsSearching: (isSearching: boolean) => void
  clearSearch: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Data
      episodes: [],
      books: [],
      speakers: [],
      quotes: [],
      
      // Initial UI State
      isPlaying: false,
      currentEpisodeId: null,
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      
      // Data Actions
      setEpisodes: (episodes) => set({ episodes }),
      setBooks: (books) => set({ books }),
      setSpeakers: (speakers) => set({ speakers }),
      setQuotes: (quotes) => set({ quotes }),
      
      // Player Actions
      playEpisode: (episodeId) => set({ 
        currentEpisodeId: episodeId, 
        isPlaying: true 
      }),
      pauseEpisode: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      // Search Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResults: (results) => set({ searchResults: results }),
      setIsSearching: (isSearching) => set({ isSearching }),
      clearSearch: () => set({ 
        searchQuery: '', 
        searchResults: [], 
        isSearching: false 
      }),
    }),
    {
      name: 'fotor-alsabt-storage',
      partialize: (state) => ({
        currentEpisodeId: state.currentEpisodeId,
      }),
    }
  )
)

// Selectors
export const useCurrentEpisode = () => {
  const episodes = useStore((state) => state.episodes)
  const currentEpisodeId = useStore((state) => state.currentEpisodeId)
  return episodes.find((ep) => ep.id === currentEpisodeId)
}

export const useLatestEpisode = () => {
  const episodes = useStore((state) => state.episodes)
  return episodes.length > 0 
    ? episodes.reduce((latest, ep) => 
        new Date(ep.date) > new Date(latest.date) ? ep : latest
      )
    : null
}



