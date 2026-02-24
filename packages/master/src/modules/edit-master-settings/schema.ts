import { z } from 'zod'

import { SettingAttrFields, SettingDataEntity } from '../../types'

import { isCodeUnique } from './checkExistCode'
import { defaultSettingFields } from './settingFields'

// 1. Define the base schema object first.
const settingSchemaObject = z.object({
  code: z
    .string({
      required_error: '入力してください。',
    })
    .min(1, '入力してください。')
    .refine((val) => val.trim().length > 0, {
      message: '空白のみは許可されていません。',
    }),
  name: z
    .string({
      required_error: '入力してください。',
    })
    .min(1, '入力してください。')
    .refine((val) => val.trim().length > 0, {
      message: '空白のみは許可されていません。',
    }),
  description: z.string(),
  copy_master_setting_on_cci_created: z.boolean().optional(),
  copy_master_data_on_cci_created: z.boolean().optional(),
})

// 2. Create the function that adds the async refinement to the base schema.
export const createSettingSchema = (httpClient) =>
  settingSchemaObject.refine(
    async ({ code }) => {
      return await isCodeUnique(httpClient, code)
    },
    {
      message: '既にこのコードは登録されています。',
      path: ['code'],
    }
  )

export const updateSettingSchema = z.object({
  code: z
    .string({
      required_error: '入力してください。',
    })
    .min(1, '入力してください。')
    .refine((val) => val.trim().length > 0, {
      message: '空白のみの入力はできません。',
    }),
  name: z
    .string({
      required_error: '入力してください。',
    })
    .min(1, '入力してください。')
    .refine((val) => val.trim().length > 0, {
      message: '空白のみの入力はできません。',
    }),
  description: z.string(),
  copy_master_setting_on_cci_created: z.boolean().optional(),
  copy_master_data_on_cci_created: z.boolean().optional(),
})

export type SettingsSchema = z.infer<typeof settingSchemaObject>

export const mapEntity2Form = (settings: SettingDataEntity) => {
  const formData: SettingsSchema = {
    code: settings.code,
    name: settings.name,
    description: settings.attributes.description,
    copy_master_setting_on_cci_created:
      settings.attributes.copy_master_setting_on_cci_created,
    copy_master_data_on_cci_created:
      settings.attributes.copy_master_data_on_cci_created,
  }

  if (
    !settings.attributes.fields
      ?.map((field) => field.physicalName)
      .includes('code')
  ) {
    if (!settings.attributes.fields) {
      settings.attributes.fields = [...defaultSettingFields]
    } else {
      settings.attributes.fields.unshift(...defaultSettingFields)
    }
  }
  const fieldListData: SettingAttrFields[] = settings.attributes.fields.map(
    (item) => {
      if (item.dataType === 'json') {
        return {
          ...item,
          uiComponent: 'string',
          defaultValue: item.defaultValue
            ? JSON.stringify(item.defaultValue)
            : item.defaultValue,
        }
      }
      return item
    }
  )

  return { formData, fieldListData }
}

export const mapForm2Dto = (
  codeData: SettingsSchema,
  fieldData: SettingAttrFields[]
) =>
  ({
    code: codeData.code,
    name: codeData.name,
    attributes: {
      description: codeData.description,
      fields: fieldData,
      copy_master_setting_on_cci_created:
        codeData.copy_master_setting_on_cci_created,
      copy_master_data_on_cci_created: codeData.copy_master_data_on_cci_created,
    },
  }) as Partial<SettingDataEntity>

export const sampleSettingJson = JSON.stringify({
  code: '',
  name: '',
  attributes: {
    description: '',
    fields: [
      {
        physicalName: '',
        name: '',
        description: '',
        dataType: '',
        min: '',
        max: '',
        length: '',
        maxRow: 1,
        defaultValue: '',
        isRequired: false,
        isShowedOnList: false,
        dataFormat: '',
      },
    ],
  },
})

const isObject = (data: any) => {
  return typeof data === 'object' && !Array.isArray(data) && data !== null
}
const isArray = (data: any) => {
  return typeof data === 'object' && Array.isArray(data) && data !== null
}

export const isValidSettingJson = (data: any) => {
  if (!isObject(data)) {
    return false
  }
  if (!data?.code || !data?.name || !data?.attributes) {
    return false
  }
  if (!isObject(data.attributes)) {
    return false
  }
  const attrs = data.attributes
  if (!attrs?.fields || !isArray(attrs.fields)) {
    return false
  }
  for (const field of attrs.fields) {
    if (
      !field?.physicalName ||
      !field?.name ||
      !field?.dataType ||
      typeof field?.isRequired !== 'boolean' ||
      typeof field?.isShowedOnList !== 'boolean'
    ) {
      return false
    }
  }
  return true
}
