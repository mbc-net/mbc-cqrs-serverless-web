import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

// --- Mocks ---

const mockToast = jest.fn()
jest.mock('../../../../../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
    toasts: [],
    dismiss: jest.fn(),
  }),
}))

const mockPost = jest.fn()
jest.mock('../../../../../provider', () => ({
  useHttpClient: () => ({
    post: mockPost,
  }),
}))

const mockStart = jest.fn()
const mockStop = jest.fn()
let subscribedFinishedCount = 0

jest.mock('../../../../../lib/hook/useSubscribeMessage', () => ({
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

jest.mock('../../../../../lib/utils/removeSortKeyVersion', () => ({
  removeSortKeyVersion: (sk: string) => sk.replace(/@.*$/, ''),
}))

const mockRouterRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
  useSearchParams: () => ({
    get: () => 'MASTER#SETTING_CODE',
  }),
}))

jest.mock('next/dynamic', () => () => {
  return function DynamicComponent() {
    return null
  }
})

let mockOnChangeText: ((json: string) => void) | null = null
jest.mock('../../../../../components/JSONEditorComponent', () => {
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

jest.mock('../../../../../components/DragResizeModal', () => {
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

jest.mock('../../../../../components/buttons/DownloadJSONButton', () => {
  return function MockDownloadButton() {
    return null
  }
})

jest.mock('../../../../../components/buttons/ImportJSONButton', () => {
  return function MockImportButton() {
    return null
  }
})

// Import after mocks
import AddJsonData from '../AddJsonData'

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

describe('master-data/ActionBar/AddJsonData', () => {
  const mockOnSave = jest.fn()
  const defaultProps = {
    tenantCode: 'TEST_TENANT',
    onSave: mockOnSave,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    subscribedFinishedCount = 0
    mockOnChangeText = null
  })

  it('should call API with valid data and start subscription', async () => {
    const responseData = [
      {
        pk: 'MASTER#TEST_TENANT',
        sk: 'SETTING_CODE#CODE_1@1',
        id: 'id-1',
        code: 'CODE_1',
        name: 'Item 1',
        version: 1,
        requestId: 'req-1',
        attributes: { key: 'val' },
        seq: 1,
      },
    ]
    mockPost.mockResolvedValue({ data: responseData })

    render(<AddJsonData {...defaultProps} />)

    await setValueAndSave(
      JSON.stringify([
        {
          settingCode: 'SETTING_CODE',
          code: 'CODE_1',
          name: 'Item 1',
          seq: 1,
          attributes: { key: 'val' },
        },
      ])
    )

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ code: 'CODE_1' }),
          ]),
        })
      )
    })

    await waitFor(() => {
      expect(mockStart).toHaveBeenCalledWith('req-1')
    })
  })

  it('should show error toast on invalid JSON data', async () => {
    render(<AddJsonData {...defaultProps} />)

    // Set JSON that fails validation (missing settingCode)
    await setValueAndSave(
      JSON.stringify([{ code: 'C', name: 'N', attributes: {} }])
    )

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

  it('should show error toast on API failure', async () => {
    mockPost.mockRejectedValue(new Error('Network error'))

    render(<AddJsonData {...defaultProps} />)

    await setValueAndSave(
      JSON.stringify([
        {
          settingCode: 'SETTING_CODE',
          code: 'CODE_1',
          name: 'Item 1',
          seq: 1,
          attributes: {},
        },
      ])
    )

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'データ反映に失敗しました。',
          variant: 'destructive',
        })
      )
    })
  })

  it('should show "no changes" toast when no items have requestId', async () => {
    const responseData = [
      {
        pk: 'MASTER#TEST_TENANT',
        sk: 'SETTING_CODE#CODE_1@1',
        id: 'id-1',
        code: 'CODE_1',
        name: 'Item 1',
        version: 1,
        attributes: {},
        seq: 1,
      },
    ]
    mockPost.mockResolvedValue({ data: responseData })

    render(<AddJsonData {...defaultProps} />)

    await setValueAndSave(
      JSON.stringify([
        {
          settingCode: 'SETTING_CODE',
          code: 'CODE_1',
          name: 'Item 1',
          seq: 1,
          attributes: {},
        },
      ])
    )

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'データに変更はありませんでした。',
          variant: 'success',
        })
      )
    })
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ sk: 'SETTING_CODE#CODE_1' }),
      ])
    )
  })

  it('should show error toast for malformed JSON string', async () => {
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
})
