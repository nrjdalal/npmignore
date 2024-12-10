'use client'

import Content from '@/components/search/results/content'
import Footer from '@/components/search/results/footer'
import Header from '@/components/search/results/header'
import { SearchResults } from '@/lib/store'
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'

export default function Index() {
  const [data] = useAtom(SearchResults)

  if (data?.total === -1) {
    return (
      <div className="flex min-h-[80dvh] items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="mb-12 mt-2 min-h-dvh divide-y">
      {data?.objects?.map((result) => {
        const pkg = {
          name: result.package.name,
          url: `https://npmjs.com/package/${result.package.name}`,
          downloads: result.package.downloads,
          description: result.package.description,
          keywords: result.package.keywords,
          publisher: result.package.publisher,
          version: result.package.version,
          date: result.package.date,
          dependents: result.package.dependents,
        }

        return (
          <div key={pkg.name} className="overflow-x-hidden py-3">
            <Header name={pkg.name} url={pkg.url} downloads={pkg.downloads} />
            <Content
              name={pkg.name}
              description={pkg.description}
              keywords={pkg.keywords}
            />
            <Footer
              publisher={pkg.publisher}
              version={pkg.version}
              date={pkg.date}
              dependents={pkg.dependents}
            />
          </div>
        )
      })}
    </div>
  )
}
