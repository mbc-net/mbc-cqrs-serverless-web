// components/ui/survey/survey-form.tsx
'use client'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type {
	SectionHeaderType,
	SurveyQuestionItemType,
	SurveySchemaType,
} from '../../types/schema'
import { DateQuestionComponent } from '../renderers/question-types/date-renderer'
import { DropdownQuestionComponent } from '../renderers/question-types/dropdown-renderer'
import { LinearScaleQuestionComponent } from '../renderers/question-types/linear-scale-renderer'
import { LongTextQuestionComponent } from '../renderers/question-types/long-text-renderer'
import { MultipleChoiceQuestionComponent } from '../renderers/question-types/multiple-choice-renderer'
import { RatingQuestionComponent } from '../renderers/question-types/rating-renderer'
import { ShortTextQuestionComponent } from '../renderers/question-types/short-text-renderer'
import { SingleChoiceQuestionComponent } from '../renderers/question-types/single-choice-renderer'
import { TimeQuestionComponent } from '../renderers/question-types/time-renderer'

type SurveyAnswers = Record<string, string | string[] | undefined>
interface SurveyFormProps {
	schema: SurveySchemaType
	onSubmit: (answers: SurveyAnswers) => void
}

interface SurveyPage {
	id: string
	title: string
	description?: string
	questions: SurveyQuestionItemType[]
	action?: SectionHeaderType['action']
}

// --- Main Component ---
export const SurveyForm: React.FC<SurveyFormProps> = ({ schema, onSubmit }) => {
	const methods = useForm<SurveyAnswers>({
		mode: 'onBlur',
	})
	const { handleSubmit, trigger, getValues, watch } = methods

	const surveyPages = useMemo((): SurveyPage[] => {
		const pages: SurveyPage[] = []
		let currentPage: SurveyPage | null = null
		if (!schema.items || schema.items.length === 0) return []

		// If the survey doesn't start with a section header, create a default first page.
		if (schema.items[0].type !== 'section-header') {
			currentPage = {
				id: `default-start-section-${schema.id}`, // A stable, unique ID
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
		[surveyPages[0]?.id].filter(Boolean),
	)
	const currentSectionId = sectionHistory[sectionHistory.length - 1]
	const currentSection = useMemo(
		() => surveyPages.find((p) => p.id === currentSectionId),
		[surveyPages, currentSectionId],
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
						(opt) => opt.value === answer,
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
			(p) => p.id === currentSection.id,
		)
		const nextSection = surveyPages[currentPageIndex + 1]

		if (nextSection) {
			return { nextSectionId: nextSection.id, isFinalStep: false }
		}

		return { nextSectionId: null, isFinalStep: true }
	}

	const { isFinalStep } = useMemo(
		() => determineNextStep(watchedAnswers),
		[currentSection, surveyPages, watchedAnswers],
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
		onSubmit(data)
	}

	if (!currentSection) {
		return (
			<div className="p-[var(--mbc-spacing-8)] text-center">
				This survey has no content.
			</div>
		)
	}

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={handleSubmit(onFormSubmit)}
				className="mx-auto my-[var(--mbc-spacing-12)] max-w-3xl space-y-[var(--mbc-spacing-8)]"
			>
				<div className="mb-[var(--mbc-spacing-10)] text-center">
					<h1 className="font-[var(--mbc-text-heading-1--font-weight)] text-[length:var(--mbc-text-3xl)] leading-[var(--mbc-text-3xl--line-height)] tracking-[var(--mbc-text-heading-1--letter-spacing)]">
						{schema.title}
					</h1>
					{schema.description && (
						<p className="mt-[var(--mbc-spacing-2)] text-[length:var(--mbc-text-xl)] text-[var(--mbc-color-muted-foreground)] leading-[var(--mbc-text-xl--line-height)]">
							{schema.description}
						</p>
					)}
				</div>

				<div key={currentSection.id}>
					<h2 className="mb-[var(--mbc-spacing-6)] border-[var(--mbc-color-border)] border-b pb-[var(--mbc-spacing-2)] font-[var(--mbc-text-heading-2--font-weight)] text-[length:var(--mbc-text-xl)] leading-[var(--mbc-text-xl--line-height)]">
						{currentSection.title}
					</h2>
					{currentSection.description && (
						<p className="mb-[var(--mbc-spacing-6)] text-[var(--mbc-color-muted-foreground)]">
							{currentSection.description}
						</p>
					)}

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

				<div className="flex justify-between pt-[var(--mbc-spacing-4)]">
					<div>
						{sectionHistory.length > 1 && (
							<Button
								type="button"
								variant="outline"
								size="default"
								className=""
								onClick={handleBack}
							>
								Back
							</Button>
						)}
					</div>
					<div>
						{isFinalStep ? (
							<Button
								type="button"
								key="submit-btn"
								variant="default"
								size="default"
								className=""
								onClick={handleSubmit(onFormSubmit)}
							>
								Submit Survey
							</Button>
						) : (
							<Button
								type="button"
								key={`next-btn-${currentSection.id}`}
								variant="default"
								size="default"
								className=""
								onClick={handleNextSection}
							>
								Next
							</Button>
						)}
					</div>
				</div>
			</form>
		</FormProvider>
	)
}
