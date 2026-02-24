'use client'

import dynamic from 'next/dynamic'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Button } from '../../../components/ui/button'
import { useToast } from '../../../components/ui/use-toast'
import DownloadJSONButton from '../../../components/buttons/DownloadJSONButton'
import Modal from '../../../components/DragResizeModal'
import ImportJSONButton from '../../../components/buttons/ImportJSONButton'
import { SettingDataEntity } from '../../../types'
import { isValidSettingJson, sampleSettingJson } from '../schema'
import { SaveIcon } from 'lucide-react'
import JSONEditorComponent from '../../../components/JSONEditorComponent'

function ModalContent({
  value,
  setValue,
  saveData,
  onCloseModal,
}: {
  value: string
  setValue: Dispatch<SetStateAction<string>>
  saveData: () => void
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
              code: { type: 'string' },
              name: { type: 'string' },
              attributes: { $ref: '/schemas/attributes' },
            },
            required: ['code', 'name', 'attributes'],

            $defs: {
              attributes: {
                $id: '/schemas/attributes',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  fields: {
                    type: 'array',
                    minItems: 2,
                    items: { $ref: '/schemas/fields' },
                    allOf: [
                      {
                        contains: {
                          type: 'object',
                          required: ['physicalName'],
                          properties: {
                            physicalName: { const: 'code' },
                          },
                        },
                      },
                      {
                        contains: {
                          type: 'object',
                          required: ['physicalName'],
                          properties: {
                            physicalName: { const: 'name' },
                          },
                        },
                      },
                    ],
                  },
                },
                required: ['fields'],
              },
              fields: {
                $id: '/schemas/fields',
                type: 'object',
                properties: {
                  physicalName: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  dataType: {
                    enum: [
                      'string',
                      'number',
                      'auto_number',
                      'boolean',
                      'json',
                      'date',
                      'text-area',
                      'text-html',
                      'text-markdown',
                      'array',
                    ],
                  },
                  min: { type: 'string' },
                  max: { type: 'string' },
                  length: { type: 'string' },
                  maxRow: { type: 'number' },
                  defaultValue: { type: ['string', 'boolean'] },
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
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onCloseModal?.()}
        >
          キャンセル
        </Button>
        <ImportJSONButton onAdd={setValue} />
        <DownloadJSONButton fileName="master-setting.json" data={value} />
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

export default function AddJsonData({
  jsonValue,
  onSave,
}: {
  jsonValue?: string
  onSave: (setting: SettingDataEntity) => void
}) {
  const { toast } = useToast()
  const [value, setValue] = useState<string>('')

  const saveData = () => {
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
    if (!isValidSettingJson(data)) {
      toast({
        title: 'JSON が無効です',
        variant: 'destructive',
      })
      return
    }
    onSave(data as SettingDataEntity)
  }

  useEffect(() => {
    setValue(jsonValue || sampleSettingJson)
  }, [jsonValue])

  return (
    <Modal>
      <Modal.Open opens="add-json-setting">
        <Button type="button" variant="outline" className="block">
          JSONエディタ
        </Button>
      </Modal.Open>
      <Modal.Window name="add-json-setting">
        <ModalContent value={value} saveData={saveData} setValue={setValue} />
      </Modal.Window>
    </Modal>
  )
}
