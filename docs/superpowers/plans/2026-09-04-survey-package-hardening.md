# Survey Package Hardening — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làm cho `@mbc-cqrs-serverless/survey-web` cài xong là chạy được, CSS không rò rỉ hai chiều, khoá câu hỏi là định danh ổn định, và `dist` đọc được.

**Architecture:** Bundle toàn bộ `dependencies` vào `dist`, chỉ để `react`/`react-dom`/`next`/`next-themes` là peer; gỡ `aws-amplify` khỏi lõi bằng một `SurveyConfigProvider` tiêm cấu hình từ host; dựng lại tầng design token Tailwind rồi scope toàn bộ CSS vào class `.mbc-survey` bằng `postcss-prefix-selector`; rút `dist` từ 5 entry + splitting xuống 2 entry không splitting.

**Tech Stack:** TypeScript, React 18, Next 14, tsup 8 (esbuild), Tailwind CSS 3.4, PostCSS, Radix UI, react-hook-form, zod, Jest + @swc/jest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-09-04-survey-package-hardening-design.md`

## Global Constraints

- Phạm vi là `packages/survey` trong repo `/data/Workspace/msu/mbc-cqrs-serverless-web`, cộng app tiêu thụ `/data/Workspace/mcp/mebs-builshiru-web` (chỉ Task 12). **Không đụng `packages/master`.**
- Không có dữ liệu production. Breaking change được phép, không cần migration.
- **Giữ Tailwind CSS v3** (`3.4.19` đang cài). Không nâng lên v4 — v4 bỏ `tailwind.config.js` và đổi cách PostCSS chạy, sẽ phá toàn bộ thiết kế ở mục 3.3 của spec.
- Class wrapper cách ly CSS là `mbc-survey`, hằng số export tại `SURVEY_ROOT_CLASS`.
- Prefix CSS dùng **class lặp**: `.mbc-survey.mbc-survey`.
- Chỉ 4 package được external: `react`, `react-dom`, `next`, `next-themes` (cộng các subpath `react/jsx-runtime`, `next/navigation`). Mọi thứ khác bundle.
- `dist` không minify, giữ `sourcemap: true`, giữ cả hai format `cjs` và `esm`.
- Message commit theo Conventional Commits (repo có commitlint + husky). `lint-staged` chạy `prettier --write` khi commit — không cần format thủ công.
- Chạy lệnh từ `packages/survey` trừ khi ghi rõ khác.
- Làm trên nhánh riêng: `git checkout -b feat/survey-package-hardening` trước Task 1.

---

## Cấu trúc file

**Tạo mới trong `packages/survey`:**

| File                                     | Trách nhiệm                                                                                    |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/utils/id.ts`                        | Sinh id ổn định, không trùng (`createId`)                                                      |
| `src/config/context.tsx`                 | `SurveyConfig`, `SurveyConfigProvider`, `useSurveyConfig`, `useTenantCode`, `useAppSyncClient` |
| `src/ui/survey-root.tsx`                 | `SURVEY_ROOT_CLASS`, `SurveyRoot` — thẻ div cách ly CSS                                        |
| `src/styles.css`                         | Biến CSS design token + directive Tailwind                                                     |
| `scripts/verify-dist.js`                 | Khẳng định `dist/styles.css` đã scope và có đủ token                                           |
| `__tests__/dependencies.test.ts`         | Quét import so với `package.json`                                                              |
| `__tests__/id.test.ts`                   | `createId` không trùng                                                                         |
| `__tests__/question-creator-id.test.tsx` | Id bất biến khi sửa label                                                                      |
| `__tests__/survey-form.test.tsx`         | Payload `onSubmit` và tham số `meta`                                                           |

**Sửa trong `packages/survey`:**

| File                                                                                       | Thay đổi                                                 |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `package.json`                                                                             | deps, peerDeps, `sideEffects`, `exports`, scripts        |
| `tailwind.config.js`                                                                       | `theme.extend.colors`, `borderRadius`, plugin animate    |
| `src/styles.ts`                                                                            | Import `./styles.css` thay vì `tailwindcss/tailwind.css` |
| `tsup.config.ts`                                                                           | Entry, splitting, jsx, prefixSelector, xử lý lỗi         |
| `postbuild.js`                                                                             | Chuyển sang đồng bộ, export hàm                          |
| `src/types/schema.ts`                                                                      | `superRefine` id không trùng                             |
| `src/forms/survey-form.tsx`                                                                | `SurveyRoot`, tham số `meta`                             |
| `src/creators/survey-creator.tsx`                                                          | `createId` (3 chỗ)                                       |
| `src/creators/question-creators/question-creator.tsx`                                      | Xoá effect đồng bộ label→id, `createId`                  |
| `src/creators/section-creators/section-header-creator.tsx`                                 | `createId`                                               |
| `src/client/http/index.ts`                                                                 | `useSurveyHttpClient`                                    |
| `src/client/http/config.ts`                                                                | **Xoá**                                                  |
| `src/client/appsync/index.ts`                                                              | `createAppSyncClient`                                    |
| `src/client/appsync/useSubscribeMessage.ts`                                                | Dùng context                                             |
| `src/hooks/use-*.ts` (3 file)                                                              | Dùng `useSurveyHttpClient`                               |
| `src/modules/*/templates/index.tsx` (2 file)                                               | Bọc `SurveyRoot`                                         |
| `src/ui/{dialog,alert-dialog,select,select-table,popover,tooltip,dropdown-menu,sheet}.tsx` | Bọc `SurveyRoot` trong Portal                            |
| `src/index.ts`                                                                             | Export `SurveyConfigProvider`, `SURVEY_ROOT_CLASS`, kiểu |

---

### Task 1: Dọn dependency và dựng lưới an toàn

Đây là task đầu vì nó biến "cài xong crash" thành một test fail được, và mọi task sau đều dựa trên `package.json` đã đúng.

**Files:**

- Modify: `packages/survey/package.json`
- Test: `packages/survey/__tests__/dependencies.test.ts`

**Interfaces:**

- Consumes: không có.
- Produces: `package.json` với `dependencies` đầy đủ và `peerDependencies` = `react`, `react-dom`, `next`, `next-themes`. Task 11 dựa vào danh sách này để tính `external`/`noExternal`.

- [ ] **Step 1: Viết test quét dependency**

Tạo `packages/survey/__tests__/dependencies.test.ts`:

```ts
import fs from 'fs'
import path from 'path'

const pkg = require('../package.json')
const SRC = path.join(__dirname, '..', 'src')

const IMPORT_RE = /(?:from\s+|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/g

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.tsx?$/.test(entry.name) ? [full] : []
  })
}

/** '@scope/pkg/sub' -> '@scope/pkg'; 'pkg/sub' -> 'pkg'; relative/alias/builtin -> null */
function packageNameOf(spec: string): string | null {
  if (spec.startsWith('.') || spec.startsWith('/')) return null
  if (spec.startsWith('@/')) return null // alias nội bộ, xem tsconfig paths
  if (spec.startsWith('node:')) return null
  if (spec.startsWith('@')) {
    const [scope, name] = spec.split('/')
    return name ? `${scope}/${name}` : null
  }
  return spec.split('/')[0]
}

function collectImportedPackages(): Set<string> {
  const found = new Set<string>()
  for (const file of walk(SRC)) {
    const source = fs.readFileSync(file, 'utf8')
    for (const match of source.matchAll(IMPORT_RE)) {
      const name = packageNameOf(match[1])
      if (name) found.add(name)
    }
  }
  return found
}

describe('package.json dependency hygiene', () => {
  const imported = collectImportedPackages()
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ])

  it('declares every package imported from src', () => {
    const missing = [...imported].filter((name) => !declared.has(name)).sort()
    expect(missing).toEqual([])
  })

  it('does not declare runtime dependencies that src never imports', () => {
    const unused = Object.keys(pkg.dependencies ?? {})
      .filter((name) => !imported.has(name))
      .sort()
    expect(unused).toEqual([])
  })

  it('does not declare react, react-dom or next as runtime dependencies', () => {
    const runtime = Object.keys(pkg.dependencies ?? {})
    expect(runtime).not.toContain('react')
    expect(runtime).not.toContain('react-dom')
    expect(runtime).not.toContain('next')
  })

  it('marks css as the only side effect', () => {
    expect(pkg.sideEffects).toEqual(['*.css'])
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd packages/survey && npx jest __tests__/dependencies.test.ts`

Expected: FAIL cả 4 test.

- test 1 báo `missing` = `["@dnd-kit/utilities", "@radix-ui/react-collapsible", "nuqs", "usehooks-ts"]`
- test 2 báo `unused` chứa `@tanstack/react-table`, `react-dom`, `tailwindcss-animate`
- test 3 báo `react` có trong dependencies
- test 4 báo `undefined` không bằng `["*.css"]`

- [ ] **Step 3: Sửa `package.json`**

Trong `packages/survey/package.json`:

Thêm 4 dòng vào `dependencies` (giữ thứ tự alphabet):

```json
    "@dnd-kit/utilities": "^3.2.2",
    "@radix-ui/react-collapsible": "^1.1.10",
    "nuqs": "^2.0.0",
    "usehooks-ts": "^3.1.1",
```

Xoá khỏi `dependencies`: `"@tanstack/react-table"`, `"next"`, `"react"`, `"react-dom"`, `"tailwindcss-animate"`.

Thêm `"tailwindcss-animate": "^1.0.7"` vào `devDependencies` (nó là plugin build, Task 6 sẽ nạp).

Thêm `"postcss-prefix-selector": "^2.1.0"` vào `devDependencies` (Task 8 dùng).

