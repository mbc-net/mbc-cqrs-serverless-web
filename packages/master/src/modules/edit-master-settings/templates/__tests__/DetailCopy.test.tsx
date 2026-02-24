import React from 'react'
import { render, waitFor } from '@testing-library/react'
import DetailCopy from '../DetailCopy'

// --- Mocks ---

const mockBack = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

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

describe('DetailCopy', () => {
  it('calls setLoading → API GET → closeLoading when id is present', async () => {
    useParams.mockReturnValue({
      pk: 'TENANT%23SETTING',
      sk: 'CODE%23001',
      id: 'TASK%23001%23SUB%23002',
    })
    mockGet.mockResolvedValue({ data: [] })

    render(<DetailCopy />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockGet).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('/tasks/'))

    // Verify the correct order: setLoading before closeLoading
    const setLoadingOrder = mockSetLoading.mock.invocationCallOrder[0]
    const closeLoadingOrder = mockCloseLoading.mock.invocationCallOrder[0]
    expect(setLoadingOrder).toBeLessThan(closeLoadingOrder)
  })

  it('does not fetch when id is undefined', async () => {
    useParams.mockReturnValue({
      pk: 'TENANT%23SETTING',
      sk: 'CODE%23001',
      id: undefined,
    })

    render(<DetailCopy />)

    await waitFor(() => {
      expect(mockSetLoading).not.toHaveBeenCalled()
    })

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('calls closeLoading in finally block when API throws an error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    useParams.mockReturnValue({
      pk: 'TENANT%23SETTING',
      sk: 'CODE%23001',
      id: 'TASK%23001%23SUB%23002',
    })
    mockGet.mockRejectedValue(new Error('Network error'))

    render(<DetailCopy />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch task details:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })
})
