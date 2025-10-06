// components/survey-creator/survey-creator.tsx
'use client'
import {
	DndContext,
	type DragEndEvent,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Input,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	cn,
} from '@mbc-cqrs-serverless-web/shared-ui'
import React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
	FormProvider,
	type Resolver,
	useFieldArray,
	useForm,
} from 'react-hook-form'
import {
	type SectionHeaderType,
	type ShortTextQuestionType,
	type SurveyItemType,
	type SurveyQuestionItemType,
	SurveySchema,
	type SurveySchemaType,
} from '../../types/schema'
import { SurveyForm } from '../forms/survey-form'
import { SortableItem } from '../layout/sortable-item'
import { FloatingActionBar } from './floating-action-bar'
import { QuestionCreator } from './question-creators/question-creator'
import { SectionActionCreator } from './section-creators/section-action-creator'
import { SectionHeaderCreator } from './section-creators/section-header-creator'
import {
	type SectionItem,
	SectionReorderModal,
} from './section-creators/section-reorder-modal'
const staticDefaultSurvey: SurveySchemaType = {
	id: 'svy_placeholder',
	title: 'Untitled Survey',
	description: '',
	items: [],
}

interface SurveyCreatorProps {
	initialSchema?: SurveySchemaType
	onSubmit: (schema: SurveySchemaType) => void
}

