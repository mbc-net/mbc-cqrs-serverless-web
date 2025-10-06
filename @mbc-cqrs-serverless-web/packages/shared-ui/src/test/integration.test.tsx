import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, test } from 'vitest'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../components/ui/accordion'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Checkbox } from '../components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Textarea } from '../components/ui/textarea'

// Integration test for form components working together
describe('Form Integration Tests', () => {
	test('Form with multiple components should work together', async () => {
		const user = userEvent.setup()

		const TestForm = () => {
			const [formData, setFormData] = React.useState({
				name: '',
				email: '',
				role: '',
				newsletter: false,
				notifications: false,
				message: '',
			})

			const handleSubmit = (e: React.FormEvent) => {
				e.preventDefault()
				console.log('Form submitted:', formData)
			}

			return (
				<Card className="w-96">
					<CardHeader>
						<CardTitle>User Registration</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="Enter your name"
								/>
							</div>

							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									placeholder="Enter your email"
								/>
							</div>

							<div>
								<Label htmlFor="role">Role</Label>
								<Select
									value={formData.role}
									onValueChange={(value) =>
										setFormData({ ...formData, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">Admin</SelectItem>
										<SelectItem value="user">User</SelectItem>
										<SelectItem value="guest">Guest</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="newsletter"
										checked={formData.newsletter}
										onCheckedChange={(checked) =>
											setFormData({ ...formData, newsletter: !!checked })
										}
									/>
									<Label htmlFor="newsletter">Newsletter</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Switch
										id="notifications"
										checked={formData.notifications}
										onCheckedChange={(checked) =>
											setFormData({ ...formData, notifications: !!checked })
										}
									/>
									<Label htmlFor="notifications">Notifications</Label>
								</div>
							</div>

							<div>
								<Label htmlFor="message">Message</Label>
								<Textarea
									id="message"
									value={formData.message}
									onChange={(e) =>
										setFormData({ ...formData, message: e.target.value })
									}
									placeholder="Enter your message"
								/>
							</div>

							<Button type="submit" className="w-full">
								Submit
							</Button>
						</form>
					</CardContent>
				</Card>
			)
		}

		render(<TestForm />)

		// Test form elements are rendered
		expect(screen.getByText('User Registration')).toBeInTheDocument()
		expect(screen.getByLabelText('Name')).toBeInTheDocument()
		expect(screen.getByLabelText('Email')).toBeInTheDocument()
		expect(screen.getByLabelText('Role')).toBeInTheDocument()
		expect(screen.getByLabelText('Newsletter')).toBeInTheDocument()
		expect(screen.getByLabelText('Notifications')).toBeInTheDocument()
		expect(screen.getByLabelText('Message')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()

		// Test form interaction
		await user.type(screen.getByLabelText('Name'), 'John Doe')
		await user.type(screen.getByLabelText('Email'), 'john@example.com')

		// Test select interaction
		await user.click(screen.getByRole('combobox'))
		await user.click(screen.getByText('Admin'))

		// Test checkbox interaction
		await user.click(screen.getByLabelText('Newsletter'))

		// Test switch interaction
		await user.click(screen.getByLabelText('Notifications'))

		// Test textarea interaction
		await user.type(screen.getByLabelText('Message'), 'This is a test message')

		// Verify form state
		expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
		expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
		expect(
			screen.getByDisplayValue('This is a test message'),
		).toBeInTheDocument()
	})
})

// Integration test for data display components
describe('Data Display Integration Tests', () => {
	test('Table with badges and actions should work together', () => {
		const mockData = [
			{ id: 1, name: 'John Doe', status: 'active', role: 'Admin' },
			{ id: 2, name: 'Jane Smith', status: 'inactive', role: 'User' },
			{ id: 3, name: 'Bob Johnson', status: 'pending', role: 'User' },
		]

		const TestTable = () => {
			const [selectedRows, setSelectedRows] = React.useState<number[]>([])

			const toggleRow = (id: number) => {
				setSelectedRows((prev) =>
					prev.includes(id)
						? prev.filter((rowId) => rowId !== id)
						: [...prev, id],
				)
			}

			return (
				<Card>
					<CardHeader>
						<CardTitle>User Management</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Select</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{mockData.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<Checkbox
												checked={selectedRows.includes(user.id)}
												onCheckedChange={() => toggleRow(user.id)}
											/>
										</TableCell>
										<TableCell>{user.name}</TableCell>
										<TableCell>
											<Badge
												variant={
													user.status === 'active'
														? 'active'
														: user.status === 'inactive'
															? 'inactive'
															: 'default'
												}
											>
												{user.status}
											</Badge>
										</TableCell>
										<TableCell>{user.role}</TableCell>
										<TableCell>
											<Button size="sm" variant="outline">
												Edit
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)
		}

		render(<TestTable />)

		// Test table rendering
		expect(screen.getByText('User Management')).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()
		expect(screen.getByText('Jane Smith')).toBeInTheDocument()
		expect(screen.getByText('Bob Johnson')).toBeInTheDocument()

		// Test badges
		expect(screen.getByText('active')).toBeInTheDocument()
		expect(screen.getByText('inactive')).toBeInTheDocument()
		expect(screen.getByText('pending')).toBeInTheDocument()

		// Test checkboxes
		const checkboxes = screen.getAllByRole('checkbox')
		expect(checkboxes).toHaveLength(3)
	})
})

// Integration test for navigation components
describe('Navigation Integration Tests', () => {
	test('Tabs with accordion content should work together', async () => {
		const user = userEvent.setup()

		const TestNavigation = () => {
			const [activeTab, setActiveTab] = React.useState('profile')

			return (
				<Card className="w-96">
					<CardHeader>
						<CardTitle>User Settings</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="profile">Profile</TabsTrigger>
								<TabsTrigger value="account">Account</TabsTrigger>
								<TabsTrigger value="preferences">Preferences</TabsTrigger>
							</TabsList>

							<TabsContent value="profile">
								<div className="space-y-4">
									<h3 className="font-medium text-lg">Profile Information</h3>
									<div>
										<Label htmlFor="display-name">Display Name</Label>
										<Input id="display-name" placeholder="Enter display name" />
									</div>
									<div>
										<Label htmlFor="bio">Bio</Label>
										<Textarea id="bio" placeholder="Tell us about yourself" />
									</div>
								</div>
							</TabsContent>

							<TabsContent value="account">
								<div className="space-y-4">
									<h3 className="font-medium text-lg">Account Settings</h3>
									<Accordion type="single" collapsible>
										<AccordionItem value="security">
											<AccordionTrigger>Security</AccordionTrigger>
											<AccordionContent>
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<Switch id="2fa" />
														<Label htmlFor="2fa">
															Two-factor authentication
														</Label>
													</div>
													<Button variant="outline" size="sm">
														Change Password
													</Button>
												</div>
											</AccordionContent>
										</AccordionItem>
										<AccordionItem value="privacy">
											<AccordionTrigger>Privacy</AccordionTrigger>
											<AccordionContent>
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<Checkbox id="profile-public" />
														<Label htmlFor="profile-public">
															Make profile public
														</Label>
													</div>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							</TabsContent>

							<TabsContent value="preferences">
								<div className="space-y-4">
									<h3 className="font-medium text-lg">Preferences</h3>
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Switch id="notifications" />
											<Label htmlFor="notifications">Email notifications</Label>
										</div>
										<div className="flex items-center space-x-2">
											<Switch id="dark-mode" />
											<Label htmlFor="dark-mode">Dark mode</Label>
										</div>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			)
		}

		render(<TestNavigation />)

		// Test initial tab
		expect(screen.getByText('Profile Information')).toBeInTheDocument()

		// Test tab switching
		await user.click(screen.getByText('Account'))
		expect(screen.getByText('Account Settings')).toBeInTheDocument()
		expect(screen.getByText('Security')).toBeInTheDocument()

		// Test accordion interaction
		await user.click(screen.getByText('Security'))
		expect(screen.getByText('Two-factor authentication')).toBeInTheDocument()

		// Test another tab
		await user.click(screen.getByText('Preferences'))
		expect(screen.getByText('Preferences')).toBeInTheDocument()
		expect(screen.getByText('Email notifications')).toBeInTheDocument()
	})
})

// Integration test for modal components
describe('Modal Integration Tests', () => {
	test('Dialog with form should work together', async () => {
		const user = userEvent.setup()

		const TestModal = () => {
			const [open, setOpen] = React.useState(false)
			const [formData, setFormData] = React.useState({ name: '', email: '' })

			const handleSubmit = (e: React.FormEvent) => {
				e.preventDefault()
				console.log('Modal form submitted:', formData)
				setOpen(false)
			}

			return (
				<div>
					<Button onClick={() => setOpen(true)}>Open Modal</Button>

					<Dialog open={open} onOpenChange={setOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New User</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<Label htmlFor="modal-name">Name</Label>
									<Input
										id="modal-name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="Enter name"
									/>
								</div>
								<div>
									<Label htmlFor="modal-email">Email</Label>
									<Input
										id="modal-email"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder="Enter email"
									/>
								</div>
								<div className="flex justify-end space-x-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => setOpen(false)}
									>
										Cancel
									</Button>
									<Button type="submit">Create User</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			)
		}

		render(<TestModal />)

		// Test modal trigger
		expect(screen.getByText('Open Modal')).toBeInTheDocument()

		// Test modal opening
		await user.click(screen.getByText('Open Modal'))
		expect(screen.getByText('Create New User')).toBeInTheDocument()

		// Test form interaction
		await user.type(screen.getByLabelText('Name'), 'Test User')
		await user.type(screen.getByLabelText('Email'), 'test@example.com')

		expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
		expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()

		// Test modal closing
		await user.click(screen.getByText('Cancel'))
		expect(screen.queryByText('Create New User')).not.toBeInTheDocument()
	})
})

// Integration test for theme consistency
describe('Theme Integration Tests', () => {
	test('All components should use consistent MBC theme', () => {
		const TestTheme = () => (
			<div className="space-y-4 p-4">
				<div className="flex gap-2">
					<Button variant="default">Default</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="secondary">Secondary</Button>
				</div>

				<div className="flex gap-2">
					<Badge variant="default">Default</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="secondary">Secondary</Badge>
				</div>

				<Card className="w-64">
					<CardHeader>
						<CardTitle>Theme Test</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Input placeholder="Test input" />
							<Textarea placeholder="Test textarea" />
							<div className="flex items-center space-x-2">
								<Checkbox id="test-checkbox" />
								<Label htmlFor="test-checkbox">Test checkbox</Label>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		)

		render(<TestTheme />)

		// Test that all components render without errors
		expect(screen.getByText('Default')).toBeInTheDocument()
		expect(screen.getByText('Destructive')).toBeInTheDocument()
		expect(screen.getByText('Outline')).toBeInTheDocument()
		expect(screen.getByText('Secondary')).toBeInTheDocument()
		expect(screen.getByText('Theme Test')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Test textarea')).toBeInTheDocument()
	})
})
