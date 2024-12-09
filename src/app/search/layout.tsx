import Header from '@/components/search/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-screen-lg overflow-x-hidden px-3.5 md:px-10">
      <Header />
      {children}
    </div>
  )
}
