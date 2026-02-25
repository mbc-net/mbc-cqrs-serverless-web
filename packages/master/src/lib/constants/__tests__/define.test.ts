import { ErrorCode, ApiErrorCode } from '../define'

describe('lib/constants/define', () => {
  describe('ErrorCode', () => {
    it('all keys should have non-empty string values', () => {
      for (const key of Object.keys(ErrorCode)) {
        expect(typeof ErrorCode[key as keyof typeof ErrorCode]).toBe('string')
        expect(ErrorCode[key as keyof typeof ErrorCode].length).toBeGreaterThan(
          0
        )
      }
    })

    it('should define required error codes', () => {
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR')
      expect(ErrorCode.SESSION_TIMEOUT).toBe('SESSION_TIMEOUT')
      expect(ErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR')
      expect(ErrorCode.TIMEOUT).toBe('TIMEOUT')
    })
  })

  describe('ApiErrorCode', () => {
    it('should define ValidationError', () => {
      expect(ApiErrorCode.ValidationError).toBe('VALIDATION_ERROR')
    })
  })
})
