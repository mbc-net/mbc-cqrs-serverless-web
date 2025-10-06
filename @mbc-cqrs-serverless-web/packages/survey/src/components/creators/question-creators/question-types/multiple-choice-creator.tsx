'use client'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import {
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@mbc-cqrs-serverless-web/shared-ui'
import { X } from 'lucide-react'
import type * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { MultipleChoiceQuestionType } from '../../../../types/schema'
import { OptionsCreator } from '../options-creator'

interface MultipleChoiceCreatorProps {
	itemIndex: number
	itemPath: string
	showOptions: boolean
	showValidation: boolean
	onCloseValidation: () => void
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleArray = <T,>(array: T[]): T[] => {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

const MultipleChoiceValidationBuilder: React.FC<{
	itemPath: string
	onClose: () => void
}> = ({ itemPath, onClose }) => {
	const { control, register } = useFormContext()
	const validationPath = `${itemPath}.validation.custom`

	return (
		<div className="mt-4 p-3">
			<div className="flex w-full flex-grow gap-2 sm:w-auto sm:flex-grow-0">
				<Controller
					control={control}
					name={`${validationPath}.rule`}
					render={({ field }) => (
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger className="w-[180px] border-0" size="xs">
								<SelectValue
									className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]"
									placeholder="Select a rule..."
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
									value="min"
								>
									Select at least
								</SelectItem>
								<SelectItem
									className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
									value="max"
								>
									Select at most
								</SelectItem>
								<SelectItem
									className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
									value="exact"
								>
									Select exactly
								</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
				<Input
					type="number"
					placeholder="Number"
					className="flex-grow rounded-none border-0 border-b px-1 text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] shadow-none placeholder:text-[length:var(--mbc-text-xs)] focus-visible:ring-0"
					{...register(`${validationPath}.value`, { valueAsNumber: true })}
				/>
				<Input
					placeholder="Custom error text"
					className="flex-grow rounded-none border-0 border-b px-1 text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] shadow-none placeholder:text-[length:var(--mbc-text-xs)] focus-visible:ring-0"
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
	)
}

export const MultipleChoiceCreator: React.FC<MultipleChoiceCreatorProps> = ({
	itemIndex,
	itemPath,
	showOptions,
	showValidation,
	onCloseValidation,
}) => {
	return (
		<>
			{showOptions && (
				<OptionsCreator
					itemIndex={itemIndex}
					questionType="multiple-choice"
					showBranching={false}
				/>
			)}

			{showValidation && (
				<MultipleChoiceValidationBuilder
					itemPath={itemPath}
					onClose={onCloseValidation}
				/>
			)}
		</>
	)
}

interface MultipleChoicePreviewProps {
	questionData: MultipleChoiceQuestionType
}

export const MultipleChoicePreview: React.FC<MultipleChoicePreviewProps> = ({
	questionData,
}) => {
	// Show shuffled options in preview if shuffle is enabled
	const optionsToShow = (questionData as any).validation?.shuffleOptions
		? shuffleArray(questionData.options || [])
		: questionData.options || []

	return (
		<div className="space-y-2">
			{optionsToShow.slice(0, 3).map((option) => (
				<div key={option.value} className="flex items-center space-x-3">
					<div className="h-4 w-4 rounded-sm border border-muted-foreground" />
					<p className="text-muted-foreground">{option.label}</p>
				</div>
			))}
			{questionData.options && questionData.options.length > 3 && (
				<p className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
					+{questionData.options.length - 3} more options
					{(questionData as any).validation?.shuffleOptions && ' (shuffled)'}
				</p>
			)}
		</div>
	)
}
