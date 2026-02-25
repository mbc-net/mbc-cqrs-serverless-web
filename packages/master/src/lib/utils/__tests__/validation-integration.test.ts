import {
  getValidateRules,
  Rule,
  CompareType,
  ValidateRule,
  RuleInterface,
} from '../validation'

// getValidateRules returns { validate: (value) => string | null }
const getValidate = (rule: ValidateRule) => {
  const rules = getValidateRules(rule)
  return (rules as any).validate as (value: any) => string | null
}

describe('getValidateRules', () => {
  describe('required', () => {
    it('returns error for empty value when required: true', () => {
      const validate = getValidate({ label: 'テスト', required: true })
      expect(validate('')).toBe('テストの入力は必須です')
      expect(validate(null)).toBe('テストの入力は必須です')
    })

    it('returns null for non-empty value when required: true', () => {
      const validate = getValidate({ label: 'テスト', required: true })
      expect(validate('hello')).toBeNull()
    })

    it('returns null for 0 when required: true (0 is valid)', () => {
      const validate = getValidate({ label: 'テスト', required: true })
      expect(validate(0)).toBeNull()
    })
  })

  describe('rules (rule combinations)', () => {
    it('returns error for invalid email with Rule.email', () => {
      const validate = getValidate({
        label: 'メール',
        rules: [Rule.email],
      })
      expect(validate('notanemail')).toBe(
        'メールはメールアドレス形式(半角英数字)で入力してください'
      )
    })

    it('returns null for valid email with Rule.email', () => {
      const validate = getValidate({
        label: 'メール',
        rules: [Rule.email],
      })
      expect(validate('test@example.com')).toBeNull()
    })

    it('returns error for non-numeric with Rule.hankakuNum', () => {
      const validate = getValidate({
        label: '数値',
        rules: [Rule.hankakuNum],
      })
      expect(validate('abc')).toBe('数値は半角数字で入力してください')
    })
  })

  describe('RuleInterface custom rules', () => {
    it('returns error message from custom validate', () => {
      const customRule: RuleInterface = {
        validate: (value, errorLabel) =>
          value < 0 ? `${errorLabel}は0以上の値を入力してください` : null,
      }
      const validate = getValidate({
        label: 'カスタム',
        rules: [customRule],
      })
      expect(validate(-1)).toBe('カスタムは0以上の値を入力してください')
      expect(validate(1)).toBeNull()
    })
  })

  describe('RequiredIfType (conditional required)', () => {
    it('callback pattern: returns error when condition is true and value is empty', () => {
      const validate = getValidate({
        label: '条件付き',
        required: {
          name: 'type',
          watch: 'special',
          callback: (watch) => watch === 'special',
        },
      })
      expect(validate('')).toBe('条件付きの入力は必須です')
    })

    it('callback pattern: returns null when condition is false', () => {
      const validate = getValidate({
        label: '条件付き',
        required: {
          name: 'type',
          watch: 'normal',
          callback: (watch) => watch === 'special',
        },
      })
      expect(validate('')).toBeNull()
    })

    it('value pattern: returns error when watch matches and value is empty', () => {
      const validate = getValidate({
        label: '条件付き',
        required: {
          name: 'type',
          watch: (name: string) => 'target',
          value: 'target',
        },
      })
      expect(validate('')).toBe('条件付きの入力は必須です')
    })

    it('value pattern: returns null when watch does not match', () => {
      const validate = getValidate({
        label: '条件付き',
        required: {
          name: 'type',
          watch: (name: string) => 'other',
          value: 'target',
        },
      })
      expect(validate('')).toBeNull()
    })
  })

  describe('length', () => {
    it('returns error when length does not match', () => {
      const validate = getValidate({ label: 'コード', length: 5 })
      expect(validate('abc')).toBe('コードは5文字で入力してください')
    })

    it('returns null when length matches', () => {
      const validate = getValidate({ label: 'コード', length: 5 })
      expect(validate('abcde')).toBeNull()
    })

    it('validates length after removing commas with addComma', () => {
      const validate = getValidate({
        label: '金額',
        length: 4,
        addComma: true,
      })
      expect(validate('1,000')).toBeNull()
    })
  })

  describe('maxLength', () => {
    it('returns error when exceeding maxLength', () => {
      const validate = getValidate({ label: '名前', maxLength: 3 })
      expect(validate('abcd')).toBe('名前は3文字以内で入力してください')
    })

    it('returns null when within maxLength', () => {
      const validate = getValidate({ label: '名前', maxLength: 3 })
      expect(validate('abc')).toBeNull()
    })
  })

  describe('compare', () => {
    it('returns error when gt comparison fails', () => {
      const validate = getValidate({
        label: '終了',
        compare: {
          name: 'start',
          label: '開始',
          type: CompareType.gt,
          watch: () => 10,
        },
      })
      expect(validate(5)).toBe('終了は開始より大きい値である必要があります')
    })

    it('returns null when gt comparison succeeds', () => {
      const validate = getValidate({
        label: '終了',
        compare: {
          name: 'start',
          label: '開始',
          type: CompareType.gt,
          watch: () => 10,
        },
      })
      expect(validate(15)).toBeNull()
    })

    it('returns date-specific message with isDate', () => {
      const validate = getValidate({
        label: '終了日',
        compare: {
          name: 'startDate',
          label: '開始日',
          type: CompareType.ge,
          watch: () => '20240101',
          isDate: true,
        },
      })
      expect(validate('20230101')).toBe(
        '終了日は開始日以降の日付である必要があります'
      )
    })
  })

  describe('regex', () => {
    it('returns error when regex does not match', () => {
      const validate = getValidate({
        label: '郵便番号',
        regex: /^\d{3}-\d{4}$/,
      })
      expect(validate('1234567')).toBe('郵便番号の形式が異なります')
    })

    it('returns null when regex matches', () => {
      const validate = getValidate({
        label: '郵便番号',
        regex: /^\d{3}-\d{4}$/,
      })
      expect(validate('123-4567')).toBeNull()
    })
  })

  describe('customRule', () => {
    it('returns error from customRule', () => {
      const validate = getValidate({
        label: 'カスタム',
        customRule: (value, errorLabel) =>
          value === 'NG' ? `${errorLabel}はNGです` : null,
      })
      expect(validate('NG')).toBe('カスタムはNGです')
      expect(validate('OK')).toBeNull()
    })
  })

  describe('errorLabel', () => {
    it('errorLabel takes precedence over label', () => {
      const validate = getValidate({
        label: '表示ラベル',
        errorLabel: 'エラーラベル',
        required: true,
      })
      expect(validate('')).toBe('エラーラベルの入力は必須です')
    })
  })

  describe('multiple rules combination', () => {
    it('stops at the first error', () => {
      const validate = getValidate({
        label: 'テスト',
        required: true,
        rules: [Rule.email],
        maxLength: 50,
      })
      // required check runs first (executed within rules validate)
      expect(validate('')).toBe('テストの入力は必須です')
    })
  })
})
