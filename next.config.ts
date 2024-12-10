import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import remarkGfm from 'remark-gfm'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
})

export default withMDX(nextConfig)
