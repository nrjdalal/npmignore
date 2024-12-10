'use client'

import Content from '@/components/search/results/content'
import Header from '@/components/search/results/header'
import { SearchResults } from '@/lib/store'
import { useAtom } from 'jotai'

export default function Index() {
  const [data] = useAtom(SearchResults)

  return (
    <div className="mt-2 min-h-dvh divide-y">
      {data?.objects?.map((result) => {
        const pkg = {
          name: result.package.name,
          downloads: result.package.downloads,
          url: `https://npmjs.com/package/${result.package.name}`,
          description: result.package.description,
          keywords: result.package.keywords,
        }

        return (
          <div key={pkg.name} className="overflow-x-hidden py-3">
            <Header name={pkg.name} url={pkg.url} downloads={pkg.downloads} />
            <Content
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
