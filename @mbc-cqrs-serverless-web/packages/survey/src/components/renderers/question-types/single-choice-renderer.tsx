'use client'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'
import { RadioGroup, RadioGroupItem } from '@mbc-cqrs-serverless-web/shared-ui'
import type * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { SingleChoiceQuestionType } from '../../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a single-choice question as a radio group.
 */
export const SingleChoiceQuestionComponent: React.FC<{
	question: SingleChoiceQuestionType
}> = ({ question }) => {
	const { control } = useFormContext()

	return (
		<Controller
			name={question.id}
			control={control}
			rules={{
				required: question.validation?.required
					? 'Please select an option'
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
						onValueChange={field.onChange}
						value={field.value}
						className="flex flex-col space-y-[var(--mbc-spacing-1)]"
					>
						{question.options.map((option) => (
							<div
								key={option.value}
								className="flex items-center space-x-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-md)] p-[var(--mbc-spacing-2)] transition-colors hover:bg-[var(--mbc-color-muted)]"
							>
								<RadioGroupItem
									value={option.value}
									id={`${question.id}-${option.value}`}
								/>
								<Label
									className="w-full cursor-pointer font-[var(--mbc-text-body--font-weight)] text-[length:var(--mbc-text-body)]"
									htmlFor={`${question.id}-${option.value}`}
								>
									{option.label}
								</Label>
							</div>
						))}
					</RadioGroup>
				</QuestionWrapper>
			)}
		/>
	)
}
