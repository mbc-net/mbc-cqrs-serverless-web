'use client'

import { SaveIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import DownloadJSONButton from '../../../../components/buttons/DownloadJSONButton'
import ImportJSONButton from '../../../../components/buttons/ImportJSONButton'
import Modal from '../../../../components/DragResizeModal'
import { Button } from '../../../../components/ui/button'
import { useToast } from '../../../../components/ui/use-toast'
import { API_URLS } from '../../../../lib/constants/url'
import { useSubscribeBulkCommandStatus } from '../../../../lib/hook/useSubscribeMessage'
import { getErrorMessage } from '../../../../lib/utils/getErrorMessage'
import { removeSortKeyVersion } from '../../../../lib/utils/removeSortKeyVersion'
import { useHttpClient } from '../../../../provider'
import { DataSettingDataEntity } from '../../../../types'
import {
  isValidMappedDataValue,
  mapResultToBulkItem,
  type BulkJsonItem,
  type MapResult,
  type MappedData,
} from '../../../../types/bulk-json-mapper'
import JSONEditorComponent from '../../../../components/JSONEditorComponent'
import { isValidMasterDataJson } from '../../../master-settings/schema'

function ModalContent({
  open,
  setOpen,
  submitting,
  value,
  setValue,
  saveData,
  onCloseModal,
  relaxedSchema,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  submitting: boolean
  value: string
  setValue: Dispatch<SetStateAction<string>>
  saveData: () => Promise<void>
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
                }
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          disabled={submitting}
          type="button"
          variant="secondary"
          onClick={() => {
            setOpen(false)
            onCloseModal?.()
          }}
        >
          キャンセル
        </Button>
        <ImportJSONButton disabled={submitting} onAdd={setValue} />
        <DownloadJSONButton
          disabled={submitting}
          fileName="master-data-bulk.json"
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
  setOpen,
  onClick,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  onClick?: () => void
}) {
  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }
  return (
    <Button
      onClick={handleClick}
      type="button"
      variant="outline"
      className="block"
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
  onSave: (setting: DataSettingDataEntity[]) => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [value, setValue] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [savedValue, setSavedValue] = useState<DataSettingDataEntity[]>([])
  const [expectedCount, setExpectedCount] = useState(0)
  const httpClient = useHttpClient()

  const { start, stop, finishedCount } = useSubscribeBulkCommandStatus(
    tenantCode,
    () => {
      setSubmitting(false)
      setOpen(false)
      setExpectedCount(0)
      toast({
        title: 'データ反映に失敗しました。',
        description:
          'タイムアウトしました。入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
      router.refresh()
    }
  )

  useEffect(() => {
    if (finishedCount === 0 || expectedCount === 0) return

    toast({
      description: `反映しました (${finishedCount}/${expectedCount})`,
      variant: 'success',
    })

    if (finishedCount >= expectedCount) {
      stop()
      setSubmitting(false)
      setOpen(false)
      setExpectedCount(0)
      onSave(savedValue)
    }
  }, [finishedCount, expectedCount, savedValue, onSave, toast, stop])

  const submitBulk = useCallback(
    async (items: BulkJsonItem[]) => {
      setSubmitting(true)
      try {
        const res = (
          await httpClient.post<DataSettingDataEntity[]>(API_URLS.MASTER.BULK, {
            items,
          })
        ).data

        const processed = (res ?? []).map((item) => ({
          ...item,
          sk: removeSortKeyVersion(item.sk),
        }))
        const itemsWithRequestId = processed.filter((item) => item.requestId)

        if (itemsWithRequestId.length === 0) {
          setSubmitting(false)
          setOpen(false)
          setExpectedCount(0)
          toast({
            description: 'データに変更はありませんでした。',
            variant: 'success',
          })
          onSave(processed)
        } else {
          setExpectedCount(itemsWithRequestId.length)
          setSavedValue(processed)
          start(itemsWithRequestId[0].requestId!)
        }
      } catch (error) {
        console.error(error)
        setSubmitting(false)
        setExpectedCount(0)
        toast({
          title: 'データ反映に失敗しました。',
          description: getErrorMessage(error),
          variant: 'destructive',
        })
      }
    },
    [httpClient, onSave, start, toast]
  )

  const saveData = async () => {
    let parsedData: unknown
    try {
      parsedData = JSON.parse(value)
    } catch {
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

    if (mapRawItem) {
      let mapped: MapResult[]
      try {
        mapped = parsedData
          .map((item: unknown) => mapRawItem(item))
          .filter(Boolean) as MapResult[]
      } catch (error) {
        toast({
          title: 'マッピングに失敗しました。',
          description: getErrorMessage(error),
          variant: 'destructive',
        })
        return
      }

      const hasSetting = mapped.some((m) => m.kind === 'setting')
      if (hasSetting) {
        toast({
          title: 'マスター設定はこの画面から登録できません',
          description: 'マスターデータ画面では kind: "data" のみ登録できます。',
          variant: 'destructive',
        })
        return
      }

      const mappedData = mapped
        .filter((m) => m.kind === 'data')
        .map((m) => (m as MappedData).value)

      if (mappedData.length === 0) {
        toast({ title: 'データがありません', variant: 'destructive' })
        return
      }

      const invalidData = mappedData.filter((x) => !isValidMappedDataValue(x))
      if (invalidData.length > 0) {
        toast({
          title: 'マッピング結果が無効です',
          description:
            'データの settingCode, code, name は文字列、seq は数値、attributes はオブジェクトである必要があります。',
          variant: 'destructive',
        })
        return
      }

      await submitBulk(
        mapped
          .filter((m) => m.kind === 'data')
          .map((m) => mapResultToBulkItem(m))
      )
      return
    }

    if (!isValidMasterDataJson(parsedData)) {
      toast({
        title: 'JSON が無効です',
        variant: 'destructive',
      })
      return
    }

    await submitBulk(parsedData)
  }

  const searchParam = useSearchParams()
  const typeCode = searchParam.get('typeCode')?.split('#')[1]

  // Seed from host props only; omit typeCode/sample from deps so re-renders do not
  // clobber in-progress user edits (develop used [jsonValue] only).
  useEffect(() => {
    const sampleDataJson = JSON.stringify([
      {
        settingCode: typeCode,
        name: '',
        seq: 0,
        code: '',
        attributes: {
          seq: 0,
          code: '',
          name: '',
        },
      },
    ])
    setValue(jsonValue ?? inputSampleJson ?? sampleDataJson)
  }, [jsonValue, inputSampleJson])

  return (
    <Modal>
      <Modal.Open opens="add-json-data">
        <TriggerButton setOpen={setOpen} />
      </Modal.Open>
      <Modal.Window name="add-json-data">
        <ModalContent
          open={open}
          setOpen={setOpen}
          value={value}
          saveData={saveData}
          setValue={setValue}
          submitting={submitting}
          relaxedSchema={Boolean(mapRawItem)}
        />
      </Modal.Window>
    </Modal>
  )
}
