import Link from 'next/link'

export default function Header() {
  return (
    <nav className="py-4">
      <Link href="/" className="text-2xl font-black">
        npmignore
      </Link>
    </nav>
  )
}
