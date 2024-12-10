import SearchBar from '@/components/search/bar.client'
import SeacrhResultsIndex from '@/components/search/results/index'

type SearchParams = Promise<{ [key: string]: string }>

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolvedSearchParams = await searchParams

  return (
    <main>
      <SearchBar initialSearchParams={resolvedSearchParams} />
      <SeacrhResultsIndex />
    </main>
  )
}
