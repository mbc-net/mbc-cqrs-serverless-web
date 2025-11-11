'use client'

import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import { BackButton } from '../../../components/buttons/back-button'
import CustomInputItem from '../../../components/form/CustomInputItem'
import DatePicker from '../../../components/form/DatePicker'
import LoadingOverlay from '../../../components/LoadingOverlay'
import { MDEditor } from '../../../components/MDEditor'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { Textarea } from '../../../components/ui/textarea'
import { useToast } from '../../../components/ui/use-toast'
import { API_URLS } from '../../../lib/constants/url'
import useHealthCheck from '../../../lib/hook/useHealthCheck'
import { useSubscribeCommandStatus } from '../../../lib/hook/useSubscribeMessage'
import { isNullish } from '../../../lib/utils/isNullish'
import {
  useHttpClient,
  useUrlProvider,
  useUserContext,
} from '../../../provider'
import {
  DataSettingDataEntity,
  SettingDataDto,
  SettingDataEntity,
} from '../../../types'
import { GenerateFormattedSequenceDto } from '../../../types/GenerateFormattedSequenceDto'
import { Editor } from '../../edit-master-settings/components/field-editor'
import { isCodeUnique } from '../checkExistCode'
import AddJsonData from '../components/AddJsonData'
import ArrayInputField from '../components/ArrayInputField'
import DeleteButton from '../components/DeleteButton'
import RestoreButton from '../components/RestoreButton'
import { useLoadingStore } from '../../../lib/stores/hooks'
import JSONEditorComponent from '../../../components/JSONEditorComponent'
import '../../../components/JsonEditor'
import '../../../components/RichTextEditor'

export enum ActionButton {
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
}

const genPlaceholder = (fieldType: string) => {
  let description

  switch (fieldType) {
    case 'number':
      description = '数値を入力してください。'
      break
    case 'string':
      description = 'テキストを入力してください。'
      break
    default:
      break
  }
  return description
}

const getDescription = (code: string, setting: SettingDataEntity) =>
  setting.attributes.fields.find((field) => field.physicalName === code)
    ?.description ?? ''

