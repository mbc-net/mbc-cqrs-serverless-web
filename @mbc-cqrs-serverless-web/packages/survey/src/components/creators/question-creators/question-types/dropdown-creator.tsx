'use client'
import type * as React from 'react'
import type { DropdownQuestionType } from '../../../../types/schema'
import { OptionsCreator } from '../options-creator'

interface DropdownCreatorProps {
	itemIndex: number
	itemPath: string
	questionData: DropdownQuestionType
	showOptions: boolean
	showShuffleOptions: boolean
	showBranching: boolean
}

export const DropdownCreator: React.FC<DropdownCreatorProps> = ({
	itemIndex,
	showOptions,
	showBranching,
}) => {
	return (
		<>
			{showOptions && (
				<OptionsCreator
					itemIndex={itemIndex}
					questionType="dropdown"
					showBranching={showBranching}
				/>
			)}
		</>
	)
}

interface DropdownPreviewProps {
	questionData: DropdownQuestionType
}

// A custom preview for the Dropdown to show a numbered list of options.
export const DropdownPreview: React.FC<DropdownPreviewProps> = ({
	questionData,
}) => {
	const optionsToShow = questionData.options || []

	return (
		<div className="pointer-events-none space-y-2">
			{optionsToShow.slice(0, 3).map((option, index) => (
				<div
					key={option.value}
					className="flex items-center space-x-2 text-muted-foreground"
				>
					<span>{index + 1}.</span>
					<p>{option.label}</p>
				</div>
			))}
			{questionData.options && questionData.options.length > 3 && (
				<p className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
					+{questionData.options.length - 3} more options
				</p>
			)}
		</div>
	)
}
