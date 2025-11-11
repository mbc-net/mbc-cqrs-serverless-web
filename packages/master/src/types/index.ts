export type DataSettingDataEntity = {
  cpk?: string
  csk?: string
  source?: string
  requestId?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  createdIp?: string
  updatedIp?: string
  pk: string
  sk: string
  id: string
  code: string
  name: string
  version: number
  tenantCode?: string
  // tenantCode?: string
  masterCode?: string
  masterType?: string
  masterTypeCode?: string
  type: string
  seq?: number
  ttl?: number
  isDeleted?: boolean
  attributes?: Record<string, any>
}
export type DataSettingDataListEntity = {
  total?: number
  lastSk?: string
  items: Array<DataSettingDataEntity>
}
export type SettingAttrFields = {
  physicalName: string
  name: string
  description?: string
  dataType: string
  min?: string
  max?: string
  length?: string
  maxRow?: number
  defaultValue?: any
  isRequired: boolean
  isShowedOnList: boolean
  dataFormat?: string
  formatCode?: string
  formatName?: string
  pattern?: string
}
export type SettingAttributes = {
  description: string
  fields: Array<SettingAttrFields>
  copy_master_setting_on_cci_created: boolean
  copy_master_data_on_cci_created: boolean
}
export type SettingDataEntity = {
  cpk?: string
  csk?: string
  source?: string
  requestId?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  createdIp?: string
  updatedIp?: string
  pk: string
  sk: string
  id: string
  code: string
  name: string
  version: number
  tenantCode?: string
  // tenantCode?: string
  masterCode?: string
  masterType?: string
  masterTypeCode?: string
  type: string
  seq?: number
  ttl?: number
  isDeleted?: boolean
  attributes: SettingAttributes
}
export type SettingDataListEntity = {
  total?: number
  lastSk?: string
  items: Array<SettingDataEntity>
}
export type SettingDataDto = {
  settingCode: string
  code: string
  name: string
  attributes: any
}
