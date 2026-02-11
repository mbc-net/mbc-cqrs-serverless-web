import React, { ReactNode } from 'react'
import { LoadingProvider } from '../lib/stores/provider'

/**
 * Creates a mock HTTP client with a configurable post method.
 * Used by checkExistCode tests across modules.
 */
export const createMockHttpClient = (
  responseData?: any,
  shouldThrow = false
) => ({
  post: jest.fn().mockImplementation(() => {
    if (shouldThrow) {
      return Promise.reject(new Error('Network error'))
    }
    return Promise.resolve({ data: responseData })
  }),
})

/**
 * React wrapper that provides LoadingProvider context.
 * Used by hook tests that depend on loading state.
 */
export const LoadingProviderWrapper = ({
  children,
}: {
  children: ReactNode
}) => <LoadingProvider>{children}</LoadingProvider>
