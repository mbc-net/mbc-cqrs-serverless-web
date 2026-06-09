'use client'

import { SaveIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import DownloadJSONButton from '../../../components/buttons/DownloadJSONButton'
import ImportJSONButton from '../../../components/buttons/ImportJSONButton'
import Modal from '../../../components/DragResizeModal'
import { Button } from '../../../components/ui/button'
import { useToast } from '../../../components/ui/use-toast'
import { API_URLS } from '../../../lib/constants/url'
import { useSubscribeBulkCommandStatus } from '../../../lib/hook/useSubscribeMessage'
import { removeSortKeyVersion } from '../../../lib/utils/removeSortKeyVersion'
import { useHttpClient } from '../../../provider'
import { DataSettingDataEntity, SettingDataEntity } from '../../../types'
import { isValidBulkJson, sampleMixedJson } from '../schema'
import JSONEditorComponent from '../../../components/JSONEditorComponent'
import { getErrorMessage } from '../../../lib/utils/getErrorMessage'
import {
  isPlainObject,
  mapResultToBulkItem,
  type MapResult,
} from '../../../types/bulk-json-mapper'

function ModalContent({
  open,
  value,
  setOpen,
  setValue,
  saveData,
  onCloseModal,
  submitting,
  relaxedSchema,
}: {
  open: boolean
  value: string
  submitting: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setValue: Dispatch<SetStateAction<string>>
  saveData: () => void
  onCloseModal?: () => void
  relaxedSchema?: boolean
}) {
  useEffect(() => {
    if (!submitting && !open) {
      onCloseModal?.()
      setOpen(false)
    }
  }, [submitting, open])
  return (
    <div className="flex w-full flex-col overflow-hidden">
      <div className="mb-3 mt-5 flex-1">
        <JSONEditorComponent
          text={value}
          onChangeText={(json) => setValue(json)}
          schema={
            relaxedSchema
              ? { type: 'array', items: { type: 'object' } }
              : {
                  type: 'array',
                  items: {
                    oneOf: [
                      {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                          name: { type: 'string' },
                          attributes: {
                            $ref: '#/definitions/settingsAttributes',
                          },
                        },
                        required: ['code', 'name', 'attributes'],
                      },
                      {
                        type: 'object',
                        properties: {
                          settingCode: { type: 'string' },
                          code: { type: 'string' },
                          name: { type: 'string' },
                          seq: { type: 'number' },
                          attributes: { type: 'object' },
                        },
                        required: [
                          'settingCode',
                          'code',
                          'name',
                          'seq',
                          'attributes',
                        ],
                      },
                    ],
                  },
                  definitions: {
                    settingsAttributes: {
                      type: 'object',
                      properties: {
                        description: { type: 'string' },
                        fields: {
                          type: 'array',
                          items: { $ref: '#/definitions/fields' },
                        },
                      },
                      required: ['fields'],
                    },
                    fields: {
                      type: 'object',
                      properties: {
                        physicalName: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        dataType: {
                          enum: ['string', 'number', 'json', 'date'],
                        },
                        min: { type: 'string' },
                        max: { type: 'string' },
                        length: { type: 'string' },
                        maxRow: { type: 'number' },
                        defaultValue: { type: 'string' },
                        isRequired: { type: 'boolean' },
                        isShowedOnList: { type: 'boolean' },
                        dataFormat: { type: 'string' },
                      },
                      required: [
                        'physicalName',
                        'name',
                        'dataType',
                        'isRequired',
                        'isShowedOnList',
                      ],
                    },
                  },
                }
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={() => {
            onCloseModal?.()
            setOpen(false)
          }}
        >
          キャンセル
        </Button>
        <ImportJSONButton disabled={submitting} onAdd={setValue} />
        <DownloadJSONButton
          disabled={submitting}
          fileName="master-setting-bulk.json"
          data={value}
        />
        <Button type="button" loading={submitting} onClick={saveData}>
          <SaveIcon size={16} />
          データ反映
        </Button>
      </div>
    </div>
  )
}

function TriggerButton({
  disabled,
  setOpen,
  onClick,
}: {
  disabled: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onClick?: () => void
}) {
  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }
  return (
    <Button
      type="button"
      variant="outline"
      className="block"
      disabled={disabled}
      onClick={handleClick}
    >
      JSONエディタ
    </Button>
  )
}

