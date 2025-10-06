// Survey question types constants
export const QUESTION_TYPES = {
	SHORT_TEXT: 'short_text',
	LONG_TEXT: 'long_text',
	LINEAR_SCALE: 'linear_scale',
	SINGLE_CHOICE: 'single_choice',
	MULTIPLE_CHOICE: 'multiple_choice',
	DROPDOWN: 'dropdown',
	RATING: 'rating',
	DATE: 'date',
	TIME: 'time',
} as const

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES]

// Question type display names
export const QUESTION_TYPE_LABELS = {
	[QUESTION_TYPES.SHORT_TEXT]: 'Short Text',
	[QUESTION_TYPES.LONG_TEXT]: 'Long Text',
	[QUESTION_TYPES.LINEAR_SCALE]: 'Linear Scale',
	[QUESTION_TYPES.SINGLE_CHOICE]: 'Single Choice',
	[QUESTION_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
	[QUESTION_TYPES.DROPDOWN]: 'Dropdown',
	[QUESTION_TYPES.RATING]: 'Rating',
	[QUESTION_TYPES.DATE]: 'Date',
	[QUESTION_TYPES.TIME]: 'Time',
} as const

// Question type descriptions
export const QUESTION_TYPE_DESCRIPTIONS = {
	[QUESTION_TYPES.SHORT_TEXT]: 'Single line text input',
	[QUESTION_TYPES.LONG_TEXT]: 'Multi-line text input',
	[QUESTION_TYPES.LINEAR_SCALE]: 'Scale from 1 to N',
	[QUESTION_TYPES.SINGLE_CHOICE]: 'Select one option',
	[QUESTION_TYPES.MULTIPLE_CHOICE]: 'Select multiple options',
	[QUESTION_TYPES.DROPDOWN]: 'Select from dropdown',
	[QUESTION_TYPES.RATING]: 'Rate with stars, hearts, or thumbs',
	[QUESTION_TYPES.DATE]: 'Select a date',
	[QUESTION_TYPES.TIME]: 'Select a time',
} as const

// Question type icons (Lucide React icon names)
export const QUESTION_TYPE_ICONS = {
	[QUESTION_TYPES.SHORT_TEXT]: 'Type',
	[QUESTION_TYPES.LONG_TEXT]: 'AlignLeft',
	[QUESTION_TYPES.LINEAR_SCALE]: 'Minus',
	[QUESTION_TYPES.SINGLE_CHOICE]: 'CircleDot',
	[QUESTION_TYPES.MULTIPLE_CHOICE]: 'CheckSquare',
	[QUESTION_TYPES.DROPDOWN]: 'ChevronDown',
	[QUESTION_TYPES.RATING]: 'Star',
	[QUESTION_TYPES.DATE]: 'Calendar',
	[QUESTION_TYPES.TIME]: 'Clock',
} as const

// Question type categories
export const QUESTION_TYPE_CATEGORIES = {
	TEXT: [QUESTION_TYPES.SHORT_TEXT, QUESTION_TYPES.LONG_TEXT],
	CHOICE: [
		QUESTION_TYPES.SINGLE_CHOICE,
		QUESTION_TYPES.MULTIPLE_CHOICE,
		QUESTION_TYPES.DROPDOWN,
	],
	SCALE: [QUESTION_TYPES.LINEAR_SCALE, QUESTION_TYPES.RATING],
	DATE_TIME: [QUESTION_TYPES.DATE, QUESTION_TYPES.TIME],
} as const

// Rating symbols
export const RATING_SYMBOLS = {
	STAR: 'star',
	HEART: 'heart',
	THUMB: 'thumb',
} as const

export type RatingSymbol = (typeof RATING_SYMBOLS)[keyof typeof RATING_SYMBOLS]

// Linear scale defaults
export const LINEAR_SCALE_DEFAULTS = {
	MIN_VALUE: 1,
	MAX_VALUE: 5,
	MIN_LABEL: 'Strongly Disagree',
	MAX_LABEL: 'Strongly Agree',
} as const

// Rating defaults
export const RATING_DEFAULTS = {
	MIN_VALUE: 1,
	MAX_VALUE: 5,
	SYMBOL: RATING_SYMBOLS.STAR,
} as const
