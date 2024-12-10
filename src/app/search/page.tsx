import SearchBar from '@/components/search/bar.client'
import SeacrhResultsIndex from '@/components/search/results/index'

type SearchParams = Promise<{ [key: string]: string }>

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  return (
    <main>
      <SearchBar initialSearchParams={searchParams} />
      <SeacrhResultsIndex />
    </main>
  )
}
