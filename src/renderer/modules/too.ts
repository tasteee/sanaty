import { to } from 'await-to-js'

type ReturnT<ResultT> = Promise<[Error, ResultT]>

export async function too<ResultT>(label: string, promise: Promise<ResultT>): ReturnT<ResultT> {
  const [error, data] = await to<ResultT>(promise)
  if (error) console.error(`❌ ${label}: `, error)
  if (!error) console.log(`✅ ${label}: `, data)
  return [error, data as any]
}
