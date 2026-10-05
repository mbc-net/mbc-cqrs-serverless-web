import { fetchAuthSession } from 'aws-amplify/auth'
import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'
import { defaultConfig, getTenantCode } from './config'

/**
 * Creates and configures an Axios instance with a request interceptor
 * to automatically attach an authentication token.
 *
 * @param config Optional Axios configuration to override the default.
 * @returns An AxiosInstance ready for making API requests.
 */
function createAxiosInstance(
  config: CreateAxiosDefaults<any> = defaultConfig
): AxiosInstance {
  const instance = axios.create(config)

  instance.interceptors.request.use(
    async (reqConfig) => {
      try {
        const session = await fetchAuthSession()
        const idToken = session?.tokens?.idToken?.toString()
        const accessToken = session?.tokens?.accessToken?.toString()

        let tokenString = ''
        if (idToken) {
          tokenString = idToken
        } else if (accessToken) {
          tokenString = accessToken
        }

        if (tokenString) {
          reqConfig.headers.Authorization = `Bearer ${tokenString}`
        }
      } catch (error) {
        console.error('Error fetching authentication session:', error)
      }
      if (!reqConfig.headers['x-tenant-code']) {
        reqConfig.headers['x-tenant-code'] = getTenantCode()
      }
      return reqConfig
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}

const clientAxiosInstance = createAxiosInstance()

export { clientAxiosInstance }
