import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useLoadingForm } from '../useLoadingForm'
import { LoadingProviderWrapper } from '../../../testing/test-utils'

describe('useLoadingForm', () => {
  it('returns form methods', () => {
    const { result } = renderHook(() => useLoadingForm(), {
      wrapper: LoadingProviderWrapper,
    })

    expect(result.current.control).toBeDefined()
    expect(result.current.handleSubmit).toBeDefined()
    expect(result.current.watch).toBeDefined()
    expect(result.current.getValues).toBeDefined()
    expect(result.current.setValue).toBeDefined()
    expect(result.current.setError).toBeDefined()
    expect(result.current.reset).toBeDefined()
    expect(result.current.trigger).toBeDefined()
    expect(result.current.form).toBeDefined()
  })

  it('returns isValid', () => {
    const { result } = renderHook(() => useLoadingForm(), {
      wrapper: LoadingProviderWrapper,
    })

    expect(typeof result.current.isValid).toBe('boolean')
  })

  it('returns errors', () => {
    const { result } = renderHook(() => useLoadingForm(), {
      wrapper: LoadingProviderWrapper,
    })

    expect(result.current.errors).toBeDefined()
  })

  it('gets loading state from LoadingProvider', () => {
    const { result } = renderHook(() => useLoadingForm(), {
      wrapper: LoadingProviderWrapper,
    })

    expect(result.current.loading).toBe(true)
  })

  it('returns loadingStore', () => {
    const { result } = renderHook(() => useLoadingForm(), {
      wrapper: LoadingProviderWrapper,
    })

    expect(result.current.loadingStore).toBeDefined()
    expect(result.current.loadingStore.setLoading).toBeDefined()
    expect(result.current.loadingStore.closeLoading).toBeDefined()
  })

  it('sets loading to false on closeLoading', () => {
    const { result } = renderHook(() => useLoadingForm(), {
      wrapper: LoadingProviderWrapper,
    })

    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.loadingStore.closeLoading()
    })

    expect(result.current.loading).toBe(false)
  })

  it('applies defaultValues correctly', () => {
    const { result } = renderHook(
      () =>
        useLoadingForm<{ name: string; age: number }>({
          defaultValues: { name: 'テスト', age: 25 },
        }),
      { wrapper: LoadingProviderWrapper }
    )

    expect(result.current.getValues('name')).toBe('テスト')
    expect(result.current.getValues('age')).toBe(25)
  })
})
