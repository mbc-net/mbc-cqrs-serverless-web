import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AxiosError } from 'axios'

// --- Mocks ---

const mockToast = jest.fn()
jest.mock('../../../../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
    toasts: [],
    dismiss: jest.fn(),
  }),
}))

const mockPost = jest.fn()
jest.mock('../../../../provider', () => ({
  useHttpClient: () => ({
    post: mockPost,
  }),
}))

const mockStart = jest.fn()
const mockStop = jest.fn()
let subscribedFinishedCount = 0

jest.mock('../../../../lib/hook/useSubscribeMessage', () => ({
  useSubscribeBulkCommandStatus: (
    _tenantCode: string,
    onTimeout: () => void
  ) => {
    return {
      start: mockStart,
      stop: mockStop,
      finishedCount: subscribedFinishedCount,
    }
  },
}))

jest.mock('../../../../lib/utils/removeSortKeyVersion', () => ({
  removeSortKeyVersion: (sk: string) => sk.replace(/@.*$/, ''),
}))

const mockRouterRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}))

jest.mock('next/dynamic', () => () => {
  return function DynamicComponent() {
    return null
  }
})

let mockOnChangeText: ((json: string) => void) | null = null
jest.mock('../../../../components/JSONEditorComponent', () => {
  return function MockJSONEditor({
    text,
    onChangeText,
  }: {
    text: string
    onChangeText: (json: string) => void
  }) {
    mockOnChangeText = onChangeText
    return <textarea data-testid="json-editor" defaultValue={text} />
  }
})

jest.mock('../../../../components/DragResizeModal', () => {
  const Modal = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
  Modal.Open = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
  Modal.Window = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
  return Modal
})

jest.mock('../../../../components/buttons/DownloadJSONButton', () => {
  return function MockDownloadButton() {
    return null
  }
})

jest.mock('../../../../components/buttons/ImportJSONButton', () => {
  return function MockImportButton() {
    return null
  }
})

// Import after mocks
import AddJsonData from '../AddJsonData'
import { ExceptionBase } from '../../../../exceptions/exception-base'

// Concrete subclass for testing
class TestException extends ExceptionBase {}

// Helper to set JSON value and trigger save
async function setValueAndSave(jsonStr: string) {
  await act(async () => {
    mockOnChangeText?.(jsonStr)
  })
  const saveButton = screen.getByText('データ反映')
  await act(async () => {
    fireEvent.click(saveButton)
  })
}

describe('master-settings/AddJsonData', () => {
  const defaultProps = {
    tenantCode: 'TEST_TENANT',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    subscribedFinishedCount = 0
    mockOnChangeText = null
  })

  describe('getErrorMessage (via API error handling)', () => {
    it('should extract message from ExceptionBase', async () => {
      const error = new TestException({ message: 'カスタムエラー' })
      mockPost.mockRejectedValue(error)

      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave(
        JSON.stringify([{ code: 'C', name: 'N', attributes: {} }])
      )

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'カスタムエラー',
            variant: 'destructive',
          })
        )
      })
    })

    it('should extract message from AxiosError response', async () => {
      const axiosError = new AxiosError('Request failed')
      axiosError.response = {
        data: { message: 'バリデーションエラー' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      }
      mockPost.mockRejectedValue(axiosError)

      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave(
        JSON.stringify([{ code: 'C', name: 'N', attributes: {} }])
      )

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'バリデーションエラー',
            variant: 'destructive',
          })
        )
      })
    })

    it('should fallback for generic Error', async () => {
      mockPost.mockRejectedValue(new Error('Generic error'))

      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave(
        JSON.stringify([{ code: 'C', name: 'N', attributes: {} }])
      )

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Generic error',
            variant: 'destructive',
          })
        )
      })
    })

    it('should fallback for unknown error', async () => {
      mockPost.mockRejectedValue('string error')

      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave(
        JSON.stringify([{ code: 'C', name: 'N', attributes: {} }])
      )

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'サーバーエラーが発生しました。',
            variant: 'destructive',
          })
        )
      })
    })
  })

  describe('saveData validation', () => {
    it('should show error toast for invalid JSON', async () => {
      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave('not valid json {{{')

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'JSON が無効です',
            variant: 'destructive',
          })
        )
      })
      expect(mockPost).not.toHaveBeenCalled()
    })

    it('should show error toast for non-array JSON', async () => {
      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave(JSON.stringify({ code: 'C', name: 'N' }))

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'JSON が無効です',
            description: '配列である必要があります。',
            variant: 'destructive',
          })
        )
      })
      expect(mockPost).not.toHaveBeenCalled()
    })

    it('should show error toast for invalid bulk JSON structure', async () => {
      render(<AddJsonData {...defaultProps} />)

      // Missing attributes
      await setValueAndSave(JSON.stringify([{ code: 'C', name: 'N' }]))

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'JSON が無効です',
            variant: 'destructive',
          })
        )
      })
      expect(mockPost).not.toHaveBeenCalled()
    })
  })

  describe('API success handling', () => {
    it('should show "no changes" toast when no requestId returned', async () => {
      const responseData = [
        {
          pk: 'MASTER#TEST_TENANT',
          sk: 'SETTING_1#CODE_1@1',
          id: 'id-1',
          code: 'CODE_1',
          name: 'Item 1',
          version: 1,
          attributes: {},
        },
      ]
      mockPost.mockResolvedValue({ data: responseData })

      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave(
        JSON.stringify([{ code: 'C', name: 'N', attributes: {} }])
      )

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'データに変更はありませんでした。',
            variant: 'success',
          })
        )
      })
      expect(mockStart).not.toHaveBeenCalled()
    })

    it('should start WebSocket subscription when requestId present', async () => {
      const responseData = [
        {
          pk: 'MASTER#TEST_TENANT',
          sk: 'SETTING_1#CODE_1@1',
          id: 'id-1',
          code: 'CODE_1',
          name: 'Item 1',
          version: 1,
          requestId: 'req-123',
          attributes: {},
        },
      ]
      mockPost.mockResolvedValue({ data: responseData })

      render(<AddJsonData {...defaultProps} />)

      await setValueAndSave(
        JSON.stringify([{ code: 'C', name: 'N', attributes: {} }])
      )

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalledWith('req-123')
      })
    })
  })
})
