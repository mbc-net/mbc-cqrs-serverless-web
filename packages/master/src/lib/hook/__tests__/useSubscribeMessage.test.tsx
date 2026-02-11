import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  useSubscribeCommandStatus,
  useSubscribeBulkCommandStatus,
} from '../useSubscribeMessage'

// --- Mocks ---

// Mock subscribeMessage to return a controllable subscription
const mockUnsubscribe = vi.fn()
let subscribeHandler: ((message: any) => void) | null = null

vi.mock('../../../appsync', () => ({
  ActionEnum: { COMMAND_STATUS: 'command-status' },
  subscribeMessage: vi.fn((_client, _filters, handler) => {
    subscribeHandler = handler
    return { unsubscribe: mockUnsubscribe }
  }),
}))

// Mock useToast - mimics real behavior where useToast() returns a new object
// each render (due to ...state spread), with an unstable dismiss function
const mockToast = vi.fn()
vi.mock('../../../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
    toasts: [],
    // Real use-toast.ts creates a new arrow function each call:
    //   dismiss: (toastId?) => dispatch({ type: 'DISMISS_TOAST', toastId })
    dismiss: vi.fn(),
  }),
}))

// Mock useApolloClient
const mockApolloClient = {} as any
vi.mock('../../../provider', () => ({
  useApolloClient: () => mockApolloClient,
}))

// Mock useIsomorphicLayoutEffect as useEffect for test environment
vi.mock('usehooks-ts', () => ({
  useIsomorphicLayoutEffect: React.useEffect,
}))

// Helper: create a finish:FINISHED message
function createFinishedMessage(reqId: string) {
  return {
    id: reqId,
    table: 'test',
    pk: 'pk',
    sk: 'sk',
    tenantCode: 'test-tenant',
    action: 'command-status',
    content: { status: 'finish:FINISHED' },
  }
}

// Helper: create a check_version:STARTED message
function createStartedMessage(reqId: string) {
  return {
    id: reqId,
    table: 'test',
    pk: 'pk',
    sk: 'sk',
    tenantCode: 'test-tenant',
    action: 'command-status',
    content: { status: 'check_version:STARTED' },
  }
}

describe('useSubscribeCommandStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    subscribeHandler = null
  })

  it('should not subscribe when reqId is not set', () => {
    const doneCallback = vi.fn()
    const { result } = renderHook(() =>
      useSubscribeCommandStatus('test-tenant', doneCallback)
    )

    expect(result.current.isListening).toBe(false)
    expect(mockUnsubscribe).not.toHaveBeenCalled()
  })

  it('should subscribe when start is called', () => {
    const doneCallback = vi.fn()
    const { result } = renderHook(() =>
      useSubscribeCommandStatus('test-tenant', doneCallback)
    )

    act(() => {
      result.current.start('req-123')
    })

    expect(result.current.isListening).toBe(true)
    expect(subscribeHandler).not.toBeNull()
  })

  it('should call doneCallback on finish:FINISHED', () => {
    const doneCallback = vi.fn()
    const { result } = renderHook(() =>
      useSubscribeCommandStatus('test-tenant', doneCallback)
    )

    act(() => {
      result.current.start('req-123')
    })

    // Simulate receiving a FINISHED message
    act(() => {
      subscribeHandler!(createFinishedMessage('req-123'))
    })

    expect(doneCallback).toHaveBeenCalledTimes(1)
    expect(result.current.isListening).toBe(false)
  })

  it('should ignore messages with different reqId', () => {
    const doneCallback = vi.fn()
    const { result } = renderHook(() =>
      useSubscribeCommandStatus('test-tenant', doneCallback)
    )

    act(() => {
      result.current.start('req-123')
    })

    // Simulate a message with a different id
    act(() => {
      subscribeHandler!(createFinishedMessage('req-OTHER'))
    })

    expect(doneCallback).not.toHaveBeenCalled()
    expect(result.current.isListening).toBe(true)
  })

  it('should not re-subscribe on unrelated re-renders', () => {
    const doneCallback = vi.fn()
    const { result, rerender } = renderHook(() =>
      useSubscribeCommandStatus('test-tenant', doneCallback)
    )

    act(() => {
      result.current.start('req-123')
    })

    mockUnsubscribe.mockClear()

    // Rerender multiple times (simulating parent re-renders)
    rerender()
    rerender()
    rerender()

    // The subscription should NOT have been torn down and recreated
    expect(mockUnsubscribe).not.toHaveBeenCalled()
  })
})

describe('useSubscribeBulkCommandStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    subscribeHandler = null
  })

  it('should not subscribe when reqId is not set', () => {
    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    expect(result.current.isListening).toBe(false)
    expect(mockUnsubscribe).not.toHaveBeenCalled()
  })

  it('should subscribe when start is called', () => {
    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    expect(result.current.isListening).toBe(true)
    expect(subscribeHandler).not.toBeNull()
  })

  it('should increment finishedCount on finish:FINISHED', () => {
    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    // Simulate receiving a FINISHED message
    act(() => {
      subscribeHandler!(createFinishedMessage('req-bulk-123'))
    })

    expect(result.current.finishedCount).toBe(1)

    // Simulate a second FINISHED message
    act(() => {
      subscribeHandler!(createFinishedMessage('req-bulk-123'))
    })

    expect(result.current.finishedCount).toBe(2)
  })

  it('should reset state when stop is called', () => {
    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    act(() => {
      subscribeHandler!(createFinishedMessage('req-bulk-123'))
    })

    expect(result.current.finishedCount).toBe(1)

    act(() => {
      result.current.stop()
    })

    expect(result.current.isListening).toBe(false)
    expect(result.current.finishedCount).toBe(0)
    expect(result.current.messages).toHaveLength(0)
  })

  it('should ignore messages with different reqId', () => {
    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    act(() => {
      subscribeHandler!(createFinishedMessage('req-OTHER'))
    })

    expect(result.current.finishedCount).toBe(0)
    expect(result.current.messages).toHaveLength(0)
  })

  it('should show toast only once for check_version:STARTED', () => {
    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    // First STARTED message
    act(() => {
      subscribeHandler!(createStartedMessage('req-bulk-123'))
    })

    expect(mockToast).toHaveBeenCalledTimes(1)

    // Second STARTED message - should NOT show toast again
    act(() => {
      subscribeHandler!(createStartedMessage('req-bulk-123'))
    })

    expect(mockToast).toHaveBeenCalledTimes(1)
  })

  /**
   * CRITICAL TEST: This test verifies that the subscription is NOT torn down
   * and recreated on unrelated re-renders.
   *
   * The bug: useEffect dependency array includes [reqId, appsyncClient, xTenantCode,
   * timeoutMs, toast, stop] which may cause the effect to re-run when any of these
   * change reference, leading to a subscribe/unsubscribe infinite loop.
   *
   * The fix: dependency array should be [reqId] only, matching useSubscribeCommandStatus.
   */
  it('should not re-subscribe on unrelated re-renders (no infinite loop)', () => {
    const { result, rerender } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    // Clear the unsubscribe call count after initial subscription
    mockUnsubscribe.mockClear()

    // Rerender multiple times (simulating parent re-renders that would
    // create new function references for toast, stop, etc.)
    rerender()
    rerender()
    rerender()

    // The subscription should NOT have been torn down and recreated.
    // If the dependency array is too broad (including toast, stop, etc.),
    // each rerender would trigger unsubscribe + resubscribe = infinite loop.
    expect(mockUnsubscribe).not.toHaveBeenCalled()
  })

  it('should unsubscribe when stop is called', () => {
    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    mockUnsubscribe.mockClear()

    act(() => {
      result.current.stop()
    })

    // stop() sets reqId to null, which triggers the cleanup
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('should call onTimeout when timeout fires', async () => {
    vi.useFakeTimers()
    const onTimeout = vi.fn()

    const { result } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant', onTimeout)
    )

    act(() => {
      result.current.start('req-bulk-123', 5000)
    })

    // Advance timer past timeout
    act(() => {
      vi.advanceTimersByTime(5001)
    })

    expect(onTimeout).toHaveBeenCalledTimes(1)
    expect(result.current.isListening).toBe(false)

    vi.useRealTimers()
  })

  /**
   * CRITICAL REGRESSION TEST: Simulates the real-world scenario where
   * a toast notification causes the component to re-render with new state,
   * which in turn may cause the useEffect dependency array to detect a change
   * and re-subscribe.
   *
   * In the real app, when check_version:STARTED triggers a toast, the toast
   * state change causes a re-render. If the useEffect dependency array includes
   * unstable references (toast, stop), this re-render will tear down and recreate
   * the subscription — producing the infinite "msgSubs unsubscribe (bulk)" loop.
   */
  it('should maintain subscription after toast triggers a re-render', () => {
    const { result, rerender } = renderHook(() =>
      useSubscribeBulkCommandStatus('test-tenant')
    )

    act(() => {
      result.current.start('req-bulk-123')
    })

    mockUnsubscribe.mockClear()

    // Simulate receiving a STARTED message that triggers toast
    act(() => {
      subscribeHandler!(createStartedMessage('req-bulk-123'))
    })

    expect(mockToast).toHaveBeenCalledTimes(1)

    // The toast triggered a re-render — subscription must remain stable
    expect(mockUnsubscribe).not.toHaveBeenCalled()

    // Receiving a FINISHED message should still work on the same subscription
    act(() => {
      subscribeHandler!(createFinishedMessage('req-bulk-123'))
    })

    expect(result.current.finishedCount).toBe(1)
  })
})
