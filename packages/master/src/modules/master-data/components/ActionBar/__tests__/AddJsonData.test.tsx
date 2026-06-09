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
import { API_URLS } from '../../../../../lib/constants/url'
import type { MapResult } from '../../../../master-settings/components/AddJsonData'

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

const validNativeItem = {
  settingCode: 'SETTING_CODE',
  code: 'CODE_1',
  name: 'Item 1',
  seq: 1,
  attributes: {
    code: 'CODE_1',
    name: 'Item 1',
    seq: 1,
  },
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

  it('should call /master-bulk with valid data and start subscription', async () => {
    const responseData = [
      {
        pk: 'MASTER#TEST_TENANT',
        sk: 'SETTING_CODE#CODE_1@1',
        id: 'id-1',
        code: 'CODE_1',
        name: 'Item 1',
        version: 1,
        requestId: 'req-1',
        attributes: {
          code: 'CODE_1',
          name: 'Item 1',
          seq: 1,
        },
        seq: 1,
      },
    ]
    mockPost.mockResolvedValue({ data: responseData })

    render(<AddJsonData {...defaultProps} />)

    await setValueAndSave(JSON.stringify([validNativeItem]))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(API_URLS.MASTER.BULK, {
        items: [validNativeItem],
      })
    })

    await waitFor(() => {
      expect(mockStart).toHaveBeenCalledWith('req-1')
    })
  })

  it('should show error toast on invalid JSON data (missing seq)', async () => {
    render(<AddJsonData {...defaultProps} />)

    await setValueAndSave(
      JSON.stringify([
        {
          settingCode: 'SETTING_CODE',
          code: 'C',
          name: 'N',
          attributes: {},
        },
      ])
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

    await setValueAndSave(JSON.stringify([validNativeItem]))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'データ登録に失敗しました。',
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
        attributes: {
          code: 'CODE_1',
          name: 'Item 1',
          seq: 1,
        },
        seq: 1,
      },
    ]
    mockPost.mockResolvedValue({ data: responseData })

    render(<AddJsonData {...defaultProps} />)

    await setValueAndSave(JSON.stringify([validNativeItem]))

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

  describe('mapRawItem path', () => {
    const mapRawItem = (raw: unknown): MapResult | null => {
      const r = raw as { id?: string; label?: string }
      if (!r?.id) return null
      return {
        kind: 'data',
        value: {
          settingCode: 'SETTING_CODE',
          code: r.id,
          name: r.label ?? r.id,
          seq: 0,
          attributes: { code: r.id, name: r.label ?? r.id, seq: 0 },
        },
      }
    }

    it('should post mapped items to /master-bulk on happy path', async () => {
      mockPost.mockResolvedValue({
        data: [
          {
            pk: 'MASTER#TEST_TENANT',
            sk: 'SETTING_CODE#EXT_1@1',
            requestId: 'req-map-1',
            code: 'EXT_1',
            name: 'External 1',
            attributes: {},
            seq: 0,
          },
        ],
      })

      render(<AddJsonData {...defaultProps} mapRawItem={mapRawItem} />)

      await setValueAndSave(
        JSON.stringify([{ id: 'EXT_1', label: 'External 1' }])
      )

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith(API_URLS.MASTER.BULK, {
          items: [
            {
              settingCode: 'SETTING_CODE',
              code: 'EXT_1',
              name: 'External 1',
              seq: 0,
              attributes: { code: 'EXT_1', name: 'External 1', seq: 0 },
            },
          ],
        })
      })
      expect(mockStart).toHaveBeenCalledWith('req-map-1')
    })

    it('should reject kind: setting without calling API', async () => {
      const mixedMapper = (): MapResult => ({
        kind: 'setting',
        value: {
          name: 'S',
          code: 'S',
          settingValue: { fields: [] },
        },
      })

      render(<AddJsonData {...defaultProps} mapRawItem={mixedMapper} />)

      await setValueAndSave(JSON.stringify([{ anything: true }]))

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'マスター設定はこの画面から登録できません',
            variant: 'destructive',
          })
        )
      })
      expect(mockPost).not.toHaveBeenCalled()
    })

    it('should show empty-data toast when mapper returns no items', async () => {
      render(<AddJsonData {...defaultProps} mapRawItem={() => null} />)

      await setValueAndSave(JSON.stringify([{ id: 'skip' }]))

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'データがありません',
            variant: 'destructive',
          })
        )
      })
      expect(mockPost).not.toHaveBeenCalled()
    })

    it('should reject invalid mapped data (attributes null)', async () => {
      const invalidMapper = (): MapResult => ({
        kind: 'data',
        value: {
          settingCode: 'SETTING_CODE',
          code: 'C',
          name: 'N',
          seq: 0,
          attributes: null as unknown as Record<string, unknown>,
        },
      })

      render(<AddJsonData {...defaultProps} mapRawItem={invalidMapper} />)

      await setValueAndSave(JSON.stringify([{ raw: true }]))

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'マッピング結果が無効です',
            variant: 'destructive',
          })
        )
      })
      expect(mockPost).not.toHaveBeenCalled()
    })

    it('should show no-changes toast when mapper response has no requestId', async () => {
      mockPost.mockResolvedValue({
        data: [
          {
            pk: 'MASTER#TEST_TENANT',
            sk: 'SETTING_CODE#EXT_2',
            code: 'EXT_2',
            name: 'External 2',
            attributes: {},
            seq: 0,
          },
        ],
      })

      render(<AddJsonData {...defaultProps} mapRawItem={mapRawItem} />)

      await setValueAndSave(
        JSON.stringify([{ id: 'EXT_2', label: 'External 2' }])
      )

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'データに変更はありませんでした。',
            variant: 'success',
          })
        )
      })
      expect(mockOnSave).toHaveBeenCalled()
      expect(mockStart).not.toHaveBeenCalled()
    })
  })
})
