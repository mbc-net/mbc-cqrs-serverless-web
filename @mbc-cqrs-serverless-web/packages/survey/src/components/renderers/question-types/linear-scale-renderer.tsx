'use client'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'
import { RadioGroup, RadioGroupItem } from '@mbc-cqrs-serverless-web/shared-ui'
import type * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { LinearScaleQuestionType } from '../../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a linear scale component as a radio group.
 * --- UPDATED: Replaced Slider with a horizontal RadioGroup ---
 */
export const LinearScaleQuestionComponent: React.FC<{
	question: LinearScaleQuestionType
}> = ({ question }) => {
	const { control } = useFormContext()

	// Generate the array of numbers for the scale
	const scaleOptions = Array.from(
		{ length: (question.max || 5) - (question.min || 1) + 1 },
		(_, i) => (question.min || 1) + i,
	)

	return (
		<Controller
			name={question.id}
			control={control}
			rules={{
				required: question.validation?.required
					? 'This field is required'
					: false,
			}}
			render={({ field }) => (
				<QuestionWrapper
					questionId={question.id}
					label={question.label}
					description={question.description}
					isRequired={question.validation?.required}
				>
					<RadioGroup
						onValueChange={(value) => field.onChange(Number.parseInt(value))}
						value={field.value?.toString()}
						className="w-full"
					>
						<div className="flex items-center justify-between gap-[var(--mbc-spacing-4)]">
							{/* Min Label */}
							<Label className="w-1/12 flex-shrink-0 text-center text-[length:var(--mbc-text-body)]">
								{question.minLabel}
							</Label>

							{/* Radio Options */}
							<div className="flex flex-grow justify-around">
								{scaleOptions.map((num) => (
									<div
										key={num}
										className="flex flex-col items-center space-y-[var(--mbc-spacing-2)]"
									>
										<Label
											htmlFor={`${question.id}-${num}`}
											className="text-[length:var(--mbc-text-body)] text-[var(--mbc-color-muted-foreground)]"
										>
											{num}
										</Label>
										<RadioGroupItem
											value={num.toString()}
											id={`${question.id}-${num}`}
										/>
									</div>
								))}
							</div>

							{/* Max Label */}
							<Label className="w-1/12 flex-shrink-0 text-center text-[length:var(--mbc-text-body)]">
								{question.maxLabel}
							</Label>
						</div>
					</RadioGroup>
				</QuestionWrapper>
			)}
		/>
	)
}
