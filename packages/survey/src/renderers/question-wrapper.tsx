'use client'
import { Label } from '../ui/label'
import type React from 'react'
import { useFormContext } from 'react-hook-form'

interface QuestionWrapperProps {
  questionId: string
  label: string
  description?: string
  isRequired?: boolean
  children: React.ReactNode
}

/**
 * A consistent wrapper for each question that displays the label, description,
 * and any validation errors from react-hook-form.
 */
export const QuestionWrapper: React.FC<QuestionWrapperProps> = ({
  questionId,
  label,
  description,
  isRequired,
  children,
}) => {
  const {
    formState: { errors },
  } = useFormContext()
  const error = errors[questionId]

  return (
    <div className="bg-card text-card-foreground focus-within:ring-ring mb-8 rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out focus-within:ring-2">
      <Label
        htmlFor={questionId}
        className="text-lg font-semibold leading-none tracking-tight"
      >
        {label}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-muted-foreground mb-4 mt-1 text-sm">{description}</p>
      )}
      <div className="mt-4">{children}</div>
      {error && (
        <p role="alert" className="text-destructive mt-2 text-sm font-medium">
          {error.message?.toString()}
        </p>
      )}
    </div>
  )
}
