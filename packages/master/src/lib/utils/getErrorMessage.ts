import { AxiosError } from 'axios'
import { ExceptionBase } from '../../exceptions/exception-base'

export function getErrorMessage(error: unknown): string {
  if (error instanceof ExceptionBase) {
    return error.getErrorMessage() || 'サーバーエラーが発生しました。'
  }
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message
    if (message) {
      return message
    }
    return 'サーバーエラーが発生しました。'
  }
  if (error instanceof Error) {
    return error.message || 'サーバーエラーが発生しました。'
  }
  return 'サーバーエラーが発生しました。'
}
