'use client'

import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import 'react-quill-new/dist/quill.snow.css'

const getDisabledState = (
  disabled: boolean | (() => boolean) | undefined
): boolean => {
  if (typeof disabled === 'function') {
    return disabled()
  }
  return !!disabled
}

const ReactQuill = dynamic(
  async () => {
    const RQ = await import('react-quill-new')
    const { Quill } = RQ
    const Block = Quill.import('blots/block') as any
    Block.tagName = 'DIV'
    Quill.register(Block, true)
    return RQ
  },
  { ssr: false }
)

const QUILL_COLORS = [
  '#000000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#9933ff',
  '#ffffff',
  '#facccc',
  '#ffebcc',
  '#ffffcc',
  '#cce8cc',
  '#cce0f5',
  '#ebd6ff',
  '#bbbbbb',
  '#f06666',
  '#ffc266',
  '#ffff66',
  '#66b966',
  '#66a3e0',
  '#c285ff',
  '#888888',
  '#a10000',
  '#b26b00',
  '#b2b200',
  '#006100',
  '#0047b2',
  '#6b24b2',
  '#444444',
  '#5c0000',
  '#663d00',
  '#666600',
  '#003700',
  '#002966',
  '#3d1466',
]

const QUILL_MODULES = {
	toolbar: [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ font: [] }],
		[{ size: ['small', false, 'large', 'huge'] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ color: QUILL_COLORS }],
		[{ background: QUILL_COLORS }],
		[{ script: 'sub' }, { script: 'super' }],
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ indent: '-1' }, { indent: '+1' }],
		[{ align: [] }],
		['blockquote', 'code-block'],
		['link', 'image', 'video'],
		['clean'],
	],
}

interface EditorProps {
  value: string
  onChangeController: (value: string) => void
  placeholder?: string
  maxLength?: number
  textAreaRows?: number
  disabled?: boolean | (() => boolean)
  fieldClassName?: string
  fieldAfterLabel?: React.ReactNode
  transformOnChange?: (value: string) => string
}

export const Editor = ({
  value,
  placeholder,
  fieldClassName,
  textAreaRows = 5,
  maxLength,
  fieldAfterLabel,
  disabled,
  transformOnChange,
  onChangeController,
}: EditorProps) => {
  const handleQuillChange = useCallback(
    (content: string) => {
      let finalValue = content

      if (maxLength && finalValue.length > maxLength) {
        finalValue = finalValue.substring(0, maxLength)
      }

      if (transformOnChange) {
        finalValue = transformOnChange(finalValue)
      }

      onChangeController(finalValue)
    },
    [maxLength, transformOnChange, onChangeController]
  )

  return (
    <>
      <div className={`${fieldClassName} editor editor${textAreaRows}`}>
        <ReactQuill
          theme="snow"
          value={value}
          modules={QUILL_MODULES}
          className="bg-white"
          placeholder={placeholder}
          onChange={handleQuillChange}
          readOnly={getDisabledState(disabled)}
        />
      </div>
      {fieldAfterLabel && <span className="ml-2">{fieldAfterLabel}</span>}
    </>
  )
}
