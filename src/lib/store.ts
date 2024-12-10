import { atomWithStorage } from 'jotai/utils'

export const Searching = atomWithStorage('searching', false)
export const StoredResults = atomWithStorage('storedResults', [])
