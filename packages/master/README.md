# @mbc-cqrs-serverless/master-web

A comprehensive React component library for building master data management interfaces, designed for Next.js applications using the [MBC CQRS Serverless](https://github.com/mbc-net/mbc-cqrs-serverless) framework.

## Features

- **Dynamic Form Generation** - Forms are automatically generated based on master setting field definitions
- **Rich Field Types** - `string`, `number`, `boolean`, `date`, `array`, `json`, `text-area`, `text-html` (rich text), `text-markdown`, `auto_number`
- **Advanced Data Table** - Server-side pagination, sorting, and filtering powered by TanStack Table
- **Drag & Drop** - Reorder fields in master settings with dnd-kit
- **Real-time Updates** - AWS AppSync subscriptions for async task monitoring
- **Role-Based UI** - Support for `system_admin` and `tenant` user segments
- **Bulk Operations** - JSON editor for bulk imports and raw data handling
- **Data Portability** - Copy master settings and data across tenants
- **TypeScript** - Full type definitions included

## Installation

```bash
npm install @mbc-cqrs-serverless/master-web
```

## Core Components

| Component            | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `MasterSetting`      | List of master setting definitions with search and pagination                |
| `EditMasterSettings` | Form for creating/editing master setting schemas with a dynamic fields table |
| `MasterData`         | Data table for records conforming to a master setting's schema               |
| `EditMasterData`     | Dynamically generated form for creating/editing master data records          |
| `AppProviders`       | Provider setup component wrapping all required contexts                      |
| `MsLayout`           | Layout wrapper with optional loading indicator                               |
| `UrlProvider`        | URL routing configuration interface (`IUrlProvider`)                         |

## Quick Start

### 1. Create a layout file

Set up providers in a layout to ensure context is initialized before child components mount.

```tsx
// app/admin/[tenant]/master/layout.tsx
'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import type { IUrlProvider } from '@mbc-cqrs-serverless/master-web/UrlProvider'

const AppProviders = dynamic(
  () =>
    import('@mbc-cqrs-serverless/master-web/AppProviders').then(
      (mod) => mod.AppProviders
    ),
  { ssr: false }
)

// Implement IUrlProvider for your application's routing
class MasterUrlProvider implements IUrlProvider {
  // ... define all required URL properties
}

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ tenant: string }>()
  const tenantCode = params?.tenant || 'common'

  const urlProvider = useMemo(
    () => new MasterUrlProvider(tenantCode),
    [tenantCode]
  )

  const httpClient = useMemo(() => {
    const instance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-code': tenantCode,
      },
    })

    instance.interceptors.request.use(async (config) => {
      try {
        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch {}
      return config
    })

    return instance
  }, [tenantCode])

  const user = useMemo(
    () => ({ tenantCode, tenantRole: 'admin' }),
    [tenantCode]
  )

  return (
    <AppProviders user={user} urlProvider={urlProvider} httpClient={httpClient}>
      {children}
    </AppProviders>
  )
}
```

### 2. Create page files

```tsx
// app/admin/[tenant]/master/master-setting/page.tsx
'use client'

import dynamic from 'next/dynamic'
import MsLayout from '@mbc-cqrs-serverless/master-web/MsLayout'
import '@mbc-cqrs-serverless/master-web/styles.css'

const MasterSetting = dynamic(
  () =>
    import('@mbc-cqrs-serverless/master-web/MasterSetting').then(
      (mod) => mod.default
    ),
  { ssr: false }
)

export default function MasterSettingPage() {
  return (
    <MsLayout useLoading>
      <MasterSetting />
    </MsLayout>
  )
}
```

### Why use dynamic imports and the Layout-based Provider Pattern?

- **Avoids Context Isolation** - React Context in npm packages can become isolated from the app's context. Setting up providers in a Layout ensures context is initialized before child components mount.
- **Synchronous httpClient** - Using `useMemo` creates httpClient synchronously, avoiding race conditions.
- **Automatic Auth Tokens** - Axios interceptors inject the latest auth token on every request.

## Subpath Exports

Import only what you need:

```tsx
import '@mbc-cqrs-serverless/master-web/styles.css'
import MsLayout from '@mbc-cqrs-serverless/master-web/MsLayout'
import { AppProviders } from '@mbc-cqrs-serverless/master-web/AppProviders'
import type { IUrlProvider } from '@mbc-cqrs-serverless/master-web/UrlProvider'
```

## Peer Dependencies

```bash
npm install next@^14.0.0 react@^18.0.0 react-dom@^18.0.0
```

## Documentation

For detailed documentation including all components, hooks, URL provider configuration, and troubleshooting, see the [official documentation](https://mbc-cqrs-serverless.mbc-net.com/docs/master-web).

## License

MIT - [Murakami Business Consulting, Inc.](https://www.mbc-net.com/)
