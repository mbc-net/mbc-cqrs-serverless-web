import React from 'react'
import { render, waitFor } from '@testing-library/react'
import EditMasterSettings from '../index'

// --- Mocks ---

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

jest.mock('../../../../lib/hook/useHealthCheck', () => jest.fn())

// Mock SettingsForm to avoid rendering the full form tree
jest.mock('../../components/SettingsForm', () => {
  return function MockSettingsForm(props: any) {
    return <div data-testid="settings-form" />
  }
})

// Mock dynamic imports used in the component
jest.mock('../../../../components/JsonEditor', () => ({}))
jest.mock('../../../../components/RichTextEditor', () => ({}))

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

describe('EditMasterSettings', () => {
  it('calls setLoading → API GET → closeLoading when pk and sk are present', async () => {
    useParams.mockReturnValue({ pk: 'TENANT%23SETTING', sk: 'CODE%23001' })
    mockGet.mockResolvedValue({
      data: { pk: 'TENANT#SETTING', sk: 'CODE#001', name: 'test' },
    })

    render(<EditMasterSettings />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockGet).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/master-setting/detail/')
    )

    // Verify the correct order: setLoading before closeLoading
    const setLoadingOrder = mockSetLoading.mock.invocationCallOrder[0]
    const closeLoadingOrder = mockCloseLoading.mock.invocationCallOrder[0]
    expect(setLoadingOrder).toBeLessThan(closeLoadingOrder)
  })

  it('calls setLoading → closeLoading without API call when pk is undefined', async () => {
    useParams.mockReturnValue({ pk: undefined, sk: 'CODE%23001' })

    render(<EditMasterSettings />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('calls setLoading → closeLoading without API call when sk is undefined', async () => {
    useParams.mockReturnValue({ pk: 'TENANT%23SETTING', sk: undefined })

    render(<EditMasterSettings />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('calls closeLoading in finally block when API throws an error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    useParams.mockReturnValue({ pk: 'TENANT%23SETTING', sk: 'CODE%23001' })
    mockGet.mockRejectedValue(new Error('Network error'))

    render(<EditMasterSettings />)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
      expect(mockCloseLoading).toHaveBeenCalled()
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch setting data:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })
})
