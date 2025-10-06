// components/survey-creator/options-creator.tsx
'use client'

import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	Button,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@mbc-cqrs-serverless-web/shared-ui'
import { GripVertical, Trash2 } from 'lucide-react'
import type * as React from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import type { SurveyItemType } from '../../../types/schema'

const DEFAULT_SELECT_VALUE = '##__DEFAULT__##'

// A dedicated component for a single sortable option row
const SortableOption: React.FC<{
	field: Record<'id', string>
	index: number
	itemIndex: number
	questionType: 'single-choice' | 'multiple-choice' | 'dropdown'
	showBranching: boolean
	removeOption: (index: number) => void
}> = ({
	field,
	index,
	itemIndex,
	questionType,
	showBranching,
	removeOption,
}) => {
	const { control, register, watch } = useFormContext()

	const allItems: SurveyItemType[] = watch('items')
	const sectionHeaders = allItems.filter(
		(item) => item.type === 'section-header',
	)

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: field.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} className="flex items-center gap-2">
			<div
				className="cursor-grab touch-none p-1"
				{...attributes}
				{...listeners}
			>
				<GripVertical className="h-5 w-5 text-muted-foreground" />
			</div>
			<div className="flex-1">
				<Input
					placeholder={`Option ${index + 1}`}
					{...register(`items.${itemIndex}.options.${index}.label`)}
				/>
			</div>

			{(questionType === 'single-choice' || questionType === 'dropdown') &&
				showBranching && (
					<div className="w-[180px]">
						<Controller
							control={control}
							name={`items.${itemIndex}.options.${index}.nextSectionId`}
							render={({ field: selectField }) => (
								<Select
									value={selectField.value || ''}
									onValueChange={(value) => {
										selectField.onChange(
											value === DEFAULT_SELECT_VALUE ? undefined : value,
										)
									}}
								>
									<SelectTrigger className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]">
										<SelectValue placeholder="Go to section..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={DEFAULT_SELECT_VALUE}>
											Default (Next Section)
										</SelectItem>
										{sectionHeaders.map((sec) => (
											<SelectItem key={sec.id} value={sec.id}>
												{sec.title || 'Untitled Section'}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				)}

			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
				onClick={() => removeOption(index)}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	)
}

interface OptionsCreatorProps {
	itemIndex: number
	questionType: 'single-choice' | 'multiple-choice' | 'dropdown'
	showBranching: boolean
}

export const OptionsCreator: React.FC<OptionsCreatorProps> = ({
	itemIndex,
	questionType,
	showBranching,
}) => {
	const { control } = useFormContext()

	const {
		fields: optionFields,
		append: appendOption,
		remove: removeOption,
		move: moveOption,
	} = useFieldArray({
		control,
		name: `items.${itemIndex}.options`,
	})

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (over && active.id !== over.id) {
			const oldIndex = optionFields.findIndex((field) => field.id === active.id)
			const newIndex = optionFields.findIndex((field) => field.id === over.id)
			moveOption(oldIndex, newIndex)
		}
	}

	const addOption = () => {
		const newLabel = `Option ${optionFields.length + 1}`
		const newValue = newLabel.toLowerCase().replace(/\s+/g, '-')
		appendOption({ label: newLabel, value: newValue })
	}

	return (
		<div className="space-y-3 pt-2">
			<Label>Options</Label>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToParentElement]}
			>
				<SortableContext
					items={optionFields.map((field) => field.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-2">
						{optionFields.map((field, index) => (
							<SortableOption
								key={field.id}
								field={field}
								index={index}
								itemIndex={itemIndex}
								questionType={questionType}
								showBranching={showBranching}
								removeOption={removeOption}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
			<Button type="button" variant="outline" size="sm" onClick={addOption}>
				Add Option
			</Button>
		</div>
	)
}
