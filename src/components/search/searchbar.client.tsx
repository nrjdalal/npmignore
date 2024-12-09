'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  q: z.string().min(2, {
    message: 'Search must be at least 1 character.',
  }),
})

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className="h-12 rounded-none bg-primary px-8 text-background sm:px-12"
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
