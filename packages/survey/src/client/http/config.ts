import type { CreateAxiosDefaults } from 'axios'

const defaultConfig: CreateAxiosDefaults<any> = {
  // Use the server-side variable if available, otherwise fall back.
  baseURL:
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000',
  timeout: 30 * 1000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
}

let resolveTenantCode = () => process.env.NEXT_PUBLIC_TENANT_CODE || 'common'

/**
 * Lets the host app decide the tenant per request (e.g. an admin switching scope).
 * Used for the `x-tenant-code` header and command-status subscriptions.
 */
const setTenantCodeResolver = (resolver: () => string) => {
  resolveTenantCode = resolver
}

const getTenantCode = () => resolveTenantCode()

export { defaultConfig, getTenantCode, setTenantCodeResolver }
