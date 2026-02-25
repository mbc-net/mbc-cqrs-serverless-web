// /lib/providers/AppProviders.tsx
import React, { createContext, useContext, ReactNode, useMemo } from 'react'
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
} from '@apollo/client'
import { AxiosInstance } from 'axios'
import { UserContext } from './types/UserContext'
import { BaseUrlProvider, IUrlProvider } from './lib/constants/url'
import { getClientInstance } from './lib/sdk/app-client'
import apolloClientInstance from './appsync/apollo-client'
import { LoadingProvider } from './lib/stores/provider'

// --- Type Definitions for our Contexts ---

/**
 * Defines the shape of the services that will be provided.
 * Any component in the app can access these services.
 */
export interface AppServices {
  httpClient: AxiosInstance
  apolloClient: ApolloClient<NormalizedCacheObject>
  user: UserContext
  urlProvider: IUrlProvider // URL generation utility
}

// --- React Context Creation ---

// We create a context with a `null` default value. This means if a component
// tries to use the context outside of its provider, we can throw a helpful error.
const AppContext = createContext<AppServices | null>(null)

// --- The Main Provider Component ---

/**
 * Props for the AppRootProvider. It accepts the service instances
 * so they can be configured from the outside (e.g., in _app.tsx).
 */
interface AppRootProviderProps {
  children: ReactNode
  services: AppServices
}

/**
 * This is the main provider component. It takes the service instances
 * and makes them available to all child components through the AppContext.
 * It also wraps children with the official ApolloProvider.
 */
function AppRootProvider({ children, services }: AppRootProviderProps) {
  return (
    <AppContext.Provider value={services}>
      <ApolloProvider client={services.apolloClient}>{children}</ApolloProvider>
    </AppContext.Provider>
  )
}

// --- Custom Hooks for Consuming Contexts ---

/**
 * A custom hook to easily access all of the app's services.
 * This is the public API for our components. It abstracts away the need
 * to know about `useContext` and provides better error handling.
 *
 * @returns {AppServices} The services provided by AppRootProvider.
 * @throws {Error} If used outside of an AppRootProvider.
 */
export function useAppServices(): AppServices {
  const context = useContext(AppContext)
  if (context === null) {
    throw new Error('useAppServices must be used within an AppRootProvider')
  }
  return context
}

/**
 * A specific hook to get only the HTTP client instance.
 */
export function useHttpClient(): AxiosInstance {
  const { httpClient } = useAppServices()
  return httpClient
}

/**
 * A specific hook to get only the Apollo client instance.
 */
export function useApolloClient(): ApolloClient<NormalizedCacheObject> {
  const { apolloClient } = useAppServices()
  return apolloClient
}

/**
 * A specific hook to get the current user/chamber information.
 * This replaces the need to pass the `cci` object as props everywhere.
 */
export function useUserContext(): UserContext {
  const { user } = useAppServices()
  return user
}

/**
 * A specific hook to get the URL provider instance.
 * This ensures all components use the same, correctly configured URL generator.
 */
export function useUrlProvider(): IUrlProvider {
  const { urlProvider } = useAppServices()
  return urlProvider
}

// --- Assembling and Exporting the Final Provider ---

/**
 * Props for the main AppProviders component.
 * Allows consumers to override default service implementations.
 */
interface AppProvidersProps {
  children: ReactNode

  user: UserContext
  /**
   * (Optional) Provide a custom Axios instance. If not provided, a default one will be created.
   * Useful for testing or custom interceptors.
   */
  httpClient?: AxiosInstance
  /**
   * (Optional) Provide a custom Apollo Client instance. If not provided, the default one will be used.
   */
  apolloClient?: ApolloClient<NormalizedCacheObject>
  /**
   * (Optional) Provide a custom URL provider. If not provided, one will be created based on the `cci` prop.
   * Useful for different environments or routing logic.
   */
  urlProvider?: IUrlProvider
}

/**
 * This is the component you will use to wrap your application.
 * It initializes the service instances (or uses the ones provided in props)
 * and makes them available to the entire component tree.
 */
export function AppProviders({
  children,
  user,
  httpClient,
  apolloClient,
  urlProvider,
}: AppProvidersProps) {
  // `useMemo` ensures that our services object is not recreated on every render,
  // which prevents unnecessary re-renders in consuming components.
  const services = useMemo(() => {
    return {
      // Use the provided service instance from props, or create a default one as a fallback.
      httpClient: httpClient ?? getClientInstance(),
      apolloClient: apolloClient ?? apolloClientInstance,
      urlProvider: urlProvider ?? new BaseUrlProvider(),
      user: user,
    }
  }, [user, httpClient, apolloClient, urlProvider])

  return (
    <AppRootProvider services={services}>
      <LoadingProvider>{children}</LoadingProvider>
    </AppRootProvider>
  )
}

export { useLoadingStore } from './lib/stores/hooks'