Đổi khối `peerDependencies` thành:

```json
  "peerDependencies": {
    "next": "^14.0.0",
    "next-themes": "^0.4.6",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "next-themes": {
      "optional": true
    }
  },
```

Xoá `"next-themes": "^0.4.6"` khỏi `dependencies` (nó chuyển sang peer).

Thêm ngay sau `"files"`:

```json
  "sideEffects": [
    "*.css"
  ],
```

- [ ] **Step 4: Cài lại và chạy test**

Run:

```bash
cd /data/Workspace/msu/mbc-cqrs-serverless-web && npm install
cd packages/survey && npx jest __tests__/dependencies.test.ts
```

Expected: PASS cả 4 test.

- [ ] **Step 5: Chạy toàn bộ test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: mọi test PASS, `tsc` không báo lỗi.

- [ ] **Step 6: Commit**

```bash
git add packages/survey/package.json packages/survey/__tests__/dependencies.test.ts package-lock.json
git commit -m "fix(survey): declare all imported dependencies and guard with a test

nuqs, usehooks-ts, @dnd-kit/utilities and @radix-ui/react-collapsible were
imported from src but never declared, resolving only through lerna
hoisting. Drops @tanstack/react-table (unused), moves react/react-dom/next
to peerDependencies only, and marks CSS as the sole side effect."
```

---

### Task 2: `createId` và bỏ đồng bộ label → id

**Files:**

- Create: `packages/survey/src/utils/id.ts`
- Modify: `packages/survey/src/utils/index.ts`
- Modify: `packages/survey/src/creators/question-creators/question-creator.tsx:148-153` (xoá effect), `:159`
- Modify: `packages/survey/src/creators/survey-creator.tsx:121`, `:290`, `:299`
- Modify: `packages/survey/src/creators/section-creators/section-header-creator.tsx:85-87`
- Test: `packages/survey/__tests__/id.test.ts`

**Interfaces:**

- Consumes: không có.
- Produces: `createId(prefix: 'q' | 'sec'): string` từ `src/utils/id.ts`, re-export qua `src/utils/index.ts`. Task 3 và Task 4 giả định id câu hỏi có dạng `q_<timestamp>_<counter><random>`.

- [ ] **Step 1: Viết test cho `createId`**

Tạo `packages/survey/__tests__/id.test.ts`:

```ts
import { createId } from '../src/utils/id'

describe('createId', () => {
  it('prefixes question ids with q_', () => {
    expect(createId('q')).toMatch(/^q_/)
  })

  it('prefixes section ids with sec_', () => {
    expect(createId('sec')).toMatch(/^sec_/)
  })

  it('never collides across a tight loop', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 10_000; i++) {
      ids.add(createId('q'))
    }
    expect(ids.size).toBe(10_000)
  })

  it('keeps question and section ids in separate namespaces', () => {
    const question = createId('q')
    const section = createId('sec')
    expect(question).not.toBe(section)
    expect(question.startsWith('sec_')).toBe(false)
  })

  it('produces ids usable as react-hook-form field names', () => {
    // RHF treats '.' and '[' as path separators, so an id must contain neither.
    const id = createId('q')
    expect(id).not.toMatch(/[.[\]]/)
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd packages/survey && npx jest __tests__/id.test.ts`

Expected: FAIL — `Cannot find module '../src/utils/id'`.

- [ ] **Step 3: Viết `createId`**

Tạo `packages/survey/src/utils/id.ts`:

```ts
let counter = 0

/**
 * Creates a stable, collision-free identifier for a survey item.
 *
 * Question and section ids are also react-hook-form field names and the
 * targets of `nextSectionId`, so two items sharing an id silently merge
 * into a single form field. `Date.now()` alone collides whenever two items
 * are created within the same millisecond, which duplication and keyboard
 * shortcuts both do.
 */
export function createId(prefix: 'q' | 'sec'): string {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now()}_${counter}${random}`
}
```

- [ ] **Step 4: Re-export qua `src/utils/index.ts`**

Thêm dòng vào `packages/survey/src/utils/index.ts`:

```ts
export * from './id'
```

- [ ] **Step 5: Chạy test để xác nhận nó pass**

Run: `cd packages/survey && npx jest __tests__/id.test.ts`

Expected: PASS cả 5 test.

- [ ] **Step 6: Xoá effect đồng bộ label → id**

Trong `packages/survey/src/creators/question-creators/question-creator.tsx`, xoá nguyên khối này (khoảng dòng 147-153):

```tsx
// Sync question ID with question label
useEffect(() => {
  if (questionLabelValue) {
    setValue(`${itemPath}.id`, questionLabelValue)
  }
}, [questionLabelValue, itemPath, setValue])
```

- [ ] **Step 7: Thay 5 chỗ sinh id bằng `createId`**

`packages/survey/src/creators/question-creators/question-creator.tsx` — thêm import:

```tsx
import { cn, createId } from '../../utils'
```

(file đang có `import { cn } from '../../utils'` — gộp vào dòng đó)

rồi dòng `id: \`q\_${Date.now()}\`,`trong`handleDuplicate` thành:

```tsx
      id: createId('q'),
```

`packages/survey/src/creators/survey-creator.tsx` — thêm `createId` vào import từ `../utils`, rồi:

dòng 121 `const newId = \`sec\_${Date.now()}\`` →

```tsx
const newId = createId('sec')
```

dòng 290 `id: \`sec\_${Date.now()}\`,` →

```tsx
        id: createId('sec'),
```

dòng 299 `id: \`q\_${Date.now()}\`,` →

```tsx
        id: createId('q'),
```

`packages/survey/src/creators/section-creators/section-header-creator.tsx` — thêm import `createId` từ `../../utils`, rồi thay khối:

```tsx
const newId = `${
  item.type === 'section-header' ? 'sec' : 'q'
}_${Date.now() + i}`
```

bằng:

```tsx
const newId = createId(item.type === 'section-header' ? 'sec' : 'q')
```

Biến `i` của `.map((item, i) => …)` giờ không dùng nữa — đổi thành `.map((item) => …)`.

- [ ] **Step 8: Xác nhận không còn chỗ nào sinh id thủ công**

Run: `cd packages/survey && grep -rn 'Date.now()' src/creators/`

Expected: không có kết quả nào.

- [ ] **Step 9: Chạy test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: mọi test PASS, `tsc` không báo lỗi. Nếu `tsc` báo `useEffect` khai mà không dùng trong `question-creator.tsx`, kiểm tra xem còn `useEffect` nào khác trong file không — nếu không còn, bỏ nó khỏi import `react`.

- [ ] **Step 10: Commit**

```bash
git add packages/survey/src/utils/id.ts packages/survey/src/utils/index.ts packages/survey/src/creators packages/survey/__tests__/id.test.ts
git commit -m "fix(survey): use stable generated ids for questions and sections

A useEffect in question-creator overwrote each question's id with its own
label text on every keystroke, so the answer payload was keyed by question
text and branching targets moved whenever a label was edited. Replaces the
Date.now() generators with createId, which cannot collide within a
millisecond."
```

---

### Task 3: Chặn id trùng ở tầng schema

**Files:**

- Modify: `packages/survey/src/types/schema.ts` (khối `SurveySchema` cuối file)
- Test: `packages/survey/__tests__/schema.test.ts`

**Interfaces:**

- Consumes: không có (độc lập với `createId`).
- Produces: `SurveySchema` từ chối schema có id trùng. `validateSurveyJson` trả `success: false` với `error.issues[0].path` trỏ tới `['items', <index>, 'id']`.

- [ ] **Step 1: Viết test**

Thêm vào cuối `packages/survey/__tests__/schema.test.ts`, trong file đã có sẵn (giữ nguyên nội dung cũ):

```ts
describe('SurveySchema duplicate id detection', () => {
  const withIds = (ids: string[]) => ({
    title: 'Duplicate id survey',
    items: ids.map((id) => ({
      id,
      type: 'short-text' as const,
      label: `Question ${id}`,
    })),
  })

  it('accepts a survey whose item ids are all distinct', () => {
    expect(SurveySchema.safeParse(withIds(['q_1', 'q_2'])).success).toBe(true)
  })

  it('rejects a survey with two items sharing an id', () => {
    const result = SurveySchema.safeParse(withIds(['q_1', 'q_1']))
    expect(result.success).toBe(false)
  })

  it('reports the duplicate on the second occurrence', () => {
    const result = SurveySchema.safeParse(withIds(['q_1', 'q_2', 'q_1']))
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues[0].path).toEqual(['items', 2, 'id'])
  })

  it('detects a question id colliding with a section id', () => {
    const result = SurveySchema.safeParse({
      title: 'Mixed',
      items: [
        { id: 'dup', type: 'section-header', title: 'Section' },
        { id: 'dup', type: 'short-text', label: 'Question' },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('still allows hand-authored ids that do not use the q_ prefix', () => {
    expect(SurveySchema.safeParse(withIds(['email', 'age'])).success).toBe(true)
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd packages/survey && npx jest __tests__/schema.test.ts -t 'duplicate id'`

Expected: FAIL — các test "rejects", "reports", "detects" fail vì `success` đang là `true`.

- [ ] **Step 3: Thêm `superRefine` vào `SurveySchema`**

Trong `packages/survey/src/types/schema.ts`, thay khối:

```ts
export const SurveySchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    items: z.array(SurveyItemSchema),
  })
  .strip()
```

bằng:

