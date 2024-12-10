'use client'

import { npmSearch } from '@/actions/npm'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  DefaultSearchParams,
  DefaultSearchResults,
  Searching,
  SearchParams,
  SearchResults,
} from '@/lib/store'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Loader2, Search } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  q: z.string().min(1, {
    message: 'Search must be at least 1 character.',
  }),
  page: z.coerce.number().int().nonnegative(),
  perPage: z.coerce.number().int().min(1).max(100),
  sortBy: z.enum([
    'score',
    'downloads_weekly',
    'downloads_monthly',
    'dependent_count',
    'published_at',
  ]),
})

export default function SearchBar({
  initialSearchParams,
}: {
  initialSearchParams: { [key: string]: string }
}) {
  const router = useRouter()

  const [searching, setSearching] = useAtom(Searching)
  const [searchParams, setSearchParams] = useAtom(SearchParams)
  const [searchResult, setSearchResults] = useAtom(SearchResults)

  useQuery({
    queryKey: ['search'],
    queryFn: async () => {
      // home page
      if (window.location.pathname === '/') return true
      // no reload on revisits
      if (initialSearchParams?.q === searchParams?.q) return true
      // loading
      setSearchResults(DefaultSearchResults)
      // no search params
      if (window.location.search === '') {
        setSearchResults({ ...DefaultSearchResults, total: 0 })
        return true
      }
      setSearching(true)
      setSearchParams(initialSearchParams)
      setSearchResults(await npmSearch(initialSearchParams))
      setSearching(false)
      return true
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: searchParams?.q || DefaultSearchParams.q,
      page: Number(searchParams?.page || DefaultSearchParams.page),
      perPage: Number(searchParams?.perPage || DefaultSearchParams.perPage),
      sortBy: searchParams?.sortBy || DefaultSearchParams.sortBy,
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
      if (initialSearchParams?.q === searchResult?.formData?.search?.q?.value)
        setSearching(true)
      setSearchResults(await npmSearch(searchParams))
      setSearching(false)
      return true
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (window.location.pathname !== '/search') {
      return redirect(`/search?q=${values.q}`)
    }
    if (searching || searchParams.q === values.q) return
    setSearchParams({
      ...searchParams,
      ...values,
    })
    form.setValue('q', DefaultSearchParams.q || '')
    await mutation.mutateAsync()
  }

  useEffect(() => {
    if (!searchParams?.q) return
    const params = new URLSearchParams(
      Object.entries(searchParams).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value)
          if (
            value ===
            DefaultSearchParams[key as keyof typeof DefaultSearchParams]
          ) {
            delete acc[key]
          }
          return acc
        },
        {} as Record<string, string>,
      ),
    )
    router.push(`/search?${decodeURIComponent(params.toString())}`)
  }, [searchParams, router])

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex">
          <Search className="absolute top-3.5 mx-3.5 hidden size-5 text-muted-foreground sm:block" />
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="h-12 rounded-none border-none bg-foreground font-mono ring-inset sm:pl-12"
                    placeholder={searchParams?.q || 'Search packages'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className={cn(
              'flex h-12 w-24 items-center justify-center rounded-none bg-primary text-background sm:w-48 sm:px-12',
              searching && 'opacity-50',
            )}
            disabled={searching}
            type="submit"
          >
            {searching ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <p>
                <Search className="size-5 sm:hidden" />
                <span className="hidden font-mono text-sm font-semibold sm:block">
                  Search
                </span>
              </p>
            )}
          </button>
        </div>
      </form>
    </Form>
  )
}
