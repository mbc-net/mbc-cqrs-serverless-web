'use client'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Heart, Star, ThumbsUp } from 'lucide-react'
import type * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { RatingQuestionType } from '../../../../types/schema'

const getSymbol = (symbol?: 'star' | 'heart' | 'thumb') => {
	switch (symbol) {
		case 'heart':
			return Heart
		case 'thumb':
			return ThumbsUp
		default:
			return Star
	}
}

interface RatingCreatorProps {
	itemPath: string
}

export const RatingCreator: React.FC<RatingCreatorProps> = ({ itemPath }) => {
	const { control, watch } = useFormContext()
	const levels = watch(`${itemPath}.levels`, 5)
	const symbol = watch(`${itemPath}.symbol`, 'star')
	const ratingOptions = Array.from({ length: levels }, (_, i) => i + 1)
	const Icon = getSymbol(symbol)

	return (
		<div className="space-y-4 px-1 pt-4">
			<div className="flex items-center gap-4">
				<Controller
					control={control}
					name={`${itemPath}.levels`}
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
				<Controller
					control={control}
					name={`${itemPath}.symbol`}
					defaultValue={'star'}
					render={({ field }) => (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger
								size="xs"
								className="w-[120px] border-0 leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]"
							>
								<SelectValue className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
									value="star"
								>
									<div className="flex items-center gap-2">
										<Star className="h-4 w-4" /> Star
									</div>
								</SelectItem>
								<SelectItem
									className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
									value="heart"
								>
									<div className="flex items-center gap-2">
										<Heart className="h-4 w-4" /> Heart
									</div>
								</SelectItem>
								<SelectItem
									className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
									value="thumb"
								>
									<div className="flex items-center gap-2">
										<ThumbsUp className="h-4 w-4" /> Thumb
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			</div>

			<div className="pointer-events-none flex w-full items-center justify-between gap-4">
				<div className="flex flex-grow justify-around">
					{ratingOptions.map((num) => (
						<div key={num} className="flex flex-col items-center space-y-2">
							<span className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
								{num}
							</span>
							<Icon className="h-6 w-6 text-muted-foreground" />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

interface RatingPreviewProps {
	questionData: RatingQuestionType
}

export const RatingPreview: React.FC<RatingPreviewProps> = ({
	questionData,
}) => {
	const levels = questionData.levels || 5
	const ratingOptions = Array.from({ length: levels }, (_, i) => i + 1)
	const Icon = getSymbol(questionData.symbol)

	return (
		<div className="pointer-events-none flex w-full items-center justify-between gap-4">
			<div className="flex flex-grow justify-around">
				{ratingOptions.map((num) => (
					<div key={num} className="flex flex-col items-center space-y-2">
						<span className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
							{num}
						</span>
						<Icon className="h-6 w-6 text-muted-foreground" />
					</div>
				))}
			</div>
		</div>
	)
}
