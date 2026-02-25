import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useAsyncAction } from '../useAsyncAction'
import { LoadingProviderWrapper } from '../../../testing/test-utils'

describe('useAsyncAction', () => {
  it('completes loading cycle: setLoading → execute → closeLoading', async () => {
    const { result } = renderHook(() => useAsyncAction(), {
      wrapper: LoadingProviderWrapper,
    })

    await act(async () => {
      await result.current.performAction(async () => 'done')
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('returns the result of the async function', async () => {
    const { result } = renderHook(() => useAsyncAction(), {
      wrapper: LoadingProviderWrapper,
    })

    let returnValue: string | undefined
    await act(async () => {
      returnValue = await result.current.performAction(
        async () => 'test-result'
      )
    })

    expect(returnValue).toBe('test-result')
  })

  it('calls closeLoading in finally block on error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const { result } = renderHook(() => useAsyncAction(), {
      wrapper: LoadingProviderWrapper,
    })

    await act(async () => {
      try {
        await result.current.performAction(async () => {
          throw new Error('test error')
        })
      } catch (e) {
        // expected
      }
    })

    expect(result.current.isLoading).toBe(false)
    consoleSpy.mockRestore()
  })
})
