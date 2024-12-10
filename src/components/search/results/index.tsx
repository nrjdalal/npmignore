'use client'

import { npmSearch } from '@/actions/npm'
import Content from '@/components/search/results/content'
import Header from '@/components/search/results/header'
import { useQuery } from '@tanstack/react-query'

export default function Index({
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

  return (
    <div className="mt-2 min-h-dvh divide-y">
      {data?.objects.map((result) => {
        const pkg = {
          name: result.package.name,
          downloads: result.package.downloads,
          url: `https://npmjs.com/package/${result.package.name}`,
          description: result.package.description,
          keywords: result.package.keywords,
        }

        return (
          <div key={pkg.name} className="overflow-x-hidden py-3">
            <Header
              q={searchParams.q as string}
              name={pkg.name}
              url={pkg.url}
              downloads={pkg.downloads}
            />
            <Content
              searchParams={searchParams}
              name={pkg.name}
              description={pkg.description}
              keywords={pkg.keywords}
            />
          </div>
        )
      })}
    </div>
  )
}
