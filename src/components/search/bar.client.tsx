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
import { Searching, SearchParams, SearchResults } from '@/lib/store'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Loader2, Search } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  q: z.string().min(1, {
    message: 'Search must be at least 1 character.',
  }),
  page: z.coerce.number().int().nonnegative(),
  perPage: z.coerce.number().int().min(1).max(100),
})

export default function SearchBar({
  initialSearchParams,
}: {
  initialSearchParams: { [key: string]: string }
}) {
  const [searching, setSearching] = useAtom(Searching)
  const [searchParams, setSearchParams] = useAtom(SearchParams)
  const [, setSearchResults] = useAtom(SearchResults)

  useQuery({
    queryKey: ['search'],
    queryFn: async () => {
      setSearchParams(initialSearchParams)
      setSearchResults(await npmSearch(initialSearchParams))
      return true
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: searchParams.q || '',
      page: Number(searchParams.page) || 0,
      perPage: Number(searchParams.perPage) || 100,
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
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
    if (searching) return
    setSearchParams({
      ...searchParams,
      ...values,
    })
    await mutation.mutateAsync()
  }

  useEffect(() => {
    Object.entries(searchParams).forEach(([key, value]) => {
      form.setValue(key as 'q' | 'page' | 'perPage', value as string | number)
    })

    const params = new URLSearchParams(
      Object.entries(searchParams).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value)
          return acc
        },
        {} as Record<string, string>,
      ),
    )

    window.history.pushState(
      {},
      '',
      `${window.location.pathname}?${decodeURIComponent(params.toString())}`,
    )
  }, [searchParams, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Search packages"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setSearchParams({
                        ...searchParams,
                        q: e.target.value,
                      })
                    }}
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
