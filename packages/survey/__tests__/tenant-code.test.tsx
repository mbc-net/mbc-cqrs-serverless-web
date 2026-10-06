import { AxiosHeaders } from 'axios'
import { act, renderHook } from '@testing-library/react'

jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn().mockResolvedValue({}),
}))
jest.mock('../src/client/appsync/index', () => ({
  __esModule: true,
  default: {},
}))
jest.mock('../src/client/appsync/subscribe', () => ({
  ActionEnum: { COMMAND_STATUS: 'command-status' },
  subscribeMessage: jest.fn(() => ({ unsubscribe: jest.fn() })),
}))

import { clientAxiosInstance } from '../src/client/http'
import { getTenantCode, setTenantCodeResolver } from '../src/client/http/config'
import { useSubscribeCommandStatus } from '../src/client/appsync/useSubscribeMessage'
import { subscribeMessage } from '../src/client/appsync/subscribe'

const runRequestInterceptor = (headers = new AxiosHeaders()) => {
  const { handlers } = clientAxiosInstance.interceptors.request as unknown as {
    handlers: { fulfilled: (c: any) => Promise<any> }[]
  }
  return handlers[0].fulfilled({ headers })
}

describe('tenant code resolver', () => {
  afterEach(() => setTenantCodeResolver(() => 'common'))

  it('defaults to NEXT_PUBLIC_TENANT_CODE or common', () => {
    expect(getTenantCode()).toBe(
      process.env.NEXT_PUBLIC_TENANT_CODE || 'common'
    )
  })

  it('sends the resolver result as x-tenant-code on every request', async () => {
    let tenant = 'jcci'
    setTenantCodeResolver(() => tenant)

    const first = await runRequestInterceptor()
    expect(first.headers['x-tenant-code']).toBe('jcci')

    tenant = 'lobo' // admin switched scope
    const second = await runRequestInterceptor()
    expect(second.headers['x-tenant-code']).toBe('lobo')
  })

  it('keeps an x-tenant-code header set explicitly on the request', async () => {
    setTenantCodeResolver(() => 'lobo')
    const config = await runRequestInterceptor(
      new AxiosHeaders({ 'x-tenant-code': 'system' })
    )
    expect(config.headers['x-tenant-code']).toBe('system')
  })

  it('subscribes to command status under the resolved tenant', () => {
    setTenantCodeResolver(() => 'lobo')
    const { result } = renderHook(() => useSubscribeCommandStatus(jest.fn()))

    act(() => result.current.start('req-1'))

    expect(subscribeMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ tenantCode: 'lobo', id: 'req-1' }),
      expect.any(Function)
    )
  })
})