export const SurveyCreator: React.FC<SurveyCreatorProps> = ({
	initialSchema,
	onSubmit,
}) => {
	const [activeElementId, setActiveElementId] = useState<string | null>(null)
	const preDragActiveId = useRef<string | null>(null)
	const [toolbarContext, setToolbarContext] = useState<{
		top: number
		index: number
	} | null>(null)
	const [previewSchema, setPreviewSchema] = useState<SurveySchemaType | null>(
		null,
	)
	const [isPreviewOpen, setIsPreviewOpen] = useState(false)
	const [pendingActiveDataId, setPendingActiveDataId] = useState<string | null>(
		null,
	)
	const [isReorderModalOpen, setIsReorderModalOpen] = useState(false)

	const methods = useForm<SurveySchemaType>({
		resolver: zodResolver(SurveySchema) as Resolver<SurveySchemaType>,
		defaultValues: initialSchema || staticDefaultSurvey,
	})

	const { control, register, handleSubmit, watch, reset, getValues, setValue } =
		methods

	const {
		fields: items,
		remove: removeItem,
		insert: insertItem,
		move: moveItem,
	} = useFieldArray({ control, name: 'items', keyName: 'key' })

	const sortableQuestionIds = useMemo(
		() =>
			items
				.filter((item) => item.type !== 'section-header')
				.map((item) => item.key),
		[items],
	)

	useEffect(() => {
		if (!initialSchema) {
			const newId = `sec_${Date.now()}`
			const clientSideDefault: SurveySchemaType = {
				id: `svy_${Date.now()}`,
				title: 'Untitled Survey',
				description: '',
				items: [
					{
						id: newId,
						type: 'section-header',
						title: 'First Section',
						description: '',
					},
				],
			}
			reset(clientSideDefault)
			setActiveElementId('survey-title-card')
		} else {
			setActiveElementId(initialSchema.items[0]?.id || 'survey-title-card')
		}
	}, [initialSchema, reset])

	useEffect(() => {
		if (!activeElementId) {
			setToolbarContext(null)
			return
		}
		const targetId =
			activeElementId === 'survey-title-card'
				? 'survey-title-card'
				: activeElementId
		const element = document.getElementById(targetId)

		const activeIndex = items.findIndex((item) => item.key === activeElementId)

		if (element) {
			setToolbarContext({ top: element.offsetTop, index: activeIndex })
		} else {
			setToolbarContext(null)
		}
	}, [activeElementId, items])

	useEffect(() => {
		if (pendingActiveDataId && items.length > 0) {
			const foundItem = items.find((item) => item.id === pendingActiveDataId)

			if (foundItem) {
				setActiveElementId(foundItem.key)
				setPendingActiveDataId(null)
			}
		}
	}, [items, pendingActiveDataId, setActiveElementId])

	useEffect(() => {
		let lastSectionIndex = -1
		for (let i = items.length - 1; i >= 0; i--) {
			if (items[i].type === 'section-header') {
				lastSectionIndex = i
				break
			}
		}
		if (lastSectionIndex !== -1) {
			const lastSectionItem = items[lastSectionIndex]
			if (
				lastSectionItem.type === 'section-header' &&
				!lastSectionItem.action
			) {
				setValue(`items.${lastSectionIndex}.action`, undefined)
			}
		}
		items.forEach((item, index) => {
			if (item.type === 'section-header' && index !== lastSectionIndex) {
				if (item.action?.type === 'submit') {
					setValue(`items.${index}.action`, undefined)
				}
			}
		})
	}, [items, setValue])

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleSaveSectionReorder = (reorderedSections: SectionItem[]) => {
		const currentItems = getValues('items')
		const questionsBySection = new Map<string, SurveyQuestionItemType[]>()
		let currentSectionId: string | null = null

		for (const item of currentItems) {
			if (item.type === 'section-header') {
				currentSectionId = item.id
				questionsBySection.set(currentSectionId, [])
			} else if (currentSectionId) {
				const questions = questionsBySection.get(currentSectionId)
				if (questions) {
					questions.push(item)
				}
			}
		}

		const newItems: SurveyItemType[] = []
		const originalSections = new Map(
			currentItems
				.filter((item) => item.type === 'section-header')
				.map((item) => [item.id, item]),
		)

		// Rebuild the flat array in the new order
		for (const sectionHeader of reorderedSections) {
			const fullSection = originalSections.get(sectionHeader.id)
			if (fullSection) {
				newItems.push(fullSection)
				const associatedQuestions =
					questionsBySection.get(sectionHeader.id) || []
				newItems.push(...associatedQuestions)
			}
		}

		setValue('items', newItems, { shouldDirty: true })
		setIsReorderModalOpen(false)
	}

	function handleDragStart(event: DragStartEvent) {
		preDragActiveId.current = activeElementId
		const { active } = event
		const item = items.find((i) => i.key === active.id)
		if (item) {
			setActiveElementId(null)
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.key === active.id)
			const newIndex = items.findIndex((item) => item.key === over.id)

			if (newIndex > 0) {
				moveItem(oldIndex, newIndex)
			}
		}

		// Rule 1: If the dragged item was the one that was active...
		if (preDragActiveId.current === active.id) {
			setActiveElementId(active.id as string)
		} else {
			// Rule 2: Otherwise, restore whatever was active before (which could be nothing).
			setActiveElementId(preDragActiveId.current)
		}
	}

	const handleAddItem = (type: 'section-header' | 'short-text') => {
		const activeIndex = items.findIndex((item) => item.key === activeElementId)
		const insertIndex = activeIndex !== -1 ? activeIndex + 1 : items.length
		let newItem: any
		if (type === 'section-header') {
			const newSection: SectionHeaderType = {
				id: `sec_${Date.now()}`,
				type: 'section-header',
				title: `Section ${
					items.filter((i) => i.type === 'section-header').length + 1
				}`,
			}
			newItem = newSection
		} else {
			const newQuestion: ShortTextQuestionType = {
				id: `q_${Date.now()}`,
				type: 'short-text',
				label: '',
				validation: { required: false },
			}
			newItem = newQuestion
		}
		insertItem(insertIndex, newItem)
		setPendingActiveDataId(newItem.id)
	}

	const handleFormSubmit = (data: SurveySchemaType) => {
		onSubmit(data)
	}

	const handlePreviewSubmit = (answers: Record<string, any>) => {
		alert('Preview submitted! Check the console for answers.')
		console.log('--- PREVIEW ANSWERS ---', answers)
		setIsPreviewOpen(false)
	}

	const isActiveTitle = activeElementId === 'survey-title-card'

	const lastSectionHeaderIndex = useMemo(() => {
		for (let i = items.length - 1; i >= 0; i--) {
			if (items[i].type === 'section-header') {
				return i
			}
		}
		return -1
	}, [items])

	let currentSectionHeaderIndex = -1

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className="mb-6 flex items-center justify-between border-b pb-4">
					<h1 className="font-bold text-[length:var(--mbc-text-3xl)] leading-[var(--mbc-text-3xl--line-height)]">
						Survey Creator
					</h1>
					<Button type="submit">Save Survey</Button>
				</div>

				<Tabs
					defaultValue="creator"
					className="w-full"
					onValueChange={(tabValue) => {
						if (tabValue === 'preview') {
							setPreviewSchema(getValues())
						}
					}}
				>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="creator">Creator</TabsTrigger>
						<TabsTrigger value="preview">Preview</TabsTrigger>
						<TabsTrigger value="json">JSON</TabsTrigger>
					</TabsList>

					<TabsContent value="creator" className="pt-6">
						<div className="relative mx-auto flex w-full max-w-4xl gap-x-12">
							<div className="w-full">
								<div className="space-y-4">
									<div
										id="survey-title-card"
										onClick={() => setActiveElementId('survey-title-card')}
										className={cn(
											'cursor-pointer rounded-lg border-l-8 p-6',
											isActiveTitle
												? 'border-primary bg-card shadow-lg'
												: 'border-gray-300 bg-muted/30',
										)}
									>
										{isActiveTitle ? (
											<div className="space-y-2">
												<Input
													{...register('title')}
													className="h-12 border-0 px-0 font-bold text-[length:var(--mbc-text-3xl)] leading-[var(--mbc-text-3xl--line-height)] shadow-none"
													placeholder="Survey Title"
												/>
												<Input
													{...register('description')}
													className="border-0 px-0 shadow-none"
													placeholder="Form description"
												/>
											</div>
										) : (
											<div>
												<h2 className="font-bold text-[length:var(--mbc-text-3xl)] leading-[var(--mbc-text-3xl--line-height)]">
													{watch('title') || 'Survey Title'}
												</h2>
												<p className="mt-1 text-muted-foreground">
													{watch('description') || 'Form description'}
												</p>
											</div>
										)}
									</div>

									<DndContext
										sensors={sensors}
										collisionDetection={closestCenter}
										onDragStart={handleDragStart}
										onDragEnd={handleDragEnd}
									>
										<SortableContext
											items={sortableQuestionIds}
											strategy={verticalListSortingStrategy}
										>
											{items.map((item, index) => {
												if (item.type === 'section-header') {
													currentSectionHeaderIndex = index
												}

												const renderedItem = (() => {
													if (item.type === 'section-header') {
														return (
															<SectionHeaderCreator
																key={item.key}
																itemId={item.key}
																itemIndex={index}
																removeItem={removeItem}
																insertItem={insertItem}
																activeElementId={activeElementId}
																setActiveElementId={setActiveElementId}
																onOpenReorderModal={() =>
																	setIsReorderModalOpen(true)
																}
															/>
														)
													}

													const content = (
														<QuestionCreator
															questionId={item.key}
															itemIndex={index}
															removeItem={removeItem}
															insertItem={insertItem}
															setPendingActiveDataId={setPendingActiveDataId}
															activeElementId={activeElementId}
															setActiveElementId={setActiveElementId}
														/>
													)
													return (
														<SortableItem key={item.key} id={item.key}>
															{content}
														</SortableItem>
													)
												})()

												const isLastItemInSection =
													index === items.length - 1 ||
													items[index + 1]?.type === 'section-header'

												const shouldShowActionCreator =
													isLastItemInSection &&
													currentSectionHeaderIndex !== -1 &&
													currentSectionHeaderIndex !== lastSectionHeaderIndex

												// 3. Return the item and, if applicable, the action creator
												return (
													<React.Fragment key={item.key}>
														{renderedItem}
														{shouldShowActionCreator && (
															<SectionActionCreator
																sectionHeaderIndex={currentSectionHeaderIndex}
																sectionNumber={
																	items
																		.slice(0, currentSectionHeaderIndex + 1)
																		.filter((i) => i.type === 'section-header')
																		.length
																}
															/>
														)}
													</React.Fragment>
												)
											})}
										</SortableContext>
									</DndContext>
								</div>
							</div>
							<FloatingActionBar
								context={toolbarContext}
								onAddQuestion={() => handleAddItem('short-text')}
								onAddSection={() => handleAddItem('section-header')}
							/>
						</div>
					</TabsContent>

					<TabsContent value="preview" className="pt-6">
						<div className="rounded-lg border bg-card p-4 md:p-8">
							{previewSchema ? (
								<SurveyForm
									schema={previewSchema}
									onSubmit={handlePreviewSubmit}
								/>
							) : (
								<p className="py-12 text-center text-muted-foreground">
									Click the 'Preview' tab to see your survey.
								</p>
							)}
						</div>
					</TabsContent>

					<TabsContent value="json" className="pt-6">
						<div className="sticky top-4">
							<h3 className="mb-2 font-semibold text-[length:var(--mbc-text-xl)] leading-[var(--mbc-text-xl--line-height)]">
								Live JSON Output
							</h3>
							<pre className="max-h-[80vh] overflow-auto rounded-md bg-secondary p-4 text-[length:var(--mbc-text-sm)] text-secondary-foreground leading-[var(--mbc-text-sm--line-height)]">
								{JSON.stringify(watch(), null, 2)}
							</pre>
						</div>
					</TabsContent>
				</Tabs>
			</form>
			<Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
				<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Survey Preview</DialogTitle>
					</DialogHeader>
					{previewSchema ? (
						<SurveyForm schema={previewSchema} onSubmit={handlePreviewSubmit} />
					) : (
						<p>Loading preview...</p>
					)}
				</DialogContent>
			</Dialog>
			<SectionReorderModal
				isOpen={isReorderModalOpen}
				onClose={() => setIsReorderModalOpen(false)}
				onSave={handleSaveSectionReorder}
				items={items}
			/>
		</FormProvider>
	)
}
