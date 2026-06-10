export type MappedSetting = {
  kind: 'setting'
  value: {
    name: string
    code: string
    tenantCode?: string
    settingValue: Record<string, any>
  }
}

export type MappedData = {
  kind: 'data'
  value: {
    settingCode: string
    code: string
    name: string
    seq: number
    attributes: Record<string, any>
    tenantCode?: string
  }
}

export type MapResult = MappedSetting | MappedData

export type BulkJsonItem = {
  name: string
  code: string
  attributes: object
  tenantCode?: string
  settingCode?: string
  seq?: number
}

export function isPlainObject(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}

export function mapResultToBulkItem(m: MapResult): BulkJsonItem {
  if (m.kind === 'setting') {
    return {
      name: m.value.name,
      code: m.value.code,
      tenantCode: m.value.tenantCode,
      attributes: m.value.settingValue,
    }
  }
  return {
    name: m.value.name,
    code: m.value.code,
    settingCode: m.value.settingCode,
    tenantCode: m.value.tenantCode,
    seq: m.value.seq,
    attributes: m.value.attributes,
  }
}

export function isValidMappedDataValue(
  value: MappedData['value'] | null | undefined
): boolean {
  return (
    !!value &&
    typeof value.settingCode === 'string' &&
    value.settingCode.trim() !== '' &&
    typeof value.code === 'string' &&
    typeof value.name === 'string' &&
    typeof value.seq === 'number' &&
    isPlainObject(value.attributes)
  )
}
