import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: (props) => {
      const { href, ...rest } = props

      return (
        <Link
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          {...rest}
        >
          {props.children}
        </Link>
      )
    },
  }
}