```ts
export const SurveySchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    items: z.array(SurveyItemSchema),
  })
  .strip()
  .superRefine((survey, ctx) => {
    // Item ids double as react-hook-form field names and as the targets of
    // `nextSectionId`, so two items sharing an id silently collapse into one
    // form field.
    const seen = new Set<string>()
    survey.items.forEach((item, index) => {
      if (seen.has(item.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['items', index, 'id'],
          message: `Duplicate item id "${item.id}".`,
        })
        return
      }
      seen.add(item.id)
    })
  })
```

- [ ] **Step 4: Chạy test để xác nhận nó pass**

Run: `cd packages/survey && npx jest __tests__/schema.test.ts`

Expected: PASS toàn bộ file, gồm cả các test cũ.

- [ ] **Step 5: Type-check**

Run: `cd packages/survey && npx tsc --noEmit`

Expected: không lỗi. Lưu ý `SurveySchemaType` vẫn suy ra đúng vì `superRefine` không đổi kiểu output.

- [ ] **Step 6: Commit**

```bash
git add packages/survey/src/types/schema.ts packages/survey/__tests__/schema.test.ts
git commit -m "feat(survey): reject surveys with duplicate item ids

Two items sharing an id collapse into a single react-hook-form field and
make nextSectionId ambiguous. Validation stays permissive about the id
format so hand-authored schemas keep working."
```

---

### Task 4: Id bất biến khi sửa label, và tham số `meta` cho `onSubmit`

**Files:**

- Modify: `packages/survey/src/forms/survey-form.tsx`
- Test: `packages/survey/__tests__/question-creator-id.test.tsx`, `packages/survey/__tests__/survey-form.test.tsx`

**Interfaces:**

- Consumes: `createId` (Task 2).
- Produces: kiểu `SurveyAnswerMeta` export từ `src/forms/survey-form.tsx`; chữ ký `onSubmit(answers, meta)`. Task 12 dựa vào việc tham số đầu **không đổi**.

- [ ] **Step 1: Viết test regression cho id**

Tạo `packages/survey/__tests__/question-creator-id.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import type { SurveySchemaType } from '../src/types/schema'

/**
 * Minimal stand-in for the label field that question-creator renders. The
 * regression being guarded is that editing the label must not touch the id,
 * which lived in a useEffect in question-creator.tsx.
 */
function LabelEditor({ onState }: { onState: (s: SurveySchemaType) => void }) {
  const methods = useForm<SurveySchemaType>({
    defaultValues: {
      title: 'Survey',
      items: [{ id: 'q_seed', type: 'short-text', label: '' }],
    },
  })
  onState(methods.getValues())
  return (
    <FormProvider {...methods}>
      <input
        aria-label="question label"
        {...methods.register('items.0.label')}
      />
      <button type="button" onClick={() => onState(methods.getValues())}>
        read
      </button>
    </FormProvider>
  )
}

describe('question label editing', () => {
  it('leaves the question id untouched when the label changes', () => {
    let state: SurveySchemaType | undefined
    render(<LabelEditor onState={(s) => (state = s)} />)

    fireEvent.change(screen.getByLabelText('question label'), {
      target: { value: 'What is your name?' },
    })
    fireEvent.click(screen.getByText('read'))

    expect(state?.items[0].id).toBe('q_seed')
    expect(state?.items[0]).toMatchObject({ label: 'What is your name?' })
  })
})
```

- [ ] **Step 2: Viết test cho payload `onSubmit`**

Tạo `packages/survey/__tests__/survey-form.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SurveyForm } from '../src/forms/survey-form'
import type { SurveySchemaType } from '../src/types/schema'

const schema: SurveySchemaType = {
  title: 'Feedback',
  items: [
    { id: 'q_name', type: 'short-text', label: 'What is your name?' },
    { id: 'q_note', type: 'long-text', label: 'Anything else?' },
  ],
}

describe('SurveyForm submit payload', () => {
  it('keys answers by question id, not by question text', async () => {
    const onSubmit = jest.fn()
    render(<SurveyForm schema={schema} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/What is your name\?/), {
      target: { value: 'Alice' },
    })
    fireEvent.click(screen.getByRole('button', { name: /アンケートを送信/ }))

    await screen.findByRole('button', { name: /アンケートを送信/ })
    expect(onSubmit).toHaveBeenCalled()

    const [answers] = onSubmit.mock.calls[0]
    expect(answers).toHaveProperty('q_name', 'Alice')
    expect(answers).not.toHaveProperty('What is your name?')
  })

  it('passes question label and type as a second meta argument', async () => {
    const onSubmit = jest.fn()
    render(<SurveyForm schema={schema} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/What is your name\?/), {
      target: { value: 'Alice' },
    })
    fireEvent.click(screen.getByRole('button', { name: /アンケートを送信/ }))

    await screen.findByRole('button', { name: /アンケートを送信/ })
    const [, meta] = onSubmit.mock.calls[0]

    expect(meta).toEqual([
      {
        id: 'q_name',
        label: 'What is your name?',
        type: 'short-text',
        value: 'Alice',
      },
      {
        id: 'q_note',
        label: 'Anything else?',
        type: 'long-text',
        value: undefined,
      },
    ])
  })
})
```

- [ ] **Step 3: Chạy hai test để xác nhận chúng fail**

Run: `cd packages/survey && npx jest __tests__/question-creator-id.test.tsx __tests__/survey-form.test.tsx`

Expected: `question-creator-id` PASS (effect đã bị xoá ở Task 2 — test này là lưới chống tái phát). `survey-form` test thứ hai FAIL vì `meta` là `undefined`.

Nếu `question-creator-id` FAIL, nghĩa là Task 2 chưa xoá hết effect — quay lại Task 2 Step 6.

- [ ] **Step 4: Thêm `meta` vào `survey-form.tsx`**

Trong `packages/survey/src/forms/survey-form.tsx`, thay khối type ở đầu:

```tsx
type SurveyAnswers = Record<string, string | string[] | undefined>
interface SurveyFormProps {
  schema: SurveySchemaType
  onSubmit: (answers: SurveyAnswers) => void
  children?: React.ReactNode
  disabled?: boolean
}
```

bằng:

```tsx
type SurveyAnswers = Record<string, string | string[] | undefined>

/**
 * Answers carry question ids as keys, so a consumer would otherwise need the
 * schema on hand to know what was asked. `meta` travels alongside them.
 */
export interface SurveyAnswerMeta {
  id: string
  label: string
  type: SurveyQuestionItemType['type']
  value: string | string[] | undefined
}

interface SurveyFormProps {
  schema: SurveySchemaType
  onSubmit: (answers: SurveyAnswers, meta: SurveyAnswerMeta[]) => void
  children?: React.ReactNode
  disabled?: boolean
}
```

rồi thay:

```tsx
const onFormSubmit = (data: SurveyAnswers) => {
  onSubmit(data)
}
```

bằng:

```tsx
const onFormSubmit = (data: SurveyAnswers) => {
  const meta: SurveyAnswerMeta[] = surveyPages.flatMap((page) =>
    page.questions.map((question) => ({
      id: question.id,
      label: question.label,
      type: question.type,
      value: data[question.id],
    }))
  )
  onSubmit(data, meta)
}
```

- [ ] **Step 5: Chạy test để xác nhận chúng pass**

Run: `cd packages/survey && npx jest __tests__/question-creator-id.test.tsx __tests__/survey-form.test.tsx`

Expected: PASS cả hai file.

Nếu test `survey-form` không tìm được label: `QuestionWrapper` render `<Label htmlFor={questionId}>` còn input có `id={question.id}`, nên `getByLabelText` khớp qua `htmlFor`. Nếu vẫn hỏng, đổi sang `screen.getByRole('textbox', { name: /What is your name\?/ })`.

- [ ] **Step 6: Chạy toàn bộ test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: mọi test PASS, `tsc` không lỗi.

- [ ] **Step 7: Commit**

```bash
git add packages/survey/src/forms/survey-form.tsx packages/survey/__tests__/question-creator-id.test.tsx packages/survey/__tests__/survey-form.test.tsx
git commit -m "feat(survey): pass answer metadata as a second onSubmit argument

Answers are keyed by question id, so consumers previously needed the schema
to recover what each key asked. The first argument keeps its old shape, so
existing call sites are unaffected."
```

---

### Task 5: Port class Tailwind v4 về cú pháp v3

Các component được sao từ registry shadcn bản Tailwind v4 vào một package chạy Tailwind 3.4.19. ~44 class dùng cú pháp v4 và sinh 0 byte CSS. Phải xong trước Task 6, nếu không tầng token dựng lại vẫn còn lỗ.

**Files:**

- Modify: `packages/survey/src/ui/*.tsx` (các file chứa cú pháp v4)

**Interfaces:**

- Consumes: không có.
- Produces: không còn cú pháp v4 trong `src`. Task 8 dựa vào việc mọi class trong `src` đều sinh được CSS.

- [ ] **Step 1: Ghi lại con số trước khi sửa**

Run:

```bash
cd packages/survey
echo "arbitrary-var:  $(grep -rhoE '\b[a-z-]+-\(--[a-z-]+\)' src --include='*.tsx' | wc -l)"
echo "outline-hidden: $(grep -rho 'outline-hidden' src --include='*.tsx' | wc -l)"
echo "shadow-xs:      $(grep -rho 'shadow-xs' src --include='*.tsx' | wc -l)"
echo "rounded-xs:     $(grep -rho 'rounded-xs' src --include='*.tsx' | wc -l)"
```

Expected: `16`, `16`, `10`, `2`.

- [ ] **Step 2: Đổi `prop-(--var)` sang `prop-[var(--var)]`**

Run:

```bash
cd packages/survey
grep -rlE '\b[a-z-]+-\(--[a-z-]+\)' src --include='*.tsx' \
  | xargs sed -i -E 's/\b([a-z-]+)-\(--([a-z-]+)\)/\1-[var(--\2)]/g'
```

