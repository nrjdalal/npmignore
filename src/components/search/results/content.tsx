'use client'

import { npmSearch } from '@/actions/npm'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (keyword: string) => {
      return await npmSearch({
        ...searchParams,
        q: `keyword:${keyword}`,
      })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['search'], data)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return (
    <div className="space-y-2">
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      <div
        className={cn(
          'mt-2 flex flex-wrap gap-2',
          !keywords.length && 'hidden',
        )}
      >
        {keywords.slice(0, 14).map((keyword) => (
          <span
            key={keyword}
            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            <button
              // href={`/search?q=keyword:${keyword}`}
              // prefetch={false}
              onClick={() => {
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
            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-zinc-600"
            target="_blank"
          >
            View {keywords.length - 13} more
          </Link>
        )}
      </div>
    </div>
  )
}
