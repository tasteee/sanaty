import dayjs from 'dayjs'
import { dialog } from 'electron'

export function getTimestamp(): string {
  return dayjs().format('hh:mmaa')
}

export function createSuccessResponse(data: any) {
  return {
    didSucceed: true,
    timestamp: getTimestamp(),
    ...data
  }
}
