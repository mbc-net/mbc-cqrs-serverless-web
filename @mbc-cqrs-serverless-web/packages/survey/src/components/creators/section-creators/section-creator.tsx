// components/survey-creator/section-creator.tsx
'use client'

import {
	Button,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	cn,
} from '@mbc-cqrs-serverless-web/shared-ui'
import type { useSortable } from '@dnd-kit/sortable'
import { GripVertical, Trash2 } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import type { SurveyItemType } from '../../../types/schema'

interface SectionCreatorProps {
	itemIndex: number
	removeItem: (index: number) => void
	activeElementId: string | null
	setActiveElementId: (id: string | null) => void
	itemId: string
	dndAttributes?: ReturnType<typeof useSortable>['attributes']
	dndListeners?: ReturnType<typeof useSortable>['listeners']
}

export const SectionCreator: React.FC<SectionCreatorProps> = ({
	itemIndex,
	removeItem,
	activeElementId,
	setActiveElementId,
	itemId,
	dndAttributes,
	dndListeners,
}) => {
	const { register, control, watch, setValue } = useFormContext()

	const itemData = watch(`items.${itemIndex}`) as Extract<
		SurveyItemType,
		{ type: 'section-header' }
	>
	const actionType = itemData?.action?.type
	const allItems: SurveyItemType[] = watch('items')

	const isActive = activeElementId === itemId

	// Filter for items that are section headers to use as jump targets
	const sectionHeaders = allItems.filter(
		(item) => item.type === 'section-header',
	)

	return (
		<div
			id={itemId}
			onClick={() => setActiveElementId(itemId)}
			className={cn(
				'cursor-pointer rounded-lg border-l-8 transition-all',
				isActive
					? 'border-primary bg-card shadow-lg'
					: 'border-primary/20 bg-muted/30',
			)}
		>
			<CardHeader className="flex flex-row items-center justify-between p-4">
				<div className="flex items-center">
					<div className="cursor-grab" {...dndAttributes} {...dndListeners}>
						<GripVertical className="h-5 w-5 text-muted-foreground" />
					</div>
					<CardTitle className="ml-2">{itemData?.title || 'Section'}</CardTitle>
				</div>
				{isActive && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={(e) => {
							e.stopPropagation()
							removeItem(itemIndex)
						}}
					>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
				)}
			</CardHeader>
			{isActive && (
				<CardContent
					className="cursor-default space-y-4 border-t p-4 md:p-6"
					onClick={(e) => e.stopPropagation()}
				>
					<div>
						<Label>Section Title</Label>
						<Input {...register(`items.${itemIndex}.title`)} />
					</div>
					<div>
						<Label>Section Description (Optional)</Label>
						<Input {...register(`items.${itemIndex}.description`)} />
					</div>
					<div className="space-y-2 pt-4">
						<h3 className="font-semibold text-[length:var(--mbc-text-base)] leading-[var(--mbc-text-base--line-height)]">
							Section Action
						</h3>
						<div className="grid grid-cols-1 gap-4 rounded-lg border bg-background p-4 md:grid-cols-2">
							<div>
								<Label>When this section is complete...</Label>
								<Controller
									control={control}
									name={`items.${itemIndex}.action.type`}
									render={({ field }) => (
										<Select
											value={field.value || 'default'}
											onValueChange={(value) => {
												const actionPath = `items.${itemIndex}.action`
												if (value === 'default') {
													setValue(actionPath, undefined)
													field.onChange(undefined)
												} else {
													field.onChange(value)
													if (value === 'submit')
														setValue(actionPath, { type: 'submit' })
													else if (value === 'jump')
														setValue(actionPath, {
															type: 'jump',
															targetSectionId: '',
														})
												}
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select an action" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="default">
													Default (Go to next section)
												</SelectItem>
												<SelectItem value="submit">
													Submit the survey
												</SelectItem>
												<SelectItem value="jump">
													Jump to a specific section
												</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</div>
							{actionType === 'jump' && (
								<div>
									<Label>Jump Target</Label>
									<Controller
										control={control}
										name={`items.${itemIndex}.action.targetSectionId`}
										rules={{ required: 'A target section is required' }}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value || ''}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select target..." />
												</SelectTrigger>
												<SelectContent>
													{sectionHeaders
														.filter((s) => s.id !== itemData.id)
														.map((s, i) => (
															<SelectItem key={s.id} value={s.id}>
																{i + 1}: {s.title || 'Untitled Section'}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			)}
		</div>
	)
}
