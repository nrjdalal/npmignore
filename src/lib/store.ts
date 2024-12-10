import { NpmSearchResult } from '@/actions/npm'
import { atom } from 'jotai'

interface SearchParamsType {
  q?: string
  page?: number
  perPage?: number
  sortBy?:
    | 'score'
    | 'downloads_weekly'
    | 'downloads_monthly'
    | 'dependent_count'
    | 'published_at'
}

export const SearchParams = atom<SearchParamsType>({
  q: '',
  page: 0,
  perPage: 100,
  sortBy: 'score',
})
export const Searching = atom<boolean>(false)
export const SearchResults = atom<NpmSearchResult>({
  formData: {
    search: {
      q: { value: '' },
      page: { value: 0 },
      perPage: { value: 0 },
      sortBy: { value: 'score' },
    },
  },
  total: -1,
  objects: [],
})
