# Table

A flexible table component for displaying structured data with sorting, selection, and responsive design.

## Import

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'
// or for server components
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui/server'
```

## Basic Usage

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

## Table with Data

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function DataTable() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Table with Actions

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'

export default function ActionTable() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Table with Status

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'

export default function StatusTable() {
  const orders = [
    { id: 1, product: 'Laptop', status: 'shipped', amount: '$999' },
    { id: 2, product: 'Mouse', status: 'pending', amount: '$29' },
    { id: 3, product: 'Keyboard', status: 'delivered', amount: '$79' },
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'shipped': return 'invited'
      case 'pending': return 'un_selected'
      case 'delivered': return 'active'
      default: return 'default'
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{order.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Sortable Table

```tsx
import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export default function SortableTable() {
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ]

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => handleSort('name')}
              className="h-auto p-0 font-semibold"
            >
              Name {getSortIcon('name')}
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => handleSort('email')}
              className="h-auto p-0 font-semibold"
            >
              Email {getSortIcon('email')}
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => handleSort('role')}
              className="h-auto p-0 font-semibold"
            >
              Role {getSortIcon('role')}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Responsive Table

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function ResponsiveTable() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901' },
  ]

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell className="hidden md:table-cell">{item.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

## Props

### Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### TableHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### TableHead Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### TableBody Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### TableRow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### TableCell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Styling

The Table component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-muted: #your-muted-color;
  --mbc-color-muted-foreground: #your-muted-text-color;
  --mbc-spacing-4: 16px;
  --mbc-spacing-2: 8px;
}
```

## Accessibility

- ✅ Semantic HTML table structure
- ✅ Proper heading hierarchy
- ✅ Screen reader support
- ✅ Keyboard navigation
- ✅ High contrast support

## Examples

### Data Table with Pagination

```tsx
import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const allData = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }))

  const totalPages = Math.ceil(allData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = allData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, allData.length)} of {allData.length} results
        </p>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### Expandable Rows

```tsx
import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { ChevronDown, ChevronRight } from 'lucide-react'

export default function ExpandableTable() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const data = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      details: 'Senior Developer with 5 years experience'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      details: 'Product Manager with 3 years experience'
    },
  ]

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <>
            <TableRow key={item.id}>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toggleRow(item.id)}
                >
                  {expandedRows.has(item.id) ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </Button>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
            {expandedRows.has(item.id) && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell colSpan={2} className="bg-gray-50">
                  <p className="text-sm text-gray-600">{item.details}</p>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  )
}
```
