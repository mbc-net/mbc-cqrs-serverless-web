import {
	DEFAULT_QUESTION_CONFIG,
	DEFAULT_SURVEY_CONFIG,
} from './default-configs'
// Survey templates
import { QUESTION_TYPES } from './question-types'

// Basic survey template
export const BASIC_SURVEY_TEMPLATE = {
	...DEFAULT_SURVEY_CONFIG,
	title: 'Basic Survey',
	description: 'A simple survey template to get you started',
	questions: [
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q1',
			type: QUESTION_TYPES.SHORT_TEXT,
			title: 'What is your name?',
			required: true,
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q2',
			type: QUESTION_TYPES.SINGLE_CHOICE,
			title: 'How would you rate our service?',
			required: true,
			options: ['Excellent', 'Good', 'Average', 'Poor'],
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q3',
			type: QUESTION_TYPES.LONG_TEXT,
			title: 'Any additional comments?',
			required: false,
		},
	],
}

// Customer satisfaction survey template
export const CUSTOMER_SATISFACTION_TEMPLATE = {
	...DEFAULT_SURVEY_CONFIG,
	title: 'Customer Satisfaction Survey',
	description: 'Help us improve our service by sharing your feedback',
	questions: [
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q1',
			type: QUESTION_TYPES.SHORT_TEXT,
			title: 'What is your email address?',
			required: true,
			validation: {
				rules: ['email'],
				customMessage: 'Please enter a valid email address',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q2',
			type: QUESTION_TYPES.RATING,
			title: 'How satisfied are you with our service?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 5,
				symbol: 'star',
				showLabels: true,
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q3',
			type: QUESTION_TYPES.LINEAR_SCALE,
			title: 'How likely are you to recommend us to a friend?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 10,
				minLabel: 'Not at all likely',
				maxLabel: 'Extremely likely',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q4',
			type: QUESTION_TYPES.MULTIPLE_CHOICE,
			title:
				'What did you like most about our service? (Select all that apply)',
			required: false,
			options: [
				'Quality of service',
				'Speed of delivery',
				'Customer support',
				'Pricing',
				'Ease of use',
				'Other',
			],
			settings: {
				allowOther: true,
				otherLabel: 'Please specify',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q5',
			type: QUESTION_TYPES.LONG_TEXT,
			title: 'What could we improve?',
			required: false,
		},
	],
}

// Event feedback template
export const EVENT_FEEDBACK_TEMPLATE = {
	...DEFAULT_SURVEY_CONFIG,
	title: 'Event Feedback Survey',
	description: 'Thank you for attending our event. Please share your feedback',
	questions: [
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q1',
			type: QUESTION_TYPES.SHORT_TEXT,
			title: 'What is your name?',
			required: true,
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q2',
			type: QUESTION_TYPES.SHORT_TEXT,
			title: 'What is your email address?',
			required: true,
			validation: {
				rules: ['email'],
				customMessage: 'Please enter a valid email address',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q3',
			type: QUESTION_TYPES.RATING,
			title: 'How would you rate the event overall?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 5,
				symbol: 'star',
				showLabels: true,
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q4',
			type: QUESTION_TYPES.LINEAR_SCALE,
			title: 'How likely are you to attend future events?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 10,
				minLabel: 'Not at all likely',
				maxLabel: 'Extremely likely',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q5',
			type: QUESTION_TYPES.MULTIPLE_CHOICE,
			title: 'What did you enjoy most about the event? (Select all that apply)',
			required: false,
			options: [
				'Keynote presentations',
				'Breakout sessions',
				'Networking opportunities',
				'Food and beverages',
				'Venue and facilities',
				'Other',
			],
			settings: {
				allowOther: true,
				otherLabel: 'Please specify',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q6',
			type: QUESTION_TYPES.LONG_TEXT,
			title: 'What suggestions do you have for future events?',
			required: false,
		},
	],
}

// Employee engagement template
export const EMPLOYEE_ENGAGEMENT_TEMPLATE = {
	...DEFAULT_SURVEY_CONFIG,
	title: 'Employee Engagement Survey',
	description: 'Help us understand your experience and improve our workplace',
	questions: [
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q1',
			type: QUESTION_TYPES.SINGLE_CHOICE,
			title: 'How long have you been with the company?',
			required: true,
			options: [
				'Less than 1 year',
				'1-2 years',
				'3-5 years',
				'6-10 years',
				'More than 10 years',
			],
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q2',
			type: QUESTION_TYPES.RATING,
			title: 'How satisfied are you with your current role?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 5,
				symbol: 'star',
				showLabels: true,
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q3',
			type: QUESTION_TYPES.LINEAR_SCALE,
			title: 'How would you rate your work-life balance?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 10,
				minLabel: 'Poor',
				maxLabel: 'Excellent',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q4',
			type: QUESTION_TYPES.MULTIPLE_CHOICE,
			title: 'What motivates you most at work? (Select all that apply)',
			required: false,
			options: [
				'Recognition and appreciation',
				'Career growth opportunities',
				'Competitive salary and benefits',
				'Work-life balance',
				'Challenging projects',
				'Team collaboration',
				'Other',
			],
			settings: {
				allowOther: true,
				otherLabel: 'Please specify',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q5',
			type: QUESTION_TYPES.LONG_TEXT,
			title: 'What would you like to see improved in our workplace?',
			required: false,
		},
	],
}

// Product feedback template
export const PRODUCT_FEEDBACK_TEMPLATE = {
	...DEFAULT_SURVEY_CONFIG,
	title: 'Product Feedback Survey',
	description: 'Help us improve our product by sharing your experience',
	questions: [
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q1',
			type: QUESTION_TYPES.SHORT_TEXT,
			title: 'What product are you reviewing?',
			required: true,
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q2',
			type: QUESTION_TYPES.RATING,
			title: 'How would you rate this product?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 5,
				symbol: 'star',
				showLabels: true,
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q3',
			type: QUESTION_TYPES.LINEAR_SCALE,
			title: 'How likely are you to purchase this product again?',
			required: true,
			settings: {
				minValue: 1,
				maxValue: 10,
				minLabel: 'Not at all likely',
				maxLabel: 'Extremely likely',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q4',
			type: QUESTION_TYPES.MULTIPLE_CHOICE,
			title:
				'What did you like most about this product? (Select all that apply)',
			required: false,
			options: [
				'Quality',
				'Price',
				'Design',
				'Ease of use',
				'Customer service',
				'Delivery speed',
				'Other',
			],
			settings: {
				allowOther: true,
				otherLabel: 'Please specify',
			},
		},
		{
			...DEFAULT_QUESTION_CONFIG,
			id: 'q5',
			type: QUESTION_TYPES.LONG_TEXT,
			title: 'What could we improve about this product?',
			required: false,
		},
	],
}

// All available templates
export const SURVEY_TEMPLATES = {
	BASIC: BASIC_SURVEY_TEMPLATE,
	CUSTOMER_SATISFACTION: CUSTOMER_SATISFACTION_TEMPLATE,
	EVENT_FEEDBACK: EVENT_FEEDBACK_TEMPLATE,
	EMPLOYEE_ENGAGEMENT: EMPLOYEE_ENGAGEMENT_TEMPLATE,
	PRODUCT_FEEDBACK: PRODUCT_FEEDBACK_TEMPLATE,
} as const

export type SurveyTemplate =
	(typeof SURVEY_TEMPLATES)[keyof typeof SURVEY_TEMPLATES]

// Template metadata
export const TEMPLATE_METADATA = {
	BASIC: {
		name: 'Basic Survey',
		description: 'A simple survey template to get you started',
		category: 'General',
		questionCount: 3,
		estimatedTime: '2-3 minutes',
	},
	CUSTOMER_SATISFACTION: {
		name: 'Customer Satisfaction',
		description: 'Measure customer satisfaction and gather feedback',
		category: 'Business',
		questionCount: 5,
		estimatedTime: '3-5 minutes',
	},
	EVENT_FEEDBACK: {
		name: 'Event Feedback',
		description: 'Collect feedback from event attendees',
		category: 'Events',
		questionCount: 6,
		estimatedTime: '4-6 minutes',
	},
	EMPLOYEE_ENGAGEMENT: {
		name: 'Employee Engagement',
		description: 'Measure employee satisfaction and engagement',
		category: 'HR',
		questionCount: 5,
		estimatedTime: '3-5 minutes',
	},
	PRODUCT_FEEDBACK: {
		name: 'Product Feedback',
		description: 'Gather feedback on products and services',
		category: 'Product',
		questionCount: 5,
		estimatedTime: '3-5 minutes',
	},
} as const
