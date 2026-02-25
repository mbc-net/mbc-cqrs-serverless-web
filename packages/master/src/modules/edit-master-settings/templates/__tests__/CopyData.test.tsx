import React from 'react'
import { render, waitFor } from '@testing-library/react'
import CopyMasterSettings from '../CopyData'

// --- Mocks ---

const mockBack = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('../../../../lib/hook/useHealthCheck', () => jest.fn())

// Mock child components to isolate the test
jest.mock('../../../../components/buttons/back-button', () => ({
  BackButton: (props: any) => (
    <button data-testid="back-button" onClick={props.onClickPrev} />
  ),
}))
jest.mock('../../../../components/table/data-table', () => ({
  DataTable: () => <div data-testid="data-table" />,
}))
jest.mock('../../../../components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}))

const mockSetLoading = jest.fn()
const mockCloseLoading = jest.fn()
const mockGet = jest.fn()

jest.mock('../../../../provider', () => ({
  useHttpClient: () => ({ get: mockGet }),
  useUrlProvider: () => ({
    getDetailedCopySettingPageUrl: (id: string) => `/copy/${id}`,
  }),
  useUserContext: () => ({ tenantCode: 'TEST_TENANT' }),
}))

jest.mock('../../../../lib/stores/hooks', () => ({
  useLoadingStore: () => ({
    setLoading: mockSetLoading,
    closeLoading: mockCloseLoading,
    isLoading: false,
  }),
}))

const { useParams } = require('next/navigation')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CopyMasterSettings', () => {
  it('calls setLoading → API GET → closeLoading when pk and sk are present', async () => {
    useParams.mockReturnValue({ pk: 'TENANT%23SETTING', sk: 'CODE%23001' })
    mockGet.mockResolvedValue({ data: [] })

    render(<CopyMasterSettings />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockGet).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(mockGet).toHaveBeenCalledWith(
      '/tasks/sfn-task-parent',
      expect.objectContaining({ params: expect.any(Object) })
    )

    // Verify the correct order: setLoading before closeLoading
    const setLoadingOrder = mockSetLoading.mock.invocationCallOrder[0]
    const closeLoadingOrder = mockCloseLoading.mock.invocationCallOrder[0]
    expect(setLoadingOrder).toBeLessThan(closeLoadingOrder)
  })

  it('does not fetch when pk is undefined', async () => {
    useParams.mockReturnValue({ pk: undefined, sk: 'CODE%23001' })

    render(<CopyMasterSettings />)

    // Wait a tick to ensure useEffect has had time to run
    await waitFor(() => {
      expect(mockSetLoading).not.toHaveBeenCalled()
    })

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('does not fetch when sk is undefined', async () => {
    useParams.mockReturnValue({ pk: 'TENANT%23SETTING', sk: undefined })

    render(<CopyMasterSettings />)

    await waitFor(() => {
      expect(mockSetLoading).not.toHaveBeenCalled()
    })

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('calls closeLoading in finally block when API throws an error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    useParams.mockReturnValue({ pk: 'TENANT%23SETTING', sk: 'CODE%23001' })
    mockGet.mockRejectedValue(new Error('Network error'))

    render(<CopyMasterSettings />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch copy results:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })
})