export default function EditMasterData() {
  const user = useUserContext()
  const tenantCode = user.tenantCode
  const urlProvider = useUrlProvider()
  const router = useRouter()
  const { toast } = useToast()
  const searchParam = useSearchParams()
  const params = useParams<{ pk: string; sk: string }>()

  const pk = params?.pk ? decodeURIComponent(params.pk) : undefined
  const sk = params?.sk ? decodeURIComponent(params.sk) : undefined

  const loadingStore = useLoadingStore()

  const isEdit = !!(pk && sk)
  let typeCode = isEdit
    ? sk?.split('#')[0]
    : searchParam.get('typeCode').split('#')[1]
  typeCode = `MASTER_SETTING#${typeCode}`
  const defaultData: SettingDataDto = {
    settingCode: typeCode || '',
    code: '',
    name: '',
    attributes: undefined,
  }
  const {
    control,
    formState: { errors },
    reset,
    watch,
    register,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<SettingDataDto>({
    defaultValues: defaultData,
    reValidateMode: 'onSubmit',
  })
  const [isSubmitting, setSubmitting] = useState(false)
  const [originData, setOriginData] = useState<string>()
  const [resData, setResData] = useState<DataSettingDataEntity>()
  const [readOnly, setReadOnly] = useState<boolean>()
  const [currentSetting, setCurrentSetting] = useState<SettingDataEntity>()
  const [formatData, setFormatData] = useState<DataSettingDataEntity>()
  const isExistCodeInFields = currentSetting?.attributes.fields
    .map((field) => field.physicalName)
    .includes('code')
  const [detailInfo, setDetailInfo] = useState<{
    pk: string
    sk: string
  } | null>(null)
  const httpClient = useHttpClient()

  const { start } = useSubscribeCommandStatus(tenantCode, async (msg) => {
    setSubmitting(false)
    setReadOnly(true)
    if (msg) {
      toast({
        description: isEdit ? '更新しました。' : '登録しました。',
        variant: 'success',
      })
      if (!isEdit)
        if (detailInfo) {
          return router.replace(
            `${urlProvider.EDIT_DATA_PAGE_URL}/${encodeURIComponent(
              detailInfo.pk
            )}/${encodeURIComponent(
              detailInfo.sk
            )}?typeCodeId=${encodeURIComponent(currentSetting.id)}`
          )
        } else {
          return router.back()
        }

      const formValue = getValues()
      setOriginData(JSON.stringify(formValue))
      setResData((prev) => ({
        ...prev,
        name: formValue.name,
        seq: +(formValue.attributes?.seq ?? 0),
        attributes: formValue.attributes,
      }))
      setSubmitting(false)
    } else {
      toast({
        title: isEdit
          ? 'データ更新に失敗しました。'
          : 'データ登録に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    }
  })

  const submit = async (data: FieldValues) => {
    setSubmitting(true)

    try {
      const processedData = JSON.parse(JSON.stringify(data))

      // Iterate through the master setting's field definitions to find JSON fields.
      currentSetting.attributes.fields.forEach((field) => {
        // Check if the field is of type 'json' and if a value for it exists in the form data.
        if (
          field.dataType === 'json' &&
          processedData.attributes?.[field.physicalName]
        ) {
          // The value from the JSON editor is a string, so it needs to be parsed into an object.
          try {
            const valueAsString = processedData.attributes[field.physicalName]
            // Ensure we don't try to parse something that is already an object.
            if (typeof valueAsString === 'string') {
              processedData.attributes[field.physicalName] =
                JSON.parse(valueAsString)
            }
          } catch (error) {
            console.error(
              `Error parsing JSON for field '${field.physicalName}':`,
              error
            )
            // Optional: Display an error to the user and stop submission.
            toast({
              title: 'JSON形式エラー',
              description: `${field.name}のJSON形式が正しくありません。`, // "Invalid JSON format for field [field name]."
              variant: 'destructive',
            })
            setSubmitting(false) // Stop the submission process.
            // Throw an error to exit the function execution.
            throw new Error('Invalid JSON format')
          }
        }
      })

      const client = httpClient
      let seq =
        isNullish(processedData?.attributes?.seq) ||
        processedData?.attributes?.seq === ''
          ? undefined
          : +processedData?.attributes?.seq
      if (
        isEdit &&
        (isNullish(processedData?.attributes?.seq) ||
          processedData?.attributes?.seq === '')
      ) {
        seq = 0
      }
      const settingCode = processedData.settingCode?.split('#')[1]
      const codeField = currentSetting.attributes.fields.find(
        (field) => field.physicalName === 'code'
      )
      let result: DataSettingDataEntity | undefined

      if (isEdit) {
        // Use the processedData for the payload.
        const payload = {
          ...processedData,
          seq,
          ...(isExistCodeInFields && {
            code: processedData.attributes['code'],
            name: processedData.attributes['name'],
          }),
        }

        result = (
          await client.put<DataSettingDataEntity>(
            `${API_URLS.DATA.UPDATE}/${encodeURIComponent(`${pk}#${sk}`)}`,
            payload
          )
        ).data
      } else {
        let generatedCode = isExistCodeInFields
          ? processedData.attributes['code']?.trim()
          : processedData.code

        if (codeField?.dataType === 'auto_number' && codeField.dataFormat) {
          if (codeField['formatCode']) {
            const format = codeField['dataFormat']
            const typeCode = codeField['formatCode']
            // const seqRes = await apiSeq.generateSequenceWithFormat({
            //   tenantCode: tenantCode,
            //   typeCode,
            //   rotateBy: GenerateFormattedSequenceDto.rotateBy.NONE,
            //   params: { code1: currentSetting.code },
            //   prefix: codeField['prefix'],
            //   postfix: codeField['postfix'],
            //   format,
            // })
            const seqRes = (
              await httpClient.post(API_URLS.SEQUENCE.WITH_PROVIDED_SETTING, {
                tenantCode: tenantCode,
                typeCode,
                rotateBy: GenerateFormattedSequenceDto.rotateBy.NONE,
                params: { code1: currentSetting.code },
                prefix: codeField['prefix'],
                postfix: codeField['postfix'],
                format,
              })
            ).data
            generatedCode = seqRes.formattedNo
          } else {
            // const seqRes = await apiSeq.generateSequence({
            //   tenantCode: tenantCode,
            //   typeCode,
            //   rotateBy: GenerateFormattedSequenceDto.rotateBy.NONE,
            //   params: { code1: currentSetting.code },
            //   prefix: codeField['prefix'],
            //   postfix: codeField['postfix'],
            // })
            const seqRes = (
              await httpClient.post(
                API_URLS.SEQUENCE.WITHOUT_PROVIDED_SETTING,
                {
                  tenantCode: tenantCode,
                  typeCode,
                  rotateBy: GenerateFormattedSequenceDto.rotateBy.NONE,
                  params: { code1: currentSetting.code },
                  prefix: codeField['prefix'],
                  postfix: codeField['postfix'],
                }
              )
            ).data
            generatedCode = seqRes.formattedNo
          }
        }

        // Use the processedData for the payload.
        const commonPayload = {
          ...processedData,
          settingCode,
          seq,
        }

        const payload = isExistCodeInFields
          ? {
              ...commonPayload,
              name: processedData.attributes['name'],
              code: generatedCode,
              attributes: {
                ...processedData.attributes,
                code: generatedCode,
              },
            }
          : {
              ...commonPayload,
              attributes: {
                ...processedData.attributes,
                code: generatedCode,
              },
            }

        result = (
          await client.post<DataSettingDataEntity>(
            API_URLS.DATA.CREATE,
            payload
          )
        ).data
      }

      if (!result?.requestId) {
        toast({
          title: isEdit
            ? 'データ更新に失敗しました。'
            : 'データ登録に失敗しました。',
          description: '入力内容を確認した上で再度やり直してください。',
          variant: 'destructive',
        })
        setSubmitting(false)
      } else {
        setDetailInfo({ pk: result.pk, sk: result.sk.split('@')[0] })
        start(result.requestId)
      }
    } catch (error) {
      // The catch block will now also handle the thrown 'Invalid JSON format' error.
      if (error.message !== 'Invalid JSON format') {
        setSubmitting(false)
        toast({
          title: 'エラーが発生しました。',
          description: 'ネットワークまたはサーバーエラーの可能性があります。',
          variant: 'destructive',
        })
      } else {
        setSubmitting(false)
        toast({
          title: 'エラーが発生しました。',
          description: 'ネットワークまたはサーバーエラーの可能性があります。',
          variant: 'destructive',
        })
      }
    }
  }

  const fetchSettings = async () => {
    try {
      const parts = searchParam.get('typeCodeId').split('#')
      const pk = `${parts[0]}#${parts[1]}`
      const sk = `${parts[2]}#${parts.slice(3).join('#')}`

      const { data } = await httpClient.get<SettingDataEntity>(
        `${API_URLS.SETTING.GET_ONE}/${encodeURIComponent(`${pk!}#${sk!}`)}`
      )

      setCurrentSetting(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchData = async () => {
    try {
      const { data } = await httpClient.get<DataSettingDataEntity>(
        `${API_URLS.DATA.GET_ONE}/${encodeURIComponent(`${pk}#${sk}`)}`
      )
      const formData = {
        settingCode: typeCode || '',
        name: data.name || '',
        code: data.code || '',
        seq: `${data.seq ?? 0}`,
        attributes: {
          ...data.attributes,
          name: data.name || '',
          code: data.code || '',
          seq: `${data.seq ?? 0}`,
        },
      }
      reset(formData)
      setResData(data)
      setOriginData(JSON.stringify(formData))
    } catch (error) {
      console.error(error)
    }
  }

  const handleAction = (action: ActionButton) => {
    const isDeleted = action === ActionButton.DELETE
    setResData((prev) => ({ ...prev, isDeleted }))
  }

  useEffect(() => {
    loadingStore.closeLoading()
  }, [loadingStore])

  useEffect(() => {
    fetchSettings()
    if (isEdit) {
      fetchData()
    }
  }, [isEdit])

  useEffect(() => {
    if (!resData) return

    const formData = {
      settingCode: typeCode || '',
      name: resData.name || '',
      seq: `${resData.seq ?? 0}`,
      code: resData.code || '',
      attributes: {
        ...resData.attributes,
        seq: `${resData.seq ?? 0}`,
      } as Record<string, any>,
    }

    if (
      isExistCodeInFields &&
      !Object.keys(formData.attributes).includes('code')
    ) {
      formData.attributes.code = resData.code || ''
      formData.attributes.name = resData.name || ''
    }
    // setResData(data)
    // setOriginData(JSON.stringify(formData))
    reset(formData)
    setOriginData(JSON.stringify(formData))
  }, [readOnly])

  // const handleCodeChange = useCallback(
  //   debounce(async () => {
  //     const settingCode = getValues('settingCode')
  //     const code = watch('code')?.trim()

  //     if (!settingCode || isEdit) return clearErrors('code')
  //     if (!code) {
  //       clearErrors('code')
  //       return
  //     }

  //     if (settingCode.trim().length === 0) {
  //       setError('code', {
  //         message: '空白のみは許可されていません。',
  //       })
  //       return
  //     }

  //     const isUnique = await isCodeUnique(settingCode.split('#')[1], code)
  //     if (!isUnique) {
  //       setError('code', { message: '既にこのコードは登録されています。' })
  //     } else {
  //       clearErrors('code')
  //     }
  //   }, 500),
  //   [isEdit, getValues, watch('code'), clearErrors, setError]
  // )

  const handleSaveJson = (data: DataSettingDataEntity) => {
    reset(data)
  }

  useEffect(() => {
    setReadOnly(isEdit)
  }, [isEdit])

  // useEffect(() => {
  //   if (isEdit) return
  //   const fetchDefaultCode = async () => {
  //     if (!currentSetting || isEdit) return

  //     const settingCodeField = currentSetting.attributes.fields.find((field) => field.physicalName === 'code')

  //     if (settingCodeField?.dataType === 'auto_number') {
  //       const code = await SequenceService.customSeqControllerGenSequence({
  //         requestBody: {
  //           tenantCode: tenantCode,
  //           typeCode: settingCodeField.dataFormat?.slice('MASTER_DATA#'.length),
  //           rotateBy: GenerateFormattedSequenceDto.rotateBy.NONE,
  //           params: {
  //             code1: currentSetting.masterCode,
  //           },
  //         },
  //       })
  //       setDataCode(code?.formattedNo)
  //       setValue('code', code?.formattedNo)
  //       setValue('attributes.code', code?.formattedNo)
  //     }
  //   }

  //   fetchDefaultCode()
  // }, [currentSetting, isEdit])

  useEffect(() => {
    const fetchDataFormat = async () => {
      if (!currentSetting || isEdit) return
      const settingCodeField = currentSetting.attributes.fields.find(
        (field) => field.physicalName === 'code'
      )
      if (settingCodeField?.dataType === 'auto_number') {
        const parts = searchParam.get('typeCodeId').split('#')
        const pk = `${parts[0]}#${parts[1]}`
        if (settingCodeField['formatCode']) {
          const name = settingCodeField['formatName']
          setFormatData({ name } as any)
        } else {
          const { data } = await httpClient.get<DataSettingDataEntity>(
            `${API_URLS.DATA.GET_ONE}/${encodeURIComponent(
              `${pk}#${settingCodeField.dataFormat}`
            )}`
          )
          setFormatData(data)
        }
      }
    }
    fetchDataFormat()
  }, [currentSetting, isEdit])

  useHealthCheck()

  if (!currentSetting || (isEdit && !resData))
    return <LoadingOverlay isLoading />

  return (
    <>
      <div className="flex-col items-center gap-[50px]">
        <form className="bg-background w-full" onSubmit={handleSubmit(submit)}>
          <div className="bg-muted/50 p-4">
            {resData?.tenantCode === tenantCode || !isEdit ? (
              <div className="flex justify-between gap-4">
                <div className="flex gap-4">
                  {isEdit && readOnly ? (
                    <div className="trigger">
                      <Button
                        type="button"
                        onClick={() => {
                          setReadOnly(false)
                        }}
                      >
                        編集
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        disabled={
                          JSON.stringify(
                            isExistCodeInFields
                              ? {
                                  ...watch(),
                                  code: watch().attributes?.code,
                                  name: watch().attributes?.name,
                                  seq: watch().attributes?.seq ?? 0,
                                }
                              : {
                                  ...watch(),
                                  code: watch().code,
                                  name: watch().name,
                                  seq: watch().attributes?.seq ?? 0,
                                }
                          ) === originData
                        }
                        loading={isSubmitting}
                      >
                        登録
                      </Button>
                      {isEdit && (
                        <Button type="button" onClick={() => setReadOnly(true)}>
                          キャンセル
                        </Button>
                      )}
                      <AddJsonData
                        disabled={!watch('settingCode')}
                        jsonValue={JSON.stringify(
                          isExistCodeInFields
                            ? {
                                ...watch(),
                                code: watch().attributes?.code,
                                name: watch().attributes?.name,
                                seq: watch().attributes?.seq ?? 0,
                              }
                            : {
                                ...watch(),
                                code: watch().code,
                                name: watch().name,
                                seq: watch().attributes?.seq ?? 0,
                              }
                        ).toString()}
                        onSave={handleSaveJson}
                      />
                    </>
                  )}
                </div>
                {isEdit && (
                  <div className="flex gap-4 align-middle">
                    {resData?.isDeleted ? (
                      <RestoreButton
                        onDone={handleAction}
                        tenantCode={tenantCode}
                        restoreItem={resData}
                      />
                    ) : (
                      <DeleteButton
                        onDone={handleAction}
                        tenantCode={tenantCode}
                        deletedItem={resData}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="fix">
                <div className="flex justify-between gap-4">
                  <Button type="button" onClick={() => router.back()}>
                    戻る
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full p-4">
            <div className="grid !grid-cols-1 gap-x-10 gap-y-4 p-6 pb-10 pt-2 md:!grid-cols-2">
              {/* <CustomInputItem key={'settingCode'} label={'タイプコード'} required={true} error={errors.settingCode}>
                <Controller
                  control={control}
                  name="settingCode"
                  rules={{
                    required: '入力してください。',
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Select disabled={true} value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {settings &&
                          settings.map(({ code, name }, index) => (
                            <SelectItem key={index} value={code}>
                              {name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </CustomInputItem> */}

              {!isExistCodeInFields && (
                <>
                  <CustomInputItem
                    key={'code'}
                    description={getDescription('code', currentSetting)}
                    label={'コード'}
                    required={true}
                    error={errors.code}
                    className="col-start-1"
                  >
                    <Input
                      {...register('code', {
                        required: '入力してください。',
                        validate: async (value) => {
                          const settingCode = getValues('settingCode')

                          if (!value || isEdit) return
                          if (!value) {
                            return
                          }

                          if (value.trim().length === 0) {
                            return '空白のみは許可されていません。'
                          }

                          const isUnique = await isCodeUnique(
                            httpClient,
                            settingCode.split('#')[1],
                            value.trim()
                          )
                          if (!isUnique) {
                            return '既にこのコードは登録されています。'
                          } else {
                            return
                          }
                        },
                      })}
                      disabled={isEdit || readOnly}
                    />
                  </CustomInputItem>
                  <CustomInputItem
                    key={'name'}
                    label={'名称'}
                    required={true}
                    error={errors.name}
                    description={getDescription('name', currentSetting)}
                  >
                    <Input
                      {...register('name', {
                        required: '入力してください。',
                        validate: (value) =>
                          value.trim() !== '' ||
                          '空白のみは許可されていません。',
                      })}
                      disabled={readOnly}
                    />
                  </CustomInputItem>
                </>
              )}

              {currentSetting?.attributes.fields?.map((field) => {
                if (field.physicalName === 'code') {
                  if (field.dataType === 'string') {
                    return (
                      <CustomInputItem
                        key={`attributes.${field.physicalName}`}
                        label={field.name}
                        description={getDescription('code', currentSetting)}
                        required={field.isRequired}
                        error={errors?.attributes?.[field.physicalName]}
                        className="col-start-1"
                      >
                        <Input
                          placeholder={genPlaceholder(field.dataType)}
                          {...register(`attributes.${field.physicalName}`, {
                            required: '入力してください。',
                            maxLength: Number(field.length)
                              ? {
                                  value: Number(field.length),
                                  message: `${field.length}文字以内で入力してください。`,
                                }
                              : undefined,
                            validate: async (value) => {
                              const settingCode = getValues('settingCode')

                              if (!value || isEdit) return
                              if (!value) {
                                return
                              }

                              if (value.trim().length === 0) {
                                return '空白のみは許可されていません。'
                              }

                              const isUnique = await isCodeUnique(
                                httpClient,
                                settingCode.split('#')[1],
                                value.trim()
                              )
                              if (!isUnique) {
                                return '既にこのコードは登録されています。'
                              } else {
                                return
                              }
                            },
                          })}
                          disabled={isEdit}
                        />
                      </CustomInputItem>
                    )
                  }
                  if (field.dataType === 'number') {
                    return (
                      <CustomInputItem
                        key={`attributes.${field.physicalName}`}
                        label={field.name}
                        description={getDescription('code', currentSetting)}
                        required={field.isRequired}
                        error={errors?.attributes?.[field.physicalName]}
                        className="col-start-1"
                      >
                        <Input
                          disabled={isEdit}
                          placeholder={genPlaceholder(field.dataType)}
                          defaultValue={field.defaultValue}
                          {...register(`attributes.${field.physicalName}`, {
                            required:
                              field.isRequired === true
                                ? '入力してください。'
                                : false,
                            pattern: {
                              value: /^-?[0-9]+$/i,
                              message: '数字を入力してください。',
                            },
                            validate: async (value) => {
                              if (
                                field.min !== undefined &&
                                Number(value) < Number(field.min)
                              ) {
                                return `最小値は ${field.min} です。`
                              }
                              if (
                                field.max !== undefined &&
                                Number(value) > Number(field.max)
                              ) {
                                return `最大値は ${field.max} です。`
                              }
                              const settingCode = getValues('settingCode')

                              if (!value || isEdit) return
                              if (!value) {
                                return
                              }

                              if (value.trim().length === 0) {
                                return '空白のみは許可されていません。'
                              }

                              const isUnique = await isCodeUnique(
                                httpClient,
                                settingCode.split('#')[1],
                                value.trim()
                              )
                              if (!isUnique) {
                                return '既にこのコードは登録されています。'
                              } else {
                                return
                              }
                            },
                          })}
                        />
                      </CustomInputItem>
                    )
                  }

                  return (
                    <CustomInputItem
                      key={`attributes.${field.physicalName}`}
                      label={field.name}
                      description={getDescription('code', currentSetting)}
                      required={field.isRequired}
                      error={errors?.attributes?.[field.physicalName]}
                      className="col-start-1"
                    >
                      <Input
                        disabled
                        {...register(`attributes.${field.physicalName}`)}
                        placeholder={genPlaceholder(field.dataType)}
                        defaultValue={
                          isEdit ? field.defaultValue : formatData?.name
                        }
                      />
                    </CustomInputItem>
                  )
                }

                if (field.physicalName === 'name') {
                  return (
                    <CustomInputItem
                      key={`attributes.${field.physicalName}`}
                      label={field.name}
                      description={getDescription('name', currentSetting)}
                      required={field.isRequired}
                      error={errors?.attributes?.[field.physicalName]}
                    >
                      <Input
                        disabled={readOnly}
                        key={`${currentSetting.id}_${field.physicalName}`}
                        placeholder={genPlaceholder(field.dataType)}
                        defaultValue={field.defaultValue}
                        {...register(`attributes.${field.physicalName}`, {
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                          maxLength: Number(field.length)
                            ? {
                                value: Number(field.length),
                                message: `${field.length}文字以内で入力してください。`,
                              }
                            : undefined,
                        })}
                      />
                    </CustomInputItem>
                  )
                }

                return (
                  <CustomInputItem
                    key={`attributes.${field.physicalName}`}
                    label={field.name}
                    description={getDescription(
                      field.physicalName,
                      currentSetting
                    )}
                    required={field.isRequired}
                    error={errors?.attributes?.[field.physicalName]}
                    className={
                      [
                        'json',
                        'text-area',
                        'text-html',
                        'text-markdown',
                      ].includes(field.dataType)
                        ? 'col-span-1 md:col-span-2'
                        : ''
                    }
                  >
                    {field.dataType === 'string' ? (
                      field.maxRow && field.maxRow > 1 ? (
                        <Controller
                          key={`${currentSetting.id}_${field.physicalName}`}
                          control={control}
                          name={`attributes.${field.physicalName}`}
                          rules={{
                            required:
                              field.isRequired === true
                                ? '入力してください。'
                                : false,
                          }}
                          defaultValue={field.defaultValue}
                          render={({ field: { onChange, value } }) => (
                            <Textarea
                              disabled={readOnly}
                              className="resize-none"
                              placeholder={genPlaceholder(field.dataType)}
                              value={value}
                              onChange={(value) =>
                                !field?.maxRow ||
                                value.target.value.split('\n').length <=
                                  field.maxRow
                                  ? onChange(value)
                                  : undefined
                              }
                            />
                          )}
                        />
                      ) : (
                        <Input
                          disabled={readOnly}
                          key={`${currentSetting.id}_${field.physicalName}`}
                          placeholder={genPlaceholder(field.dataType)}
                          defaultValue={field.defaultValue}
                          {...register(`attributes.${field.physicalName}`, {
                            required:
                              field.isRequired === true
                                ? '入力してください。'
                                : false,
                            maxLength: Number(field.length)
                              ? {
                                  value: Number(field.length),
                                  message: `${field.length}文字以内で入力してください。`,
                                }
                              : undefined,
                            validate: (value) => {
                              if (!value && !field.isRequired) return true
                              if (field.pattern) {
                                try {
                                  const regex = new RegExp(field.pattern)
                                  if (!regex.test(value)) {
                                    return `正規表現パターンが正しくありません。パターン: ${field.pattern}`
                                  }
                                } catch (error) {
                                  return `正規表現パターンが正しくありません。パターン: ${field.pattern}`
                                }
                              }
                              return true
                            },
                          })}
                        />
                      )
                    ) : field.dataType === 'json' ? (
                      <Controller
                        key={`${currentSetting.id}_${field.physicalName}`}
                        control={control}
                        name={`attributes.${field.physicalName}`}
                        rules={{
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                          // Add a validation rule to ensure the string is valid JSON
                          validate: (value) => {
                            if (!value && !field.isRequired) return true
                            try {
                              // The editor passes a string, so we try to parse it
                              JSON.parse(value)
                              return true
                            } catch (e) {
                              return 'JSONの形式が正しくありません。' // "Invalid JSON format."
                            }
                          },
                        }}
                        defaultValue={field.defaultValue}
                        render={({ field: { onChange, value } }) => {
                          // Ensure the value passed to the editor is always a string.
                          const stringValue =
                            typeof value === 'object' && value !== null
                              ? JSON.stringify(value, null, 2)
                              : value || ''

                          return (
                            <div className="h-[500px]">
                              <JSONEditorComponent
                                disabled={readOnly}
                                key={`${currentSetting.id}_${field.physicalName}_json`}
                                text={stringValue}
                                onChangeText={(text) => onChange(text)}
                              />
                            </div>
                          )
                        }}
                      />
                    ) : field.dataType === 'number' ? (
                      <Input
                        disabled={readOnly}
                        key={`${currentSetting.id}_${field.physicalName}`}
                        placeholder={genPlaceholder(field.dataType)}
                        defaultValue={field.defaultValue}
                        {...register(`attributes.${field.physicalName}`, {
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                          pattern: {
                            value: /^-?[0-9]+$/i,
                            message: '数字を入力してください。',
                          },
                          validate: (value) => {
                            if (
                              field.min !== undefined &&
                              Number(value) < Number(field.min)
                            ) {
                              return `最小値は ${field.min} です。`
                            }
                            if (
                              field.max !== undefined &&
                              Number(value) > Number(field.max)
                            ) {
                              return `最大値は ${field.max} です。`
                            }
                            return true
                          },
                        })}
                      />
                    ) : field.dataType === 'text-area' ? (
                      <Controller
                        key={`${currentSetting.id}_${field.physicalName}`}
                        control={control}
                        name={`attributes.${field.physicalName}`}
                        defaultValue={field.defaultValue}
                        rules={{
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                        }}
                        render={({ field: { onChange, value } }) => (
                          <Textarea
                            disabled={readOnly}
                            className="resize-none"
                            placeholder={genPlaceholder(field.dataType)}
                            value={value}
                            onChange={(value) =>
                              !field?.maxRow ||
                              value.target.value.split('\n').length <=
                                field.maxRow
                                ? onChange(value)
                                : undefined
                            }
                          />
                        )}
                      />
                    ) : field.dataType === 'text-html' ? (
                      <Controller
                        key={`${currentSetting.id}_${field.physicalName}`}
                        control={control}
                        name={`attributes.${field.physicalName}`}
                        rules={{
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                        }}
                        defaultValue={field.defaultValue}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Editor
                              value={value}
                              onChangeController={onChange}
                              fieldClassName={readOnly && 'htmleditor-disable'}
                              disabled={readOnly}
                            />
                          )
                        }}
                      />
                    ) : field.dataType === 'text-markdown' ? (
                      <Controller
                        key={`${currentSetting.id}_${field.physicalName}`}
                        control={control}
                        name={`attributes.${field.physicalName}`}
                        rules={{
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                        }}
                        defaultValue={field.defaultValue}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <MDEditor
                              value={value}
                              onChange={onChange}
                              className={readOnly && 'markdowneditor-disable'}
                            />
                          )
                        }}
                      />
                    ) : field.dataType === 'boolean' ? (
                      <Controller
                        key={`${currentSetting.id}_${field.physicalName}`}
                        control={control}
                        name={`attributes.${field.physicalName}`}
                        rules={{
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                        }}
                        defaultValue={field.defaultValue}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Switch
                              disabled={readOnly}
                              checked={value === true}
                              onCheckedChange={(checked) => onChange(checked)}
                            />
                          )
                        }}
                      />
                    ) : field.dataType === 'array' ? (
                      <Controller
                        control={control}
                        name={`attributes.${field.physicalName}`}
                        rules={{
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                        }}
                        defaultValue={
                          Array.isArray(field.defaultValue)
                            ? field.defaultValue
                            : []
                        }
                        render={({ field: { onChange, value } }) => (
                          <ArrayInputField
                            values={Array.isArray(value) ? value : []}
                            onChange={onChange}
                            disabled={readOnly}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        key={`${currentSetting.id}_${field.physicalName}`}
                        control={control}
                        name={`attributes.${field.physicalName}`}
                        rules={{
                          required:
                            field.isRequired === true
                              ? '入力してください。'
                              : false,
                        }}
                        defaultValue={field.defaultValue}
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            disabled={readOnly}
                            onChange={(date) => onChange(date)}
                            value={value}
                          />
                        )}
                      />
                    )}
                  </CustomInputItem>
                )
              })}
            </div>
          </div>
        </form>
      </div>

      <div className="flex justify-center pt-10">
        <BackButton onClickPrev={() => router.back()} />
      </div>
    </>
  )
}
