// components/survey-creator/question-creator.tsx
'use client'

import type { useSortable } from '@dnd-kit/sortable'
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Input,
	Label,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
	Separator,
	Switch,
	cn,
} from '@mbc-cqrs-serverless-web/shared-ui'
import {
	AlignLeft,
	BarChartHorizontal,
	Calendar,
	CheckSquare,
	ChevronDownSquare,
	CircleDot,
	Clock,
	Copy,
	GripHorizontal,
	Minus,
	MoreVertical,
	Star,
	Trash2,
} from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type {
	DateQuestionType,
	SurveyQuestionItemType,
	TimeQuestionType,
} from '../../../types/schema'
import {
	DateCreator,
	DatePreview,
	DropdownCreator,
	DropdownPreview,
	LinearScaleCreator,
	LinearScalePreview,
	LongTextCreator,
	LongTextPreview,
	MultipleChoiceCreator,
	MultipleChoicePreview,
	RatingCreator,
	RatingPreview,
	ShortTextCreator,
	ShortTextPreview,
	SingleChoiceCreator,
	SingleChoicePreview,
	TimeCreator,
	TimePreview,
} from './question-types'

interface QuestionCreatorProps {
	itemIndex: number
	removeItem: (index: number) => void
	insertItem: (index: number, item: any) => void
	setPendingActiveDataId: (id: string | null) => void
	activeElementId: string | null
	setActiveElementId: (id: string | null) => void
	questionId: string
	dndAttributes?: ReturnType<typeof useSortable>['attributes']
	dndListeners?: ReturnType<typeof useSortable>['listeners']
}

