// components/ui/survey/survey-form.tsx
'use client'
import { Button } from '../ui/button'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { DateQuestionComponent } from '../renderers/question-types/date-renderer'
import { DropdownQuestionComponent } from '../renderers/question-types/dropdown-renderer'
import { LinearScaleQuestionComponent } from '../renderers/question-types/linear-scale-renderer'
import { LongTextQuestionComponent } from '../renderers/question-types/long-text-renderer'
import { MultipleChoiceQuestionComponent } from '../renderers/question-types/multiple-choice-renderer'
import { RatingQuestionComponent } from '../renderers/question-types/rating-renderer'
import { ShortTextQuestionComponent } from '../renderers/question-types/short-text-renderer'
import { SingleChoiceQuestionComponent } from '../renderers/question-types/single-choice-renderer'
import { TimeQuestionComponent } from '../renderers/question-types/time-renderer'
import type {
  SectionHeaderType,
  SurveyQuestionItemType,
  SurveySchemaType,
} from '../types/schema' // Corrected import path
import { cn } from '@/utils'

type SurveyAnswers = Record<string, string | string[] | undefined>

/**
 * Answers carry question ids as keys, so a consumer would otherwise need the
 * schema on hand to know what was asked. `meta` travels alongside them.
 */
export interface SurveyAnswerMeta {
  id: string
  label: string
  type: SurveyQuestionItemType['type']
  value: string | string[] | undefined
}

interface SurveyFormProps {
  schema: SurveySchemaType
  onSubmit: (answers: SurveyAnswers, meta: SurveyAnswerMeta[]) => void
  children?: React.ReactNode
  disabled?: boolean
}

interface SurveyPage {
  id: string
  title: string
  description?: string
  questions: SurveyQuestionItemType[]
  action?: SectionHeaderType['action']
}

