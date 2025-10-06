'use client'
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@mbc-cqrs-serverless-web/shared-ui'
import type * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { LinearScaleQuestionType } from '../../../../types/schema'

interface LinearScaleCreatorProps {
	itemPath: string
	questionData: LinearScaleQuestionType
}

export const LinearScaleCreator: React.FC<LinearScaleCreatorProps> = ({
	itemPath,
}) => {
	const { control, watch } = useFormContext()

	const minValue = watch(`${itemPath}.min`, 1)
	const maxValue = watch(`${itemPath}.max`, 5)

	return (
		<div className="space-y-4 px-1 pt-4">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<Controller
						control={control}
						name={`${itemPath}.min`}
						defaultValue={1}
						render={({ field }) => (
							<Select
								onValueChange={(val) => field.onChange(Number(val))}
								value={field.value?.toString()}
							>
								<SelectTrigger
									size="xs"
									className="w-[80px] border-0 leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]"
								>
									<SelectValue className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
										value="0"
									>
										0
									</SelectItem>
									<SelectItem
										className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
										value="1"
									>
										1
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					<span className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
						to
					</span>
					<Controller
						control={control}
						name={`${itemPath}.max`}
						defaultValue={5}
						render={({ field }) => (
							<Select
								onValueChange={(val) => field.onChange(Number(val))}
								value={field.value?.toString()}
							>
								<SelectTrigger
									size="xs"
									className="w-[80px] border-0 leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]"
								>
									<SelectValue className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]" />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
										<SelectItem
											className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
											key={num}
											value={num.toString()}
										>
											{num}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>
			</div>
			<div className="space-y-2">
				<div className="flex items-center gap-4">
					<span className="w-8 flex-shrink-0 text-center text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
						{minValue}
					</span>
					<Input
						placeholder="Label (optional)"
						className="max-w-[200px] rounded-none border-0 border-b text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] shadow-none placeholder:text-[length:var(--mbc-text-xs)] focus-visible:ring-0"
						{...control.register(`${itemPath}.minLabel`)}
					/>
				</div>
				<div className="flex items-center gap-4">
					<span className="w-8 flex-shrink-0 text-center text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
						{maxValue}
					</span>
					<Input
						placeholder="Label (optional)"
						className="max-w-[200px] rounded-none border-0 border-b text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] shadow-none placeholder:text-[length:var(--mbc-text-xs)] focus-visible:ring-0"
						{...control.register(`${itemPath}.maxLabel`)}
					/>
				</div>
			</div>
		</div>
	)
}

interface LinearScalePreviewProps {
	questionData: LinearScaleQuestionType
}

export const LinearScalePreview: React.FC<LinearScalePreviewProps> = ({
	questionData,
}) => {
	const min = questionData.min ?? 1
	const max = questionData.max ?? 5
	const scaleOptions = Array.from({ length: max - min + 1 }, (_, i) => min + i)

	return (
		<div className="pointer-events-none flex w-full items-center justify-between gap-4">
			<span className="w-1/12 flex-shrink-0 text-center text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
				{questionData.minLabel}
			</span>
			<div className="flex flex-grow justify-around">
				{scaleOptions.map((num) => (
					<div key={num} className="flex flex-col items-center space-y-2">
						<span className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
							{num}
						</span>
						<div className="h-4 w-4 rounded-full border border-muted-foreground" />
					</div>
				))}
			</div>
			<span className="w-1/12 flex-shrink-0 text-center text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
				{questionData.maxLabel}
			</span>
		</div>
	)
}
