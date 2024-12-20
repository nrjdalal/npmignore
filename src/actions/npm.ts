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
  formData: {
    search: {
      q: {
        value: string
      }
      page: {
        value: number
      }
      perPage: {
        value: number
      }
      sortBy: {
        value:
          | 'score'
          | 'downloads_weekly'
          | 'downloads_monthly'
          | 'dependent_count'
          | 'published_at'
      }
    }
  }
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
  q = '',
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

  if (q === '') {
    return {
      formData: {
        search: {
          q: { value: '' },
          page: { value: 0 },
          perPage: { value: 0 },
          sortBy: { value: 'score' },
        },
      },
      total: -1,
      objects: [],
    }
  }

  const res = await fetch(`https://www.npmjs.com/search?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
    },
  })

  const html = await res.text()
  const json = JSON.parse(html.split('"context":')[1].split(',"chunks":')[0])

  return json
}
