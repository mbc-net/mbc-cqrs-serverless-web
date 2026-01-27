# Master Management UI Library

This repository contains a comprehensive UI library built with Next.js, React, and TypeScript for managing master data and master settings. It provides a set of reusable components designed to build powerful and flexible administration interfaces. The library is structured as a package within a Next.js application, which also serves as a live demonstration environment.

---

## Core Components

The library is centered around four main components that provide the full CRUD (Create, Read, Update, Delete) functionality for master settings and their corresponding data.

### 1\. `MasterSetting`

This component renders a list of all available master setting definitions. It features searching and pagination capabilities to easily navigate through numerous settings. From here, users can select a setting to view its associated data or create a new setting definition.

### 2\. `EditMasterSettings`

This is the powerhouse for defining the structure of your master data. It provides a form to create or edit a "master setting." Key features include:

- Defining basic information like a unique `code` and `name`.
- A dynamic **Fields Table** where you can add, remove, reorder, and edit the fields that will make up the master data records.

### 3\. `MasterData`

Once a master setting is selected, this component displays all the data records that conform to that setting's schema. It includes:

- A powerful data table with server-side pagination and sorting.
- Advanced search and filtering capabilities based on the fields defined in the master setting.
- Options to create new data records or navigate to edit existing ones.

### 4\. `EditMasterData`

This component renders a form that is **dynamically generated** based on the fields defined in the associated master setting. It allows users to create a new master data record or edit an existing one.

---

## Key Features

- **Dynamic Form Generation**: Forms in `EditMasterData` are created on-the-fly based on field definitions from a `MasterSetting`, ensuring data integrity and consistency.
- **Rich Field Types**: Supports a wide variety of data types for master data fields, including:
  - `string`, `number`, `boolean`, `date`
  - `array` (for a list of strings)
  - `json` (with a built-in JSON editor)
  - `text-area`, `text-html` (rich text editor), and `text-markdown`
  - `auto_number` for automatically generating sequential codes.
- **Advanced Data Table**: The data tables for both settings and data come with robust features like server-side pagination, sorting, and filtering to handle large datasets efficiently.
- **Role-Based UI**: The root layout and URL structure are designed to support different user segments, such as `system_admin` and `tenant`, allowing for tailored user experiences.
- **Bulk & Raw Data Handling**: A `JSONEditorComponent` is available for creating or editing both settings and data via raw JSON, which is ideal for bulk imports or complex data structures.
- **Asynchronous Task Monitoring**: Uses AWS AppSync Subscriptions to provide real-time feedback for long-running operations like data deletion or copying data across tenants.
- **Data Portability**: Includes functionality for system administrators to copy master settings and their associated data to other tenants.

---

## Using the Library in Your Project

When integrating this library into your own Next.js App Router project, follow the **Layout-based Provider Pattern** to avoid common issues like `httpClient.get is not a function`.

### Quick Start

1. **Install the package:**

    ```bash
    npm install @mbc-cqrs-serverless/master-web
    ```

2. **Create a layout file** (`app/admin/[tenant]/master/layout.tsx`):

    ```tsx
    'use client'

    import { useMemo } from 'react'
    import dynamic from 'next/dynamic'
    import { useParams } from 'next/navigation'
    import axios from 'axios'
    import { fetchAuthSession } from 'aws-amplify/auth'
    import type { IUrlProvider } from '@mbc-cqrs-serverless/master-web/UrlProvider'

    const AppProviders = dynamic(
      () => import('@mbc-cqrs-serverless/master-web/AppProviders').then((mod) => mod.AppProviders),
      { ssr: false }
    )

    // Implement IUrlProvider for your application's routing
    class MasterUrlProvider implements IUrlProvider {
      // ... (define all required URL properties)
    }

    export default function MasterLayout({ children }: { children: React.ReactNode }) {
      const params = useParams<{ tenant: string }>()
      const tenantCode = params?.tenant || 'common'

      const urlProvider = useMemo(() => new MasterUrlProvider(tenantCode), [tenantCode])

      const httpClient = useMemo(() => {
        const instance = axios.create({
          baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`,
          headers: { 'Content-Type': 'application/json', 'x-tenant-code': tenantCode },
        })

        // Add interceptor for automatic auth token injection
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

      const user = useMemo(() => ({ tenantCode, tenantRole: 'admin' }), [tenantCode])

      return (
        <AppProviders user={user} urlProvider={urlProvider} httpClient={httpClient}>
          {children}
        </AppProviders>
      )
    }
    ```

3. **Create page files** with dynamic imports:

    ```tsx
    // app/admin/[tenant]/master/master-setting/page.tsx
    'use client'

    import dynamic from 'next/dynamic'
    import MsLayout from '@mbc-cqrs-serverless/master-web/MsLayout'
    import '@mbc-cqrs-serverless/master-web/styles.css'

    const MasterSetting = dynamic(
      () => import('@mbc-cqrs-serverless/master-web/MasterSetting').then((mod) => mod.default),
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

### Why This Pattern?

- **Avoids Context Isolation**: React Context in npm packages can become isolated from the app's context. Setting up providers in a Layout ensures context is initialized before child components mount.
- **Synchronous httpClient**: Using `useMemo` creates httpClient synchronously, avoiding race conditions.
- **Automatic Auth Tokens**: Axios interceptors inject the latest auth token on every request.

### Documentation

For detailed documentation including all components, hooks, URL provider configuration, and troubleshooting, see the [official documentation](https://mbc-cqrs-serverless.mbc-net.com/docs/master-web).

---

## Running the Demo Application

The included Next.js application serves as a demonstration of the UI library's capabilities.

**Prerequisites:**

- Node.js
- npm, yarn, or pnpm

### Steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project and add the necessary API endpoints.

    ```env
    # Example
    NEXT_PUBLIC_MASTER_API_BASE=http://your-api-server.com
    NEXT_PUBLIC_MASTER_APPSYNC_URL=wss://your.appsync-api.us-east-1.amazonaws.com/graphql
    NEXT_PUBLIC_MASTER_APPSYNC_APIKEY=your-appsync-api-key
    NEXT_PUBLIC_MASTER_APPSYNC_REGION=us-east-1
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:8888`.

5.  **Access the Application:**
    Upon visiting the application, you will be prompted to enter a **Bearer Token** and select a user **Segment** (`system_admin` or `tenant`). This is required to initialize the API clients and user context for the demo.

---

## Building the Library

To use this library in other projects, you can build it into a distributable package.

1.  **Run the build command:**
    ```bash
    npm run build
    ```
2.  **Output:**
    The compiled and bundled library files will be located in the `dist/` directory. This directory is ready to be published to a package registry like npm or consumed locally in another project.

The build process uses `tsup` and a custom `postbuild.js` script to ensure that all client-side components are correctly marked with the `"use client"` directive for compatibility with the Next.js App Router.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Data Fetching**: [Axios](https://axios-http.com/) (for REST APIs) & [Apollo Client](https://www.apollographql.com/docs/react/) (for AWS AppSync GraphQL Subscriptions)
- **State Management**: React Context API
- **Component Bundler**: [tsup](https://tsup.egoist.dev/)