export const QuestionCreator: React.FC<QuestionCreatorProps> = ({
	itemIndex,
	removeItem,
	insertItem,
	setPendingActiveDataId,
	activeElementId,
	setActiveElementId,
	questionId,
	dndAttributes,
	dndListeners,
}) => {
	const { register, control, watch, getValues, setValue } = useFormContext()

	const itemPath = `items.${itemIndex}`
	const questionData = watch(itemPath) as SurveyQuestionItemType

	const questionLabel = questionData?.label || 'New Question'
	const questionType = questionData?.type
	const showOptions = ['single-choice', 'multiple-choice', 'dropdown'].includes(
		questionType,
	)

	const [showDescription, setShowDescription] = useState(
		() => !!questionData.description,
	)
	const [showValidation, setShowValidation] = useState(() => {
		if (questionType === 'short-text') {
			return !!questionData.validation?.custom
		}
		if (questionType === 'long-text') {
			return !!questionData.validation?.custom
		}
		if (questionType === 'multiple-choice') {
			return !!questionData.validation?.custom
		}
		return false
	})
	const [showShuffleOptions, setShowShuffleOptions] = useState(() => {
		if (
			questionType === 'multiple-choice' ||
			questionType === 'single-choice' ||
			questionType === 'dropdown'
		) {
			return !!questionData.validation?.shuffleOptions
		}
		return false
	})
	const [showBranching, setShowBranching] = useState(() => {
		if (
			questionData.type === 'single-choice' ||
			questionData.type === 'dropdown'
		) {
			return !!questionData.options?.some((opt) => opt.nextSectionId)
		}
		return false
	})

	const isActive = activeElementId === questionId

	const handleDuplicate = () => {
		const currentItemData = getValues(`items.${itemIndex}`)
		const duplicatedItem = {
			...JSON.parse(JSON.stringify(currentItemData)),
			id: `q_${Date.now()}`,
		}
		insertItem(itemIndex + 1, duplicatedItem)
		setPendingActiveDataId(duplicatedItem.id)
	}

	const handleCloseValidation = () => {
		setShowValidation(false)
		setValue(`${itemPath}.validation.custom`, undefined)
	}

	const renderQuestionPreview = () => {
		switch (questionType) {
			case 'short-text':
				return <ShortTextPreview />
			case 'long-text':
				return <LongTextPreview />
			case 'linear-scale':
				return <LinearScalePreview questionData={questionData} />
			case 'single-choice':
				return <SingleChoicePreview questionData={questionData} />
			case 'multiple-choice':
				return <MultipleChoicePreview questionData={questionData} />
			case 'dropdown':
				return <DropdownPreview questionData={questionData} />
			case 'rating':
				return <RatingPreview questionData={questionData} />
			case 'date':
				return <DatePreview questionData={questionData} />
			case 'time':
				return <TimePreview questionData={questionData} />
			default:
				return null
		}
	}

	return (
		<div
			id={questionId}
			onClick={(e) => {
				e.stopPropagation()
				setActiveElementId(questionId)
			}}
			className={cn(
				'rounded-lg border transition-all',
				isActive
					? 'border-primary bg-card shadow-lg'
					: 'border-transparent bg-white hover:bg-muted/50',
			)}
		>
			{isActive ? (
				// ============================================================================
				// EDIT MODE
				// ============================================================================
				<div className="p-6">
					<div
						className="flex cursor-grab justify-center pb-4"
						{...dndAttributes}
						{...dndListeners}
					>
						<GripHorizontal className="h-5 w-5 text-muted-foreground" />
					</div>

					<div className="flex items-center gap-4">
						<Input
							placeholder="Question"
							className="h-12 flex-grow rounded-none border-0 border-b px-1 font-semibold text-[length:var(--mbc-text-lg)] leading-[var(--mbc-text-lg--line-height)] shadow-none focus-visible:ring-0"
							{...register(`${itemPath}.label`)}
						/>
						<Controller
							control={control}
							name={`${itemPath}.type`}
							render={({ field }) => (
								<Select
									onValueChange={(newType) => {
										const currentQuestion = getValues(itemPath)

										// Preserve common properties
										const newQuestionData: any = {
											id: currentQuestion.id,
											label: currentQuestion.label,
											description: currentQuestion.description,
											validation: {
												required: !!currentQuestion.validation?.required,
											},
											type: newType,
										}

										// Add default properties based on the new type
										switch (newType) {
											case 'single-choice':
											case 'multiple-choice':
											case 'dropdown':
												newQuestionData.options = []
												break
											case 'linear-scale':
												newQuestionData.min = 1
												newQuestionData.max = 5
												newQuestionData.minLabel = ''
												newQuestionData.maxLabel = ''
												break
											case 'rating':
												newQuestionData.levels = 5
												newQuestionData.symbol = 'star'
												break
											case 'date':
												newQuestionData.includeTime = false
												newQuestionData.includeYear = true
												break
											case 'time':
												newQuestionData.answerType = 'time'
												break
										}

										// Replace the entire object in the form state
										setValue(itemPath, newQuestionData, { shouldDirty: true })
									}}
									value={field.value}
								>
									<SelectTrigger className="w-[220px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="short-text">
												<div className="flex items-center gap-2">
													<Minus className="h-4 w-4" /> Short answer
												</div>
											</SelectItem>
											<SelectItem value="long-text">
												<div className="flex items-center gap-2">
													<AlignLeft className="h-4 w-4" /> Paragraph
												</div>
											</SelectItem>
										</SelectGroup>
										<SelectSeparator />
										<SelectGroup>
											<SelectItem value="single-choice">
												<div className="flex items-center gap-2">
													<CircleDot className="h-4 w-4" /> Multiple choice
												</div>
											</SelectItem>
											<SelectItem value="multiple-choice">
												<div className="flex items-center gap-2">
													<CheckSquare className="h-4 w-4" /> Checkboxes
												</div>
											</SelectItem>
											<SelectItem value="dropdown">
												<div className="flex items-center gap-2">
													<ChevronDownSquare className="h-4 w-4" /> Dropdown
												</div>
											</SelectItem>
										</SelectGroup>
										<SelectSeparator />
										<SelectGroup>
											<SelectItem value="linear-scale">
												<div className="flex items-center gap-2">
													<BarChartHorizontal className="h-4 w-4" /> Linear
													scale
												</div>
											</SelectItem>
											<SelectItem value="rating">
												<div className="flex w-full items-center justify-between">
													<div className="flex items-center gap-2">
														<Star className="h-4 w-4" /> Rating
													</div>
												</div>
											</SelectItem>
										</SelectGroup>
										<SelectSeparator />
										<SelectGroup>
											<SelectItem value="date">
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4" /> Date
												</div>
											</SelectItem>
											<SelectItem value="time">
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4" /> Time
												</div>
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="mt-4 space-y-2">
						{showDescription && (
							<Input
								placeholder="Description"
								className="rounded-none border-0 px-1 text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] shadow-none focus-visible:ring-0"
								{...register(`${itemPath}.description`)}
							/>
						)}

						{questionType === 'short-text' && (
							<ShortTextCreator
								itemPath={itemPath}
								questionData={questionData}
								showValidation={showValidation}
								onCloseValidation={handleCloseValidation}
							/>
						)}

						{questionType === 'long-text' && (
							<LongTextCreator
								itemPath={itemPath}
								questionData={questionData}
								showValidation={showValidation}
								onCloseValidation={handleCloseValidation}
							/>
						)}

						{questionType === 'linear-scale' && (
							<LinearScaleCreator
								itemPath={itemPath}
								questionData={questionData}
							/>
						)}

						{questionType === 'single-choice' && (
							<SingleChoiceCreator
								itemIndex={itemIndex}
								itemPath={itemPath}
								questionData={questionData}
								showOptions={showOptions}
								showShuffleOptions={showShuffleOptions}
								showBranching={showBranching}
							/>
						)}

						{questionType === 'multiple-choice' && (
							<MultipleChoiceCreator
								itemIndex={itemIndex}
								itemPath={itemPath}
								showOptions={showOptions}
								showValidation={showValidation}
								onCloseValidation={handleCloseValidation}
							/>
						)}

						{questionType === 'dropdown' && (
							<DropdownCreator
								itemIndex={itemIndex}
								itemPath={itemPath}
								questionData={questionData}
								showOptions={showOptions}
								showShuffleOptions={showShuffleOptions}
								showBranching={showBranching}
							/>
						)}

						{questionType === 'rating' && <RatingCreator itemPath={itemPath} />}

						{questionType === 'date' && <DateCreator itemPath={itemPath} />}

						{questionType === 'time' && <TimeCreator itemPath={itemPath} />}
					</div>

					<Separator className="my-4" />

					<div className="flex items-center justify-end space-x-2">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={handleDuplicate}
							title="Duplicate"
						>
							<Copy className="h-4 w-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="hover:bg-destructive/10 hover:text-destructive"
							onClick={() => removeItem(itemIndex)}
							title="Delete"
						>
							<Trash2 className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6" />

						<div className="flex items-center space-x-2">
							<Label
								htmlFor={`${itemPath}.validation.required`}
								className="cursor-pointer font-medium text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)]"
							>
								Required
							</Label>
							<Controller
								control={control}
								name={`${itemPath}.validation.required`}
								render={({ field }) => (
									<Switch
										id={`${itemPath}.validation.required`}
										checked={!!field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Show</DropdownMenuLabel>
								<DropdownMenuCheckboxItem
									checked={showDescription}
									onCheckedChange={(checked) => {
										setShowDescription(!!checked)
										if (!checked) {
											setValue(`${itemPath}.description`, '')
										}
									}}
								>
									Description
								</DropdownMenuCheckboxItem>
								{(questionType === 'short-text' ||
									questionType === 'long-text' ||
									questionType === 'multiple-choice') && (
									<DropdownMenuCheckboxItem
										checked={showValidation}
										onCheckedChange={(checked) => {
											if (checked) {
												setShowValidation(true)
												// Set a default validation rule based on question type
												if (questionType === 'short-text') {
													setValue(`${itemPath}.validation.custom`, {
														type: 'number',
														rule: 'eq',
													})
												} else if (questionType === 'long-text') {
													setValue(`${itemPath}.validation.custom`, {
														type: 'length',
														rule: 'min',
													})
												} else if (questionType === 'multiple-choice') {
													setValue(`${itemPath}.validation.custom`, {
														rule: 'min',
														value: 1,
													})
												}
											} else {
												handleCloseValidation()
											}
										}}
									>
										Response validation
									</DropdownMenuCheckboxItem>
								)}
								{(questionType === 'single-choice' ||
									questionType === 'dropdown') && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem
											checked={!!showShuffleOptions}
											onCheckedChange={(checked) => {
												setShowShuffleOptions(!!checked)
												setValue(
													`${itemPath}.validation.shuffleOptions`,
													!!checked,
												)
											}}
										>
											Shuffle option order
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={!!showBranching}
											onCheckedChange={setShowBranching}
										>
											Go to section based on answer
										</DropdownMenuCheckboxItem>
									</>
								)}
								{questionType === 'multiple-choice' && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem
											checked={!!showShuffleOptions}
											onCheckedChange={(checked) => {
												setShowShuffleOptions(!!checked)
												setValue(
													`${itemPath}.validation.shuffleOptions`,
													!!checked,
												)
											}}
										>
											Shuffle option order
										</DropdownMenuCheckboxItem>
									</>
								)}
								{questionType === 'date' && (
									<>
										<DropdownMenuCheckboxItem
											checked={(questionData as DateQuestionType).includeTime}
											onCheckedChange={(checked) => {
												setValue(`${itemPath}.includeTime`, !!checked)
											}}
										>
											Include time
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={
												(questionData as DateQuestionType).includeYear !== false
											}
											onCheckedChange={(checked) => {
												setValue(`${itemPath}.includeYear`, !!checked)
											}}
										>
											Include year
										</DropdownMenuCheckboxItem>
									</>
								)}
								{questionType === 'time' && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuLabel>Answer type</DropdownMenuLabel>
										<DropdownMenuRadioGroup
											value={
												(questionData as TimeQuestionType).answerType || 'time'
											}
											onValueChange={(value) => {
												setValue(`${itemPath}.answerType`, value)
											}}
										>
											<DropdownMenuRadioItem value="time">
												Time
											</DropdownMenuRadioItem>
											<DropdownMenuRadioItem value="duration">
												Duration
											</DropdownMenuRadioItem>
										</DropdownMenuRadioGroup>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			) : (
				// ============================================================================
				// VIEW MODE
				// ============================================================================
				<div className="group relative cursor-pointer p-6">
					<div
						className="-translate-x-1/2 absolute top-3 left-1/2 flex cursor-grab justify-center opacity-0 transition-opacity group-hover:opacity-100"
						{...dndAttributes}
						{...dndListeners}
					>
						<GripHorizontal className="h-5 w-5 text-muted-foreground" />
					</div>
					<div className="space-y-2">
						<p className="font-semibold">
							{questionLabel || 'Untitled Question'}
						</p>
						{questionData.description && (
							<p className="text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
								{questionData.description}
							</p>
						)}
						<div className="pt-2">{renderQuestionPreview()}</div>
					</div>
				</div>
			)}
		</div>
	)
}
