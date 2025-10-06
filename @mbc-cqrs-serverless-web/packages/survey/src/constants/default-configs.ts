// Default survey configurations
import {
	LINEAR_SCALE_DEFAULTS,
	QUESTION_TYPES,
	RATING_DEFAULTS,
} from './question-types'

// Default survey configuration
export const DEFAULT_SURVEY_CONFIG = {
	title: '',
	description: '',
	isPublished: false,
	allowAnonymous: true,
	allowMultipleSubmissions: false,
	showProgressBar: true,
	showQuestionNumbers: true,
	shuffleQuestions: false,
	shuffleOptions: false,
	timeLimit: null,
	maxSubmissions: null,
	startDate: null,
	endDate: null,
	theme: 'default',
	branding: {
		showLogo: false,
		logoUrl: '',
		primaryColor: '#3b82f6',
		secondaryColor: '#64748b',
	},
	notifications: {
		emailOnSubmission: false,
		emailOnCompletion: false,
		emailAddresses: [],
	},
} as const

// Default question configuration
export const DEFAULT_QUESTION_CONFIG = {
	id: '',
	type: QUESTION_TYPES.SHORT_TEXT,
	title: '',
	description: '',
	required: false,
	validation: {
		rules: [],
		customMessage: '',
	},
	options: [],
	settings: {},
	branching: {
		enabled: false,
		conditions: [],
	},
	display: {
		showTitle: true,
		showDescription: true,
		showRequired: true,
	},
} as const

// Default section configuration
export const DEFAULT_SECTION_CONFIG = {
	id: '',
	title: '',
	description: '',
	questions: [],
	settings: {
		showTitle: true,
		showDescription: true,
		collapsible: false,
		collapsed: false,
	},
} as const

// Default question type configurations
export const DEFAULT_QUESTION_TYPE_CONFIGS = {
	[QUESTION_TYPES.SHORT_TEXT]: {
		placeholder: 'Enter your answer...',
		maxLength: 255,
		minLength: 1,
	},
	[QUESTION_TYPES.LONG_TEXT]: {
		placeholder: 'Enter your answer...',
		maxLength: 2000,
		minLength: 1,
		rows: 4,
	},
	[QUESTION_TYPES.LINEAR_SCALE]: {
		minValue: LINEAR_SCALE_DEFAULTS.MIN_VALUE,
		maxValue: LINEAR_SCALE_DEFAULTS.MAX_VALUE,
		minLabel: LINEAR_SCALE_DEFAULTS.MIN_LABEL,
		maxLabel: LINEAR_SCALE_DEFAULTS.MAX_LABEL,
		step: 1,
	},
	[QUESTION_TYPES.SINGLE_CHOICE]: {
		options: ['Option 1', 'Option 2'],
		allowOther: false,
		otherLabel: 'Other',
		shuffleOptions: false,
	},
	[QUESTION_TYPES.MULTIPLE_CHOICE]: {
		options: ['Option 1', 'Option 2'],
		allowOther: false,
		otherLabel: 'Other',
		shuffleOptions: false,
		minSelections: 1,
		maxSelections: null,
	},
	[QUESTION_TYPES.DROPDOWN]: {
		options: ['Option 1', 'Option 2'],
		placeholder: 'Select an option...',
		allowOther: false,
		otherLabel: 'Other',
	},
	[QUESTION_TYPES.RATING]: {
		minValue: RATING_DEFAULTS.MIN_VALUE,
		maxValue: RATING_DEFAULTS.MAX_VALUE,
		symbol: RATING_DEFAULTS.SYMBOL,
		showLabels: true,
		allowHalfRatings: false,
	},
	[QUESTION_TYPES.DATE]: {
		format: 'YYYY-MM-DD',
		minDate: null,
		maxDate: null,
		includeYear: true,
		placeholder: 'Select a date...',
	},
	[QUESTION_TYPES.TIME]: {
		format: 'HH:mm',
		minTime: null,
		maxTime: null,
		step: 15,
		placeholder: 'Select a time...',
	},
} as const

// Default form configuration
export const DEFAULT_FORM_CONFIG = {
	submitButtonText: 'Submit',
	nextButtonText: 'Next',
	previousButtonText: 'Previous',
	completeButtonText: 'Complete',
	showProgress: true,
	showNavigation: true,
	allowBackNavigation: true,
	autoSave: false,
	autoSaveInterval: 30000, // 30 seconds
	validationMode: 'onChange', // 'onChange' | 'onBlur' | 'onSubmit'
} as const

// Default theme configuration
export const DEFAULT_THEME_CONFIG = {
	name: 'default',
	colors: {
		primary: '#3b82f6',
		secondary: '#64748b',
		success: '#10b981',
		warning: '#f59e0b',
		error: '#ef4444',
		background: '#ffffff',
		surface: '#f8fafc',
		text: '#1f2937',
		textSecondary: '#6b7280',
		border: '#e5e7eb',
	},
	typography: {
		fontFamily: 'Inter, system-ui, sans-serif',
		fontSize: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
		},
		fontWeight: {
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700,
		},
	},
	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
	},
	borderRadius: {
		sm: '0.25rem',
		md: '0.375rem',
		lg: '0.5rem',
		xl: '0.75rem',
	},
} as const

// Default accessibility configuration
export const DEFAULT_ACCESSIBILITY_CONFIG = {
	announcePageChanges: true,
	announceQuestionChanges: true,
	highContrast: false,
	largeText: false,
	keyboardNavigation: true,
	screenReaderSupport: true,
	focusManagement: true,
	ariaLabels: {
		required: 'Required',
		optional: 'Optional',
		submit: 'Submit survey',
		next: 'Next question',
		previous: 'Previous question',
		complete: 'Complete survey',
	},
} as const

// Default localization configuration
export const DEFAULT_LOCALIZATION_CONFIG = {
	locale: 'en',
	dateFormat: 'MM/DD/YYYY',
	timeFormat: '12h',
	numberFormat: 'en-US',
	currency: 'USD',
	messages: {
		required: 'This field is required',
		invalid: 'Please enter a valid value',
		tooShort: 'Please enter at least {min} characters',
		tooLong: 'Please enter no more than {max} characters',
		invalidEmail: 'Please enter a valid email address',
		invalidUrl: 'Please enter a valid URL',
		submit: 'Submit',
		next: 'Next',
		previous: 'Previous',
		complete: 'Complete',
		loading: 'Loading...',
		saving: 'Saving...',
		error: 'An error occurred',
		success: 'Success',
	},
} as const
