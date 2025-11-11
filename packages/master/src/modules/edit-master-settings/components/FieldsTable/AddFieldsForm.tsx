import React, { useEffect, useState } from 'react'

import { PlusIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { defaultPhysicalSettingField } from '../../settingFields'
import { MasterRdsEntity } from '../../../../types/MasterRdsEntity'
import { SettingAttrFields } from '../../../../types'
import { MDEditor } from '../../../../components/MDEditor'
import DatePicker from '../../../../components/form/DatePicker'
import CustomFormItem from '../../../../components/form/CustomFormItem'
import { Textarea } from '../../../../components/ui/textarea'
import { Switch } from '../../../../components/ui/switch'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { Form, FormControl, FormField } from '../../../../components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { Editor } from '../field-editor'
import JSONEditorComponent from '../../../../components/JSONEditorComponent'

// === ENUMS ===
const DataTypes = z.enum(
  [
    'string',
    'number',
    'auto_number',
    'json',
    'date',
    'text',
    'boolean',
    'array',
  ],
  {
    required_error: '入力は必須です。',
  }
)

const TextFormats = z.enum(['area', 'html', 'markdown'], {
  required_error: '入力は必須です。',
})

// === COMMON VALIDATORS ===
const numericString = z
  .string()
  .optional()
  .refine((v) => v === undefined || v === '' || /^-?[0-9]+$/.test(v), {
    message: '数字で入力してください。',
  })

const limitedString = z
  .string({ required_error: '入力してください。' })
  .min(1, '入力してください。')
  .max(255, '255文字以内で入力してください。')

// === BASE SCHEMA ===
const baseSchema = z.object({
  physicalName: limitedString,
  name: limitedString,
  description: z.string(),
  dataType: DataTypes,
  defaultValue: z.union([z.string(), z.boolean()]).optional(),
  dataFormat: z.string({ required_error: '選択してください。' }).optional(),
  isRequired: z.boolean(),
  isShowedOnList: z.boolean(),
  min: numericString,
  max: numericString,
  length: z
    .string()
    .regex(/^[0-9]+$/, { message: '数字で入力してください。' })
    .refine(
      (v) => {
        const num = Number(v)
        return num >= 1 && num <= 255
      },
      {
        message: '1〜255の範囲で入力してください。',
      }
    )
    .optional(),
  maxRow: numericString.refine(
    (v) => {
      if (v === '' || v === undefined) return true
      return Number(v) >= 1
    },
    {
      message: '1以上の数値を入力してください。',
    }
  ),
  prefix: z.string({ required_error: '入力してください。' }).optional(),
  postfix: z.string().optional(),
  textFormat: TextFormats.optional(),
  pattern: z.string().optional(),
})

// === REFINEMENTS ===
export const fieldsSchema = baseSchema
  .refine(
    (data) => !(data.min && data.max) || Number(data.min) < Number(data.max),
    {
      message: '最小値には最大値より小さい値を入力してください。',
      path: ['min'],
    }
  )
  .refine(
    (data) => !(data.min && data.max) || Number(data.min) < Number(data.max),
    {
      message: '最大値には最小値より大きい値を入力してください。',
      path: ['max'],
    }
  )
  .refine(
    (data) => {
      if (data.dataType === 'number' && data.defaultValue) {
        const def = Number(data.defaultValue)
        const min = data.min ? Number(data.min) : -Infinity
        const max = data.max ? Number(data.max) : Infinity
        return def >= min && def <= max
      }
      return true
    },
    {
      message: 'デフォルト値は min から max の範囲内である必要があります。',
      path: ['defaultValue'],
    }
  )
  .refine(
    (data) => {
      if (data.dataType === 'json' && data.defaultValue) {
        try {
          JSON.parse(data.defaultValue as string)
          return true
        } catch {
          return false
        }
      }
      return true
    },
    {
      message: 'デフォルト値は有効な JSON である必要があります。',
      path: ['defaultValue'],
    }
  )
  .refine(
    (data) => {
      if (data.dataType === 'boolean' && data.defaultValue !== undefined) {
        return typeof data.defaultValue === 'boolean'
      }
      return true
    },
    {
      message: 'デフォルト値は true または false である必要があります。',
      path: ['defaultValue'],
    }
  )
  .refine((data) => data.dataType !== 'text' || !!data.textFormat, {
    message: 'dataType が "text" の場合、textFormat は必須です。',
    path: ['textFormat'],
  })
  .refine(
    (data) => {
      if (data.dataType === 'string' && data.defaultValue && data.length) {
        return (data.defaultValue as string).length <= Number(data.length)
      }
      return true
    },
    {
      message: '文字列の長さは設定された長さを超えてはいけません。',
      path: ['defaultValue'],
    }
  )
  .refine(
    (data) => {
      if (data.dataType === 'auto_number' && data.physicalName === 'code') {
        return !!data.dataFormat
      }
      return true
    },
    {
      message: '選択してください。',
      path: ['dataFormat'],
    }
  )
// .refine(
//   (data) => {
//     if (data.dataType === 'array' && data.defaultValue) {
//       try {
//         const parsed = JSON.parse(data.defaultValue as string)
//         return Array.isArray(parsed)
//       } catch {
//         return false
//       }
//     }
//     return true
//   },
//   {
//     message: '配列として有効な JSON を入力してください。',
//     path: ['defaultValue'],
//   }
// )
// .refine(
//   (data) => {
//     if (data.dataType === 'auto_number' && data.physicalName === 'code') {
//       return !!data.prefix
//     }
//     return true
//   },
//   {
//     message: '入力してください。',
//     path: ['prefix'],
//   }
// )

type FieldsSchema = z.infer<typeof fieldsSchema>

export default function AddFieldsForm({
  disabled,
  submit,
  editData,
  formatOptions,
}: {
  disabled: boolean
  submit: (data: SettingAttrFields, mode: 'add' | 'edit') => void
  editData:
    | {
        index: number
        data: SettingAttrFields
      }
    | undefined
  formatOptions: MasterRdsEntity[]
}) {
  const defaultValues: FieldsSchema = {
    physicalName: '',
    name: '',
    description: '',
    dataType: 'string',
    min: undefined,
    max: undefined,
    length: undefined,
    defaultValue: undefined,
    isRequired: false,
    isShowedOnList: false,
    maxRow: undefined,
    textFormat: 'area',
    dataFormat: undefined,
    pattern: undefined,
  }

  const form = useForm<FieldsSchema>({
    resolver: zodResolver(fieldsSchema),
    defaultValues,
    reValidateMode: 'onSubmit',
  })

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const isDefaultSettingField = defaultPhysicalSettingField.includes(
    form.watch('physicalName')
  )

  const onAdd = () => {
    setMode('add')
    form.reset(defaultValues)
    setOpen(true)
  }

  const onSubmit = (data: FieldsSchema) => {
    const formattedData = {
      ...data,
      maxRow: data?.maxRow ? Number(data.maxRow) : undefined,
      length: data.dataType === 'string' ? data.length : undefined,
      pattern: data.dataType === 'string' ? data.pattern : undefined,
      min: data.dataType === 'number' ? data.min : undefined,
      max: data.dataType === 'number' ? data.max : undefined,
      // Convert boolean defaultValue to string for compatibility with SettingAttrFields
      defaultValue:
        data.dataType === 'boolean' && typeof data.defaultValue === 'boolean'
          ? data.defaultValue.toString()
          : data.defaultValue,
    } as any
    if (data.dataType === 'text') {
      formattedData.dataType = `${data.dataType}-${data.textFormat}`
    }
    if (data.dataType === 'auto_number') {
      const settingData = formatOptions.find(
        (option) => option.sk === formattedData.dataFormat
      )
      formattedData.formatCode = formattedData.dataFormat
      formattedData.dataFormat = settingData.attributes?.format
      formattedData.formatName = settingData.name
    }
    submit(formattedData, mode)
    setOpen(false)
    form.reset(defaultValues)
  }

  useEffect(() => {
    if (editData) {
      const formattedData = {
        ...editData.data,
        maxRow: editData.data.maxRow?.toString(),
        // Convert string defaultValue to boolean for boolean dataType
        defaultValue:
          editData.data.dataType === 'boolean' && editData.data.defaultValue
            ? editData.data.defaultValue === 'true'
            : editData.data.defaultValue,
      } as FieldsSchema

      if (formattedData.dataType.startsWith('text-')) {
        const [type, format] = formattedData.dataType.split('-')
        formattedData.dataType = type as any
        formattedData.textFormat = format as any
      }
      form.reset(formattedData)
      setMode('edit')
      setOpen(true)
    }
  }, [editData])

  useEffect(() => {
    const dataType = form.getValues('dataType')
    const textFormat = form.getValues('textFormat')
    const formattedDataType =
      dataType !== 'text' ? dataType : `${dataType}-${textFormat}`

    if (editData && editData.data.dataType === formattedDataType) return

    form.setValue('defaultValue', dataType === 'boolean' ? false : '')
  }, [form.watch('dataType'), form.watch('textFormat')])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        disabled={disabled}
        type="button"
        onClick={onAdd}
        className="w-fit"
      >
        <PlusIcon />
        項目追加
      </Button>

      <DialogContent className="max-h-[85%] w-[90%] max-w-none overflow-y-auto lg:w-[80%] xl:w-[60%]">
        <DialogHeader>
          <DialogTitle>
            <div className="mt-1 text-center text-[hsl(var(--foreground))]">
              項目追加
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1">
          <Form {...form}>
            <form>
              <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                <FormField
                  control={form.control}
                  name="physicalName"
                  render={({ field }) => (
                    <CustomFormItem
                      className="block"
                      label="コード"
                      required={true}
                    >
                      <FormControl>
                        <Input
                          autoComplete="physicalName"
                          className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                          disabled={isDefaultSettingField}
                          {...field}
                        />
                      </FormControl>
                    </CustomFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <CustomFormItem
                      className="block"
                      label="名称"
                      required={true}
                    >
                      <FormControl>
                        <Input
                          autoComplete="name"
                          className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                    </CustomFormItem>
                  )}
                />
                {form.watch('physicalName') === 'code' ? (
                  <FormField
                    control={form.control}
                    name="dataType"
                    render={({ field }) => (
                      <CustomFormItem
                        className="block"
                        label="データ型"
                        required={true}
                      >
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: 'string', label: '文字列' },
                              { value: 'number', label: '数値' },
                              { value: 'auto_number', label: '自動採番' },
                            ].map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CustomFormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="dataType"
                    render={({ field }) => (
                      <CustomFormItem
                        className="block"
                        label="データ型"
                        required={true}
                      >
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isDefaultSettingField}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: 'string', label: '文字列' },
                              { value: 'number', label: '数値' },
                              { value: 'boolean', label: 'ブール値' },
                              { value: 'date', label: '日付' },
                              { value: 'array', label: '文字列(配列)' },
                              { value: 'json', label: 'JSON' },
                              { value: 'text', label: '文字列（複数行）' },
                            ].map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CustomFormItem>
                    )}
                  />
                )}
                {form.watch('dataType') === 'text' && (
                  <FormField
                    control={form.control}
                    name="textFormat"
                    render={({ field }) => (
                      <CustomFormItem
                        className="block"
                        label="エディタ"
                        required={true}
                      >
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || 'text'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: 'area', label: 'テキストエリア' },
                              { value: 'html', label: 'HTML形式' },
                              { value: 'markdown', label: 'Markdown形式' },
                            ].map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CustomFormItem>
                    )}
                  />
                )}
                {form.watch('dataType') === 'number' && (
                  <div className="grid grid-cols-2 gap-x-10">
                    <FormField
                      control={form.control}
                      name="min"
                      render={({ field }) => (
                        <CustomFormItem className="block" label="Min">
                          <FormControl>
                            <Input
                              type="number"
                              autoComplete="min"
                              className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="max"
                      render={({ field }) => (
                        <CustomFormItem className="block" label="Max">
                          <FormControl>
                            <Input
                              type="number"
                              autoComplete="max"
                              className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                  </div>
                )}
                {form.watch('dataType') === 'string' && (
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <CustomFormItem className="block" label="文字数">
                        <FormControl>
                          <Input
                            type="number"
                            autoComplete="length"
                            className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                      </CustomFormItem>
                    )}
                  />
                )}
                {form.watch('dataType') === 'auto_number' && (
                  <>
                    <FormField
                      control={form.control}
                      name="dataFormat"
                      render={({ field }) => (
                        <CustomFormItem
                          className="block"
                          label="フォーマット"
                          required={true}
                        >
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {formatOptions.map((options) => (
                                <SelectItem key={options.id} value={options.sk}>
                                  {options.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CustomFormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prefix"
                      render={({ field }) => (
                        <CustomFormItem className="block" label="接頭辞">
                          <FormControl>
                            <Input
                              autoComplete="prefix"
                              className="focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postfix"
                      render={({ field }) => (
                        <CustomFormItem className="block" label="接尾辞">
                          <FormControl>
                            <Input
                              autoComplete="postfix"
                              className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                  </>
                )}
                {!isDefaultSettingField &&
                  (form.watch('dataType') === 'date' ? (
                    <FormField
                      key="default-value-date"
                      control={form.control}
                      name="defaultValue"
                      render={({ field }) => (
                        <CustomFormItem
                          className="col-start-1 block"
                          label="デフォルト値"
                        >
                          <FormControl>
                            <DatePicker
                              {...field}
                              value={
                                typeof field.value === 'boolean'
                                  ? String(field.value)
                                  : (field.value ?? '')
                              }
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                  ) : form.watch('dataType') === 'text' ? (
                    form.watch('textFormat') === 'html' ? (
                      <FormField
                        key="default-value-text-html"
                        control={form.control}
                        name="defaultValue"
                        render={({
                          field: {
                            ref: _,
                            value,
                            onChange: _onChange,
                            ...others
                          },
                        }) => {
                          return (
                            <CustomFormItem
                              className="col-span-2 col-start-1 block"
                              label="デフォルト値"
                            >
                              <FormControl>
                                <Editor
                                  value={value as string}
                                  onChangeController={_onChange}
                                />
                              </FormControl>
                            </CustomFormItem>
                          )
                        }}
                      />
                    ) : form.watch('textFormat') === 'area' ? (
                      <FormField
                        key="default-value-text-text"
                        control={form.control}
                        name="defaultValue"
                        render={({ field }) => (
                          <CustomFormItem
                            className="col-span-2 col-start-1 block"
                            label="デフォルト値"
                          >
                            <FormControl>
                              <Textarea
                                autoComplete="description"
                                className="focus-visible:ring-offset-0"
                                {...field}
                                value={
                                  typeof field.value === 'boolean'
                                    ? String(field.value)
                                    : (field.value ?? '')
                                }
                              />
                            </FormControl>
                          </CustomFormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        key="default-value-text-markdown"
                        control={form.control}
                        name="defaultValue"
                        render={({
                          field: {
                            ref: _,
                            value,
                            onChange: _onChange,
                            ...others
                          },
                        }) => {
                          return (
                            <CustomFormItem
                              className="col-span-2 col-start-1 block"
                              label="デフォルト値"
                            >
                              <FormControl>
                                <MDEditor
                                  value={value as string}
                                  onChange={_onChange}
                                />
                              </FormControl>
                            </CustomFormItem>
                          )
                        }}
                      />
                    )
                  ) : form.watch('dataType') === 'json' ? (
                    <FormField
                      key="default-value-json"
                      control={form.control}
                      name="defaultValue"
                      render={({ field: { onChange, value } }) => (
                        <CustomFormItem
                          className="col-span-2 col-start-1 block"
                          label="デフォルト値"
                        >
                          <FormControl>
                            <JSONEditorComponent
                              text={value as string}
                              onChangeText={(text) => onChange(text)}
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                  ) : form.watch('dataType') === 'boolean' ? (
                    <FormField
                      key="default-value-boolean"
                      control={form.control}
                      name="defaultValue"
                      render={({ field }) => (
                        <CustomFormItem
                          className="col-start-1 block"
                          label="デフォルト値"
                        >
                          <FormControl>
                            <Switch
                              checked={field.value === true}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                  ) : form.watch('dataType') === 'array' ? (
                    <></>
                  ) : (
                    <FormField
                      key="default-value-other"
                      control={form.control}
                      name="defaultValue"
                      render={({ field }) => (
                        <CustomFormItem
                          className="col-start-1 block"
                          label="デフォルト値"
                        >
                          <FormControl>
                            <Input
                              autoComplete="defaultValue"
                              className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                              {...field}
                              value={
                                typeof field.value === 'boolean'
                                  ? String(field.value)
                                  : (field.value ?? '')
                              }
                            />
                          </FormControl>
                        </CustomFormItem>
                      )}
                    />
                  ))}
                {form.watch('dataType') === 'string' && (
                  <FormField
                    control={form.control}
                    name="pattern"
                    render={({ field }) => (
                      <CustomFormItem
                        className="block"
                        label="正規表現パターン"
                      >
                        <FormControl>
                          <Input
                            autoComplete="pattern"
                            placeholder="正規表現パターンを入力してください"
                            className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                      </CustomFormItem>
                    )}
                  />
                )}
                <div className="flex items-start justify-start gap-10">
                  <FormField
                    control={form.control}
                    name="isRequired"
                    render={({ field }) => (
                      <CustomFormItem
                        className="flex w-fit flex-col space-y-1"
                        label="必須項目"
                      >
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isDefaultSettingField}
                          />
                        </FormControl>
                      </CustomFormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isShowedOnList"
                    render={({ field }) => (
                      <CustomFormItem
                        className="flex w-fit flex-col space-y-1"
                        label="一覧表示"
                      >
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isDefaultSettingField}
                          />
                        </FormControl>
                      </CustomFormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <CustomFormItem className="col-span-2 block" label="説明">
                      <FormControl>
                        <Textarea
                          autoComplete="description"
                          className="text-[hsl(var(--foreground))] focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                    </CustomFormItem>
                  )}
                />
              </div>

              <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  キャンセル
                </Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                  登録
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