- [ ] **Step 3: Đổi ba utility chỉ có ở v4**

Run:

```bash
cd packages/survey
grep -rl 'outline-hidden' src --include='*.tsx' | xargs sed -i 's/\boutline-hidden\b/outline-none/g'
grep -rl 'shadow-xs'      src --include='*.tsx' | xargs sed -i 's/\bshadow-xs\b/shadow-sm/g'
grep -rl 'rounded-xs'     src --include='*.tsx' | xargs sed -i 's/\brounded-xs\b/rounded-sm/g'
```

- [ ] **Step 4: Xác nhận không còn cú pháp v4**

Run:

```bash
cd packages/survey
grep -rnE '\b[a-z-]+-\(--[a-z-]+\)|\boutline-hidden\b|\bshadow-xs\b|\brounded-xs\b' src --include='*.tsx' || echo 'CLEAN'
```

Expected: in ra `CLEAN`.

- [ ] **Step 5: Kiểm tra một chỗ đã đổi đúng**

Run: `cd packages/survey && grep -n 'radix-select-content' src/ui/select.tsx`

Expected: thấy `max-h-[var(--radix-select-content-available-height)]` và `origin-[var(--radix-select-content-transform-origin)]`.

- [ ] **Step 6: Chạy test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: mọi test PASS, `tsc` không lỗi. Đây chỉ là đổi chuỗi className nên không có thay đổi hành vi nào để test.

- [ ] **Step 7: Commit**

```bash
git add packages/survey/src/ui
git commit -m "fix(survey): port Tailwind v4 class syntax back to v3

The UI components were copied from the shadcn Tailwind v4 registry into a
package pinned to Tailwind 3.4, where prop-(--var), outline-hidden,
shadow-xs and rounded-xs all emit no CSS at all."
```

---

### Task 6: Dựng lại tầng design token

**Files:**

- Modify: `packages/survey/tailwind.config.js`
- Create: `packages/survey/src/styles.css`
- Modify: `packages/survey/src/styles.ts`

**Interfaces:**

- Consumes: không có.
- Produces: `src/styles.css` chứa biến CSS trong khối `.mbc-survey`; `tailwind.config.js` sinh được 40 class token. Task 8 khẳng định chúng có mặt trong `dist/styles.css`.

- [ ] **Step 1: Xác nhận các token đang chết**

Run:

```bash
cd packages/survey && npm run build >/dev/null 2>&1
grep -c 'bg-card\|text-muted-foreground\|bg-popover' dist/styles.css
```

Expected: `0`.

- [ ] **Step 2: Viết `tailwind.config.js`**

Thay toàn bộ `packages/survey/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

- [ ] **Step 3: Viết `src/styles.css`**

Tạo `packages/survey/src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * Design tokens live on the library's own wrapper class rather than :root.
 * A host app that also uses shadcn defines these exact variable names on
 * :root, so a global block here would collide with the app's own theme.
 *
 * The inherited properties below are the inbound isolation layer: everything
 * inside the wrapper inherits from here instead of from the host's body.
 */
.mbc-survey {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;

  --sidebar: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 217.2 91.2% 59.8%;

  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    'Noto Sans',
    sans-serif;
  font-size: 1rem;
  font-weight: 400;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  word-spacing: normal;
  text-align: left;
  text-transform: none;
  text-indent: 0;
  white-space: normal;
  color: hsl(var(--foreground));
}
```

- [ ] **Step 4: Trỏ `src/styles.ts` vào file mới**

Thay toàn bộ `packages/survey/src/styles.ts`:

```ts
// Entry point for the library stylesheet; tsup emits it as dist/styles.css.
import './styles.css'
```

- [ ] **Step 5: Build và kiểm token đã sinh ra**

Run:

```bash
cd packages/survey && npm run build
for c in bg-card text-muted-foreground bg-popover ring-destructive text-sidebar-accent-foreground animate-in; do
  printf '%-32s %s\n' "$c" "$(grep -c "\\.$c" dist/styles.css)"
done
```

Expected: mọi dòng in số lớn hơn `0`.

- [ ] **Step 6: Kiểm biến CSS nằm trên wrapper, không phải `:root`**

Run: `cd packages/survey && grep -c '^:root' dist/styles.css; grep -c 'mbc-survey' dist/styles.css`

Expected: dòng đầu `0`, dòng sau lớn hơn `0`.

- [ ] **Step 7: Chạy test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: mọi test PASS, `tsc` không lỗi.

- [ ] **Step 8: Commit**

```bash
git add packages/survey/tailwind.config.js packages/survey/src/styles.css packages/survey/src/styles.ts
git commit -m "fix(survey): restore the missing design token layer

tailwind.config.js declared an empty theme and no plugins, so all 40 token
classes used across src emitted zero bytes and tailwindcss-animate never
ran. Tokens are defined on the .mbc-survey wrapper rather than :root to
avoid colliding with a host app's own shadcn variables."
```

---

### Task 7: `SurveyRoot` và bọc các Radix portal

**Files:**

- Create: `packages/survey/src/ui/survey-root.tsx`
- Modify: `packages/survey/src/ui/{dialog,alert-dialog,select,select-table,popover,tooltip,dropdown-menu,sheet}.tsx`
- Modify: `packages/survey/src/ui/sonner.tsx`
- Modify: `packages/survey/src/forms/survey-form.tsx`
- Modify: `packages/survey/src/modules/survey-template/templates/index.tsx`
- Modify: `packages/survey/src/modules/edit-survey-template/templates/index.tsx`

**Interfaces:**

- Consumes: không có.
- Produces: `SURVEY_ROOT_CLASS: 'mbc-survey'` và `SurveyRoot` từ `src/ui/survey-root.tsx`. Task 8 prefix CSS bằng đúng class này; Task 11 export nó từ `src/index.ts`.

- [ ] **Step 1: Viết `SurveyRoot`**

Tạo `packages/survey/src/ui/survey-root.tsx`:

```tsx
'use client'

import type React from 'react'

/** The single class every rule in dist/styles.css is scoped under. */
export const SURVEY_ROOT_CLASS = 'mbc-survey'

/**
 * Isolation boundary for the library's styles.
 *
 * Deliberately a bare div: no layout styles, no transform, no filter and no
 * overflow. Any of those would create a containing block and break the
 * `position: fixed` used by dialogs rendered underneath it.
 */
export function SurveyRoot({ children }: { children: React.ReactNode }) {
  return <div className={SURVEY_ROOT_CLASS}>{children}</div>
}
```

- [ ] **Step 2: Bọc portal trong `dialog.tsx`**

Trong `packages/survey/src/ui/dialog.tsx`, thêm import:

```tsx
import { SurveyRoot } from './survey-root'
```

rồi thay thân của `DialogContent`:

```tsx
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
```

thành:

```tsx
    <DialogPortal data-slot="dialog-portal">
      <SurveyRoot>
        <DialogOverlay />
        <DialogPrimitive.Content
```

và đóng lại tương ứng — `</DialogPrimitive.Content>` theo sau bởi `</SurveyRoot>` rồi `</DialogPortal>`.

- [ ] **Step 3: Bọc portal trong 7 file còn lại**

Áp cùng khuôn: import `SurveyRoot` từ `./survey-root`, bọc **toàn bộ** phần con của Portal.

`alert-dialog.tsx` — trong `AlertDialogContent`, bọc `<AlertDialogOverlay />` và `<AlertDialogPrimitive.Content>` bên trong `<AlertDialogPortal>`.

`sheet.tsx` — trong `SheetContent`, bọc `<SheetOverlay />` và `<SheetPrimitive.Content>` bên trong `<SheetPortal>`.

`select.tsx` — trong `SelectContent`, bọc `<SelectPrimitive.Content>` bên trong `<SelectPrimitive.Portal>`.

`select-table.tsx` — như `select.tsx`.

`popover.tsx` — trong `PopoverContent`, bọc `<PopoverPrimitive.Content>` bên trong `<PopoverPrimitive.Portal>`.

`tooltip.tsx` — trong `TooltipContent`, bọc `<TooltipPrimitive.Content>` bên trong `<TooltipPrimitive.Portal>`.

`dropdown-menu.tsx` — trong `DropdownMenuContent`, bọc `<DropdownMenuPrimitive.Content>` bên trong `<DropdownMenuPrimitive.Portal>`.

Ví dụ đầy đủ cho `popover.tsx`:

```tsx
<PopoverPrimitive.Portal>
  <SurveyRoot>
    <PopoverPrimitive.Content
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-none',
        className
      )}
      {...props}
    />
  </SurveyRoot>
</PopoverPrimitive.Portal>
```

- [ ] **Step 4: Scope toast của sonner**

Trong `packages/survey/src/ui/sonner.tsx`, thêm import:

```tsx
import { SURVEY_ROOT_CLASS } from './survey-root'
```

rồi thêm prop vào `<Sonner>`, đặt **trước** `{...props}` để consumer vẫn ghi đè được:

```tsx
      toastOptions={{ className: SURVEY_ROOT_CLASS }}
      {...props}
```

- [ ] **Step 5: Bọc ba component công khai**

`packages/survey/src/forms/survey-form.tsx` — import `SurveyRoot` từ `../ui/survey-root`, rồi bọc `<FormProvider>` (thẻ ngoài cùng của phần return chính):

```tsx
<SurveyRoot>
  <FormProvider {...methods}>…</FormProvider>
