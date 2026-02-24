export const sampleSettingJson = JSON.stringify([
  {
    code: '',
    name: '',
    attributes: {
      description: '',
      fields: [
        {
          physicalName: 'code',
          name: 'コード',
          description: '',
          dataType: 'string',
          defaultValue: '',
          isRequired: true,
          isShowedOnList: true,
          length: '255',
          uiComponent: 'string',
        },
        {
          physicalName: 'name',
          name: '名称',
          description: '',
          dataType: 'string',
          isRequired: true,
          isShowedOnList: true,
          length: '255',
          uiComponent: 'string',
        },
        {
          physicalName: 'seq',
          name: '並び順',
          description: '',
          dataType: 'number',
          defaultValue: '',
          isRequired: false,
          isShowedOnList: true,
          uiComponent: 'string',
        },
      ],
    },
  },
])

// Combined sample showing both Master Settings and Master Data
export const sampleMixedJson = JSON.stringify([
  {
    code: 'MASTER_SETTING_CODE',
    name: 'マスター設定サンプル',
    attributes: {
      description: '',
      fields: [
        {
          physicalName: 'code',
          name: 'コード',
          description: '',
          dataType: 'string',
          defaultValue: '',
          isRequired: true,
          isShowedOnList: true,
          length: '255',
          uiComponent: 'string',
        },
        {
          physicalName: 'name',
          name: '名称',
          description: '',
          dataType: 'string',
          isRequired: true,
          isShowedOnList: true,
          length: '255',
          uiComponent: 'string',
        },
        {
          physicalName: 'seq',
          name: '並び順',
          description: '',
          dataType: 'number',
          defaultValue: '',
          isRequired: false,
          isShowedOnList: true,
          uiComponent: 'string',
        },
      ],
    },
  },
  {
    settingCode: 'SETTING_CODE',
    code: 'MASTER_DATA_CODE',
    name: 'マスターデータサンプル',
    seq: 0,
    attributes: {
      description: '',
    },
  },
])

const isObject = (data: any) => {
  return typeof data === 'object' && !Array.isArray(data) && data !== null
}
const isArray = (data: any) => {
  return typeof data === 'object' && Array.isArray(data) && data !== null
}

export const isValidSettingJson = (data: any) => {
  if (!isArray(data)) {
    return false
  }
  for (const item of data) {
    if (!isObject(item)) {
      return false
    }
    if (!('code' in item) || !('name' in item) || !('attributes' in item)) {
      return false
    }
    if (!isObject(item.attributes)) {
      return false
    }
    const attrs = item.attributes
    if (!attrs?.fields || !isArray(attrs.fields)) {
      return false
    }
    for (const field of attrs.fields) {
      if (
        !('physicalName' in field) ||
        !('name' in field) ||
        !('dataType' in field) ||
        typeof field?.isRequired !== 'boolean' ||
        typeof field?.isShowedOnList !== 'boolean'
      ) {
        return false
      }
    }
  }
  return true
}

export const isValidMasterDataJson = (data: any) => {
  if (!isArray(data)) {
    return false
  }
  for (const item of data) {
    if (!isObject(item)) return false
    // Check for existence of all required properties
    if (
      !('settingCode' in item) ||
      !('code' in item) ||
      !('name' in item) ||
      !('attributes' in item) ||
      !('seq' in item)
    ) {
      return false
    }
    if (typeof item.seq !== 'number') {
      return false
    }
    if (!isObject(item.attributes)) {
      return false
    }
  }

  return true
}

/**
 * Validate unified bulk JSON format.
 * Each item must have code, name, attributes.
 * If settingCode is present, seq is also required (master data).
 * If settingCode is absent, it's treated as a master setting.
 */
export const isValidBulkJson = (data: any) => {
  if (!isArray(data)) {
    return false
  }
  for (const item of data) {
    if (!isObject(item)) return false
    if (!('code' in item) || !('name' in item) || !('attributes' in item)) {
      return false
    }
    if (!isObject(item.attributes)) {
      return false
    }
    // If settingCode present, it's master data — seq is required
    if ('settingCode' in item) {
      if (typeof item.settingCode !== 'string') return false
      if (!('seq' in item) || typeof item.seq !== 'number') return false
    }
  }
  return true
}
