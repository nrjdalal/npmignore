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
import { Searching } from '@/lib/store'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  q: z.string().min(2, {
    message: 'Search must be at least 1 character.',
  }),
  page: z.coerce.number().int().nonnegative(),
  perPage: z.coerce.number().int().min(1).max(100),
})

export default function SearchBar() {
  const { q, page, perPage } = Object.fromEntries(useSearchParams())

  const [searching, setSearching] = useAtom(Searching)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: q || '',
      page: Number(page) || 0,
      perPage: Number(perPage) || 100,
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return { results: await npmSearch(values), values }
    },
    onSuccess: (data) => {
      setSearching(false)
      queryClient.setQueryData(['search'], data.results)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (searching) return
    setSearching(true)
    await mutation.mutateAsync(values)
  }

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
                      const params = new URLSearchParams(window.location.search)
                      params.set('q', e.target.value)
                      window.history.replaceState(
                        {},
                        '',
                        `${window.location.pathname}?${params}`,
                      )
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className={cn(
              'h-12 rounded-none bg-primary px-8 text-background sm:px-12',
              searching && 'cursor-wait opacity-50',
            )}
            disabled={searching}
            type="submit"
          >
            <Search className="size-5 sm:hidden" />
            <span className="hidden font-mono text-sm font-semibold sm:block">
              Search
            </span>
          </button>
        </div>
      </form>
    </Form>
  )
}
