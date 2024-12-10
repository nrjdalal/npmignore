'use client'

import { npmSearch } from '@/actions/npm'
import { Searching, SearchParams } from '@/lib/store'
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
  const [searchParamsState, setSearchParamState] = useAtom<{ q?: string }>(
    SearchParams,
  )

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (keyword: string) => {
      setSearching(true)
      return await npmSearch({
        ...searchParams,
        q: `keyword:${keyword}`,
      })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['search'], data)
      setSearching(false)
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
                if (searching || searchParamsState.q === `keyword:${keyword}`) {
                  return
                }
                setSearchParamState({
                  ...searchParams,
                  q: `keyword:${keyword}`,
                })
                mutation.mutate(keyword)
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
