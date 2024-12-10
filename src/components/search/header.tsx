import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'

export default function Header() {
  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/" className="text-2xl font-black">
        npmignore-beta
      </Link>
      <ThemeToggle />
    </nav>
  )
}
