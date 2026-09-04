# Thiết kế: Củng cố package `@mbc-cqrs-serverless/survey-web`

**Ngày:** 2026-09-04
**Phạm vi:** chỉ `packages/survey`. `packages/master` có phần lớn cùng vấn đề nhưng nằm ngoài lần này.
**Trạng thái tương thích ngược:** không có dữ liệu production, được phép breaking. Không cần migration.

## 1. Bối cảnh

Bốn phản hồi nhận được từ người dùng package:

1. Thư viện phụ thuộc vào dependency bên ngoài — cài xong là crash vì thiếu module, icon không hiển thị, xung đột phiên bản với dep của app.
2. Dùng `q_` làm khoá câu hỏi thay vì dùng chính text câu hỏi.
3. Tailwind của thư viện ăn CSS bên ngoài — cần bọc component vào một thẻ div để CSS ngoài không ảnh hưởng vào trong và ngược lại.
4. Bản build `dist` khó đọc, khó debug.

Điều tra xác nhận cả bốn, và tìm ra hai lỗi nghiêm trọng hơn phần mô tả:

- **Bốn dependency được import nhưng không khai báo** trong `package.json`: `nuqs`, `usehooks-ts`, `@dnd-kit/utilities`, `@radix-ui/react-collapsible`. Chúng chỉ resolve được nhờ hoisting của monorepo lerna; ở máy người dùng thì không.
- **Toàn bộ tầng design token không tồn tại trong bản build.** 38 class token (`bg-card`, `text-muted-foreground`, `bg-popover`, `ring-destructive`, `animate-in`…) được dùng ~400 lượt trong `src` nhưng sinh ra **0 byte** trong `dist/styles.css`, vì `tailwind.config.js` có `theme.extend` rỗng, `plugins: []`, và `src/styles.ts` chỉ `import 'tailwindcss/tailwind.css'`. Không có khối `:root` nào trong CSS xuất bản ⇒ không biến CSS nào được định nghĩa.

Lỗi thứ hai là nguyên nhân chính của cảm giác "tailwind ăn css bên ngoài": component không mang màu của chính nó, nên thứ gì app host có sẽ lộ xuyên qua.

## 2. Mục tiêu

- Cài `@mbc-cqrs-serverless/survey-web` xong là chạy được, không phải cài thêm gì ngoài `react`, `react-dom`, `next`.
- CSS của thư viện không đè lên app host, và CSS của app host không rỉ vào trong thư viện — ở mức đủ dùng thực tế (host cố tình `!important` vẫn xuyên qua được; chấp nhận).
- Khoá câu hỏi là định danh ổn định, không phải text câu hỏi.
- `dist` đọc được, debug được.

### Ngoài phạm vi

- `packages/master`.
- Shadow DOM (đã cân nhắc và loại: phá portal của Radix, chi phí cao).
- Migration dữ liệu cũ (không có dữ liệu production).
- Refactor không liên quan tới bốn mục tiêu trên.

## 3. Thiết kế

### 3.1 Dependency và bề mặt cài đặt

**Ranh giới external.** Chỉ ba nhóm được để ngoài, vì cả ba là context/singleton do app host sở hữu — bundle vào là vỡ:

| External                                  | Lý do                                                            |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `react`, `react-dom`, `react/jsx-runtime` | Hai bản React trong một cây là hỏng hook                         |
| `next`, `next/navigation`                 | Router context của host                                          |
| `next-themes`                             | `ui/sonner.tsx` gọi `useTheme()`, cần đọc ThemeProvider của host |

Cả ba khai trong `peerDependencies` (`next-themes` để `peerDependenciesMeta.optional: true`) và **gỡ khỏi `dependencies`** — hiện `react`, `react-dom`, `next` đang bị khai trùng ở cả hai chỗ.

Mọi thứ còn lại bundle thẳng vào `dist` qua `noExternal`: radix, react-hook-form, zod, date-fns, react-day-picker, lucide-react, dnd-kit, nuqs, usehooks-ts, axios, `@apollo/client`, cmdk, sonner, class-variance-authority, clsx, tailwind-merge. Điều này chữa đồng thời "thiếu module" và "xung đột phiên bản": bản bundle nằm trong closure của thư viện, không đụng bản của app.

**Dọn `package.json`:**

