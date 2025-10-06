// Survey hooks
import { useCallback, useState } from 'react'
import type { SurveySchemaType } from '../types/schema'
import { validateSurveyData } from '../utils/validation'

/**
 * Hook for managing survey state and validation
 */
export function useSurvey(schema: SurveySchemaType) {
	const [currentStep, setCurrentStep] = useState(0)
	const [answers, setAnswers] = useState<Record<string, unknown>>({})
	const [errors, setErrors] = useState<Record<string, string[]>>({})

	const updateAnswer = useCallback(
		(questionId: string, value: unknown) => {
			setAnswers((prev) => ({
				...prev,
				[questionId]: value,
			}))

			// Clear errors for this question when user starts typing
			if (errors[questionId]) {
				setErrors((prev) => {
					const newErrors = { ...prev }
					delete newErrors[questionId]
					return newErrors
				})
			}
		},
		[errors],
	)

	const validateCurrentStep = useCallback(() => {
		const validation = validateSurveyData(answers, schema)
		if (!validation.success) {
			setErrors(validation.errors || {})
		} else {
			setErrors({})
		}
		return validation.success
	}, [answers, schema])

	const nextStep = useCallback(() => {
		if (validateCurrentStep()) {
			setCurrentStep((prev) => prev + 1)
		}
	}, [validateCurrentStep])

	const previousStep = useCallback(() => {
		setCurrentStep((prev) => Math.max(0, prev - 1))
	}, [])

	const resetSurvey = useCallback(() => {
		setAnswers({})
		setErrors({})
		setCurrentStep(0)
	}, [])

	return {
		currentStep,
		answers,
		errors,
		updateAnswer,
		validateCurrentStep,
		nextStep,
		previousStep,
		resetSurvey,
		isComplete: currentStep >= schema.items.length - 1,
	}
}
