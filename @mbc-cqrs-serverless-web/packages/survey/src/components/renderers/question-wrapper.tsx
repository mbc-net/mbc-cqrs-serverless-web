'use client'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'
import type * as React from 'react'
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
		<div className="mb-[var(--mbc-spacing-8)] rounded-[var(--mbc-radius-lg)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-card)] p-[var(--mbc-spacing-6)] text-[var(--mbc-color-card-foreground)] shadow-[var(--mbc-shadow-sm)] transition-all duration-[var(--mbc-transition-duration)] ease-[var(--mbc-transition-easing)] focus-within:ring-2 focus-within:ring-[var(--mbc-color-ring)]">
			<Label
				htmlFor={questionId}
				className="font-[var(--mbc-text-heading-3--font-weight)] text-[length:var(--mbc-text-base)] leading-[var(--mbc-text-base--line-height)] tracking-[var(--mbc-text-heading-3--letter-spacing)]"
			>
				{label}
				{isRequired && (
					<span className="ml-[var(--mbc-spacing-1)] text-[var(--mbc-color-destructive)]">
						*
					</span>
				)}
			</Label>
			{description && (
				<p className="mt-[var(--mbc-spacing-1)] mb-[var(--mbc-spacing-4)] text-[length:var(--mbc-text-body)] text-[var(--mbc-color-muted-foreground)] leading-[var(--mbc-text-body--line-height)]">
					{description}
				</p>
			)}
			<div className="mt-[var(--mbc-spacing-4)]">{children}</div>
			{error && (
				<p
					role="alert"
					className="mt-[var(--mbc-spacing-2)] font-[var(--mbc-text-body-bold--font-weight)] text-[length:var(--mbc-text-body)] text-[var(--mbc-color-destructive)] leading-[var(--mbc-text-body--line-height)]"
				>
					{error.message?.toString()}
				</p>
			)}
		</div>
	)
}