- Thêm: `nuqs`, `usehooks-ts`, `@dnd-kit/utilities`, `@radix-ui/react-collapsible`.
- Gỡ hẳn `@tanstack/react-table` — không xuất hiện ở bất kỳ file nào trong `src`.
- Chuyển `tailwindcss-animate` sang `devDependencies` — nó là plugin Tailwind chạy lúc build, không phải dep runtime. Hiện đang nằm trong `dependencies` mà `tailwind.config.js` lại không nạp (xem 3.3).
- Chuyển `react`, `react-dom`, `next` sang chỉ còn `peerDependencies` — hiện bị khai trùng ở cả hai chỗ.
- Gỡ `aws-amplify`, `aws-appsync-auth-link`, `aws-appsync-subscription-link` (xem 3.2).
- Thêm `"sideEffects": ["*.css"]` — hiện thiếu, nên bundler của app host không tree-shake được gì.
- Thêm `postcss-prefix-selector` vào `devDependencies`.

**`aws-amplify` không được bundle.** Amplify là singleton: app host gọi `Amplify.configure()` trên bản copy của nó, còn thư viện sẽ đọc bản đã bundle vào `dist` ⇒ session luôn rỗng, mọi request mất header `Authorization`. Vì vậy Amplify bị gỡ hẳn khỏi lõi thay vì để external — xem 3.2.

### 3.2 `SurveyConfigProvider` — gỡ Amplify khỏi lõi

`src/client/http/index.ts` hiện tạo axios instance ngay ở module scope (`const clientAxiosInstance = createAxiosInstance()`), tức chạy side-effect ngay lúc import, kể cả khi SSR. `src/client/appsync/index.ts` cũng khởi tạo `ApolloClient` ở module scope và đọc `process.env.NEXT_PUBLIC_*` lúc import. Cả hai bị thay bằng một provider.

```ts
export interface SurveyConfig {
  apiUrl: string
  tenantCode?: string // mặc định 'common'
  getAuthToken?: () => Promise<string | null | undefined>
  appSync: {
    url: string
    apiKey: string
    region: string
  }
}

export function SurveyConfigProvider(props: {
  config: SurveyConfig
  children: React.ReactNode
}): JSX.Element
```

`appSync` **bắt buộc**. `SurveyTemplatePage` và `EditSurveyTemplatePage` phụ thuộc vào `useSubscribeCommandStatus` để biết command đã đồng bộ xong; thiếu cấu hình thì UI mất trạng thái "đang xử lý". Provider throw lỗi rõ ràng khi thiếu, thay vì suy biến im lặng.

Host dùng Amplify truyền vào:

```ts
<SurveyConfigProvider
  config={{
    apiUrl: process.env.NEXT_PUBLIC_API_URL!,
    tenantCode: process.env.NEXT_PUBLIC_TENANT_CODE,
    getAuthToken: async () =>
      (await fetchAuthSession()).tokens?.idToken?.toString(),
    appSync: {
      url: process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQLENDPOINT!,
      apiKey: process.env.NEXT_PUBLIC_AWS_APPSYNC_APIKEY!,
      region: process.env.NEXT_PUBLIC_AWS_APPSYNC_REGION!,
    },
  }}
>
```

Host dùng cơ chế auth khác truyền hàm khác. Thư viện không còn biết Amplify là gì.

**Thay đổi kéo theo:**

| Hiện tại                                        | Sau                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `clientAxiosInstance` (module scope)            | `useSurveyHttpClient()` — `useMemo` theo config, interceptor gọi `config.getAuthToken()` |
| `apolloClient` (module scope, `export default`) | Khởi tạo lazy từ `config.appSync`, giữ trong context                                     |
| `xTenantCode` (module scope, đọc env)           | `config.tenantCode ?? 'common'`                                                          |
| `src/client/http/config.ts` đọc `process.env`   | Xoá; `apiUrl`/`tenantCode` đến từ config                                                 |

Call-site phải sửa: `hooks/use-survey-templates.ts`, `hooks/use-edit-survey-template.ts`, `hooks/use-delete-survey-template.ts`, `client/appsync/useSubscribeMessage.ts`.

**`SurveyForm` không đụng provider.** Ai chỉ nhúng form để render survey vẫn dùng được mà không cần `SurveyConfigProvider`; chỉ hai template page mới cần.

