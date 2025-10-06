// components/survey-creator/floating-action-bar.tsx
'use client'

import { Button, Card, Separator } from '@mbc-cqrs-serverless-web/shared-ui'
import { Plus, Tally4, Text, Type } from 'lucide-react'

interface FloatingActionBarProps {
	context: { top: number; index: number } | null
	onAddQuestion: (index: number) => void
	onAddSection: (index: number) => void
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
	context,
	onAddQuestion,
	onAddSection,
}) => {
	if (!context) {
		return null
	}

	return (
		<Card
			className="absolute right-[-80px] flex flex-col items-center gap-2 p-2 transition-all duration-150"
			style={{
				top: `${context.top}px`,
				transform: 'translateY(10%)', // Minor offset
			}}
		>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={() => onAddQuestion(context.index)}
				title="Add Question"
			>
				<Plus className="h-5 w-5" />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				disabled
				title="Import Questions (coming soon)"
			>
				<Text className="h-5 w-5" />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				disabled
				title="Add Title & Description (coming soon)"
			>
				<Type className="h-5 w-5" />
			</Button>
			<Separator />
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={() => onAddSection(context.index)}
				title="Add Section"
			>
				<Tally4 className="h-5 w-5" />
			</Button>
		</Card>
	)
}
