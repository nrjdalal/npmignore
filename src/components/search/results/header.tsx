import { SearchParams } from '@/lib/store'
import { humanNumbers } from '@/lib/utils'
import { useAtom } from 'jotai'
import { Download } from 'lucide-react'
import Link from 'next/link'

export default function Header({
  name,
  url,
  downloads,
}: {
  name: string
  url: string
  downloads: { monthly: number; weekly: number }
}) {
  const [searchParams] = useAtom(SearchParams)

  return (
    <div className="flex flex-wrap items-center justify-between font-mono">
      <Link href={url} className="flex gap-x-4 font-semibold" target="_blank">
        {name}
        {searchParams?.q === name && (
          <span className="flex items-center rounded-md bg-purple-200 px-2 text-xs font-normal text-secondary dark:text-muted">
            exact match
          </span>
        )}
      </Link>
      <div className="flex items-center justify-end gap-x-1.5 text-sm">
        <span className="mt-px">
          {humanNumbers(downloads.monthly)}
          {/* {form.getValues().sortBy === 'downloads_weekly'
            ? humanNumbers(item.package.downloads.weekly)
            : humanNumbers(item.package.downloads.monthly)} */}
        </span>
        <Download className="size-4" />
      </div>
    </div>
  )
}
