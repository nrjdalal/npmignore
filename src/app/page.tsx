/* eslint-disable @next/next/no-img-element */

'use client'

import { on } from 'events'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { humanNumbers } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Dot, Download, Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  q: z.string(),
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

export default function SuspensePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <Loader2 className="animate-spin" />
        </main>
      }
    >
      <Page />
    </Suspense>
  )
}

function Page() {
  const params = useSearchParams()

  const [searching, setSearching] = useState(false)

  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: params.get('q') || '',
      page: Number(params.get('page')) || 0,
      perPage: Number(params.get('perPage')) || 100,
      sortBy:
        (params.get('sortBy') as
          | 'score'
          | 'downloads_weekly'
          | 'downloads_monthly'
          | 'dependent_count'
          | 'published_at') || '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await npmSearch({
        ...values,
        q: values.q ? values.q : 'next',
        sortBy: values.sortBy ? values.sortBy : 'score',
      })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['search'], data)
      setSearching(false)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutation.mutateAsync(values)
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search'],
    queryFn: async () => {
      return await npmSearch({
        ...(form.getValues() as z.infer<typeof formSchema>),
        q: form.getValues().q ? form.getValues().q : 'next',
        sortBy: form.getValues().sortBy ? form.getValues().sortBy : 'score',
      })
    },
  })

  return (
    <main className="mx-auto max-w-screen-lg p-5 md:px-10">
      <h1 className="text-2xl font-bold">npmignore - npm on steroids</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-5 flex items-center">
            <FormField
              control={form.control}
              name="q"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 transform text-gray-400" />
                  <FormControl>
                    <Input
                      className="!m-0 h-12 rounded-none border-none bg-gray-200 pl-12 !text-base !text-zinc-600 shadow-none placeholder:text-gray-400 focus-visible:ring-inset"
                      {...field}
                      placeholder="Search packages"
                      onChange={(e) => {
                        const newPrams = new URLSearchParams(params.toString())
                        newPrams.set('q', e.target.value)
                        window.history.pushState(
                          null,
                          '',
                          `?${newPrams.toString()}`,
                        )
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              className="flex h-12 items-center justify-center rounded-none bg-zinc-950 px-8 text-sm font-semibold text-white"
              type="submit"
              onClick={() => setSearching(true)}
            >
              Search
            </button>
          </div>
        </form>
      </Form>

      <div className="grid grid-cols-1 gap-5">
        {(searching || isLoading) && (
          <div className="flex h-48 min-h-dvh justify-center">
            <Loader2 className="mt-24 animate-spin" />
          </div>
        )}
        {isError && (
          <div className="flex h-48 min-h-dvh justify-center">
            <p className="mt-24">Something went wrong!</p>
          </div>
        )}
        {!searching && data?.objects?.length && (
          <div className="min-h-dvh divide-y">
            <div className="mt-2 flex items-center justify-between py-5">
              <p className="font-bold">{data.total} packages found</p>
              <Select
                onValueChange={(value) => {
                  setSearching(true)
                  const newParams = new URLSearchParams(params.toString())
                  newParams.set('sortBy', value)
                  window.history.pushState(null, '', `?${newParams.toString()}`)
                  form.setValue(
                    'sortBy',
                    value as
                      | 'score'
                      | 'downloads_weekly'
                      | 'downloads_monthly'
                      | 'dependent_count'
                      | 'published_at',
                  )
                  onSubmit(form.getValues())
                }}
                defaultValue={form.getValues().sortBy}
              >
                <SelectTrigger className="w-48 rounded-sm border-zinc-300 bg-gray-100 text-zinc-700">
                  <SelectValue placeholder="Sort by: Default" />
                </SelectTrigger>
                <SelectContent className="rounded-none shadow-none" align="end">
                  <SelectItem value="score">Default</SelectItem>
                  <SelectItem value="downloads_weekly">
                    Weekly Downloads
                  </SelectItem>
                  <SelectItem value="downloads_monthly">
                    Monthly Downloads
                  </SelectItem>
                  <SelectItem value="dependent_count">
                    Most Dependents
                  </SelectItem>
                  <SelectItem value="published_at">
                    Recently Published
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data?.objects.map((item) => (
              <div key={item.package.name} className="py-3">
                <div>
                  <Link
                    href={`https://npmjs.com/package/${item.package.name}`}
                    className="flex gap-x-4 font-semibold"
                    target="_blank"
                  >
                    {item.package.name}
                    {params.get('q') === item.package.name && (
                      <span className="flex items-center rounded-md bg-purple-200 px-2 text-xs font-normal text-zinc-600">
                        exact match
                      </span>
                    )}
                  </Link>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {item.package.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {item.package.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-zinc-600"
                    >
                      <Link
                        href={`/?q=keyword:${keyword}`}
                        onClick={(e) => {
                          e.preventDefault()
                          setSearching(true)
                          const newParams = new URLSearchParams(
                            params.toString(),
                          )
                          newParams.set('q', `keyword:${keyword}`)
                          window.history.pushState(
                            null,
                            '',
                            `?${newParams.toString()}`,
                          )
                          form.setValue('q', `keyword:${keyword}`)
                          form.setValue('page', 0)
                          onSubmit(form.getValues())
                        }}
                      >
                        {keyword}
                      </Link>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-x-2 text-zinc-500">
                    <img
                      className="rounded-sm"
                      src={
                        'https://npmjs.com/' +
                        item.package.publisher.avatars.small
                      }
                      alt={item.package.name}
                      height={24}
                      width={24}
                    />
                    <p className="flex items-center text-sm">
                      <Link
                        href={`https://www.npmjs.com/~${item.package.publisher.name}`}
                        target="_blank"
                        className="font-semibold"
                      >
                        {item.package.publisher.name}
                      </Link>
                      <Dot />
                      <span>{item.package.version}</span>
                      <Dot />
                      <Box className="mr-1 size-4" />
                      <span>
                        {humanNumbers(item.package.dependents)} dependents
                      </span>
                    </p>
                  </div>
                  <p className="flex items-center gap-x-1.5 text-sm">
                    <Download className="size-4" />
                    <span className="mt-px">
                      {form.getValues().sortBy === 'downloads_weekly'
                        ? humanNumbers(item.package.downloads.weekly)
                        : humanNumbers(item.package.downloads.monthly)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
