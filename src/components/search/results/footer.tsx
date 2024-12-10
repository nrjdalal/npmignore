/* eslint-disable @next/next/no-img-element */

import { humanNumbers, humanTime } from '@/lib/utils'
import { Box, Dot } from 'lucide-react'
import Link from 'next/link'

export default function Footer({
  publisher,
  version,
  date,
  dependents,
}: {
  publisher: {
    avatars: {
      small: string
    }
    name: string
  }
  version: string
  date: {
    ts: number
  }
  dependents: number
}) {
  return (
    <div className="mr-5 mt-3 flex w-full flex-wrap items-center gap-y-1 text-sm text-zinc-500">
      <img
        className="rounded-sm"
        src={'https://npmjs.com/' + publisher.avatars.small}
        alt={''}
        height={24}
        width={24}
      />
      <Link
        className="ml-2 font-bold"
        href={`https://www.npmjs.com/~${publisher.name}`}
        target="_blank"
      >
        {publisher.name}
      </Link>
      <Dot />
      <span>{version}</span>
      <Dot />
      <span>{humanTime(date.ts)}</span>
      <p className="flex items-center">
        <Dot />
        <Box className="mr-1 size-4 min-w-4" />
        <span>{humanNumbers(dependents)} dependents</span>
      </p>
    </div>
  )
}