// --- Main Component ---
export const SurveyForm: React.FC<SurveyFormProps> = ({
  schema,
  onSubmit,
  children,
  disabled = false,
}) => {
  const methods = useForm<SurveyAnswers>()
  const { handleSubmit, trigger, getValues, watch } = methods

  const surveyPages = useMemo((): SurveyPage[] => {
    const pages: SurveyPage[] = []
    let currentPage: SurveyPage | null = null
    if (!schema.items || schema.items.length === 0) return []

    // If the survey doesn't start with a section header, create a default first page.
    if (schema.items[0].type !== 'section-header') {
      currentPage = {
        id: `default-start-section-${schema.title}`, // A stable, unique ID
        title: schema.title,
        description: schema.description,
        questions: [],
        action: undefined,
      }
      pages.push(currentPage)
    }

    for (const item of schema.items) {
      if (item.type === 'section-header') {
        currentPage = {
          id: item.id,
          title: item.title,
          description: item.description,
          action: item.action,
          questions: [],
        }
        pages.push(currentPage)
      } else if (currentPage) {
        currentPage.questions.push(item as SurveyQuestionItemType)
      }
    }
    return pages
  }, [schema])

  const [sectionHistory, setSectionHistory] = useState<string[]>(
    [surveyPages[0]?.id].filter(Boolean)
  )
  const currentSectionId = sectionHistory[sectionHistory.length - 1]
  const currentSection = useMemo(
    () => surveyPages.find((p) => p.id === currentSectionId),
    [surveyPages, currentSectionId]
  )

  const watchedAnswers = watch()

  const determineNextStep = (currentAnswers: SurveyAnswers) => {
    if (!currentSection) {
      return { nextSectionId: null, isFinalStep: true }
    }

    if (currentSection.action) {
      if (currentSection.action.type === 'submit') {
        return { nextSectionId: null, isFinalStep: true }
      }
      if (currentSection.action.type === 'jump') {
        return {
          nextSectionId: currentSection.action.targetSectionId,
          isFinalStep: false,
        }
      }
    }

    for (const question of currentSection.questions) {
      if (question.type === 'single-choice' || question.type === 'dropdown') {
        const answer = currentAnswers[question.id] as string
        if (answer) {
          const chosenOption = question.options.find(
            (opt) => opt.value === answer
          )
          if (chosenOption?.nextSectionId) {
            return {
              nextSectionId: chosenOption.nextSectionId,
              isFinalStep: false,
            }
          }
        }
      }
    }

    const currentPageIndex = surveyPages.findIndex(
      (p) => p.id === currentSection.id
    )
    const nextSection = surveyPages[currentPageIndex + 1]

    if (nextSection) {
      return { nextSectionId: nextSection.id, isFinalStep: false }
    }

    return { nextSectionId: null, isFinalStep: true }
  }

  const { isFinalStep } = useMemo(
    () => determineNextStep(watchedAnswers),
    [currentSection, surveyPages, watchedAnswers]
  )

  const handleNextSection = async () => {
    if (!currentSection) return

    let isValid = true
    if (currentSection.questions.length > 0) {
      const fieldIds = currentSection.questions.map((q) => q.id)
      isValid = await trigger(fieldIds)
    }

    if (isValid) {
      const { nextSectionId: finalNextId } = determineNextStep(getValues())
      if (finalNextId) {
        setSectionHistory((prev) => [...prev, finalNextId])
      }
    }
  }

  const handleBack = () => {
    if (sectionHistory.length > 1) {
      setSectionHistory((prev) => prev.slice(0, -1))
    }
  }
  const onFormSubmit = (data: SurveyAnswers) => {
    const meta: SurveyAnswerMeta[] = surveyPages.flatMap((page) =>
      page.questions.map((question) => ({
        id: question.id,
        // `SurveyQuestionItemType` excludes section headers at runtime, but
        // the discriminated union doesn't narrow cleanly here, so guard the
        // read the same way question-creator.tsx does elsewhere.
        label: 'label' in question ? question.label : '',
        type: question.type,
        value: data[question.id],
      }))
    )
    onSubmit(data, meta)
  }

  if (!currentSection) {
    return (
      <div className="p-8 text-center">
        このアンケートにはコンテンツがありません。
      </div>
    ) // This survey has no content.
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={cn(
          'mx-auto my-12 max-w-3xl space-y-8',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{schema.title}</h1>
          {schema.description && (
            <p className="text-muted-foreground mt-2 text-lg">
              {schema.description}
            </p>
          )}
        </div>

        <div key={currentSection.id}>
          <h2 className="mb-6 border-b pb-2 text-2xl font-semibold">
            {currentSection.title}
          </h2>
          {currentSection.description && (
            <p className="text-muted-foreground mb-6">
              {currentSection.description}
            </p>
          )}

          {children}

          {currentSection.questions.map((question) => {
            switch (question.type) {
              case 'short-text':
                return (
                  <ShortTextQuestionComponent
                    key={question.id}
                    question={question}
                  />
                )
              case 'long-text':
                return (
                  <LongTextQuestionComponent
                    key={question.id}
                    question={question}
                  />
                )
              case 'linear-scale':
                return (
                  <LinearScaleQuestionComponent
                    key={question.id}
                    question={question}
                  />
                )
              case 'single-choice':
                return (
                  <SingleChoiceQuestionComponent
                    key={question.id}
                    question={question}
                  />
                )
              case 'multiple-choice':
                return (
                  <MultipleChoiceQuestionComponent
                    key={question.id}
                    question={question}
                  />
                )
              case 'dropdown':
                return (
                  <DropdownQuestionComponent
                    key={question.id}
                    question={question as any}
                  />
                )
              case 'rating':
                return (
                  <RatingQuestionComponent
                    key={question.id}
                    question={question as any}
                  />
                )
              case 'date':
                return (
                  <DateQuestionComponent
                    key={question.id}
                    question={question as any}
                  />
                )
              case 'time':
                return (
                  <TimeQuestionComponent
                    key={question.id}
                    question={question as any}
                  />
                )
            }
          })}
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {sectionHistory.length > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                {/* Back */}
                前へ
              </Button>
            )}
          </div>
          <div>
            {isFinalStep ? (
              <Button
                type="button"
                key="submit-btn"
                disabled={disabled}
                onClick={handleSubmit(onFormSubmit)}
              >
                {/* Submit Survey */}
                アンケートを送信
              </Button>
            ) : (
              <Button
                type="button"
                key={`next-btn-${currentSection.id}`}
                onClick={handleNextSection}
              >
                {/* Next */}
                次へ
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
