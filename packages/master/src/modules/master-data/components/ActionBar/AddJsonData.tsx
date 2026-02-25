'use client'

import { SaveIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DownloadJSONButton from '../../../../components/buttons/DownloadJSONButton'
import ImportJSONButton from '../../../../components/buttons/ImportJSONButton'
import Modal from '../../../../components/DragResizeModal'
import { Button } from '../../../../components/ui/button'
import { useToast } from '../../../../components/ui/use-toast'
import { API_URLS } from '../../../../lib/constants/url'
import { useSubscribeBulkCommandStatus } from '../../../../lib/hook/useSubscribeMessage'
import { removeSortKeyVersion } from '../../../../lib/utils/removeSortKeyVersion'
import { useHttpClient } from '../../../../provider'
import { DataSettingDataEntity } from '../../../../types'
import JSONEditorComponent from '../../../../components/JSONEditorComponent'

function ModalContent({
  open,
  setOpen,
  submitting,
  value,
  setValue,
  saveData,
  onCloseModal,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  submitting: boolean
  value: string
  setValue: Dispatch<SetStateAction<string>>
  saveData: () => Promise<void>
  onCloseModal?: () => void
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
          schema={{
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
              required: ['settingCode', 'code', 'name', 'attributes'],
            },
          }}
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
  onSave,
}: {
  tenantCode: string
  jsonValue?: string
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
  const isObject = (data: any) => {
    return typeof data === 'object' && !Array.isArray(data) && data !== null
  }
  const isArray = (data: any) => {
    return typeof data === 'object' && Array.isArray(data) && data !== null
  }

  const isValidJsonData = (data: any) => {
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

  const { start, stop, finishedCount } = useSubscribeBulkCommandStatus(
    tenantCode,
    () => {
      // Timeout callback
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

  // Track when all items are finished
  useEffect(() => {
    if (finishedCount === 0 || expectedCount === 0) return

    // Show toast for each completed item
    toast({
      description: `反映しました (${finishedCount}/${expectedCount})`,
      variant: 'success',
    })

    // Check if all items are finished
    if (finishedCount >= expectedCount) {
      stop()
      setSubmitting(false)
      setOpen(false)
      setExpectedCount(0)

      // Call onSave to refresh data
      onSave(savedValue)
    }
  }, [finishedCount, expectedCount, savedValue, onSave, toast, stop])

  const saveData = async () => {
    let data: any
    try {
      data = JSON.parse(value)
    } catch {
      toast({
        title: 'JSON が無効です',
        description: '正しいJSONフォーマットである必要があります。',
        variant: 'destructive',
      })
      return
    }
    if (!isValidJsonData(data)) {
      toast({
        title: 'JSON が無効です',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    let res: DataSettingDataEntity[] | undefined = undefined
    try {
      res = (
        await httpClient.post<DataSettingDataEntity[]>(
          API_URLS.DATA.CREATE_BULK,
          {
            items: data,
          }
        )
      ).data
    } catch (error) {
      console.error(error)
      setSubmitting(false)
      setExpectedCount(0)
      toast({
        title: 'データ反映に失敗しました。',
        variant: 'destructive',
      })
      return
    }

    const itemsWithRequestId = res.filter((item) => item.requestId)
    if (itemsWithRequestId.length === 0) {
      // All items had no changes (not dirty)
      setSubmitting(false)
      setOpen(false)
      setExpectedCount(0)
      toast({
        description: 'データに変更はありませんでした。',
        variant: 'success',
      })
      onSave(
        res.map((item) => ({ ...item, sk: removeSortKeyVersion(item.sk) }))
      )
    } else {
      setExpectedCount(itemsWithRequestId.length)
      setSavedValue(
        res.map((item) => ({ ...item, sk: removeSortKeyVersion(item.sk) }))
      )
      start(itemsWithRequestId[0].requestId)
    }
  }

  const searchParam = useSearchParams()
  const typeCode = searchParam.get('typeCode').split('#')[1]

  const sampleDataJson = JSON.stringify([
    {
      settingCode: typeCode, // Get typeCodeId from url
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

  useEffect(() => {
    setValue(jsonValue || sampleDataJson)
  }, [jsonValue])

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
        />
      </Modal.Window>
    </Modal>
  )
}
