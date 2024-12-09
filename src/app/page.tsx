/* eslint-disable @next/next/no-img-element */

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { cn, humanNumbers } from '@/lib/utils'
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
  niSort: z.enum(['disabled', 'downloads', 'dependents']),
  niTitleMatch: z.boolean(),
  niDownloads: z.string(),
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
      page: Number(params.get('page')) || 1,
      perPage: Number(params.get('perPage')) || 100,
      sortBy:
        (params.get('sortBy') as
          | 'score'
          | 'downloads_weekly'
          | 'downloads_monthly'
          | 'dependent_count'
          | 'published_at') || '',
      niSort: 'disabled',
      niTitleMatch: false,
      niDownloads: params.get('niDownloads') || '0',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await npmSearch({
        ...values,
        page: values.page - 1,
        q: values.q ? values.q : 'shadcn',
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
        page: form.getValues().page - 1,
        q: form.getValues().q ? form.getValues().q : 'shadcn',
        sortBy: form.getValues().sortBy ? form.getValues().sortBy : 'score',
      })
    },
  })

  return (
    <main className="mx-auto max-w-screen-lg px-3.5 pb-10 md:px-10">
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">npmignore</h1>
        <ModeToggle />
      </div>

      <Form {...form}>
        <form>
          <div className="mt-4 flex items-center">
            <FormField
              control={form.control}
              name="q"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 transform text-gray-400" />
                  <FormControl>
                    <Input
                      className="!m-0 h-12 rounded-none border-none bg-gray-100 pl-12 !text-base !text-zinc-600 shadow-none placeholder:text-gray-400 focus-visible:ring-inset dark:bg-zinc-900 dark:!text-white"
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
              className="flex h-12 items-center justify-center rounded-none bg-zinc-950 px-8 text-sm font-semibold text-white dark:bg-zinc-800"
              type="submit"
              onClick={() => {
                setSearching(true)
                onSubmit(form.getValues())
              }}
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
        {!searching && data?.objects?.length === 0 && (
          <div className="flex h-48 min-h-dvh justify-center">
            <p className="mt-24">No packages found</p>
          </div>
        )}

        <div>
          <div className="mt-2 flex items-center justify-between py-5">
            <p className="font-bold">{data?.total || '0'} pkgs found</p>
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
              <SelectTrigger className="w-48 rounded-sm border-zinc-300 bg-gray-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <SelectValue placeholder="npm: Default" />
              </SelectTrigger>
              <SelectContent className="rounded-none shadow-none" align="end">
                <SelectItem value="score">npm: Default</SelectItem>
                <SelectItem value="downloads_weekly">
                  Weekly Downloads
                </SelectItem>
                <SelectItem value="downloads_monthly">
                  Monthly Downloads
                </SelectItem>
                <SelectItem value="dependent_count">Most Dependents</SelectItem>
                <SelectItem value="published_at">Recently Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center border-y">
            <p className="pr-3 font-semibold text-zinc-500">Filters</p>
            <Select
              onValueChange={(value) => {
                setSearching(true)
                const newParams = new URLSearchParams(params.toString())
                newParams.set('niSort', value)
                window.history.pushState(null, '', `?${newParams.toString()}`)
                form.setValue(
                  'niSort',
                  value as 'disabled' | 'downloads' | 'dependents',
                )
                onSubmit(form.getValues())
              }}
              defaultValue={form.getValues().niSort}
            >
              <SelectTrigger className="w-36 rounded-none border-y-0 border-l border-r-0 shadow-none ring-inset">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent
                className="rounded-none text-xs shadow-none"
                align="start"
              >
                <SelectItem value="disabled">Sort: Disabled</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
                <SelectItem value="dependents">Dependents</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                setSearching(true)
                const newParams = new URLSearchParams(params.toString())
                newParams.set('niDownloads', value)
                window.history.pushState(null, '', `?${newParams.toString()}`)
                form.setValue('niDownloads', value)
                onSubmit(form.getValues())
              }}
              defaultValue={form.getValues().niDownloads}
            >
              <SelectTrigger className="w-36 rounded-none border-y-0 border-l border-r shadow-none ring-inset">
                <SelectValue placeholder="> 0 Downloads" />
              </SelectTrigger>
              <SelectContent
                className="rounded-none text-xs shadow-none"
                align="start"
              >
                <SelectItem value="0">&gt; 0 Downloads</SelectItem>
                <SelectItem value="10000">&gt; 10,000</SelectItem>
                <SelectItem value="100000">&gt; 100,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!searching && data?.objects?.length && (
          <div className="min-h-dvh divide-y">
            {data?.objects
              .filter((item) => {
                const niDownloads = Number(form.getValues().niDownloads)
                if (form.getValues().sortBy === 'downloads_weekly') {
                  return item.package.downloads.weekly > niDownloads
                }
                return item.package.downloads.monthly > niDownloads
              })
              .sort((a, b) => {
                if (form.getValues().niSort === 'downloads') {
                  if (form.getValues().sortBy === 'downloads_weekly') {
                    return (
                      b.package.downloads.weekly - a.package.downloads.weekly
                    )
                  }
                  return (
                    b.package.downloads.monthly - a.package.downloads.monthly
                  )
                } else if (form.getValues().niSort === 'dependents') {
                  return b.package.dependents - a.package.dependents
                } else {
                  return 0
                }
              })
              .map((item) => (
                <div key={item.package.name} className="overflow-x-hidden py-3">
                  <div className="flex flex-wrap items-center justify-between">
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
                    <div className="flex items-center justify-end gap-x-1.5 text-sm">
                      <Download className="size-4" />
                      <span className="mt-px">
                        {form.getValues().sortBy === 'downloads_weekly'
                          ? humanNumbers(item.package.downloads.weekly)
                          : humanNumbers(item.package.downloads.monthly)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {item.package.description}
                  </p>

                  <div
                    className={cn(
                      'mt-2 flex flex-wrap gap-2',
                      !item.package.keywords.length && 'hidden',
                    )}
                  >
                    {item.package.keywords.slice(0, 14).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800"
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
                    {item.package.keywords.length > 13 && (
                      <Link
                        href={
                          'https://www.npmjs.com/package/' + item.package.name
                        }
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-zinc-600"
                      >
                        View {item.package.keywords.length - 13} more
                      </Link>
                    )}
                  </div>

                  <div className="mr-5 mt-3 flex w-full flex-wrap items-center text-sm text-zinc-500">
                    <img
                      className="rounded-sm"
                      src={
                        'https://npmjs.com/' +
                        item.package.publisher.avatars.small
                      }
                      alt={''}
                      height={24}
                      width={24}
                    />
                    <Link
                      className="ml-2 font-bold"
                      href={`https://www.npmjs.com/~${item.package.publisher.name}`}
                      target="_blank"
                    >
                      {item.package.publisher.name}
                    </Link>
                    <Dot />
                    <span>{item.package.version}</span>
                    <Dot />
                    <Box className="mr-1 size-4 min-w-4" />
                    <p>{humanNumbers(item.package.dependents)} dependents</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mt-5 text-center text-sm text-muted-foreground">
        <p className="flex justify-center">
          <Link
            className="mb-2 text-base font-semibold text-zinc-700 underline dark:text-zinc-200"
            href="https://github.com/nrjdalal/npmignore"
          >
            Github
          </Link>
          <Dot />
          <Link
            className="mb-2 text-base font-semibold text-zinc-700 underline dark:text-zinc-200"
            href="https://nrjdalal.com"
          >
            nrjdalal.com
          </Link>
        </p>
        <br />
        UI Color Tweaks, Pagination, More Filters!
        <br />
        Coming Soon!
      </div>
    </main>
  )
}