</SurveyRoot>
```

Bọc luôn nhánh return sớm khi không có nội dung:

```tsx
return (
  <SurveyRoot>
    <div className="p-8 text-center">
      このアンケートにはコンテンツがありません。
    </div>
  </SurveyRoot>
)
```

`packages/survey/src/modules/survey-template/templates/index.tsx` — import `SurveyRoot` từ `../../../ui/survey-root`, bọc `<SurveyTemplateErrorBoundary>`.

`packages/survey/src/modules/edit-survey-template/templates/index.tsx` — import `SurveyRoot` từ `../../../ui/survey-root`, bọc thẻ ngoài cùng của phần return.

- [ ] **Step 6: Xác nhận mọi Portal đều đã được bọc**

Run:

```bash
cd packages/survey
for f in dialog alert-dialog select select-table popover tooltip dropdown-menu sheet; do
  printf '%-16s %s\n' "$f" "$(grep -c 'SurveyRoot' src/ui/$f.tsx)"
done
```

Expected: mỗi file in số `>= 3` (1 dòng import + thẻ mở + thẻ đóng).

- [ ] **Step 7: Chạy test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: mọi test PASS, `tsc` không lỗi. Test `survey-form.test.tsx` từ Task 4 vẫn phải PASS — `SurveyRoot` chỉ thêm một div, không đổi vai trò ARIA nào.

- [ ] **Step 8: Commit**

```bash
git add packages/survey/src/ui packages/survey/src/forms/survey-form.tsx packages/survey/src/modules
git commit -m "feat(survey): add SurveyRoot isolation wrapper and scope portals

Radix renders dialog, select, popover, tooltip, dropdown-menu and sheet
content into document.body, outside any wrapper the components mount, so
prefixed CSS would never reach them. Wrapping inside the Portal avoids the
ancestor transform and overflow clipping that setting Portal container
would introduce."
```

---

### Task 8: Scope CSS lúc build và khẳng định kết quả

**Files:**

- Modify: `packages/survey/tsup.config.ts` (chỉ khối `onSuccess`)
- Create: `packages/survey/scripts/verify-dist.js`
- Modify: `packages/survey/package.json` (script `build`)

**Interfaces:**

- Consumes: `SURVEY_ROOT_CLASS` = `'mbc-survey'` (Task 7), `src/styles.css` (Task 6).
- Produces: `dist/styles.css` mà mọi selector đều nằm dưới `.mbc-survey.mbc-survey`. Task 11 giữ nguyên chuỗi PostCSS này khi viết lại phần còn lại của `tsup.config.ts`.

- [ ] **Step 1: Viết script khẳng định**

Tạo `packages/survey/scripts/verify-dist.js`:

```js
// Fails the build when the emitted stylesheet would leak into a host app or
// when the design token layer went missing again.
const fs = require('fs')
const path = require('path')

const CSS_PATH = path.join(__dirname, '..', 'dist', 'styles.css')
const SCOPE = '.mbc-survey'

const REQUIRED_TOKENS = [
  'bg-card',
  'bg-popover',
  'bg-primary',
  'text-muted-foreground',
  'text-destructive',
  'ring-destructive',
  'border-input',
  'text-sidebar-accent-foreground',
  'animate-in',
]

function fail(message) {
  console.error(`✗ verify-dist: ${message}`)
  process.exitCode = 1
}

if (!fs.existsSync(CSS_PATH)) {
  fail(`missing ${CSS_PATH} — did tsup finish its onSuccess hook?`)
  process.exit(1)
}

const css = fs.readFileSync(CSS_PATH, 'utf8')

// Strip at-rule preludes and declaration blocks so only selectors remain.
const selectors = css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('}')
  .map((chunk) => chunk.split('{')[0])
  .filter((chunk) => chunk.includes('{') === false)
  .flatMap((chunk) => chunk.split(','))
  .map((selector) => selector.trim())
  .filter((selector) => selector.length > 0 && !selector.startsWith('@'))

const unscoped = selectors.filter((selector) => !selector.includes(SCOPE))

if (unscoped.length > 0) {
  fail(
    `${unscoped.length} selector(s) are not scoped under ${SCOPE}:\n  ` +
      unscoped.slice(0, 20).join('\n  ')
  )
}

const missing = REQUIRED_TOKENS.filter(
  (token) =>
    !css.includes(`.${token}`) &&
    !css.includes(`.${token.replace(/:/g, '\\:')}`)
)

if (missing.length > 0) {
  fail(`design token classes emitted no CSS: ${missing.join(', ')}`)
}

if (process.exitCode !== 1) {
  console.log(
    `✓ verify-dist: ${selectors.length} selectors, all scoped under ${SCOPE}`
  )
}
```

- [ ] **Step 2: Nối script vào `build`**

Trong `packages/survey/package.json`, đổi:

```json
    "build": "tsup",
```

thành:

```json
    "build": "tsup && node ./scripts/verify-dist.js",
```

- [ ] **Step 3: Chạy build để xác nhận script fail**

Run: `cd packages/survey && npm run build`

Expected: `tsup` thành công rồi `verify-dist` FAIL, liệt kê các selector chưa scope (`*`, `::before`, `html`, `body`, `.bg-card`, …) và exit code khác 0.

- [ ] **Step 4: Thêm `postcss-prefix-selector` vào `onSuccess`**

Trong `packages/survey/tsup.config.ts`, thêm import ở đầu file:

```ts
import prefixSelector from 'postcss-prefix-selector'
```

rồi thay dòng tạo processor:

```ts
const postcssProcessor = postcss([tailwindcss, autoprefixer])
```

bằng:

```ts
// The doubled class raises every library rule by two class-specificity
// steps, enough to win against most class-based rules in the host app.
const SCOPE = '.mbc-survey.mbc-survey'

const postcssProcessor = postcss([
  tailwindcss,
  autoprefixer,
  prefixSelector({
    prefix: SCOPE,
    transform(prefix, selector, prefixedSelector) {
      // The token block in src/styles.css already carries the scope.
      if (selector.includes('.mbc-survey')) return selector
      // Preflight targets the document root; inside the library the
      // wrapper *is* the root.
      if (selector === 'html' || selector === 'body' || selector === ':root') {
        return prefix
      }
      if (selector.startsWith('html ') || selector.startsWith('body ')) {
        return prefix + selector.slice(selector.indexOf(' '))
      }
      return prefixedSelector
    },
  }),
])
```

- [ ] **Step 5: Build lại và xác nhận script pass**

Run: `cd packages/survey && npm run build`

Expected: in `✓ verify-dist: <n> selectors, all scoped under .mbc-survey`, exit code 0.

- [ ] **Step 6: Kiểm bằng mắt hai chỗ quan trọng**

Run:

```bash
cd packages/survey
echo '--- preflight đã scope chưa ---'
head -20 dist/styles.css
echo '--- token block giữ nguyên một lớp scope chưa ---'
grep -m1 -o '\.mbc-survey[^{]*{ *--background' dist/styles.css || grep -m1 -B1 'background: 0 0% 100%' dist/styles.css
```

Expected: phần preflight bắt đầu bằng `.mbc-survey.mbc-survey *`, và khối biến chỉ có **một** `.mbc-survey` (không phải `.mbc-survey.mbc-survey .mbc-survey`).

- [ ] **Step 7: Chạy test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: mọi test PASS, `tsc` không lỗi.

- [ ] **Step 8: Commit**

```bash
git add packages/survey/tsup.config.ts packages/survey/scripts/verify-dist.js packages/survey/package.json
git commit -m "fix(survey): scope the emitted stylesheet under .mbc-survey

The 57KB unscoped preflight was overriding host applications wholesale.
verify-dist now fails the build if any selector escapes the wrapper or if
the design token classes stop emitting CSS."
```

---

### Task 9: `SurveyConfigProvider` và client HTTP

**Files:**

- Create: `packages/survey/src/config/context.tsx`
- Modify: `packages/survey/src/client/http/index.ts`
- Delete: `packages/survey/src/client/http/config.ts`
- Modify: `packages/survey/src/hooks/use-survey-templates.ts`, `use-edit-survey-template.ts`, `use-delete-survey-template.ts`
- Modify: `packages/survey/src/client/appsync/useSubscribeMessage.ts`

**Interfaces:**

- Consumes: không có.
- Produces:
  - `SurveyAppSyncConfig` và `createAppSyncClient(config)` từ `src/client/appsync/index.ts`
  - `SurveyConfig`, `SurveyConfigProvider` từ `src/config/context.tsx` (và re-export `SurveyAppSyncConfig`)
  - `useSurveyConfig(): SurveyConfig`, `useTenantCode(): string`, `useAppSyncClient(): ApolloClient<NormalizedCacheObject>`
  - `useSurveyHttpClient(): AxiosInstance` từ `src/client/http/index.ts`
  - Task 10 export chúng ra `src/index.ts`; Task 12 dùng `SurveyConfigProvider`.

Task này phải hoàn tất trọn vẹn mới type-check được: bỏ `export default apolloClient` mà chưa sửa `useSubscribeMessage.ts` sẽ để lại một import gãy.

- [ ] **Step 1: Viết context và provider**

Tạo `packages/survey/src/config/context.tsx`:

```tsx
'use client'

import { ApolloClient, type NormalizedCacheObject } from '@apollo/client/core'
import { createContext, useContext, useMemo } from 'react'
import type React from 'react'
// SurveyAppSyncConfig is defined next to the client that consumes it, so the
// import only ever points one way: context -> appsync, never back.
import {
  createAppSyncClient,
  type SurveyAppSyncConfig,
} from '../client/appsync'

export type { SurveyAppSyncConfig }

