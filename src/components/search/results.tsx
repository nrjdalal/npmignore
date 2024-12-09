'use client'

import { npmSearch } from '@/actions/npm'
import { useQuery } from '@tanstack/react-query'

export default function SearchResults({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search'],
    queryFn: async () => {
      return await npmSearch(searchParams)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return <pre className="mt-4">{JSON.stringify(data?.objects, null, 2)}</pre>
}
