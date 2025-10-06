'use client'
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Calendar, Clock } from 'lucide-react'
import type * as React from 'react'
import { useFormContext } from 'react-hook-form'
import type { DateQuestionType } from '../../../../types/schema'

interface DateCreatorProps {
	itemPath: string
}

export const DateCreator: React.FC<DateCreatorProps> = ({ itemPath }) => {
	const { watch } = useFormContext()

	const includeTime: boolean = watch(`${itemPath}.includeTime`)
	const includeYear: boolean = watch(`${itemPath}.includeYear`)

	const datePlaceholder = ['Month, day', includeYear !== false && ', year']
		.filter(Boolean)
		.join('')

	return (
		<div className="pointer-events-none max-w-[250px] space-y-2 px-1 pt-4">
			<div className="flex items-center gap-2">
				<Input
					disabled
					placeholder={datePlaceholder}
					className="border-0 border-b shadow-none"
				/>
				<Calendar className="h-5 w-5 bg-transparent text-muted-foreground" />
			</div>
			{includeTime && (
				<div className="flex items-center gap-2">
					<Input
						disabled
						placeholder="Time"
						className="border-0 border-b shadow-none"
					/>
					<Clock className="h-5 w-5 bg-transparent text-muted-foreground" />
				</div>
			)}
		</div>
	)
}

interface DatePreviewProps {
	questionData: DateQuestionType
}

export const DatePreview: React.FC<DatePreviewProps> = ({ questionData }) => {
	const placeholder = [
		'Month, day',
		questionData.includeYear !== false && ', year',
	]
		.filter(Boolean)
		.join('')

	return (
		<div className="pointer-events-none max-w-[250px] space-y-2 px-1 pt-4">
			<div className="flex items-center gap-2">
				<Input
					disabled
					placeholder={placeholder}
					className="border-0 border-b shadow-none"
				/>
				<Calendar className="h-5 w-5 bg-transparent text-muted-foreground" />
			</div>
			{questionData.includeTime && (
				<div className="flex items-center gap-2">
					<Input
						disabled
						placeholder="Time"
						className="border-0 border-b shadow-none"
					/>
					<Clock className="h-5 w-5 bg-transparent text-muted-foreground" />
				</div>
			)}
		</div>
	)
}
