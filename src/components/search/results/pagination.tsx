'use client'

import { npmSearch } from '@/actions/npm'
import {
  DefaultSearchParams,
  Searching,
  SearchParams,
  SearchResults,
} from '@/lib/store'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'

export default function Paginantion() {
  const [searchParams, setSearchParams] = useAtom(SearchParams)
  const [searchResults, setSearchResults] = useAtom(SearchResults)
  const [searching, setSearching] = useAtom(Searching)

  const mutation = useMutation({
    mutationFn: async () => {
      setSearching(true)
      setSearchResults(await npmSearch(searchParams))
      setSearching(false)
      return true
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const info = {
    total: searchResults.total,
    page: searchParams.page || DefaultSearchParams.page,
    perPage: searchParams.perPage || DefaultSearchParams.perPage,
    lastPage:
      Math.ceil(
        searchResults.total /
          (searchParams.perPage || DefaultSearchParams.perPage),
      ) - 1,
  }

  const data = {
    prev: info.page - 1 == -1 ? null : info.page - 1,
    next: info.page + 1 > info.lastPage ? null : info.page + 1,
  }

  return (
    <div className="flex space-x-2 pt-8">
      <button
        className={cn(
          'rounded bg-primary px-4 py-1 text-sm text-background',
          data.prev === null && 'cursor-not-allowed opacity-50',
        )}
        disabled={data.prev === null}
        onClick={async () => {
          if (searchParams.page === 0) return
          if (searching) return
          setSearchParams({
            ...searchParams,
            page: data.prev !== null ? data.prev : undefined,
          })
          mutation.mutateAsync()
        }}
      >
        Previous
      </button>
      {info.lastPage + 1 > 6 ? (
        <>
          {Array.from({ length: 3 }, (_, index) => (
            <button
              key={index}
              className={cn(
                'hidden rounded bg-primary px-4 py-1 text-sm text-background sm:inline',
                index === info.page && 'font-bold',
              )}
              onClick={async () => {
                if (searching) return
                setSearchParams({
                  ...searchParams,
                  page: index,
                })
                mutation.mutateAsync()
              }}
            >
              {index + 1}
            </button>
          ))}
          <span className="hidden sm:inline">...</span>
          {Array.from({ length: 3 }, (_, index) => (
            <button
              key={info.lastPage - 2 + index}
              className={cn(
                'hidden rounded bg-primary px-4 py-1 text-sm text-background sm:inline',
                info.lastPage - 2 + index === info.page && 'font-bold',
              )}
              onClick={async () => {
                if (searching) return
                setSearchParams({
                  ...searchParams,
                  page: info.lastPage - 2 + index,
                })
                mutation.mutateAsync()
              }}
            >
              {info.lastPage - 2 + index + 1}
            </button>
          ))}
        </>
      ) : (
        Array.from({ length: info.lastPage + 1 }, (_, index) => (
          <button
            key={index}
            className={cn(
              'hidden rounded bg-primary px-4 py-1 text-sm text-background sm:inline',
              index === info.page && 'font-bold',
            )}
            onClick={async () => {
              if (searching) return
              setSearchParams({
                ...searchParams,
                page: index,
              })
              mutation.mutateAsync()
            }}
          >
            {index + 1}
          </button>
        ))
      )}
      <button
        className={cn(
          'rounded bg-primary px-4 py-1 text-sm text-background',
          data.next === null && 'cursor-not-allowed opacity-50',
        )}
        disabled={data.next === null}
        onClick={async () => {
          if (searchParams.page === info.lastPage) return
          if (searching) return
          setSearchParams({
            ...searchParams,
            page: data.next !== null ? data.next : undefined,
          })
          mutation.mutateAsync()
        }}
      >
        Next
      </button>
    </div>
  )
}
