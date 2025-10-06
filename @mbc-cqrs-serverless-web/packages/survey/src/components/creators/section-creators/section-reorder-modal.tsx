// components/survey-creator/section-reorder-modal.tsx
'use client'

import {
	DndContext,
	type DragEndEvent,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@mbc-cqrs-serverless-web/shared-ui'
import { GripVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FieldArrayWithId } from 'react-hook-form'
import type { SurveySchemaType } from '../../../types/schema'

// Defines the shape of a section item used within the modal
export interface SectionItem {
	id: string
	key: string
	title: string
}

interface SortableSectionItemProps {
	section: SectionItem
	index: number
	total: number
}

// A sortable list item component used only by the modal
const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
	section,
	index,
	total,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: section.key })
	const style = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex items-center gap-2 rounded-lg bg-muted/50 p-3"
		>
			<div
				{...attributes}
				{...listeners}
				className="cursor-grab touch-none p-1"
			>
				<GripVertical className="h-5 w-5 text-muted-foreground" />
			</div>
			<div>
				<p className="font-semibold">{section.title || 'Untitled Section'}</p>
				<p className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
					Section {index + 1} of {total}
				</p>
			</div>
		</div>
	)
}

interface SectionReorderModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (reorderedSections: SectionItem[]) => void
	items: FieldArrayWithId<SurveySchemaType, 'items', 'key'>[]
}

export const SectionReorderModal: React.FC<SectionReorderModalProps> = ({
	isOpen,
	onClose,
	onSave,
	items,
}) => {
	const [sections, setSections] = useState<SectionItem[]>([])

	useEffect(() => {
		if (isOpen) {
			const sectionHeaders = items
				// FIXED: Removed the incorrect type predicate from the filter.
				.filter((item) => item.type === 'section-header')
				.map(({ id, key, title }) => ({ id, key, title }))
			setSections(sectionHeaders)
		}
	}, [isOpen, items])

	const sensors = useSensors(useSensor(PointerSensor))

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (over && active.id !== over.id) {
			setSections((prevSections) => {
				const oldIndex = prevSections.findIndex((s) => s.key === active.id)
				const newIndex = prevSections.findIndex((s) => s.key === over.id)
				const newArray = [...prevSections]
				const [removed] = newArray.splice(oldIndex, 1)
				newArray.splice(newIndex, 0, removed)
				return newArray
			})
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reorder sections</DialogTitle>
				</DialogHeader>
				<div className="max-h-[60vh] space-y-2 overflow-y-auto p-1">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={sections.map((s) => s.key)}
							strategy={verticalListSortingStrategy}
						>
							{sections.map((sec, index) => (
								<SortableSectionItem
									key={sec.key}
									section={sec}
									index={index}
									total={sections.length}
								/>
							))}
						</SortableContext>
					</DndContext>
				</div>
				<DialogFooter>
					<Button type="button" variant="ghost" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={() => onSave(sections)}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
