'use client'
import {
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@mbc-cqrs-serverless-web/shared-ui'
import { X } from 'lucide-react'
import type * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { LongTextQuestionType } from '../../../../types/schema'

interface LongTextCreatorProps {
	itemPath: string
	questionData: LongTextQuestionType
	showValidation: boolean
	onCloseValidation: () => void
}

const LongTextValidationBuilder: React.FC<{
	itemPath: string
	onClose: () => void
}> = ({ itemPath, onClose }) => {
	const { control, watch, setValue, register } = useFormContext()
	const validationPath = `${itemPath}.validation.custom`
	const validationRule = watch(validationPath)

	const handleTypeChange = (newType: string) => {
		let defaultRule: string
		switch (newType) {
			case 'length':
				defaultRule = 'min'
				break
			case 'regex':
				defaultRule = 'matches'
				break
			default:
				defaultRule = 'min'
				break
		}
		// Update the rule and clear other values that depend on it
		setValue(`${validationPath}.rule`, defaultRule)
		setValue(`${validationPath}.value`, undefined)
	}

	const needsValue = !!validationRule?.rule

	return (
		<div className="mt-4 p-3">
			<div className="flex flex-wrap items-center gap-2">
				{/* --- Group 1: Type and Rule Selects --- */}
				<div className="flex w-full flex-grow gap-2 sm:w-auto sm:flex-grow-0">
					<Controller
						control={control}
						name={`${validationPath}.type`}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={(v) => {
									field.onChange(v)
									handleTypeChange(v)
								}}
							>
								<SelectTrigger className="w-[120px] border-0" size="xs">
									<SelectValue
										className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]"
										placeholder="Type..."
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
										value="length"
									>
										Length
									</SelectItem>
									<SelectItem
										className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
										value="regex"
									>
										Regex
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					<Controller
						control={control}
						name={`${validationPath}.rule`}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={!validationRule?.type}
							>
								<SelectTrigger className="w-[180px] border-0" size="xs">
									<SelectValue
										className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] placeholder:text-[length:var(--mbc-text-xs)]"
										placeholder="Rule..."
									/>
								</SelectTrigger>
								<SelectContent>
									{validationRule?.type === 'length' && (
										<>
											<SelectItem
												className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
												value="max"
											>
												Max character count
											</SelectItem>
											<SelectItem
												className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
												value="min"
											>
												Min character count
											</SelectItem>
										</>
									)}
									{validationRule?.type === 'regex' && (
										<>
											<SelectItem
												className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
												value="contains"
											>
												Contains
											</SelectItem>
											<SelectItem
												className="text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]"
												value="not_contains"
											>
												Doesn't contain
											</SelectItem>
											<SelectItem value="matches">Matches</SelectItem>
											<SelectItem value="not_matches">Doesn't match</SelectItem>
										</>
									)}
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				{/* --- Group 2: Value Inputs --- */}
				{needsValue && (
					<div className="flex flex-grow gap-2">
						<Input
							type={validationRule?.type === 'length' ? 'number' : 'text'}
							placeholder="Value"
							className="min-w-[80px] flex-grow rounded-none border-0 border-b px-1 text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] shadow-none placeholder:text-[length:var(--mbc-text-xs)] focus-visible:ring-0"
							{...register(`${validationPath}.value`)}
						/>
					</div>
				)}

				{/* --- Group 3: Custom Error and Close Button --- */}
				<div className="flex w-full flex-grow gap-2 sm:w-auto">
					<Input
						placeholder="Custom error text"
						className="flex-grow rounded-none border-0 border-b px-1 text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] shadow-none placeholder:text-[length:var(--mbc-text-xs)] focus-visible:ring-0"
						{...register(`${validationPath}.customError`)}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="shrink-0"
						onClick={onClose}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}

export const LongTextCreator: React.FC<LongTextCreatorProps> = ({
	itemPath,
	showValidation,
	onCloseValidation,
}) => {
	return (
		<>
			<div className="px-1 pt-4">
				<div className="pointer-events-none min-h-[80px] w-full rounded border border-dashed p-3 text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
					Long answer text (paragraph)
				</div>
			</div>

			{showValidation && (
				<LongTextValidationBuilder
					itemPath={itemPath}
					onClose={onCloseValidation}
				/>
			)}
		</>
	)
}

export const LongTextPreview: React.FC = () => {
	return (
		<div className="pointer-events-none min-h-[80px] w-full rounded border border-dashed p-3 text-[length:var(--mbc-text-sm)] text-muted-foreground leading-[var(--mbc-text-sm--line-height)]">
			Long answer text (paragraph)
		</div>
	)
}
