// components/survey-creator/sortable-item.tsx
'use client'

import type {
	DraggableAttributes,
	DraggableSyntheticListeners,
} from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

// --- ADDED: Define the contract for the child component ---
// Any component that wants to be sortable via this wrapper must accept these props.
interface SortableChildProps {
	dndAttributes?: DraggableAttributes
	dndListeners?: DraggableSyntheticListeners
}

// --- CHANGED: Update the main props interface ---
interface SortableItemProps {
	id: string
	// The child must be a single React element that accepts our optional dnd props.
	children: React.ReactElement<Partial<SortableChildProps>>
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style}>
			{/* This is now type-safe because of the contract defined in SortableItemProps */}
			{React.cloneElement(children, {
				dndAttributes: attributes,
				dndListeners: listeners,
			})}
		</div>
	)
}
