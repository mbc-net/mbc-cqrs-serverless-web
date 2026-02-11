'use client'

import { SaveIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '../../../components/ui/button'
import ImportJSONButton from '../../../components/buttons/ImportJSONButton'
import DownloadJSONButton from '../../../components/buttons/DownloadJSONButton'
import { DataSettingDataEntity } from '../../../types'
import { useToast } from '../../../components/ui/use-toast'
import Modal from '../../../components/DragResizeModal'
import JSONEditorComponent from '../../../components/JSONEditorComponent'

function ModalContent({
  setOpen,
  value,
  setValue,
  saveData,
  onCloseModal,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  value: string
  setValue: Dispatch<SetStateAction<string>>
  saveData: () => Promise<void>
  onCloseModal?: () => void
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="mb-3 mt-5 min-h-0 flex-1">
        <JSONEditorComponent
          text={value}
          onChangeText={(json) => setValue(json)}
          schema={{
            type: 'object',
            properties: {
              settingCode: { type: 'string' },
              code: { type: 'string' },
              name: { type: 'string' },
              attributes: { type: 'object' },
            },
            required: ['settingCode', 'code', 'name'],
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            onCloseModal?.()
            setOpen(false)
          }}
        >
          キャンセル
        </Button>
        <ImportJSONButton onAdd={setValue} />
        <DownloadJSONButton fileName="master-data.json" data={value} />
        <Button
          type="button"
          onClick={() => {
            saveData()
            onCloseModal?.()
          }}
        >
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
  open: boolean
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
  disabled,
  jsonValue,
  onSave,
}: {
  disabled: boolean
  jsonValue?: string
  onSave: (setting: DataSettingDataEntity) => void
}) {
  const { toast } = useToast()
  const [value, setValue] = useState<string>('')
  const [open, setOpen] = useState(false)

  const isObject = (data: any) => {
    return typeof data === 'object' && !Array.isArray(data) && data !== null
  }

  const isValidJsonData = (data: any) => {
    if (!isObject(data)) return false
    if (!data?.settingCode || !data?.code || !data?.name) {
      return false
    }
    // if (!isObject(data.attributes)) {
    //   return false
    // }
    return true
  }

  const saveData = async () => {
    const data = JSON.parse(value)
    if (!isValidJsonData(data)) {
      toast({
        title: 'JSON が無効です',
        variant: 'destructive',
      })
      return
    }
    onSave(data)
  }

  useEffect(() => {
    setValue(jsonValue || '')
  }, [jsonValue])

  return (
    <Modal>
      <Modal.Open opens="add-json-data">
        <TriggerButton disabled={disabled} open={open} setOpen={setOpen} />
      </Modal.Open>
      <Modal.Window name="add-json-data">
        <ModalContent
          setOpen={setOpen}
          value={value}
          saveData={saveData}
          setValue={setValue}
        />
      </Modal.Window>
    </Modal>
  )
}
