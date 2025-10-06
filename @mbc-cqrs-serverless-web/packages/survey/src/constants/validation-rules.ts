// Survey validation rules constants
export const VALIDATION_RULES = {
	// Required field validation
	REQUIRED: 'required',

	// Text length validation
	MIN_LENGTH: 'minLength',
	MAX_LENGTH: 'maxLength',

	// Number validation
	MIN_VALUE: 'minValue',
	MAX_VALUE: 'maxValue',

	// Email validation
	EMAIL: 'email',

	// URL validation
	URL: 'url',

	// Pattern validation
	PATTERN: 'pattern',

	// Custom validation
	CUSTOM: 'custom',
} as const

export type ValidationRule =
	(typeof VALIDATION_RULES)[keyof typeof VALIDATION_RULES]

// Default validation messages
export const VALIDATION_MESSAGES = {
	REQUIRED: 'This field is required',
	MIN_LENGTH: 'Must be at least {min} characters',
	MAX_LENGTH: 'Must be no more than {max} characters',
	MIN_VALUE: 'Must be at least {min}',
	MAX_VALUE: 'Must be no more than {max}',
	EMAIL: 'Please enter a valid email address',
	URL: 'Please enter a valid URL',
	PATTERN: 'Please enter a valid format',
	CUSTOM: 'Please check your input',
} as const

// Text length limits
export const TEXT_LIMITS = {
	SHORT_TEXT: {
		MIN: 1,
		MAX: 255,
	},
	LONG_TEXT: {
		MIN: 1,
		MAX: 2000,
	},
	QUESTION_TITLE: {
		MIN: 1,
		MAX: 200,
	},
	QUESTION_DESCRIPTION: {
		MIN: 0,
		MAX: 500,
	},
	OPTION_TEXT: {
		MIN: 1,
		MAX: 100,
	},
} as const

// Number limits
export const NUMBER_LIMITS = {
	LINEAR_SCALE: {
		MIN: 1,
		MAX: 10,
	},
	RATING: {
		MIN: 1,
		MAX: 10,
	},
	OPTIONS_COUNT: {
		MIN: 2,
		MAX: 20,
	},
} as const

// Survey limits
export const SURVEY_LIMITS = {
	QUESTIONS_PER_SURVEY: {
		MIN: 1,
		MAX: 100,
	},
	SECTIONS_PER_SURVEY: {
		MIN: 1,
		MAX: 50,
	},
	SURVEY_TITLE: {
		MIN: 1,
		MAX: 200,
	},
	SURVEY_DESCRIPTION: {
		MIN: 0,
		MAX: 1000,
	},
} as const

// Validation patterns
export const VALIDATION_PATTERNS = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	URL: /^https?:\/\/.+/,
	PHONE: /^[\+]?[1-9][\d]{0,15}$/,
	ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
	NUMERIC: /^\d+$/,
} as const

// Error codes
export const ERROR_CODES = {
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	REQUIRED_FIELD: 'REQUIRED_FIELD',
	INVALID_FORMAT: 'INVALID_FORMAT',
	OUT_OF_RANGE: 'OUT_OF_RANGE',
	TOO_LONG: 'TOO_LONG',
	TOO_SHORT: 'TOO_SHORT',
	INVALID_EMAIL: 'INVALID_EMAIL',
	INVALID_URL: 'INVALID_URL',
	CUSTOM_VALIDATION: 'CUSTOM_VALIDATION',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
