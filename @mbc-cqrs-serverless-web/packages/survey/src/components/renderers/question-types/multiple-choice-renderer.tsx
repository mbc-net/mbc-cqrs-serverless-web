'use client'
import { Checkbox } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'
import type * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { MultipleChoiceQuestionType } from '../../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a multiple-choice question as checkboxes.
 */
export const MultipleChoiceQuestionComponent: React.FC<{
	question: MultipleChoiceQuestionType
}> = ({ question }) => {
	const { control } = useFormContext()

	return (
		<Controller
			name={question.id}
			control={control}
			defaultValue={[]}
			rules={{
				required: question.validation?.required
					? 'Please select at least one option'
					: false,
			}}
			render={({ field }) => (
				<QuestionWrapper
					questionId={question.id}
					label={question.label}
					description={question.description}
					isRequired={question.validation?.required}
				>
					<div className="flex flex-col space-y-[var(--mbc-spacing-1)]">
						{question.options.map((option) => (
							<div
								key={option.value}
								className="flex items-center space-x-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-md)] p-[var(--mbc-spacing-2)] transition-colors hover:bg-[var(--mbc-color-muted)]"
							>
								<Checkbox
									id={`${question.id}-${option.value}`}
									checked={field.value?.includes(option.value)}
									onCheckedChange={(checked) => {
										const currentValues = field.value || []
										if (checked) {
											field.onChange([...currentValues, option.value])
										} else {
											field.onChange(
												currentValues.filter(
													(value: string) => value !== option.value,
												),
											)
										}
									}}
								/>
								<Label
									className="w-full cursor-pointer font-[var(--mbc-text-body--font-weight)] text-[length:var(--mbc-text-body)]"
									htmlFor={`${question.id}-${option.value}`}
								>
									{option.label}
								</Label>
							</div>
						))}
					</div>
				</QuestionWrapper>
			)}
		/>
	)
}