export default function AddJsonData({
  tenantCode,
  jsonValue,
  inputSampleJson,
  mapRawItem,
  onSave,
}: {
  tenantCode: string
  jsonValue?: string
  inputSampleJson?: string
  mapRawItem?: (raw: unknown) => MapResult | null | undefined
  onSave?: (result: {
    settings?: SettingDataEntity[]
    data?: DataSettingDataEntity[]
  }) => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [value, setValue] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const savedResultsRef = useRef<(SettingDataEntity | DataSettingDataEntity)[]>(
    []
  )
  const [expectedCount, setExpectedCount] = useState(0)
  const httpClient = useHttpClient()
  const [bulkTenant, setBulkTenant] = useState<string>(tenantCode)

  const {
    start: startBulk,
    stop: stopBulk,
    finishedCount,
  } = useSubscribeBulkCommandStatus(bulkTenant, () => {
    // Timeout callback
    setSubmitting(false)
    setOpen(false)
    setExpectedCount(0)
    toast({
      title: 'マスターデータの反映に失敗しました。',
      description:
        'タイムアウトしました。入力内容を確認した上で再度やり直してください。',
      variant: 'destructive',
    })
    router.refresh()
  })

  // Track when all items are finished
  useEffect(() => {
    if (finishedCount === 0 || expectedCount === 0) return

    toast({
      description: `マスターデータを反映しました (${finishedCount}/${expectedCount})`,
      variant: 'success',
    })

    if (finishedCount >= expectedCount) {
      stopBulk()
      setExpectedCount(0)
      setSubmitting(false)
      setOpen(false)

      onSave?.({
        settings:
          savedResultsRef.current.length > 0
            ? (savedResultsRef.current as any)
            : undefined,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishedCount, expectedCount, toast, stopBulk, onSave])

  const saveData = async () => {
    let parsedData: any
    try {
      parsedData = JSON.parse(value)
    } catch (error) {
      toast({
        title: 'JSON が無効です',
        description: '正しいJSONフォーマットである必要があります。',
        variant: 'destructive',
      })
      return
    }

    if (!Array.isArray(parsedData)) {
      toast({
        title: 'JSON が無効です',
        description: '配列である必要があります。',
        variant: 'destructive',
      })
      return
    }

    let bulkItems: {
      name: string
      code: string
      attributes: object
      tenantCode?: string
      settingCode?: string
      seq?: number
    }[]

    // If mapper provided, transform first
    if (mapRawItem) {
      const mapped = parsedData
        .map((item: any) => mapRawItem(item))
        .filter(Boolean) as MapResult[]

      if (mapped.length === 0) {
        toast({ title: 'データがありません', variant: 'destructive' })
        return
      }

      // Validate mapped results
      for (const m of mapped) {
        if (m.kind === 'setting') {
          if (
            typeof m.value.name !== 'string' ||
            typeof m.value.code !== 'string' ||
            !isPlainObject(m.value.settingValue)
          ) {
            toast({
              title: 'マッピング結果が無効です',
              description:
                '設定データの name, code は文字列、settingValue はオブジェクトである必要があります。',
              variant: 'destructive',
            })
            return
          }
        } else {
          if (
            typeof m.value.settingCode !== 'string' ||
            m.value.settingCode.trim() === '' ||
            typeof m.value.code !== 'string' ||
            typeof m.value.name !== 'string' ||
            typeof m.value.seq !== 'number' ||
            !isPlainObject(m.value.attributes)
          ) {
            toast({
              title: 'マッピング結果が無効です',
              description:
                'データの settingCode, code, name は文字列、seq は数値、attributes はオブジェクトである必要があります。',
              variant: 'destructive',
            })
            return
          }
        }
      }

      bulkItems = mapped.map(mapResultToBulkItem)
    } else {
      // Validate using unified bulk validation
      if (!isValidBulkJson(parsedData)) {
        toast({
          title: 'JSON が無効です',
          description:
            '各項目には code, name, attributes が必須です。マスターデータの場合は settingCode, seq も必須です。',
          variant: 'destructive',
        })
        return
      }

      bulkItems = parsedData
    }

    if (bulkItems.length === 0) {
      toast({ title: 'データがありません', variant: 'destructive' })
      return
    }

    setSubmitting(true)

    try {
      const res = (
        await httpClient.post<(SettingDataEntity | DataSettingDataEntity)[]>(
          API_URLS.MASTER.BULK,
          { items: bulkItems }
        )
      ).data

      const processed = res.map((item) => ({
        ...item,
        sk: removeSortKeyVersion(item.sk),
      }))
      savedResultsRef.current = processed

      const itemsWithRequestId = res.filter((item) => item.requestId)
      if (itemsWithRequestId.length === 0) {
        setSubmitting(false)
        setOpen(false)
        toast({
          description: 'データに変更はありませんでした。',
          variant: 'success',
        })
        onSave?.({
          settings: processed.length > 0 ? (processed as any) : undefined,
        })
      } else {
        const itemTenant = bulkItems[0]?.tenantCode || tenantCode
        setBulkTenant(itemTenant)
        setExpectedCount(itemsWithRequestId.length)
        startBulk(itemsWithRequestId[0].requestId)
      }
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error)
      toast({
        title: 'マスターデータの反映に失敗しました。',
        description: errorMessage,
        variant: 'destructive',
      })
      setSubmitting(false)
    }
  }

  useEffect(() => {
    setValue(jsonValue || inputSampleJson || sampleMixedJson)
  }, [jsonValue, inputSampleJson])

  return (
    <Modal>
      <Modal.Open opens="add-json-setting">
        <TriggerButton disabled={submitting} setOpen={setOpen} />
      </Modal.Open>
      <Modal.Window name="add-json-setting">
        <ModalContent
          submitting={submitting}
          open={open}
          value={value}
          setOpen={setOpen}
          saveData={saveData}
          setValue={setValue}
          relaxedSchema={Boolean(mapRawItem)}
        />
      </Modal.Window>
    </Modal>
  )
}
