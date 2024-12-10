'use client'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SearchParams } from '@/lib/store'
import { useAtom } from 'jotai'
import Link from 'next/link'

export default function Header() {
  const [, setSearchParams] = useAtom(SearchParams)

  return (
    <nav className="flex items-center justify-between py-4">
      <Link
        href="/"
        className="text-2xl font-black"
        onClick={() => setSearchParams({})}
      >
        npmignore
      </Link>
      <ThemeToggle />
    </nav>
  )
}
