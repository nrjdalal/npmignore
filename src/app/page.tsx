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
import { humanNumbers } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  q: z.string(),
  page: z.coerce.number().int().nonnegative(),
  perPage: z.coerce.number().int().min(1).max(100),
})

export default function Page() {
  const params = useSearchParams()

  const [searching, setSearching] = useState(false)

  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: params.get('q') || '',
      page: Number(params.get('page')) || 0,
      perPage: Number(params.get('perPage')) || 100,
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await npmSearch({
        ...values,
        q: values.q ? values.q : 'next',
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
      })
    },
  })

  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <main className="mx-auto max-w-screen-md space-y-5 p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center">
              <FormField
                control={form.control}
                name="q"
                render={({ field }) => (
                  <FormItem className="relative w-full">
                    <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 transform text-zinc-500" />
                    <FormControl>
                      <Input
                        className="!m-0 h-12 rounded-none border-none bg-gray-200 pl-12 !text-base !text-zinc-600 shadow-none placeholder:text-gray-400 focus-visible:ring-inset"
                        {...field}
                        placeholder="Search packages"
                        onChange={(e) => {
                          const newPrams = new URLSearchParams(
                            params.toString(),
                          )
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
            <div className="flex h-24 min-h-dvh justify-center">
              <Loader2 className="mt-24 animate-spin" />
            </div>
          )}
          {isError && (
            <div className="flex h-24 min-h-dvh justify-center">
              <p className="mt-24">Something went wrong!</p>
            </div>
          )}
          {!searching && data?.objects.length && (
            <div className="min-h-dvh divide-y">
              <p className="py-5 font-bold">{data.total} packages found</p>
              {data?.objects.map((item) => (
                <div key={item.package.name} className="py-3">
                  <div>
                    <h3 className="flex gap-x-4 font-semibold">
                      {item.package.name}
                      {params.get('q') === item.package.name && (
                        <span className="flex items-center rounded-md bg-purple-200 px-2 text-xs font-normal text-zinc-600">
                          exact match
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {item.package.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      className="flex items-center gap-x-2 text-zinc-500"
                      href={`https://www.npmjs.com/~${item.package.publisher.name}`}
                      target="_blank"
                    >
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
                      <p className="text-sm font-semibold">
                        {item.package.publisher.name}
                      </p>
                    </Link>
                    <p className="flex items-center gap-x-1.5 text-sm">
                      <Download className="size-4" />
                      <span className="mt-px">
                        {humanNumbers(item.package.downloads.monthly)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </Suspense>
  )
}
