// Survey validation utilities
import type { z } from 'zod'
import { SurveySchema, type SurveySchemaType } from '../types/schema'

/**
 * Validates a survey schema using Zod
 */
export function validateSurveySchema(data: unknown): {
	success: boolean
	data?: SurveySchemaType
	error?: z.ZodError
} {
	return SurveySchema.safeParse(data)
}

/**
 * Validates survey data against a survey schema
 */
export function validateSurveyData(
	data: Record<string, unknown>,
	schema: SurveySchemaType,
): {
	success: boolean
	errors?: Record<string, string[]>
} {
	const errors: Record<string, string[]> = {}
	let hasErrors = false

	// Validate required questions
	for (const item of schema.items) {
		if (item.type !== 'section-header') {
			const questionId = item.id
			const value = data[questionId]

			// Check if required question has value
			if (item.validation?.required && (!value || value === '')) {
				errors[questionId] = errors[questionId] || []
				errors[questionId].push('This field is required')
				hasErrors = true
			}

			// Add more validation logic here based on question type
			// This is a basic implementation - can be extended
		}
	}

	return {
		success: !hasErrors,
		errors: hasErrors ? errors : undefined,
	}
}

/**
 * Creates a validation function for a specific question type
 */
export function createQuestionValidator(questionType: string) {
	return (value: unknown, validation?: any): string[] => {
		const errors: string[] = []

		if (validation?.required && (!value || value === '')) {
			errors.push('This field is required')
		}

		// Add type-specific validation logic here
		switch (questionType) {
			case 'short-text':
			case 'long-text':
				if (value && typeof value !== 'string') {
					errors.push('Value must be a string')
				}
				break
			case 'single-choice':
			case 'multiple-choice':
				if (value && !Array.isArray(value) && typeof value !== 'string') {
					errors.push('Value must be a string or array')
				}
				break
			// Add more question types as needed
		}

		return errors
	}
}

/**
 * Validates a single question response
 */
export function validateQuestionResponse(
	questionId: string,
	value: unknown,
	question: any,
): string[] {
	const validator = createQuestionValidator(question.type)
	return validator(value, question.validation)
}
