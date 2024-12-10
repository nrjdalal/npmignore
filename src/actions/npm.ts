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

export interface NpmSearchResult {
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
  q = 'shadcn',
  page = 0,
  perPage = 100,
  sortBy = 'score',
}: NpmSearch = {}): Promise<NpmSearchResult> {
  const queryParams = new URLSearchParams({
    q: q,
    page: page.toString(),
    perPage: perPage.toString(),
    sortBy: sortBy,
  }).toString()

  const res = await fetch(`https://www.npmjs.com/search?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
    },
  })

  const html = await res.text()
  return JSON.parse(html.split('"context":')[1].split(',"chunks":')[0])
}
