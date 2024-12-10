import { NpmSearchResult } from '@/actions/npm'
import { atom } from 'jotai'

interface SearchParamsType {
  q?: string
  page?: number
  perPage?: number
}

export const SearchParams = atom<SearchParamsType>({})
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
