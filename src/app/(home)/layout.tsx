import SearchBar from '@/components/search/bar.client'
import Header from '@/components/search/header'
import { cn } from '@/lib/utils'
import React from 'react'

type SearchParams = Promise<{ [key: string]: string }>

export default async function Page(props: {
  children: React.ReactNode
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams

  return (
    <div className="mx-auto max-w-screen-lg overflow-x-hidden px-3.5 md:px-10">
      <Header />
      <main>
        <SearchBar initialSearchParams={searchParams} />
        <section
          className={cn(
            'prose py-14',
            'prose-a:text-site-blue',
            'prose-headings:text-primary',
            'prose-li:text-secondary',
            'prose-p:text-secondary',
          )}
        >
          {props.children}
        </section>
      </main>
    </div>
  )
}
