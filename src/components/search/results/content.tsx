'use client'

import { npmSearch } from '@/actions/npm'
import { Searching } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import Link from 'next/link'

export default function Content({
  searchParams,
  name,
  description,
  keywords,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
  name: string
  description: string
  keywords: string[]
}) {
  const [searching, setSearching] = useAtom(Searching)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (keyword: string) => {
      return await npmSearch({
        ...searchParams,
        q: `keyword:${keyword}`,
      })
    },
    onSuccess: (data) => {
      setSearching(false)
      queryClient.setQueryData(['search'], data)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return (
    <div className="space-y-2">
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div
        className={cn(
          'mt-2 flex flex-wrap gap-2',
          !keywords.length && 'hidden',
        )}
      >
        {keywords.slice(0, 14).map((keyword) => (
          <span
            key={keyword}
            className={cn(
              'rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground',
              searching && 'cursor-not-allowed',
            )}
          >
            <button
              onClick={() => {
                if (searching) return
                setSearching(true)
                mutation.mutate(keyword)
                const params = new URLSearchParams(window.location.search)
                params.set('q', `keyword:${keyword}`)
                window.history.replaceState(
                  {},
                  '',
                  `${window.location.pathname}?${params}`,
                )
              }}
            >
              {keyword}
            </button>
          </span>
        ))}
        {keywords.length > 13 && (
          <Link
            href={'https://www.npmjs.com/package/' + name}
            className="rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground"
            target="_blank"
          >
            View {keywords.length - 13} more
          </Link>
        )}
      </div>
    </div>
  )
}
