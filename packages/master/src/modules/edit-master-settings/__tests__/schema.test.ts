import {
  updateSettingSchema,
  mapEntity2Form,
  mapForm2Dto,
  isValidSettingJson,
  sampleSettingJson,
} from '../schema'
import { SettingDataEntity, SettingAttrFields } from '../../../types'

describe('edit-master-settings/schema', () => {
  describe('isValidSettingJson', () => {
    it('valid data returns true', () => {
      const data = {
        code: 'CODE',
        name: '名前',
        attributes: {
          fields: [
            {
              physicalName: 'f1',
              name: 'F1',
              dataType: 'string',
              isRequired: true,
              isShowedOnList: true,
            },
          ],
        },
      }
      expect(isValidSettingJson(data)).toBe(true)
    })

    it('non-object returns false', () => {
      expect(isValidSettingJson([])).toBe(false)
      expect(isValidSettingJson(null)).toBe(false)
      expect(isValidSettingJson('string')).toBe(false)
    })

    it('missing code returns false', () => {
      expect(
        isValidSettingJson({
          name: '名前',
          attributes: { fields: [] },
        })
      ).toBe(false)
    })

    it('missing name returns false', () => {
      expect(
        isValidSettingJson({
          code: 'CODE',
          attributes: { fields: [] },
        })
      ).toBe(false)
    })

    it('missing attributes returns false', () => {
      expect(isValidSettingJson({ code: 'CODE', name: '名前' })).toBe(false)
    })

    it('non-object attributes returns false', () => {
      expect(
        isValidSettingJson({ code: 'C', name: 'N', attributes: 'invalid' })
      ).toBe(false)
    })

    it('non-array fields returns false', () => {
      expect(
        isValidSettingJson({
          code: 'C',
          name: 'N',
          attributes: { fields: 'invalid' },
        })
      ).toBe(false)
    })

    it('missing required field properties returns false', () => {
      expect(
        isValidSettingJson({
          code: 'C',
          name: 'N',
          attributes: {
            fields: [{ name: 'F', dataType: 'string' }],
          },
        })
      ).toBe(false)
    })

    it('non-boolean isRequired in field returns false', () => {
      expect(
        isValidSettingJson({
          code: 'C',
          name: 'N',
          attributes: {
            fields: [
              {
                physicalName: 'p',
                name: 'F',
                dataType: 'string',
                isRequired: 'yes',
                isShowedOnList: true,
              },
            ],
          },
        })
      ).toBe(false)
    })
  })

  describe('sampleSettingJson', () => {
    it('should be valid JSON', () => {
      const parsed = JSON.parse(sampleSettingJson)
      expect(parsed).toBeDefined()
      expect(typeof parsed).toBe('object')
    })
  })

  describe('mapEntity2Form', () => {
    const makeEntity = (
      overrides: Partial<SettingDataEntity> = {}
    ): SettingDataEntity => ({
      pk: 'PK',
      sk: 'SK',
      id: 'ID',
      code: 'TEST_CODE',
      name: 'テスト設定',
      version: 1,
      type: 'master-setting',
      attributes: {
        description: '説明文',
        fields: [
          {
            physicalName: 'code',
            name: 'コード',
            dataType: 'string',
            isRequired: true,
            isShowedOnList: true,
            length: '255',
          },
          {
            physicalName: 'name',
            name: '名称',
            dataType: 'string',
            isRequired: true,
            isShowedOnList: true,
            length: '255',
          },
        ],
        copy_master_setting_on_cci_created: true,
        copy_master_data_on_cci_created: false,
      },
      ...overrides,
    })

    it('converts entity to form data', () => {
      const entity = makeEntity()
      const { formData, fieldListData } = mapEntity2Form(entity)

      expect(formData.code).toBe('TEST_CODE')
      expect(formData.name).toBe('テスト設定')
      expect(formData.description).toBe('説明文')
      expect(formData.copy_master_setting_on_cci_created).toBe(true)
      expect(formData.copy_master_data_on_cci_created).toBe(false)
    })

    it('does not add defaultSettingFields when fields contain code', () => {
      const entity = makeEntity()
      const { fieldListData } = mapEntity2Form(entity)

      const codeFields = fieldListData.filter((f) => f.physicalName === 'code')
      expect(codeFields).toHaveLength(1)
    })

    it('prepends defaultSettingFields when fields do not contain code', () => {
      const entity = makeEntity({
        attributes: {
          description: '',
          fields: [
            {
              physicalName: 'custom',
              name: 'カスタム',
              dataType: 'string',
              isRequired: false,
              isShowedOnList: false,
            },
          ],
          copy_master_setting_on_cci_created: false,
          copy_master_data_on_cci_created: false,
        },
      })
      const { fieldListData } = mapEntity2Form(entity)

      expect(fieldListData[0].physicalName).toBe('code')
      expect(fieldListData[1].physicalName).toBe('name')
      expect(fieldListData[2].physicalName).toBe('seq')
      expect(fieldListData[3].physicalName).toBe('custom')
    })

    it('JSON.stringify defaultValue for json dataType fields', () => {
      const entity = makeEntity({
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
            {
              physicalName: 'jsonField',
              name: 'JSONフィールド',
              dataType: 'json',
              isRequired: false,
              isShowedOnList: false,
              defaultValue: { key: 'value' },
            },
          ],
          copy_master_setting_on_cci_created: false,
          copy_master_data_on_cci_created: false,
        },
      })
      const { fieldListData } = mapEntity2Form(entity)

      const jsonField = fieldListData.find(
        (f) => f.physicalName === 'jsonField'
      )
      expect(jsonField?.defaultValue).toBe('{"key":"value"}')
      expect(jsonField?.uiComponent).toBe('string')
    })

    it('preserves falsy defaultValue for json dataType fields', () => {
      const entity = makeEntity({
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
            {
              physicalName: 'jsonField',
              name: 'JSONフィールド',
              dataType: 'json',
              isRequired: false,
              isShowedOnList: false,
              defaultValue: '',
            },
          ],
          copy_master_setting_on_cci_created: false,
          copy_master_data_on_cci_created: false,
        },
      })
      const { fieldListData } = mapEntity2Form(entity)

      const jsonField = fieldListData.find(
        (f) => f.physicalName === 'jsonField'
      )
      expect(jsonField?.defaultValue).toBe('')
    })
  })

  describe('mapForm2Dto', () => {
    it('generates DTO from form data and field data', () => {
      const codeData = {
        code: 'DTO_CODE',
        name: 'DTO名',
        description: 'DTO説明',
        copy_master_setting_on_cci_created: true,
        copy_master_data_on_cci_created: false,
      }
      const fieldData: SettingAttrFields[] = [
        {
          physicalName: 'code',
          name: 'コード',
          dataType: 'string',
          isRequired: true,
          isShowedOnList: true,
        },
      ]

      const dto = mapForm2Dto(codeData, fieldData)

      expect(dto.code).toBe('DTO_CODE')
      expect(dto.name).toBe('DTO名')
      expect(dto.attributes?.description).toBe('DTO説明')
      expect(dto.attributes?.fields).toEqual(fieldData)
      expect(dto.attributes?.copy_master_setting_on_cci_created).toBe(true)
      expect(dto.attributes?.copy_master_data_on_cci_created).toBe(false)
    })
  })

  describe('updateSettingSchema', () => {
    it.each([
      {
        desc: 'valid data passes validation',
        input: { code: 'VALID_CODE', name: '有効な名前', description: '説明' },
        expected: true,
      },
      {
        desc: 'empty code fails validation',
        input: { code: '', name: '名前', description: '' },
        expected: false,
      },
      {
        desc: 'empty name fails validation',
        input: { code: 'CODE', name: '', description: '' },
        expected: false,
      },
      {
        desc: 'whitespace-only code fails validation',
        input: { code: '   ', name: '名前', description: '' },
        expected: false,
      },
      {
        desc: 'whitespace-only name fails validation',
        input: { code: 'CODE', name: '   ', description: '' },
        expected: false,
      },
      {
        desc: 'missing code fails validation',
        input: { name: '名前', description: '' },
        expected: false,
      },
      {
        desc: 'optional fields can be omitted',
        input: {
          code: 'CODE',
          name: '名前',
          description: '',
          copy_master_setting_on_cci_created: true,
        },
        expected: true,
      },
    ])('$desc', async ({ input, expected }) => {
      const result = await updateSettingSchema.safeParseAsync(input)
      expect(result.success).toBe(expected)
    })
  })
})
