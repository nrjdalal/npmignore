import SearchBar from '@/components/search/bar.client'
import SeacrhResultsIndex from '@/components/search/results/index'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  return (
    <main>
      <SearchBar />
      <SeacrhResultsIndex searchParams={searchParams} />
    </main>
  )
}