Hệ quả phụ đáng giá: `dist` không còn đọc `process.env.NEXT_PUBLIC_*` — vốn là một dạng phụ thuộc ngầm vào môi trường bên ngoài.

### 3.3 Cách ly CSS

Bốn lớp, làm theo thứ tự. Lớp (a) phải xong trước, nếu không việc scope là scope một file rỗng.

**(a) Dựng lại tầng design token.**

- `tailwind.config.js`: bổ sung `theme.extend.colors` ánh xạ sang CSS variable theo chuẩn shadcn (đủ 38 token đang dùng trong `src`), `theme.extend.borderRadius`, và nạp plugin `tailwindcss-animate`.
- Thêm `src/styles.css` khai các biến CSS, thay cho `src/styles.ts` hiện tại (`import 'tailwindcss/tailwind.css'`).
- **Khối biến đặt trên `.mbc-survey`, không phải `:root`.** App host dùng shadcn sẽ có đúng những tên biến này ở `:root`; để global là va nhau. Đây là điểm khác biệt có chủ ý so với đoạn config tham khảo (nó cố tình chừa `:root`/`html` không prefix — chính chỗ đó là lỗ rò).

**(b) Chặn chiều ra.**

Toàn bộ output CSS đi qua `postcss-prefix-selector` trong `onSuccess` của tsup:

- Preflight `*, ::before, ::after` → `.mbc-survey *, .mbc-survey ::before, .mbc-survey ::after`.
- `html` và `body` → `.mbc-survey`.
- Selector đã bắt đầu bằng `.mbc-survey` (khối biến ở lớp a) giữ nguyên, không prefix chồng.

**(c) Chặn chiều vào.**

- Preflight đã prefix tự nó là lớp chặn: `.mbc-survey button` (0,1,1) thắng `button` (0,0,1) của host.
- Thêm reset thuộc tính kế thừa trên wrapper (`font`, `color`, `line-height`, `letter-spacing`, `text-transform`, `text-align`, `white-space`) để `body { font-family: … }` của host không rỉ vào.
- Prefix dùng **class lặp `.mbc-survey.mbc-survey`**, nâng mọi rule của thư viện thêm 2 bậc class specificity, đủ thắng phần lớn rule host viết theo class. Chi phí: CSS phình ~10–15%.

Giới hạn đã biết và chấp nhận: host dùng `!important` vẫn xuyên qua được.

**(d) Radix portal.**

Tám file trong `src/ui/` render ra `document.body`, nằm ngoài wrapper ⇒ CSS đã prefix không với tới, dialog/menu mất sạch style: `dialog.tsx`, `alert-dialog.tsx`, `select.tsx`, `select-table.tsx`, `popover.tsx`, `tooltip.tsx`, `dropdown-menu.tsx`, `sheet.tsx`.

Cách xử lý: bọc `<div className="mbc-survey">` **bên trong** mỗi `Portal`, quanh `Content`.

Đã cân nhắc và loại phương án đặt `container` của Portal trỏ về wrapper: kéo portal vào trong cây DOM sẽ dính `overflow: hidden` và `transform` của tổ tiên — một `transform` bất kỳ trên ancestor tạo containing block mới và làm `position: fixed` của dialog vỡ.

`ui/sonner.tsx` cũng render ra body, xử lý riêng qua `toastOptions.className`.

**(e) Người dùng không phải làm gì thêm.**

`SurveyForm`, `SurveyTemplatePage`, `EditSurveyTemplatePage` tự bọc `SurveyRoot` ở bên trong. `SurveyRoot` là một `div.mbc-survey` trần, **không mang style layout, không `transform`, không `overflow`, không `filter`** — ràng buộc này để không tạo containing block ảnh hưởng tới positioning bên trong. Cách dùng không đổi: vẫn `import '@mbc-cqrs-serverless/survey-web/styles.css'` như README hiện ghi.

### 3.4 Khoá câu hỏi `q_`

Thủ phạm là `src/creators/question-creators/question-creator.tsx:148-153`:

```js
// Sync question ID with question label
useEffect(() => {
  if (questionLabelValue) setValue(`${itemPath}.id`, questionLabelValue)
}, [questionLabelValue, itemPath, setValue])
```

Effect này ghi đè `id` bằng text label mỗi lần gõ. Các chỗ _sinh_ id vốn đã đúng (`q_${Date.now()}`, `sec_${Date.now()}`) nhưng bị effect phá ngay sau đó. **Xoá effect là phần chính.**

