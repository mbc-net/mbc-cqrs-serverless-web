import {
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  MaintenanceException,
  NetworkException,
  TimeoutException,
  UnknownException,
} from '../exception'
import { ExceptionBase } from '../exception-base'
import { ErrorCode } from '../../lib/constants/define'

describe('ExceptionBase', () => {
  it('should store and return detail', () => {
    const detail = { error_code: 'TEST', message: 'test error' }
    // Use a concrete subclass since ExceptionBase is abstract
    const error = new NotFoundException(detail)
    expect(error.getDetail()).toEqual(detail)
    expect(error.getErrorCode()).toBe('TEST')
    expect(error.getErrorMessage()).toBe('test error')
  })

  it('should return null for missing detail', () => {
    const error = new NotFoundException()
    expect(error.getDetail()).toBeUndefined()
    expect(error.getErrorCode()).toBeUndefined()
  })

  it('should return HTTP status from axios error', () => {
    const axiosError = {
      response: { status: 500 },
    } as any
    const error = new UnknownException(undefined, axiosError)
    expect(error.getHttpStatusCode()).toBe(500)
  })
})

describe('NotFoundException', () => {
  it('should return 404', () => {
    const error = new NotFoundException()
    expect(error.getHttpStatusCode()).toBe(404)
  })
})

describe('UnauthorizedException', () => {
  it('should return 401', () => {
    const error = new UnauthorizedException()
    expect(error.getHttpStatusCode()).toBe(401)
  })
})

describe('ForbiddenException', () => {
  it('should return 403', () => {
    const error = new ForbiddenException()
    expect(error.getHttpStatusCode()).toBe(403)
  })
})

describe('MaintenanceException', () => {
  it('should return maintenance error code', () => {
    const error = new MaintenanceException()
    expect(error.getErrorCode()).toBe(ErrorCode.MAINTENANCE)
  })

  it('should return default message when no detail', () => {
    const error = new MaintenanceException()
    expect(error.getErrorMessage()).toBe('現在システムはメンテナンス中です。')
  })

  it('should return detail message when provided', () => {
    const error = new MaintenanceException({
      detail: 'カスタムメンテナンスメッセージ',
    } as any)
    expect(error.getErrorMessage()).toBe('カスタムメンテナンスメッセージ')
  })

  it('should return null for error detail code', () => {
    const error = new MaintenanceException()
    expect(error.getErrorDetailCode()).toBeNull()
  })
})

describe('NetworkException', () => {
  it('should return 503 and NETWORK_ERROR code', () => {
    const error = new NetworkException()
    expect(error.getHttpStatusCode()).toBe(503)
    expect(error.getErrorCode()).toBe(ErrorCode.NETWORK_ERROR)
  })
})

describe('TimeoutException', () => {
  it('should return 504 and TIMEOUT code', () => {
    const error = new TimeoutException()
    expect(error.getHttpStatusCode()).toBe(504)
    expect(error.getErrorCode()).toBe(ErrorCode.TIMEOUT)
  })
})
