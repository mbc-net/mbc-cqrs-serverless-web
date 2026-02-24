'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import {
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import CustomFormItem from '../../../components/form/CustomFormItem'
import { Button } from '../../../components/ui/button'
import { Form, FormControl, FormField } from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { Textarea } from '../../../components/ui/textarea'
import { useToast } from '../../../components/ui/use-toast'
import { API_URLS } from '../../../lib/constants/url'
import { useSubscribeCommandStatus } from '../../../lib/hook/useSubscribeMessage'
import { SettingAttrFields, SettingDataEntity } from '../../../types'

import { BackButton } from '../../../components/buttons/back-button'
import LoadingOverlay from '../../../components/LoadingOverlay'
import {
  useHttpClient,
  useUrlProvider,
  useUserContext,
} from '../../../provider'
import { MasterRdsEntity } from '../../../types/MasterRdsEntity'
import { MasterRdsListEntity } from '../../../types/MasterRdsListEntity'
import {
  createSettingSchema,
  mapEntity2Form,
  mapForm2Dto,
  SettingsSchema,
  updateSettingSchema,
} from '../schema'
import { defaultSettingFields } from '../settingFields'
import AddJsonData from './AddJsonData'
import CopyButton from './CopyButton'
import DeleteButton from './DeleteButton'
import AddFieldsForm from './FieldsTable/AddFieldsForm'
import FieldsTable from './FieldsTable/FieldsTable'
import ListCopyButton from './ListCopyButton'
import { TENANT_SYSTEM_CODE } from '../../../lib/constants'

export const SEQUENCE_CODE = 'sequence_setting'

