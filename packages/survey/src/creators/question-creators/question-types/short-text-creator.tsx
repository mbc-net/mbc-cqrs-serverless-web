'use client'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import { X } from 'lucide-react'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { ShortTextQuestionType } from '../../../types/schema'

interface ShortTextCreatorProps {
  itemPath: string
  questionData: ShortTextQuestionType
  showValidation: boolean
  onCloseValidation: () => void
}

const ShortTextValidationBuilder: React.FC<{
  itemPath: string
  onClose: () => void
}> = ({ itemPath, onClose }) => {
  const { control, watch, setValue, register } = useFormContext()
  const validationPath = `${itemPath}.validation.custom`
  const validationRule = watch(validationPath)

  const handleTypeChange = (newType: string) => {
    let defaultRule: string
    switch (newType) {
      case 'text':
        defaultRule = 'contains'
        break
      case 'length':
        defaultRule = 'min'
        break
      case 'regex':
        defaultRule = 'matches'
        break
      default:
        defaultRule = 'eq'
        break
    }
    // Update the rule and clear other values that depend on it
    setValue(`${validationPath}.rule`, defaultRule)
    setValue(`${validationPath}.value`, undefined)
    setValue(`${validationPath}.value2`, undefined)
  }

  const needsValue =
    !['is_number', 'is_whole', 'is_email', 'is_url'].includes(
      validationRule?.rule
    ) && !!validationRule?.rule
  const needsTwoValues = ['between', 'not_between'].includes(
    validationRule?.rule
  )

  return (
    <div className="mt-4 p-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* --- Group 1: Type and Rule Selects --- */}
        <div className="flex w-full flex-grow gap-2 sm:w-auto sm:flex-grow-0">
          <Controller
            control={control}
            name={`${validationPath}.type`}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v)
                  handleTypeChange(v)
                }}
              >
                <SelectTrigger className="w-[120px] border-0" size="xs">
                  <SelectValue
                    className="text-xs placeholder:text-xs"
                    placeholder="タイプ..." // "Type..."
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="text-xs" value="number">
                    {/* Number */}
                    数値
                  </SelectItem>
                  <SelectItem className="text-xs" value="text">
                    {/* Text */}
                    テキスト
                  </SelectItem>
                  <SelectItem className="text-xs" value="length">
                    {/* Length */}
                    文字数
                  </SelectItem>
                  <SelectItem className="text-xs" value="regex">
                    {/* Regex */}
                    正規表現
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            control={control}
            name={`${validationPath}.rule`}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!validationRule?.type}
              >
                <SelectTrigger className="w-[180px] border-0" size="xs">
                  <SelectValue
                    className="text-xs placeholder:text-xs"
                    placeholder="ルール..." // "Rule..."
                  />
                </SelectTrigger>
                <SelectContent>
                  {validationRule?.type === 'number' && (
                    <>
                      <SelectItem className="text-xs" value="gt">
                        {/* Greater than */}
                        より大きい
                      </SelectItem>
                      <SelectItem className="text-xs" value="gte">
                        {/* Greater than or equal to */}
                        以上
                      </SelectItem>
                      <SelectItem className="text-xs" value="lt">
                        {/* Less than */}
                        より小さい
                      </SelectItem>
                      <SelectItem className="text-xs" value="lte">
                        {/* Less than or equal to */}
                        以下
                      </SelectItem>
                      <SelectItem className="text-xs" value="eq">
                        {/* Equal to */}
                        等しい
                      </SelectItem>
                      <SelectItem className="text-xs" value="neq">
                        {/* Not equal to */}
                        等しくない
                      </SelectItem>
                      <SelectItem className="text-xs" value="between">
                        {/* Between */}
                        範囲内
                      </SelectItem>
                      <SelectItem className="text-xs" value="not_between">
                        {/* Not between */}
                        範囲外
                      </SelectItem>
                      <SelectItem className="text-xs" value="is_number">
                        {/* Is number */}
                        数値
                      </SelectItem>
                      <SelectItem className="text-xs" value="is_whole">
                        {/* Whole number */}
                        整数
                      </SelectItem>
                    </>
                  )}
                  {validationRule?.type === 'text' && (
                    <>
                      <SelectItem className="text-xs" value="contains">
                        {/* Contains */}
                        含む
                      </SelectItem>
                      <SelectItem className="text-xs" value="not_contains">
                        {/* Doesn't contain */}
                        含まない
                      </SelectItem>
                      <SelectItem className="text-xs" value="is_email">
                        {/* Email address */}
                        メールアドレス
                      </SelectItem>
                      <SelectItem className="text-xs" value="is_url">
                        {/* URL */}
                        URL
                      </SelectItem>
                    </>
                  )}
                  {validationRule?.type === 'length' && (
                    <>
                      <SelectItem className="text-xs" value="max">
                        {/* Max character count */}
                        最大文字数
                      </SelectItem>
                      <SelectItem className="text-xs" value="min">
                        {/* Min character count */}
                        最小文字数
                      </SelectItem>
                    </>
                  )}
                  {validationRule?.type === 'regex' && (
                    <>
                      <SelectItem className="text-xs" value="contains">
                        {/* Contains */}
                        含む
                      </SelectItem>
                      <SelectItem className="text-xs" value="not_contains">
                        {/* Doesn't contain */}
                        含まない
                      </SelectItem>
                      <SelectItem value="matches">
                        {/* Matches */}
                        一致する
                      </SelectItem>
                      <SelectItem value="not_matches">
                        {/* Doesn't match */}
                        一致しない
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* --- Group 2: Value Inputs --- */}
        {needsValue && (
          <div className="flex flex-grow gap-2">
            <Input
              type={
                validationRule?.type === 'number' ||
                validationRule?.type === 'length'
                  ? 'number'
                  : 'text'
              }
              placeholder="値" // "Value"
              className="min-w-[80px] flex-grow rounded-none border-0 border-b px-1 text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
              {...register(`${validationPath}.value`, {
                setValueAs: (value) => {
                  if (
                    validationRule?.type === 'number' ||
                    validationRule?.type === 'length'
                  ) {
                    if (value === '' || value === null) return undefined
                    const num = Number(value)
                    return Number.isNaN(num) ? undefined : num
                  }
                  return value
                },
              })}
            />
            {needsTwoValues && (
              <>
                ~
                <Input
                  type="number"
                  placeholder="かつ" // "and"
                  className="min-w-[80px] flex-grow rounded-none border-0 border-b px-1 text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
                  {...register(`${validationPath}.value2`, {
                    setValueAs: (value) => {
                      if (value === '' || value === null) return undefined
                      const num = Number(value)
                      return Number.isNaN(num) ? undefined : num
                    },
                  })}
                />
              </>
            )}
          </div>
        )}

        {/* --- Group 3: Custom Error and Close Button --- */}
        <div className="flex w-full flex-grow gap-2 sm:w-auto">
          <Input
            placeholder="カスタムエラーテキスト" // "Custom error text"
            className="flex-grow rounded-none border-0 border-b px-1 text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
            {...register(`${validationPath}.customError`)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const ShortTextCreator: React.FC<ShortTextCreatorProps> = ({
  itemPath,
  showValidation,
  onCloseValidation,
}) => {
  return (
    <>
      <div className="px-1 pt-4">
        <p className="text-muted-foreground pointer-events-none w-1/2 border-b border-dashed text-sm">
          {/* Short answer text */}
          短文回答
        </p>
      </div>

      {showValidation && (
        <ShortTextValidationBuilder
          itemPath={itemPath}
          onClose={onCloseValidation}
        />
      )}
    </>
  )
}

export const ShortTextPreview: React.FC = () => {
  return (
    <p className="text-muted-foreground pointer-events-none w-1/2 border-b border-dashed text-sm">
      {/* Short answer text */}
      短文回答
    </p>
  )
}