**Ba việc kèm theo:**

1. **`Date.now()` không đủ để làm id.** Thêm câu hỏi bằng phím tắt hoặc duplicate liên tiếp trong cùng một mili-giây sẽ trùng id, mà cả `nextSectionId` lẫn field name của react-hook-form đều tra theo id. Thêm `src/utils/id.ts`:

   ```ts
   export function createId(prefix: 'q' | 'sec'): string
   ```

   Cài đặt bằng counter đơn điệu trong module cộng hậu tố ngẫu nhiên ngắn. Áp cho cả năm chỗ sinh id: `survey-creator.tsx:127`, `survey-creator.tsx:290`, `survey-creator.tsx:299`, `question-creator.tsx:159`, `section-header-creator.tsx:89` và `:91`.

2. **Giữ `id` sống sót qua submit.** Sau khi bỏ effect, `items.N.id` không còn ai `setValue`. `useFieldArray` giữ được qua `defaultValues`, nhưng đây là chỗ dễ âm thầm mất dữ liệu — đăng ký tường minh và có test khẳng định id bất biến trước/sau khi sửa label.

3. **Không siết regex `q_` vào zod schema.** `BaseQuestionSchema.id` giữ `z.string().min(1)`; chỉ _bộ sinh_ dùng tiền tố `q_`, để schema viết tay với id có nghĩa (`email`, `age`) vẫn hợp lệ. Thay vào đó thêm `superRefine` trên `SurveySchema` kiểm tra **id không trùng nhau** trong `items` — hiện không ai kiểm, và hai câu hỏi cùng id sẽ bị react-hook-form gộp làm một field.

**Payload `onSubmit` đổi sang hai tham số:**

```ts
interface SurveyAnswerMeta {
  id: string
  label: string
  type: SurveyQuestionItemType['type']
  value: string | string[] | undefined
}

onSubmit: (
  answers: Record<string, string | string[] | undefined>,
  meta: SurveyAnswerMeta[]
) => void
```

Tham số đầu giữ nguyên hình dạng cũ nên call-site hiện có vẫn chạy; ai cần label thì đọc tham số thứ hai, không phải lưu kèm schema mới đọc được kết quả.

### 3.5 Cấu hình build và hình dạng `dist`

Hiện `splitting: true` với 5 entry sinh 14 file `chunk-2HSNQQFZ.js`, `chunk-4QAMQSFT.mjs`… tên băm vô nghĩa, tổng 2.1 MB.

**Đề xuất:** `splitting: false`, rút xuống 2 entry JS + 1 entry CSS.

```
dist/
  index.js  index.mjs  index.d.ts  index.d.mts        (+ .map)
  SurveyForm.js  SurveyForm.mjs  SurveyForm.d.ts  SurveyForm.d.mts  (+ .map)
  styles.css
```

`SurveyForm` tách riêng vì đây là thứ bên thứ ba nhúng nhiều nhất, và closure của nó không đụng `@apollo/client`, `axios`, `nuqs`, `@dnd-kit/*`, `cmdk`, `sonner` — app chỉ hiển thị survey cho người trả lời sẽ không phải tải cả cụm đó. Cái giá là phần dùng chung bị nhân đôi trên đĩa (~300–500 KB), nhưng không bao giờ cả hai cùng nạp lúc chạy.

Bỏ hai subpath `./SurveyTemplatePage` và `./EditSurveyTemplatePage` khỏi `exports`; hai component lấy từ entry gốc (`import { SurveyTemplatePage } from '@mbc-cqrs-serverless/survey-web'`). Giữ `./SurveyForm`, `./styles`, `./styles.css`.

Đánh đổi đã biết: app tiêu thụ đang dùng hai subpath này với `dynamic()` để tách code theo route (xem 3.6). Sau thay đổi, ba route dưới `/admin/survey-management` sẽ nạp cả entry gốc — tức có thêm `SurveyForm` và phần dùng chung — thay vì chỉ đúng template page cần thiết. Chấp nhận, đổi lấy `dist` gọn và không nhân bản code giữa các entry.

**Sửa trong `tsup.config.ts`:**