export default function SettingsForm({
  editedData,
  setEditedData,
}: {
  editedData?: SettingDataEntity
  setEditedData: Dispatch<SetStateAction<SettingDataEntity>>
}) {
  const urlProvider = useUrlProvider()
  const user = useUserContext()
  const params = useParams<{ pk: string; sk: string }>()
  const httpClient = useHttpClient()
  const pk = params?.pk ? decodeURIComponent(params.pk) : undefined
  const sk = params?.sk ? decodeURIComponent(params.sk) : undefined

  const isEdit = !!(pk && sk)
  const [detailInfo, setDetailInfo] = useState<{
    code: string
    id: string
  } | null>(null)

  const form = useForm<SettingsSchema>({
    resolver: zodResolver(
      editedData ? updateSettingSchema : createSettingSchema(httpClient)
    ),
    defaultValues: {
      code: '',
      name: '',
      description: '',
    },
    reValidateMode: 'onSubmit',
  })

  const router = useRouter()
  const { toast } = useToast()
  const [fieldList, setFieldList] =
    useState<SettingAttrFields[]>(defaultSettingFields)
  const [submitting, setSubmitting] = useState(false)
  const [editFieldData, setEditFieldData] = useState<{
    index: number
    data: SettingAttrFields
  }>()
  const [originData, setOriginData] = useState<string>()
  const [readOnly, setReadOnly] = useState<boolean>(true)
  const [formatOptions, setFormatOptions] = useState<MasterRdsEntity[]>([])

  const fetchFormatOptions = async () => {
    const data = (
      await httpClient.get<MasterRdsListEntity>(API_URLS.DATA.GET_ALL, {
        params: {
          settingCode: SEQUENCE_CODE,
          page: 1,
          pageSize: 100,
        },
      })
    ).data
    const items = data.items
    setFormatOptions(items)
  }

  const { start } = useSubscribeCommandStatus(user.tenantCode, async (msg) => {
    setSubmitting(false)
    if (msg) {
      toast({
        description: editedData ? '更新しました。' : '登録しました。',
        variant: 'success',
      })
      if (!isEdit)
        if (detailInfo)
          return router.push(
            `${
              urlProvider.DATA_PAGE_URL
            }?isTypeCodeFixed=1&typeCode=${encodeURIComponent(
              detailInfo.code
            )}&typeCodeId=${encodeURIComponent(detailInfo.id)}`
          )
        else return router.push(urlProvider.SETTINGS_PAGE_URL)
      const dto = mapForm2Dto(form.getValues(), [
        ...fieldList.map((item) => ({
          ...item,
          uiComponent: 'string',
        })),
      ])
      setEditedData((prev) => ({
        ...prev,
        name: dto.name,
        attributes: dto.attributes,
      }))
      setReadOnly(true)
    } else {
      toast({
        title: editedData
          ? 'データ更新に失敗しました。'
          : 'データ登録に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    }
  })
  // console.log(tenantCode)

  const onSubmit = async (data: SettingsSchema) => {
    setSubmitting(true)
    let res: SettingDataEntity | undefined = undefined
    try {
      const dto = mapForm2Dto(data, [
        ...fieldList.map((item) => {
          if (item.dataType === 'boolean') {
            return {
              ...item,
              uiComponent: 'string',
              defaultValue:
                item.defaultValue === 'true' || item.defaultValue === true,
            }
          }
          if (item.dataType === 'json') {
            return {
              ...item,
              uiComponent: 'string',
              defaultValue: item.defaultValue
                ? JSON.parse(item.defaultValue as string)
                : '',
            }
          }
          return {
            ...item,
            uiComponent: 'string',
          }
        }),
      ])
      if (editedData) {
        res = (
          await httpClient.put<SettingDataEntity>(
            `${API_URLS.SETTING.UPDATE}/${encodeURIComponent(
              `${editedData.pk}#${editedData.sk}`
            )}`,
            dto
          )
        ).data
      } else {
        res = (
          await httpClient.post<SettingDataEntity>(API_URLS.SETTING.CREATE, {
            ...dto,
            settingValue: dto.attributes,
            code: dto.code?.trim(),
          })
        ).data
      }
    } catch (error) {
      console.error(error)
    }

    if (!res?.requestId) {
      setSubmitting(false)
      toast({
        title: editedData
          ? 'データ更新に失敗しました。'
          : 'データ登録に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    } else {
      setDetailInfo({ code: res.sk.split('@')[0], id: res.id })
      start(res.requestId)
    }
  }

  const submitFieldForm = (data: SettingAttrFields, mode: 'add' | 'edit') => {
    if (mode === 'add') {
      setFieldList((prev) => [...prev, data])
    }
    if (mode === 'edit') {
      setFieldList((prev) => {
        const newFieldList = [...prev]
        newFieldList.splice(editFieldData!.index, 1, data)
        return newFieldList
      })
      setEditFieldData(undefined)
    }
  }

  const deleteField = (index: number) => {
    const deletedItem = fieldList.find((item, i) => i === index)
    setFieldList((prev) => prev.filter((item) => item !== deletedItem))
  }

  const editField = (index: number) => {
    const editItemIdx = fieldList.findIndex((item, i) => i === index)
    setEditFieldData({
      index: editItemIdx,
      data: fieldList[editItemIdx],
    })
  }

  const assignSettingData2Form = (setting: SettingDataEntity) => {
    const { formData, fieldListData } = mapEntity2Form(setting)
    form.reset(formData)
    setFieldList(fieldListData)
  }

  const handleSaveJson = (setting: SettingDataEntity) => {
    assignSettingData2Form(setting)
  }

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = fieldList.findIndex((item) => item.name === active.id)
      const newIndex = fieldList.findIndex((item) => item.name === over?.id)
      setFieldList((items) => arrayMove(items, oldIndex, newIndex))
    }
  }

  useEffect(() => {
    if (editedData) {
      assignSettingData2Form(editedData)

      setOriginData(
        JSON.stringify(form.getValues()) + JSON.stringify(fieldList)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedData])

  useEffect(() => {
    fetchFormatOptions()
  }, [])

  useEffect(() => {
    setReadOnly(isEdit)
  }, [isEdit])

  if (isEdit && !editedData) return <LoadingOverlay isLoading />

  return (
    <div className="relative w-full">
      <Form {...form}>
        <form className="bg-background" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-muted/50 p-4">
            {editedData?.tenantCode === user.tenantCode || !isEdit ? (
              <div className="flex justify-between gap-4">
                {isEdit && readOnly ? (
                  <div className="flex gap-x-2">
                    <div className="trigger">
                      <Button
                        key="set-edit"
                        onClick={() => {
                          setReadOnly(false)
                        }}
                        type="button"
                      >
                        編集
                      </Button>
                    </div>
                    {user.tenantCode == TENANT_SYSTEM_CODE && (
                      <>
                        <CopyButton />
                        <ListCopyButton />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Button
                      key="save"
                      type="submit"
                      loading={submitting}
                      disabled={
                        // Object.keys(form.formState.errors).length > 0 ||
                        JSON.stringify(form.getValues()) +
                          JSON.stringify(fieldList) ===
                        originData
                      }
                    >
                      保存
                    </Button>
                    {isEdit && (
                      <Button type="button" onClick={() => setReadOnly(true)}>
                        キャンセル
                      </Button>
                    )}
                    <AddJsonData
                      jsonValue={JSON.stringify(
                        mapForm2Dto(form.watch(), [
                          ...fieldList.map((item) => ({
                            ...item,
                            uiComponent: 'string',
                          })),
                        ])
                      )}
                      onSave={handleSaveJson}
                    />
                  </div>
                )}
                {isEdit && (
                  <div className="flex gap-x-2">
                    <DeleteButton
                      tenantCode={user.tenantCode}
                      deletedItem={editedData}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="fix">
                <div className="flex justify-between gap-4">
                  <Button
                    type="button"
                    onClick={() => router.push(urlProvider.SETTINGS_PAGE_URL)}
                  >
                    戻る
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 px-4">
            <div className="bg-emphasis flex items-end justify-start p-4 text-xl font-bold text-white">
              <div>名称登録</div>
            </div>
            <div className="bg-background grid gap-x-10 gap-y-2 p-6 pb-10 md:grid-cols-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <CustomFormItem label="コード" required>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="code"
                        className="focus-visible:ring-offset-0"
                        disabled={!!editedData}
                      />
                    </FormControl>
                  </CustomFormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                disabled={readOnly}
                render={({ field }) => (
                  <CustomFormItem label="名称" required>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        className="focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                  </CustomFormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                disabled={readOnly}
                render={({ field }) => (
                  <CustomFormItem label="説明" className="md:col-span-2">
                    <FormControl>
                      <Textarea
                        autoComplete="description"
                        className="focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                  </CustomFormItem>
                )}
              />
              {user.tenantCode == TENANT_SYSTEM_CODE && (
                <>
                  <FormField
                    control={form.control}
                    name="copy_master_setting_on_cci_created"
                    disabled={readOnly}
                    render={({ field }) => (
                      <CustomFormItem
                        className="mt-2"
                        label="新規商工会議所作成時マスタ設定をコピー"
                      >
                        <FormControl>
                          <Switch
                            checked={field.value}
                            defaultChecked={isEdit ? field.value : false}
                            onCheckedChange={field.onChange}
                            disabled={readOnly}
                          />
                        </FormControl>
                      </CustomFormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="copy_master_data_on_cci_created"
                    disabled={readOnly}
                    render={({ field }) => (
                      <CustomFormItem
                        className="mt-2"
                        label="新規商工会議所作成時マスタデータをコピー"
                      >
                        <FormControl>
                          <Switch
                            checked={field.value}
                            defaultChecked={isEdit ? field.value : false}
                            onCheckedChange={field.onChange}
                            disabled={readOnly}
                          />
                        </FormControl>
                      </CustomFormItem>
                    )}
                  />
                </>
              )}
            </div>
            <div className="bg-emphasis flex items-end justify-start p-4 text-xl font-bold text-white">
              <div>項目一覧</div>
            </div>
            <div className="bg-background p-6 pb-10">
              <div className="mb-5 flex w-full items-start">
                <AddFieldsForm
                  formatOptions={formatOptions}
                  disabled={readOnly}
                  submit={submitFieldForm}
                  editData={editFieldData}
                />
              </div>
              <FieldsTable
                formatOptions={formatOptions}
                sensors={sensors}
                handleDragEnd={handleDragEnd}
                disabled={readOnly}
                data={fieldList}
                onDeletedField={deleteField}
                onEditField={editField}
              />
            </div>
          </div>
        </form>
      </Form>
      <div className="bg-background text-center">
        <BackButton onClickPrev={() => router.back()} />
      </div>
    </div>
  )
}