export interface SurveyConfig {
  /** Base URL of the survey API. */
  apiUrl: string
  /** Sent as the `x-tenant-code` header. Defaults to 'common'. */
  tenantCode?: string
  /**
   * Resolves a bearer token for outgoing requests. Left undefined, requests
   * go out unauthenticated. Hosts on Amplify pass
   * `async () => (await fetchAuthSession()).tokens?.idToken?.toString()`.
   */
  getAuthToken?: () => Promise<string | null | undefined>
  /**
   * Required: the template pages track command completion over an AppSync
   * subscription, and lose their "syncing" state without it.
   */
  appSync: SurveyAppSyncConfig
}

interface SurveyContextValue {
  config: SurveyConfig
  appSyncClient: ApolloClient<NormalizedCacheObject>
}

const SurveyContext = createContext<SurveyContextValue | null>(null)

export function SurveyConfigProvider({
  config,
  children,
}: {
  config: SurveyConfig
  children: React.ReactNode
}) {
  if (!config.apiUrl) {
    throw new Error('[survey-web] SurveyConfigProvider: `apiUrl` is required.')
  }
  const { url, apiKey, region } = config.appSync ?? {}
  if (!url || !apiKey || !region) {
    throw new Error(
      '[survey-web] SurveyConfigProvider: `appSync.url`, `appSync.apiKey` and `appSync.region` are all required.'
    )
  }

  const value = useMemo<SurveyContextValue>(
    () => ({ config, appSyncClient: createAppSyncClient(config.appSync) }),
    [config.apiUrl, config.tenantCode, config.getAuthToken, url, apiKey, region]
  )

  return (
    <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
  )
}

function useSurveyContext(): SurveyContextValue {
  const ctx = useContext(SurveyContext)
  if (!ctx) {
    throw new Error(
      '[survey-web] Missing <SurveyConfigProvider>. Wrap SurveyTemplatePage or EditSurveyTemplatePage in it.'
    )
  }
  return ctx
}

export function useSurveyConfig(): SurveyConfig {
  return useSurveyContext().config
}

export function useTenantCode(): string {
  return useSurveyContext().config.tenantCode ?? 'common'
}

export function useAppSyncClient(): ApolloClient<NormalizedCacheObject> {
  return useSurveyContext().appSyncClient
}
```

- [ ] **Step 2: Viết `createAppSyncClient`**

Thay toàn bộ `packages/survey/src/client/appsync/index.ts`:

```ts
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client/core'
import { type AuthOptions, createAuthLink } from 'aws-appsync-auth-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'

export interface SurveyAppSyncConfig {
  url: string
  apiKey: string
  region: string
}

/**
 * Builds an AppSync-aware Apollo client. Kept as a factory rather than a
 * module-scope singleton so nothing connects at import time, which would
 * otherwise run during SSR.
 */
export function createAppSyncClient(
  config: SurveyAppSyncConfig
): ApolloClient<NormalizedCacheObject> {
  const { url, apiKey, region } = config
  const auth: AuthOptions = { type: 'API_KEY', apiKey }
  const httpLink = new HttpLink({ uri: url })

  return new ApolloClient({
    link: ApolloLink.from([
      createAuthLink({ url, region, auth }),
      createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
    ]),
    cache: new InMemoryCache(),
  })
}
```

- [ ] **Step 3: Viết `useSurveyHttpClient`**

Thay toàn bộ `packages/survey/src/client/http/index.ts`:

```ts
'use client'

import axios, { type AxiosInstance } from 'axios'
import { useMemo } from 'react'
import { useSurveyConfig } from '../../config/context'

/**
 * Axios instance bound to the host-supplied config.
 *
 * Replaces the former module-scope singleton, which both created a client at
 * import time and reached directly into aws-amplify. Bundling Amplify would
 * have broken auth outright: the host configures its own copy, so a bundled
 * one never sees a session.
 */
export function useSurveyHttpClient(): AxiosInstance {
  const { apiUrl, tenantCode, getAuthToken } = useSurveyConfig()

  return useMemo(() => {
    const instance = axios.create({
      baseURL: apiUrl,
      timeout: 30 * 1000,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-code': tenantCode ?? 'common',
      },
    })

    instance.interceptors.request.use(
      async (reqConfig) => {
        if (!getAuthToken) return reqConfig
        try {
          const token = await getAuthToken()
          if (token) {
            reqConfig.headers.Authorization = `Bearer ${token}`
          }
        } catch (error) {
          console.error('[survey-web] Failed to resolve auth token:', error)
        }
        return reqConfig
      },
      (error) => Promise.reject(error)
    )

    return instance
  }, [apiUrl, tenantCode, getAuthToken])
}
```

- [ ] **Step 4: Xoá `src/client/http/config.ts`**

Run: `cd packages/survey && rm src/client/http/config.ts`

- [ ] **Step 5: Sửa ba hook dùng axios**

Trong mỗi file `packages/survey/src/hooks/use-survey-templates.ts`, `use-edit-survey-template.ts`, `use-delete-survey-template.ts`:

Bỏ dòng import cũ:

```ts
import { clientAxiosInstance } from '../client/http'
```

(và trong `use-survey-templates.ts` bỏ luôn `import { xTenantCode } from '../client/http/config'`)

Thêm:

```ts
import { useSurveyHttpClient } from '../client/http'
```

và trong `use-survey-templates.ts` thêm `useTenantCode`:

```ts
import { useTenantCode } from '../config/context'
```

Trong thân mỗi hook, thêm ngay dòng đầu:

```ts
const httpClient = useSurveyHttpClient()
```

và trong `use-survey-templates.ts` thêm:

```ts
const tenantCode = useTenantCode()
```

Thay mọi `clientAxiosInstance.` thành `httpClient.` và mọi `xTenantCode` thành `tenantCode`.

Thêm `httpClient` (và `tenantCode` ở file tương ứng) vào mảng dependency của `useCallback`/`useEffect` bao quanh mỗi lời gọi.

Ví dụ cụ thể trong `use-survey-templates.ts` — trước:

```ts
import { clientAxiosInstance } from '../client/http'
import { xTenantCode } from '../client/http/config'

