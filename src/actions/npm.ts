'use server'

interface NpmSearch {
  q?: string
  page?: number
  perPage?: number
  sortBy?:
    | 'score'
    | 'downloads_weekly'
    | 'downloads_monthly'
    | 'dependent_count'
    | 'published_at'
}

interface NpmSearchResult {
  total: number
  objects: {
    updated: string
    searchScore: number
    package: {
      name: string
      keywords: string[]
      version: string
      description: string
      publisher: {
        name: string
        avatars: {
          small: string
          medium: string
          large: string
        }
      }
      maintainers: {
        email: string
        username: string
      }[]
      license: string
      date: {
        ts: number
        rel: string
      }
      links: {
        homepage: string
        repository: string
        bugs: string
        npm: string
      }
      dependents: number
      downloads: {
        monthly: number
        weekly: number
      }
      keywordsTruncated: boolean
    }
  }[]
}
export async function npmSearch({
  q,
  page,
  perPage,
  sortBy,
}: NpmSearch = {}): Promise<NpmSearchResult> {
  const queryParams = new URLSearchParams({
    q: q || 'next',
    page: page?.toString() || '0',
    perPage: perPage?.toString() || '100',
    sortBy: sortBy || 'score',
  }).toString()

  if (!q) {
    throw new Error('Query is required')
  }

  const res = await fetch(`https://www.npmjs.com/search?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
    },
  })

  const html = await res.text()
  return JSON.parse(html.split('"context":')[1].split(',"chunks":')[0])
}
