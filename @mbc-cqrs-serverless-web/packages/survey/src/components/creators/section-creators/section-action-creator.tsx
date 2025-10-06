// components/survey-creator/section-action-creator.tsx
'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Controller, useFormContext } from 'react-hook-form'
import type { SurveyItemType, SurveySchemaType } from '../../../types/schema'

interface SectionActionCreatorProps {
	sectionHeaderIndex: number
	sectionNumber: number
}

export const SectionActionCreator: React.FC<SectionActionCreatorProps> = ({
	sectionHeaderIndex,
	sectionNumber,
}) => {
	const { control, watch } = useFormContext<SurveySchemaType>()

	const actionPath = `items.${sectionHeaderIndex}.action` as const
	const allItems: SurveyItemType[] = watch('items')

	const sectionHeaders = allItems.filter(
		(item) => item.type === 'section-header',
	)
	const currentSectionId = watch(`items.${sectionHeaderIndex}.id`)

	return (
		<div className="mt-6 pb-6">
			<div className="flex items-center gap-2">
				<p className="flex-shrink-0 font-medium text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
					After section {sectionNumber}
				</p>

				<Controller
					control={control}
					name={actionPath}
					render={({ field }) => {
						const currentAction = field.value
						let selectedValue = 'default'

						// FIXED: Add an explicit check for the action object's existence.
						// This helps TypeScript correctly narrow the type.
						if (currentAction) {
							if (currentAction.type === 'submit') {
								selectedValue = '##SUBMIT##'
							} else if (currentAction.type === 'jump') {
								selectedValue = currentAction.targetSectionId
							}
						}

						return (
							<Select
								value={selectedValue}
								onValueChange={(value) => {
									if (value === 'default') {
										field.onChange(undefined)
									} else if (value === '##SUBMIT##') {
										field.onChange({ type: 'submit' })
									} else {
										field.onChange({ type: 'jump', targetSectionId: value })
									}
								}}
							>
								<SelectTrigger className="w-auto border-0 bg-transparent p-1 shadow-none focus:ring-0 focus:ring-offset-0">
									<SelectValue placeholder="Continue to next section" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="default">
										Continue to next section
									</SelectItem>

									{sectionHeaders
										.filter((s) => s.id !== currentSectionId)
										.map((s) => {
											const visualIndex =
												sectionHeaders.findIndex((sec) => sec.id === s.id) + 1
											return (
												<SelectItem key={s.id} value={s.id}>
													Go to section {visualIndex} (
													{s.title || 'Untitled Section'})
												</SelectItem>
											)
										})}

									<SelectItem value="##SUBMIT##">Submit form</SelectItem>
								</SelectContent>
							</Select>
						)
					}}
				/>
			</div>
		</div>
	)
}