| Chỗ                                           | Vấn đề                                                                                                 | Xử lý                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `banner: { js: 'import React from "react"' }` | Nhét cú pháp `import` ESM vào cả output CJS                                                            | Bỏ; đặt `options.jsx = 'automatic'`, bỏ `jsxFactory`/`jsxFragment` |
| `exec('node ./postbuild.js', cb)`             | Không được `await` trong `onSuccess`; tsup có thể kết thúc trước khi directive `'use client'` ghi xong | Gọi trực tiếp hàm từ `postbuild.js` và `await`                     |
| `postbuild.js` dùng `fs.readFile` callback    | Ghi bất đồng bộ song song, không chờ                                                                   | Chuyển sang `readFileSync`/`writeFileSync`                         |
| `publicDir: 'public'`                         | Thư mục không tồn tại                                                                                  | Bỏ                                                                 |
| `try/catch` nuốt lỗi trong `onSuccess`        | Build báo thành công dù xử lý CSS hỏng                                                                 | Throw                                                              |
| `prebuild: rm -rf dist`                       | Thừa (`clean: true` đã làm), hỏng trên Windows                                                         | Bỏ                                                                 |

**Thêm:** `postcss-prefix-selector` nối vào chuỗi postcss trong `onSuccess`; `treeshake: true`. Giữ `format: ['cjs', 'esm']`, `dts: true`, `sourcemap: true`, không minify — `dist` là để đọc.

**Không lấy từ đoạn config tham khảo:** `format: ['cjs']` (survey đang trỏ `.mjs` trong `exports`, drop ESM là vỡ); `inlineSvgPlugin` (package không có file `.svg` nào — icon đến từ `lucide-react`); `dts.resolve: false` cho `@date-fns/tz`; `scripts/extract-antd-css.cjs`; các external `react-i18next`, `react-router-dom`, `i18next`. Tất cả đều thuộc về một package khác.

### 3.6 App tiêu thụ: `mebs-builshiru-web`

Repo `/data/Workspace/mcp/mebs-builshiru-web` đang dùng `@mbc-cqrs-serverless/survey-web@^0.0.43`. Đây là consumer thật đã biết, nên breaking change phải được sửa kèm ở đó.

**Quan sát xác nhận chẩn đoán:**

- `usehooks-ts` và `@dnd-kit/utilities` có mặt trong `node_modules` của app nhưng **không được khai báo trong `package.json` của app** — chúng lọt vào nhờ hoisting transitive. App chạy được là do may, không phải do đúng.
- `src/app/layout.tsx` nạp `@mbc-cqrs-serverless/survey-web/styles.css` **sau** `./globals.css` của chính app. Preflight 57 KB chưa scope của thư viện đang đè lên toàn bộ app — đúng feedback #3 ngoài đời thực. Sau khi scope, thứ tự import này không còn ảnh hưởng.

**Thay đổi cần làm ở app:**

| File                                              | Thay đổi                                                                   |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| `src/app/admin/survey-management/page.tsx`        | `import('…/survey-web/SurveyTemplatePage')` → `import('…/survey-web')`     |
| `src/app/admin/survey-management/create/page.tsx` | `import('…/survey-web/EditSurveyTemplatePage')` → `import('…/survey-web')` |
| `src/app/admin/survey-management/[id]/page.tsx`   | như trên                                                                   |
| Ba file trên                                      | Bọc thêm `SurveyConfigProvider` (xem 3.2) quanh template page              |

**Không cần đổi:**

- Hai call-site `SurveyForm` (`SurveyTemplatePreview.tsx`, `SurveyTemplateAnswer.tsx`) — subpath `./SurveyForm` được giữ.
- `onSubmit` của `SurveyForm` — tham số `meta` là bổ sung, chữ ký cũ vẫn đúng.
- `import '@mbc-cqrs-serverless/survey-web/styles.css'` trong `layout.tsx`.

**Ngoài phạm vi nhưng cần biết:** app cũng nạp `@mbc-cqrs-serverless/master-web/styles.css`, vốn cũng là preflight chưa scope. Sau lần này, survey hết đè lên app nhưng master thì chưa — nếu app còn thấy CSS bị đè thì thủ phạm còn lại là master.

## 4. Kiểm thử

Hiện có 4 file test thuần unit (`schema`, `cn`, `get-pagination-item`, `subscribe`), chưa có test component nào dù `@testing-library/react` đã sẵn trong devDeps.

