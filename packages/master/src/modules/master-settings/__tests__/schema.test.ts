import {
  isValidSettingJson,
  isValidMasterDataJson,
  isValidBulkJson,
  sampleSettingJson,
  sampleMixedJson,
} from '../schema'

describe('master-settings/schema', () => {
  describe('isValidSettingJson', () => {
    it('valid data returns true', () => {
      const data = [
        {
          code: 'CODE',
          name: '名前',
          attributes: {
            description: '',
            fields: [
              {
                physicalName: 'code',
                name: 'コード',
                dataType: 'string',
                isRequired: true,
                isShowedOnList: true,
              },
            ],
          },
        },
      ]
      expect(isValidSettingJson(data)).toBe(true)
    })

    it('array of multiple items returns true', () => {
      const data = [
        {
          code: 'A',
          name: 'A名',
          attributes: {
            fields: [
              {
                physicalName: 'f1',
                name: 'F1',
                dataType: 'string',
                isRequired: false,
                isShowedOnList: false,
              },
            ],
          },
        },
        {
          code: 'B',
          name: 'B名',
          attributes: {
            fields: [
              {
                physicalName: 'f2',
                name: 'F2',
                dataType: 'number',
                isRequired: true,
                isShowedOnList: true,
              },
            ],
          },
        },
      ]
      expect(isValidSettingJson(data)).toBe(true)
    })

    it('non-array returns false', () => {
      expect(isValidSettingJson({})).toBe(false)
      expect(isValidSettingJson('string')).toBe(false)
      expect(isValidSettingJson(null)).toBe(false)
      expect(isValidSettingJson(undefined)).toBe(false)
      expect(isValidSettingJson(42)).toBe(false)
    })

    it('empty array returns true (no items to validate)', () => {
      expect(isValidSettingJson([])).toBe(true)
    })

    it('non-object item returns false', () => {
      expect(isValidSettingJson(['string'])).toBe(false)
      expect(isValidSettingJson([null])).toBe(false)
      expect(isValidSettingJson([42])).toBe(false)
    })

    it('missing code returns false', () => {
      const data = [{ name: '名前', attributes: { fields: [] } }]
      expect(isValidSettingJson(data)).toBe(false)
    })

    it('missing name returns false', () => {
      const data = [{ code: 'CODE', attributes: { fields: [] } }]
      expect(isValidSettingJson(data)).toBe(false)
    })

    it('missing attributes returns false', () => {
      const data = [{ code: 'CODE', name: '名前' }]
      expect(isValidSettingJson(data)).toBe(false)
    })

    it('non-object attributes returns false', () => {
      const data = [{ code: 'CODE', name: '名前', attributes: 'string' }]
      expect(isValidSettingJson(data)).toBe(false)
    })

    it('non-array fields returns false', () => {
      const data = [
        { code: 'CODE', name: '名前', attributes: { fields: 'invalid' } },
      ]
      expect(isValidSettingJson(data)).toBe(false)
    })

    it('missing fields returns false', () => {
      const data = [
        { code: 'CODE', name: '名前', attributes: { description: '' } },
      ]
      expect(isValidSettingJson(data)).toBe(false)
    })

    it('missing physicalName in field returns false', () => {
      const data = [
        {
          code: 'CODE',
          name: '名前',
          attributes: {
            fields: [
              {
                name: 'F',
                dataType: 'string',
                isRequired: true,
                isShowedOnList: true,
              },
            ],
          },
        },
      ]
      expect(isValidSettingJson(data)).toBe(false)
    })

    it('non-boolean isRequired in field returns false', () => {
      const data = [
        {
          code: 'CODE',
          name: '名前',
          attributes: {
            fields: [
              {
                physicalName: 'f',
                name: 'F',
                dataType: 'string',
                isRequired: 'yes',
                isShowedOnList: true,
              },
            ],
          },
        },
      ]
      expect(isValidSettingJson(data)).toBe(false)
    })
  })

  describe('isValidMasterDataJson', () => {
    it('valid data returns true', () => {
      const data = [
        {
          settingCode: 'SETTING',
          code: 'CODE',
          name: '名前',
          seq: 0,
          attributes: { description: '' },
        },
      ]
      expect(isValidMasterDataJson(data)).toBe(true)
    })

    it('non-array returns false', () => {
      expect(isValidMasterDataJson({})).toBe(false)
      expect(isValidMasterDataJson(null)).toBe(false)
    })

    it('missing settingCode returns false', () => {
      const data = [{ code: 'CODE', name: '名前', seq: 0, attributes: {} }]
      expect(isValidMasterDataJson(data)).toBe(false)
    })

    it('non-numeric seq returns false', () => {
      const data = [
        {
          settingCode: 'S',
          code: 'C',
          name: 'N',
          seq: '0',
          attributes: {},
        },
      ]
      expect(isValidMasterDataJson(data)).toBe(false)
    })

    it('non-object attributes returns false', () => {
      const data = [
        {
          settingCode: 'S',
          code: 'C',
          name: 'N',
          seq: 0,
          attributes: 'invalid',
        },
      ]
      expect(isValidMasterDataJson(data)).toBe(false)
    })

    it('non-object item returns false', () => {
      expect(isValidMasterDataJson([null])).toBe(false)
      expect(isValidMasterDataJson([42])).toBe(false)
    })
  })

  describe('sampleSettingJson', () => {
    it('should be valid JSON', () => {
      const parsed = JSON.parse(sampleSettingJson)
      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed.length).toBeGreaterThan(0)
    })

    it('should pass isValidSettingJson validation', () => {
      const parsed = JSON.parse(sampleSettingJson)
      expect(isValidSettingJson(parsed)).toBe(true)
    })
  })

  describe('isValidBulkJson', () => {
    it('valid mixed array (settings + data) returns true', () => {
      const data = [
        {
          code: 'SETTING_1',
          name: '設定1',
          attributes: { fields: [] },
        },
        {
          settingCode: 'SETTING_1',
          code: 'DATA_1',
          name: 'データ1',
          seq: 0,
          attributes: { key: 'val' },
        },
      ]
      expect(isValidBulkJson(data)).toBe(true)
    })

    it('valid settings-only array returns true', () => {
      const data = [
        {
          code: 'S1',
          name: '設定',
          attributes: { description: '' },
        },
      ]
      expect(isValidBulkJson(data)).toBe(true)
    })

    it('valid data-only array returns true', () => {
      const data = [
        {
          settingCode: 'S1',
          code: 'D1',
          name: 'データ',
          seq: 1,
          attributes: {},
        },
      ]
      expect(isValidBulkJson(data)).toBe(true)
    })

    it('empty array returns true', () => {
      expect(isValidBulkJson([])).toBe(true)
    })

    it('non-array input returns false', () => {
      expect(isValidBulkJson({})).toBe(false)
      expect(isValidBulkJson('string')).toBe(false)
      expect(isValidBulkJson(null)).toBe(false)
      expect(isValidBulkJson(undefined)).toBe(false)
      expect(isValidBulkJson(42)).toBe(false)
    })

    it('missing code returns false', () => {
      const data = [{ name: 'N', attributes: {} }]
      expect(isValidBulkJson(data)).toBe(false)
    })

    it('missing name returns false', () => {
      const data = [{ code: 'C', attributes: {} }]
      expect(isValidBulkJson(data)).toBe(false)
    })

    it('missing attributes returns false', () => {
      const data = [{ code: 'C', name: 'N' }]
      expect(isValidBulkJson(data)).toBe(false)
    })

    it('non-object attributes returns false', () => {
      const data = [{ code: 'C', name: 'N', attributes: 'invalid' }]
      expect(isValidBulkJson(data)).toBe(false)
    })

    it('settingCode present but seq missing returns false', () => {
      const data = [
        {
          settingCode: 'S1',
          code: 'D1',
          name: 'データ',
          attributes: {},
        },
      ]
      expect(isValidBulkJson(data)).toBe(false)
    })

    it('settingCode present but seq is non-number returns false', () => {
      const data = [
        {
          settingCode: 'S1',
          code: 'D1',
          name: 'データ',
          seq: '0',
          attributes: {},
        },
      ]
      expect(isValidBulkJson(data)).toBe(false)
    })

    it('settingCode is non-string returns false', () => {
      const data = [
        {
          settingCode: 123,
          code: 'D1',
          name: 'データ',
          seq: 0,
          attributes: {},
        },
      ]
      expect(isValidBulkJson(data)).toBe(false)
    })

    it('non-object item returns false', () => {
      expect(isValidBulkJson([null])).toBe(false)
      expect(isValidBulkJson([42])).toBe(false)
      expect(isValidBulkJson(['string'])).toBe(false)
    })
  })

  describe('sampleMixedJson', () => {
    it('should be valid JSON', () => {
      const parsed = JSON.parse(sampleMixedJson)
      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed.length).toBe(2)
    })

    it('first item should be in Setting format', () => {
      const parsed = JSON.parse(sampleMixedJson)
      expect(isValidSettingJson([parsed[0]])).toBe(true)
    })

    it('second item should be in MasterData format', () => {
      const parsed = JSON.parse(sampleMixedJson)
      expect(isValidMasterDataJson([parsed[1]])).toBe(true)
    })
  })
})
