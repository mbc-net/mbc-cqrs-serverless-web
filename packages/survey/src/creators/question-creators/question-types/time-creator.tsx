'use client'
import { Input } from '../../../ui/input'
import { Clock } from 'lucide-react'
import type React from 'react'
import { useFormContext } from 'react-hook-form'
import type { TimeQuestionType } from '../../../types/schema'

interface TimeCreatorProps {
  itemPath: string
}

export const TimeCreator: React.FC<TimeCreatorProps> = ({ itemPath }) => {
  const { watch } = useFormContext()
  const answerType: 'time' | 'duration' = watch(`${itemPath}.answerType`)

  return (
    <div className="pointer-events-none max-w-[250px] space-y-2 px-1 pt-4">
      <div className="flex items-center gap-2">
        <Input
          disabled
          placeholder={answerType === 'time' ? '時刻' : '期間'}
          className="border-0 border-b shadow-none"
        />
        <Clock className="text-muted-foreground h-5 w-5 bg-transparent" />
      </div>
    </div>
  )
}

interface TimePreviewProps {
  questionData: TimeQuestionType
}

export const TimePreview: React.FC<TimePreviewProps> = () => {
  return (
    <div className="pointer-events-none flex w-1/2 items-center gap-2">
      <Input disabled placeholder="時刻" /> {/* Time */}
      <Clock className="text-muted-foreground h-5 w-5" /> {/* Clock */}
    </div>
  )
}
