import SearchBar from '@/components/search/bar.client'
import SearchResults from '@/components/search/results'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  return (
    <main>
      <SearchBar />
      <SearchResults searchParams={searchParams} />
    </main>
  )
}
