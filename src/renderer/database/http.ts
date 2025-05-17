import wretch from 'wretch'

const token = 'TODO: TOKEN'

type QueryOptionsT = {
  method: 'GET' | 'POST'
  path: string
  body?: any
}

const query = (options: QueryOptionsT) => {
  const headers = new Headers()
  headers.append('x-apikey', 'b3d120a9-cd21-4e41-aca0-488fa578da31')
  headers.append('Authorization', `Bearer ${token}`)

  const methodWrappers = {
    GET: (request) => request.get().json(),
    POST: (request) => request.post(options.body).json()
  }

  const configuration = {
    headers,
    method: options.method,
    redirect: 'follow' as RequestRedirect
  }

  const urlPrefix = 'https://certain-teal-68.clerk.accounts.dev'
  const wrapper = methodWrappers[options.method]
  return wrapper(wretch(`${urlPrefix}${options.path}`, configuration))
}

const getArtist = async (authId: string) => {
  return query({
    method: 'GET',
    path: `/artists/${authId}`
  })
}

const getSpace = async (id: string) => {
  return query({
    method: 'GET',
    path: `/spaces/${id}`
  })
}

const getArtistSpaces = async (artistId: string) => {
  return query({
    method: 'GET',
    path: `/artists/${artistId}/spaces`
  })
}

const queryModels = async (searchQuery: string) => {
  return query({
    method: 'POST',
    path: '/models/search',
    body: { query: searchQuery }
  })
}

export const database = {
  getArtist,
  getSpace,
  getArtistSpaces,
  queryModels
}