export function useSurveyTemplates(params: SurveyTemplateSearchParams) {
  // …
  const fetchSurveys = useCallback(async () => {
    const response =
      await clientAxiosInstance.get<SurveyTemplateControllerSearchDataResponse>(
        '/api/survey-template',
        { headers: { 'x-tenant-code': xTenantCode }, params: { …} }
      )
    // …
  }, [page, pageSize, keyword])
```

sau:

```ts
import { useSurveyHttpClient } from '../client/http'
import { useTenantCode } from '../config/context'

export function useSurveyTemplates(params: SurveyTemplateSearchParams) {
  const httpClient = useSurveyHttpClient()
  const tenantCode = useTenantCode()
  // …
  const fetchSurveys = useCallback(async () => {
    const response =
      await httpClient.get<SurveyTemplateControllerSearchDataResponse>(
        '/api/survey-template',
        { headers: { 'x-tenant-code': tenantCode }, params: { …} }
      )
    // …
  }, [page, pageSize, keyword, httpClient, tenantCode])
```

Run để kiểm không sót:

```bash
cd packages/survey && grep -rn 'clientAxiosInstance\|xTenantCode' src || echo 'CLEAN'
```

Expected: in `CLEAN`.

- [ ] **Step 6: Nối `useSubscribeMessage` vào context**

Trong `packages/survey/src/client/appsync/useSubscribeMessage.ts`:

Bỏ hai import cũ:

```ts
import { xTenantCode } from '../http/config'
import apolloClient from './index'
```

Thêm:

```ts
import { useAppSyncClient, useTenantCode } from '../../config/context'
```

Trong thân `useSubscribeCommandStatus`, thêm ngay sau dòng khai `reqId`:

```ts
const appSyncClient = useAppSyncClient()
const tenantCode = useTenantCode()
```

Trong `useEffect`, thay:

```ts
      msgSubs = subscribeMessage(
        apolloClient,
        {
          tenantCode: xTenantCode,
```

bằng:

```ts
      msgSubs = subscribeMessage(
        appSyncClient,
        {
          tenantCode,
```

Đổi mảng dependency của `useEffect` từ `[reqId]` thành `[reqId, appSyncClient, tenantCode, timeoutMs, done]`.

- [ ] **Step 7: Xác nhận không còn singleton hay biến môi trường nào ở module scope**

Run:

```bash
cd packages/survey
grep -rn "aws-amplify" src || echo 'NO AMPLIFY'
grep -rn "process.env" src || echo 'NO ENV READS'
```

Expected: in `NO AMPLIFY` và `NO ENV READS`.

- [ ] **Step 8: Type-check**

Run: `cd packages/survey && npx tsc --noEmit`

Expected: không lỗi.

- [ ] **Step 9: Commit**

```bash
git add packages/survey/src/config packages/survey/src/client packages/survey/src/hooks
git commit -m "refactor(survey): inject API config instead of reaching for Amplify

createAxiosInstance called fetchAuthSession from aws-amplify at module
scope, so the package could not be bundled without breaking auth — the
host configures its own Amplify singleton, which a bundled copy never
sees. Hosts now pass getAuthToken and the AppSync settings explicitly."
```

---

### Task 10: Bề mặt export công khai

**Files:**

- Modify: `packages/survey/src/index.ts`
- Modify: `packages/survey/package.json`

**Interfaces:**

- Consumes: `SurveyConfigProvider`, `SurveyConfig`, `SurveyAppSyncConfig` (Task 9); `SurveyRoot`, `SURVEY_ROOT_CLASS` (Task 7); `SurveyAnswerMeta` (Task 4).
- Produces: `src/index.ts` export `SurveyConfigProvider`, `SURVEY_ROOT_CLASS`, `SurveyRoot`, `SurveyForm`, `SurveyTemplatePage`, `EditSurveyTemplatePage` và các kiểu `SurveyConfig`, `SurveyAppSyncConfig`, `SurveyAnswerMeta`. Task 11 và Task 12 dựa vào danh sách export này.

- [ ] **Step 1: Cập nhật `src/index.ts`**

Thay toàn bộ `packages/survey/src/index.ts`:

```ts
// Public entry point.
export { SurveyTemplatePage } from './modules/survey-template/templates/index'
export { EditSurveyTemplatePage } from './modules/edit-survey-template/templates/index'
export { SurveyForm } from './forms/survey-form'
export { SurveyConfigProvider } from './config/context'
export { SurveyRoot, SURVEY_ROOT_CLASS } from './ui/survey-root'

export type { SurveyConfig, SurveyAppSyncConfig } from './config/context'
export type { SurveyAnswerMeta } from './forms/survey-form'
export type {
  SurveySchemaType,
  SurveyItemType,
  SurveyQuestionItemType,
} from './types/schema'
```

- [ ] **Step 2: Chạy test và type-check**

Run: `cd packages/survey && npx jest && npx tsc --noEmit`

Expected: `tsc` không lỗi, nhưng `dependencies.test.ts` từ Task 1 **FAIL** ở test "does not declare runtime dependencies that src never imports", báo `unused` = `["aws-amplify"]` — không còn file nào trong `src` import nó nữa. Step 3 xử lý.

- [ ] **Step 3: Gỡ `aws-amplify` khỏi `package.json`**

Xoá khỏi `dependencies` trong `packages/survey/package.json`:

```json
    "aws-amplify": "^6.15.4",
```

Giữ `aws-appsync-auth-link` và `aws-appsync-subscription-link` — `src/client/appsync/index.ts` vẫn import chúng, chúng sẽ được bundle.

Run: `cd /data/Workspace/msu/mbc-cqrs-serverless-web && npm install && cd packages/survey && npx jest __tests__/dependencies.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/survey/src/index.ts packages/survey/package.json package-lock.json
git commit -m "feat(survey): export SurveyConfigProvider and drop aws-amplify

With configuration injected rather than read from Amplify and process.env,
aws-amplify leaves the dependency list entirely and the package can be
fully bundled."
```

---

### Task 11: Cấu hình tsup và hình dạng `dist`

**Files:**

- Modify: `packages/survey/tsup.config.ts`
- Modify: `packages/survey/postbuild.js`
- Modify: `packages/survey/package.json` (`exports`, `scripts`)

**Interfaces:**

- Consumes: `package.json` sau Task 1 và Task 10; chuỗi PostCSS sau Task 8.
- Produces: `dist/` chỉ gồm `index.*`, `SurveyForm.*`, `styles.css`. Task 12 import từ `'@mbc-cqrs-serverless/survey-web'` và `'…/survey-web/SurveyForm'`.

- [ ] **Step 1: Ghi lại hình dạng dist hiện tại**

Run: `cd packages/survey && ls dist | wc -l && ls dist | grep -c '^chunk-'`

Expected: khoảng `40` và `14`.

- [ ] **Step 2: Viết lại `postbuild.js` thành đồng bộ và export hàm**

Thay toàn bộ `packages/survey/postbuild.js`:

```js
// Next.js requires the "use client" directive to be the very first statement
// in a module. esbuild hoists it out of position when it concatenates
// modules, so it is re-applied here.
const fs = require('fs')
const path = require('path')
const glob = require('glob')

function applyUseClientDirective(distDir = path.join(__dirname, 'dist')) {
  const files = [
    ...glob.sync(`${distDir}/**/*.js`),
    ...glob.sync(`${distDir}/**/*.mjs`),
  ]

  let fixed = 0
  for (const file of files) {
    const data = fs.readFileSync(file, 'utf8')
    if (data.startsWith('"use client"')) continue

    const cleaned = data.replace(/"use client";?/g, '')
    fs.writeFileSync(file, `"use client";\n${cleaned}`, 'utf8')
    fixed += 1
  }

  console.log(`✓ postbuild: applied "use client" to ${fixed} file(s)`)
  return fixed
}

module.exports = { applyUseClientDirective }

if (require.main === module) {
  applyUseClientDirective()
}
```

- [ ] **Step 3: Viết lại `tsup.config.ts`**

Thay toàn bộ `packages/survey/tsup.config.ts`:

```ts
import autoprefixer from 'autoprefixer'
import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import prefixSelector from 'postcss-prefix-selector'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'tsup'
import { applyUseClientDirective } from './postbuild.js'

/**
 * Only host-owned singletons stay external. Everything else is bundled so
 * that installing this package pulls in nothing else, and so that a version
 * already present in the host app cannot conflict with ours.
 */
const EXTERNAL = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'next',
  'next/navigation',
  'next-themes',
]

/** The doubled class buys two class-specificity steps against host rules. */
const SCOPE = '.mbc-survey.mbc-survey'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    styles: 'src/styles.ts',
    // Kept as its own entry: embedding just the respondent-facing form is the
    // common third-party case, and its closure touches none of the apollo,
    // axios, nuqs, dnd-kit, cmdk or sonner code the admin pages need.
    SurveyForm: 'src/forms/survey-form.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  // Off deliberately: five entries with splitting produced fourteen
  // chunk-<hash> files that nobody could read.
  splitting: false,
  treeshake: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  tsconfig: './tsconfig.json',
  loader: {
    '.css': 'css',
  },
  external: EXTERNAL,
  // Everything except the externals above. `react-dom\/` matters on its own:
  // bundled deps such as sonner reach for react-dom/client, and that subpath
  // must resolve to the host's copy too.
  noExternal: [
    /^(?!react$|react-dom$|react\/|react-dom\/|next$|next\/|next-themes$).*/,
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.platform = 'browser'
    options.target = 'es2020'
    return options
  },
  onSuccess: async () => {
    const cssPath = path.join(process.cwd(), 'dist', 'styles.css')
    if (!fs.existsSync(cssPath)) {
      throw new Error(`Expected tsup to emit ${cssPath}, but it is missing.`)
    }

    const processor = postcss([
      tailwindcss,
      autoprefixer,
      prefixSelector({
        prefix: SCOPE,
        transform(prefix, selector, prefixedSelector) {
          // The token block in src/styles.css already carries the scope.
          if (selector.includes('.mbc-survey')) return selector
          // Preflight targets the document root; here the wrapper is the root.
          if (
            selector === 'html' ||
            selector === 'body' ||
            selector === ':root'
          ) {
            return prefix
          }
          if (selector.startsWith('html ') || selector.startsWith('body ')) {
            return prefix + selector.slice(selector.indexOf(' '))
          }
          return prefixedSelector
        },
      }),
    ])

    const result = await processor.process(fs.readFileSync(cssPath, 'utf8'), {
      from: cssPath,
      to: cssPath,
    })
    fs.writeFileSync(cssPath, result.css)
    console.log('✓ tailwind: stylesheet processed and scoped')

    applyUseClientDirective(path.join(process.cwd(), 'dist'))
  },
})
```

Nếu tsup không nạp được named import từ `postbuild.js` (nó là CommonJS), đổi dòng import thành:

```ts
import { createRequire } from 'module'
const { applyUseClientDirective } = createRequire(import.meta.url)(
  './postbuild.js'
)
```

- [ ] **Step 4: Cập nhật `exports` và bỏ `prebuild`**

Trong `packages/survey/package.json`, thay khối `exports` bằng:

```json
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./styles": {
      "types": "./dist/styles.d.ts",
      "import": "./dist/styles.mjs",
      "require": "./dist/styles.js"
    },
    "./SurveyForm": {
      "types": "./dist/SurveyForm.d.ts",
      "import": "./dist/SurveyForm.mjs",
      "require": "./dist/SurveyForm.js"
    },
    "./styles.css": "./dist/styles.css"
  },
```

Xoá dòng `"prebuild": "rm -rf dist",` khỏi `scripts` (`clean: true` đã lo việc này và `rm -rf` hỏng trên Windows).

- [ ] **Step 5: Build và kiểm hình dạng dist**

Run:

```bash
cd packages/survey && npm run build
echo '--- không còn chunk nào ---'
ls dist | grep '^chunk-' || echo 'NO CHUNKS'
echo '--- danh sách file ---'
ls dist
```

Expected: in `NO CHUNKS`, và `ls dist` cho `index.js/.mjs/.d.ts/.d.mts`, `SurveyForm.js/.mjs/.d.ts/.d.mts`, `styles.js/.mjs/.d.ts/.d.mts`, `styles.css`, cùng các file `.map`.

- [ ] **Step 6: Xác nhận dependency đã được bundle chứ không require ra ngoài**

Run:

```bash
cd packages/survey
echo '--- các package còn được require từ ngoài ---'
grep -ohE "require\(['\"][^./][^'\"]*['\"]\)" dist/index.js | sort -u
```

Expected: chỉ thấy `react`, `react-dom`, `next/navigation`, `next-themes` (và các subpath của chúng). Không được có `@radix-ui/*`, `axios`, `nuqs`, `@apollo/client`.

- [ ] **Step 7: Xác nhận `"use client"` đứng đầu file**

Run: `cd packages/survey && head -c 14 dist/index.js && echo && head -c 14 dist/SurveyForm.mjs`

Expected: cả hai in `"use client";`.

- [ ] **Step 8: Chạy test, type-check và verify-dist**

Run: `cd packages/survey && npx jest && npx tsc --noEmit && node ./scripts/verify-dist.js`

Expected: mọi test PASS, `tsc` không lỗi, `verify-dist` in dấu ✓.

- [ ] **Step 9: Commit**

```bash
git add packages/survey/tsup.config.ts packages/survey/postbuild.js packages/survey/package.json
git commit -m "build(survey): bundle dependencies and flatten dist to two entries

Five entries with code splitting produced fourteen unreadable chunk-<hash>
files. Also drops the ESM-only React banner that was being injected into
the CJS output, awaits the use-client pass instead of spawning it
unawaited, and lets CSS failures fail the build."
```

---

### Task 12: Smoke test cài đặt thật và cập nhật app tiêu thụ

**Files:**

- Create: `/data/Workspace/mcp/mebs-builshiru-web/src/modules/survey/SurveyTemplateAdmin.tsx`
- Create: `/data/Workspace/mcp/mebs-builshiru-web/src/modules/survey/EditSurveyTemplateAdmin.tsx`
- Modify: `/data/Workspace/mcp/mebs-builshiru-web/src/app/admin/survey-management/page.tsx`
- Modify: `/data/Workspace/mcp/mebs-builshiru-web/src/app/admin/survey-management/create/page.tsx`
- Modify: `/data/Workspace/mcp/mebs-builshiru-web/src/app/admin/survey-management/[id]/page.tsx`

**Interfaces:**

- Consumes: `SurveyConfigProvider`, `SurveyTemplatePage`, `EditSurveyTemplatePage` từ `'@mbc-cqrs-serverless/survey-web'` (Task 10); subpath `'…/survey-web/SurveyForm'` (Task 11).
- Produces: không có (task cuối).

- [ ] **Step 1: Đóng gói và cài vào app**

Run:

```bash
cd /data/Workspace/msu/mbc-cqrs-serverless-web/packages/survey
npm pack --pack-destination /tmp/claude-1000
ls /tmp/claude-1000/mbc-cqrs-serverless-survey-web-*.tgz
```

Expected: in ra đường dẫn tarball.

- [ ] **Step 2: Cài tarball**

Run:

```bash
cd /data/Workspace/mcp/mebs-builshiru-web
npm install /tmp/claude-1000/mbc-cqrs-serverless-survey-web-0.0.42.tgz
```

(thay số phiên bản theo tên file thật ở Step 1)

Expected: cài thành công, không có cảnh báo `unmet peer dependency` nào ngoài `react`/`react-dom`/`next`.

- [ ] **Step 3: Viết component provider cho trang danh sách**

Tạo `/data/Workspace/mcp/mebs-builshiru-web/src/modules/survey/SurveyTemplateAdmin.tsx`:

```tsx
'use client'

import {
  SurveyConfigProvider,
  SurveyTemplatePage,
} from '@mbc-cqrs-serverless/survey-web'
import { fetchAuthSession } from 'aws-amplify/auth'

// tenantCode is intentionally omitted: the package defaults it to 'common',
// which is what this app has always sent.
const surveyConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL as string,
  getAuthToken: async () =>
    (await fetchAuthSession()).tokens?.idToken?.toString(),
  appSync: {
    url: process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQLENDPOINT as string,
    apiKey: process.env.NEXT_PUBLIC_AWS_APPSYNC_APIKEY as string,
    region: process.env.NEXT_PUBLIC_AWS_APPSYNC_REGION as string,
  },
}

export default function SurveyTemplateAdmin() {
  return (
    <SurveyConfigProvider config={surveyConfig}>
      <SurveyTemplatePage />
    </SurveyConfigProvider>
  )
}
```

- [ ] **Step 4: Viết component provider cho trang chỉnh sửa**

Tạo `/data/Workspace/mcp/mebs-builshiru-web/src/modules/survey/EditSurveyTemplateAdmin.tsx`:

```tsx
'use client'

import {
  EditSurveyTemplatePage,
  SurveyConfigProvider,
} from '@mbc-cqrs-serverless/survey-web'
import { fetchAuthSession } from 'aws-amplify/auth'

const surveyConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL as string,
  getAuthToken: async () =>
    (await fetchAuthSession()).tokens?.idToken?.toString(),
  appSync: {
    url: process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQLENDPOINT as string,
    apiKey: process.env.NEXT_PUBLIC_AWS_APPSYNC_APIKEY as string,
    region: process.env.NEXT_PUBLIC_AWS_APPSYNC_REGION as string,
  },
}

export default function EditSurveyTemplateAdmin() {
  return (
    <SurveyConfigProvider config={surveyConfig}>
      <EditSurveyTemplatePage />
    </SurveyConfigProvider>
  )
}
```

- [ ] **Step 5: Trỏ ba route sang component mới**

Thay toàn bộ `/data/Workspace/mcp/mebs-builshiru-web/src/app/admin/survey-management/page.tsx`:

```tsx
'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import dynamic from 'next/dynamic'

const SurveyTemplateAdmin = dynamic(
  () => import('@/modules/survey/SurveyTemplateAdmin'),
  { ssr: false }
)

export default function SurveyManagementPage() {
  return (
    <AdminLayout title="アンケート管理">
      <SurveyTemplateAdmin />
    </AdminLayout>
  )
}
```

Thay toàn bộ `/data/Workspace/mcp/mebs-builshiru-web/src/app/admin/survey-management/create/page.tsx`:

```tsx
'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import dynamic from 'next/dynamic'

const EditSurveyTemplateAdmin = dynamic(
  () => import('@/modules/survey/EditSurveyTemplateAdmin'),
  { ssr: false }
)

export default function CreateSurveyTemplate() {
  return (
    <AdminLayout title="アンケート管理">
      <EditSurveyTemplateAdmin />
    </AdminLayout>
  )
}
```

Thay toàn bộ `/data/Workspace/mcp/mebs-builshiru-web/src/app/admin/survey-management/[id]/page.tsx` bằng đúng nội dung của file `create/page.tsx` ở trên.

- [ ] **Step 6: Xác nhận không còn subpath đã bỏ**

Run:

```bash
cd /data/Workspace/mcp/mebs-builshiru-web
grep -rn 'survey-web/SurveyTemplatePage\|survey-web/EditSurveyTemplatePage' src || echo 'CLEAN'
```

Expected: in `CLEAN`.

- [ ] **Step 7: Build app**

Run: `cd /data/Workspace/mcp/mebs-builshiru-web && npx next build`

Expected: build thành công. Đây là bằng chứng duy nhất cho thấy "cài xong không crash" — nếu còn dependency nào chưa được bundle, bước này sẽ báo `Module not found`.

- [ ] **Step 8: Kiểm CSS không còn rò ra ngoài**

Run:

```bash
cd /data/Workspace/mcp/mebs-builshiru-web
grep -c 'mbc-survey' node_modules/@mbc-cqrs-serverless/survey-web/dist/styles.css
head -3 node_modules/@mbc-cqrs-serverless/survey-web/dist/styles.css
```

Expected: số lớn hơn `0`, và ba dòng đầu bắt đầu bằng `.mbc-survey.mbc-survey`, **không** phải `*,` hay `::before`.

- [ ] **Step 9: Kiểm bằng mắt trong trình duyệt**

Run: `cd /data/Workspace/mcp/mebs-builshiru-web && npx next dev`

Mở lần lượt và xác nhận:

- `/admin/survey-management` — danh sách hiện đúng màu (thẻ có nền trắng, chữ phụ màu xám), phân trang hoạt động.
- `/admin/survey-management/create` — mở dropdown chọn loại câu hỏi: menu phải có **nền trắng và viền**, không trong suốt. Đây là bài kiểm quyết định cho việc bọc portal ở Task 7.
- Mở dialog xoá — overlay và hộp thoại phải có style đầy đủ.
- Kéo thả để đổi thứ tự câu hỏi — xác nhận id không đổi bằng cách sửa nhãn một câu hỏi rồi lưu, mở lại và kiểm nhánh rẽ (`nextSectionId`) vẫn trỏ đúng.
- Một trang trả lời survey công khai — xác nhận CSS của app (header, footer) **không** bị đổi font hay khoảng cách so với trước.

- [ ] **Step 10: Commit ở repo app**

```bash
cd /data/Workspace/mcp/mebs-builshiru-web
git checkout -b chore/survey-web-config-provider
git add src/modules/survey src/app/admin/survey-management package.json package-lock.json
git commit -m "chore: adopt survey-web SurveyConfigProvider and root entry

The package no longer reaches into aws-amplify or process.env on its own,
so API and AppSync settings are passed in explicitly. The
SurveyTemplatePage and EditSurveyTemplatePage subpath exports were folded
into the root entry."
```

- [ ] **Step 11: Gỡ tarball, trỏ lại registry**

Sau khi phiên bản mới được publish, chạy ở repo app:

```bash
npm install @mbc-cqrs-serverless/survey-web@latest
```

Ghi chú lại trong PR rằng app đang tạm dùng tarball cho tới khi package được publish.

---

## Ghi chú còn lại

- **`packages/master` chưa được sửa.** App tiêu thụ cũng nạp `@mbc-cqrs-serverless/master-web/styles.css`, vốn cũng là preflight chưa scope. Sau kế hoạch này, survey hết đè lên app nhưng master thì chưa — nếu app còn thấy CSS bị đè, thủ phạm còn lại là master. Xứng đáng một spec riêng cùng khuôn.
- **`SurveyForm` không cần provider.** Hai call-site trong app (`SurveyTemplatePreview.tsx`, `SurveyTemplateAnswer.tsx`) không phải đổi gì.
- **Tham số `meta` là bổ sung.** `onSubmit={(data) => onSubmit(data)}` trong `SurveyTemplateAnswer.tsx` vẫn đúng.