Bổ sung, xếp theo khả năng bắt lại đúng bốn phản hồi:

1. **Quét dependency trong CI** — so import trong `src` với `package.json`, fail nếu có dep chưa khai. Chính kiểm tra này tìm ra 4 dep thiếu; chặn vĩnh viễn lớp lỗi "cài xong crash".
2. **Assertion trên `dist/styles.css` sau build** — không selector trần nào (`*`, `html`, `body`, `:root`) lọt ra, và các token (`bg-card`, `text-muted-foreground`, `animate-in`) phải có mặt. Bản build hiện tại thiếu cả 38 token mà không ai biết.
3. **Regression cho id** — dựng `question-creator` trong `FormProvider`, gõ đổi label, khẳng định `items.0.id` bất biến.
4. **`createId` không trùng** — sinh 10.000 id trong vòng lặp chặt.
5. **`schema.test.ts` bổ sung** — `superRefine` bắt id trùng.
6. **`survey-form.test.tsx`** — payload dùng id làm key; `meta` mang đúng `label` và `type`.
7. **Smoke test cài thật** — `npm pack`, cài tarball vào một app Next tối giản, build. Là thứ duy nhất thực sự chứng minh "cài xong không crash". Làm thủ công một lần lúc hoàn thành; cân nhắc đưa vào CI sau.

## 5. Thứ tự triển khai

Mỗi bước một commit, tự kiểm chứng được trước khi sang bước sau.

| #   | Bước                                                                          | Kiểm chứng bằng                                                           |
| --- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | Dọn dependency: khai 4 dep thiếu, gỡ dep thừa và trùng, thêm `sideEffects`    | Test 1                                                                    |
| 2   | Khoá `q_`: xoá effect, `createId`, uniqueness refine, `meta` trong `onSubmit` | Test 3, 4, 5, 6                                                           |
| 3   | Dựng lại tầng design token Tailwind                                           | Test 2 (phần token có mặt)                                                |
| 4   | Scope CSS `.mbc-survey`, bọc 8 portal, sonner                                 | Test 2 (phần không lọt) + kiểm bằng mắt: dialog, select, popover, tooltip |
| 5   | `SurveyConfigProvider`, gỡ Amplify khỏi lõi                                   | Test hiện có + `tsc --noEmit`                                             |
| 6   | tsup config và hình dạng `dist`                                               | `ls dist` — 11 file, không còn `chunk-*`                                  |
| 7   | Smoke test `npm pack` vào app Next                                            | Thủ công                                                                  |
| 8   | Cập nhật `mebs-builshiru-web` theo 3.6                                        | `next build` của app                                                      |

Bước 5 phải xong trước bước 6: chừng nào `aws-amplify` còn trong lõi thì chưa thể bật `noExternal` bundle toàn bộ.

Làm trên nhánh riêng, tách khỏi thay đổi đang dang dở ở `packages/master` trên `develop`.

## 6. Các phương án đã cân nhắc và loại

| Phương án                                                                  | Lý do loại                                                                                                                                                         |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Giữ mọi dep external, chỉ khai lại `peerDependencies` và viết docs cài đặt | Rẻ nhất nhưng không chữa được "cài xong crash" lẫn xung đột phiên bản — chỉ chuyển gánh nặng sang người dùng                                                       |
| Bundle tất kể cả `aws-amplify`, giữ nguyên API công khai                   | Amplify là singleton; host `Amplify.configure()` trên bản copy của nó, thư viện đọc bản bundle ⇒ session rỗng, mọi request mất `Authorization`                     |
| Shadow DOM để cách ly tuyệt đối                                            | Phá portal của Radix (dialog/select/popover/tooltip), phải inject stylesheet vào shadow root và xử lý form submit qua ranh giới shadow. Chi phí và rủi ro cao nhất |
| Chỉ chặn chiều ra (đúng như đoạn config tham khảo)                         | Không đạt yêu cầu cách ly hai chiều                                                                                                                                |
| Đặt `container` của Radix Portal trỏ về wrapper                            | Portal nằm trong cây DOM sẽ dính `overflow: hidden` và `transform` của tổ tiên; `position: fixed` của dialog vỡ                                                    |
| Đổi payload `onSubmit` hẳn sang mảng có label                              | Breaking mạnh nhất với mọi call-site, trong khi thêm tham số thứ hai đạt cùng mục đích                                                                             |
