'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  parseAsBoolean,
  parseAsString,
  UseQueryStatesKeysMap,
} from 'next-usequerystate'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ColumnDef } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import LoadingOverlay from '../../../components/LoadingOverlay'
import { BackButton } from '../../../components/buttons/back-button'
import { DataTable } from '../../../components/table/data-table'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion'
import { Button } from '../../../components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { countDefault } from '../../../lib/constants/define'
import { API_URLS } from '../../../lib/constants/url'
import useHealthCheck from '../../../lib/hook/useHealthCheck'
import { useLoadingForm } from '../../../lib/hook/useLoadingForm'
import { useNavigation } from '../../../lib/hook/useNavigation'
import { usePagination } from '../../../lib/hook/usePagination'
import { formatDate } from '../../../lib/utils/datetime'
import {
  useHttpClient,
  useUrlProvider,
  useUserContext,
} from '../../../provider'
import { SettingDataEntity } from '../../../types'
import { MasterRdsEntity } from '../../../types/MasterRdsEntity'
import { MasterRdsListEntity } from '../../../types/MasterRdsListEntity'
import { Paginate } from '../../../types/common'
import { SearchPropsMasterData } from '../../../types/master-data'
import { PaginateProps } from '../../../types/pagination'
import AddJsonData from '../components/ActionBar/AddJsonData'
import '../../../components/JsonEditor'
import { toast } from 'src/components/ui/use-toast'

export enum AccordionValue {
  SETTING = 'setting',
  DATA_SEARCH = 'data-search',
  DATA_RESULT = 'data-result',
}

export default function MasterData() {
  const user = useUserContext()
  const tenantCode = user.tenantCode
  const urlProvider = useUrlProvider()
  const router = useRouter()
  const httpClient = useHttpClient()

  /**
   * 検索条件の定義
   */
  const searchPropDefinitions: UseQueryStatesKeysMap<SearchPropsMasterData> = {
    code: parseAsString.withDefault(''),
    keyword: parseAsString.withDefault(''),
    isDeleted: parseAsBoolean.withDefault(false),
    typeCode: parseAsString.withDefault(''),
    typeCodeId: parseAsString.withDefault(''),
  }

  const [currentSetting, setCurrentSetting] = useState<SettingDataEntity>()
  const [accordion, setAccordion] = useState<string[]>([
    AccordionValue.DATA_SEARCH,
    AccordionValue.DATA_RESULT,
  ])

  const isExistCodeInFields = currentSetting?.attributes.fields
    .map((field) => field.physicalName)
    .includes('code')

  const { form, loading, loadingStore, control, handleSubmit, reset, errors } =
    useLoadingForm<SearchPropsMasterData>({
      defaultValues: {
        code: '',
        keyword: '',
        isDeleted: false,
      },
    })
  const { navigate } = useNavigation()
  /**
   * 検索処理
   * @param data
   * @returns
   */
  const getData = async (data: SearchPropsMasterData) => {
    const props: PaginateProps = {
      ...data,
      page: data?.page || 1,
      count: data?.count || countDefault,
      pageSize: data?.count || countDefault,
    }
    const paginate = (
      await httpClient.get<MasterRdsListEntity>(API_URLS.DATA.GET_ALL, {
        params: {
          ...props,
          settingCode: data.typeCode.split('#').at(-1),
          orderBys: data.ordering ? [data.ordering] : undefined,
        },
      })
    ).data

    paginate.items = paginate.items.map((item) => ({
      ...item,
      attributes: {
        ...item.attributes,
        code: item.code,
        name: item.name,
      },
    }))
    return {
      count: paginate.total,
      results: paginate.items,
    }
  }
  /**
   * 検索のカスタムフック定義
   */
  const {
    searchProps,
    paginate,
    executeSearch,
    onSubmitSearch,
    isCalledSearch,
    handlePaginationChange,
    handleSortChange,
  } = usePagination<
    MasterRdsEntity,
    SearchPropsMasterData,
    Paginate<MasterRdsEntity>
  >({
    searchPropDefinitions: searchPropDefinitions,
    getData: getData,
    reset: reset,
    rootPath: urlProvider.DATA_PAGE_URL,
  })

  // 一覧を取得(初期表示)
  useEffect(() => {
    ;(async () => {
      await initSearch()
    })()
  }, [])

  // 一覧を取得(検索ボタンクリック時)
  useEffect(() => {
    ;(async () => {
      if (!isCalledSearch) {
        return
      }
      await initSearch()
    })()
  }, [isCalledSearch])

  const initSearch = async () => {
    const { paginate } = await executeSearch()
    if (paginate) {
      loadingStore.closeLoading()
    }
  }
  useHealthCheck()

  const handleClear = () => {
    const clearedValues: SearchPropsMasterData = {
      code: '',
      keyword: '',
      isDeleted: false,
    }
    reset(clearedValues)
    onSubmitSearch(clearedValues)
  }
  const columns: ColumnDef<MasterRdsEntity>[] = useMemo(() => {
    // First, define the dynamically generated columns from the settings
    const dynamicColumns: ColumnDef<MasterRdsEntity>[] =
      currentSetting?.attributes.fields
        ?.filter((field) => field.isShowedOnList)
        .map((item) => {
          // Special case for the 'code' column with a link
          if (item.physicalName === 'code') {
            return {
              id: item.physicalName,
              meta: {
                size: '25%',
              },
              accessorKey: 'masterCode',
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title={item.name} />
              ),
              cell: ({ row }) => (
                <Link
                  className="block w-full overflow-hidden text-ellipsis text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] hover:underline"
                  href={`${urlProvider.EDIT_DATA_PAGE_URL}/${encodeURIComponent(
                    row.original.pk
                  )}/${encodeURIComponent(
                    row.original.sk
                  )}?typeCodeId=${encodeURIComponent(currentSetting.id)}`}
                >
                  {row.original.masterCode}
                </Link>
              ),
            }
          }

          // Simple sortable columns like 'seq' or 'name'
          if (item.physicalName === 'seq' || item.physicalName === 'name') {
            return {
              accessorKey: item.physicalName,
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title={item.name} />
              ),
            }
          }

          // All other dynamic columns with special data type formatting
          return {
            id: `attr-${item.physicalName}`,
            // Use dot notation for nested attributes.
            // Fallback to a custom accessor function if the physicalName might contain special characters.
            accessorFn: (row) => row.attributes?.[item.physicalName],
            header: () => <div className="px-4 font-bold">{item.name}</div>,
            cell: ({ getValue }) => {
              const value = getValue()
              const dataType = item.dataType

              // Added a specific handler for the 'json' dataType.
              if (dataType === 'json') {
                // Ensure we don't render null/undefined or empty objects.
                if (
                  value === null ||
                  typeof value !== 'object' ||
                  Object.keys(value).length === 0
                ) {
                  return <span className="italic text-gray-400">empty</span>
                }
                // Pretty-print the JSON object for readability.
                const formattedJson = JSON.stringify(value, null, 2)
                return (
                  <pre className="max-h-24 overflow-y-auto rounded-md bg-gray-100 p-2 text-xs dark:bg-gray-800">
                    <code>{formattedJson}</code>
                  </pre>
                )
              }

              // Updated boolean and array to use the same pretty-print logic.
              if (dataType === 'boolean' || dataType === 'array') {
                return JSON.stringify(value)
              }

              if (dataType === 'date') {
                return formatDate(value as any) // Assumes formatDate utility
              }

              // Ensure non-string values are converted to string to prevent render errors.
              if (value !== null && typeof value !== 'undefined') {
                return String(value)
              }

              return null // Render nothing if value is null or undefined
            },
          }
        }) || []

    // If 'code' is not in the dynamic fields, prepend default columns
    if (!isExistCodeInFields) {
      const defaultColumns: ColumnDef<MasterRdsEntity>[] = [
        {
          accessorKey: 'masterCode',
          meta: {
            size: '25%',
          },
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="コード" />
          ),
          cell: ({ row }) => (
            <Link
              className="block w-full overflow-hidden text-ellipsis text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              href={`${urlProvider.EDIT_DATA_PAGE_URL}/${encodeURIComponent(
                row.original.pk
              )}/${encodeURIComponent(
                row.original.sk
              )}?typeCodeId=${encodeURIComponent(currentSetting.id)}`}
            >
              {row.original.masterCode}
            </Link>
          ),
        },
        {
          accessorKey: 'name',
          meta: {
            size: '25%',
          },
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="名称" />
          ),
        },
      ]
      return [...defaultColumns, ...dynamicColumns]
    }

    return dynamicColumns
  }, [searchProps, currentSetting, isExistCodeInFields, tenantCode])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchProps?.typeCodeId) return
        const parts = searchProps?.typeCodeId.split('#')
        const pk = `${parts[0]}#${parts[1]}`
        const sk = `${parts[2]}#${parts.slice(3).join('#')}`

        const { data } = await httpClient.get<SettingDataEntity>(
          `${API_URLS.SETTING.GET_ONE}/${encodeURIComponent(`${pk!}#${sk!}`)}`
        )
        setCurrentSetting(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [searchProps?.typeCodeId])

  const pagination = useMemo(
    () => ({
      pageIndex: (searchProps?.page ?? 1) - 1,
      pageSize: searchProps?.count ?? countDefault,
    }),
    [searchProps]
  )

  const sorting = useMemo(() => {
    if (!searchProps?.ordering) return []
    const desc = searchProps.ordering.startsWith('-')
    const id = desc ? searchProps.ordering.substring(1) : searchProps.ordering
    return [{ id, desc }]
  }, [searchProps?.ordering])

  const onClickPrev = () => {
    navigate(urlProvider.SETTINGS_PAGE_URL)
  }

  if (!currentSetting) return <LoadingOverlay isLoading />

  return (
    <>
      <div>
        <Accordion
          defaultValue={accordion}
          className="flex flex-col gap-2"
          value={accordion}
          type="multiple"
          onValueChange={(e) => setAccordion(e)}
        >
          {searchProps.typeCode && (
            <AccordionItem
              value={AccordionValue.SETTING}
              className="card border-none shadow-sm"
            >
              <AccordionTrigger className="bg-emphasis focus:!bg-emphasis w-full overflow-hidden text-ellipsis px-6 py-3 text-lg text-white focus:!text-white focus:!outline-0">
                {`${currentSetting?.code}:${currentSetting.name} 設定情報`}
              </AccordionTrigger>
              <AccordionContent className="flex justify-center">
                <div className="flex w-[85%] flex-col items-center justify-center px-6 py-2">
                  <div className="w-full pb-3 md:w-[90%] lg:w-[85%]">
                    <table className="block w-full border-collapse">
                      <tbody className="block w-full">
                        <tr className="border-foreground/80 block w-full border-b">
                          <th className="lg:text-md inline-block w-[4rem] py-2 text-left text-sm font-semibold">
                            コード
                          </th>
                          <td className="lg:text-md inline-block w-[calc(100%-6rem)] py-2 pl-8 text-sm">
                            {currentSetting?.code}
                          </td>
                        </tr>
                        <tr className="border-foreground/80 block w-full border-b">
                          <th className="lg:text-md inline-block w-[4rem] py-2 text-left text-sm font-semibold">
                            名称
                          </th>
                          <td className="lg:text-md inline-block w-[calc(100%-6rem)] py-2 pl-8 text-sm">
                            {currentSetting?.name}
                          </td>
                        </tr>
                        <tr className="border-foreground/80 block w-full border-b">
                          <th className="lg:text-md inline-block w-[4rem] py-2 text-left text-sm font-semibold">
                            説明
                          </th>
                          <td className="lg:text-md inline-block w-[calc(100%-6rem)] py-2 pl-8 text-sm">
                            {currentSetting?.attributes?.description}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Link
                    href={
                      currentSetting
                        ? `${
                            urlProvider.EDIT_SETTINGS_PAGE_URL
                          }/${encodeURIComponent(
                            currentSetting.pk
                          )}/${encodeURIComponent(currentSetting.sk)}`
                        : '#'
                    }
                  >
                    <Button variant="default" size="default">
                      詳細
                    </Button>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem
            // onClick={() => {
            //   setAccordion((prev) => {
            //     console.log('prev', prev)
            //     // console.log('prev.includes(AccordionValue.DATA_SEARCH)', prev.includes(AccordionValue.DATA_SEARCH))
            //     // console.log('prev.indexOf(AccordionValue.DATA_SEARCH)', prev.indexOf(AccordionValue.DATA_SEARCH))
            //     // if (prev.includes(AccordionValue.DATA_SEARCH)) {
            //     //   return prev.splice(prev.indexOf(AccordionValue.DATA_SEARCH), 1)
            //     // }
            //     // return [...new Set([...prev, AccordionValue.DATA_RESULT, AccordionValue.DATA_SEARCH])]
            //   })
            // }}

            value={AccordionValue.DATA_SEARCH}
            className="card border-none shadow-sm"
          >
            <AccordionTrigger className="bg-emphasis focus:!bg-emphasis px-6 py-3 text-lg text-white focus:!text-white focus:!outline-0">
              データを検索する
            </AccordionTrigger>
            <AccordionContent className="flex flex-col justify-center p-0">
              <div className="py-3">
                <Form {...form}>
                  <form
                    onSubmit={handleSubmit((onValid) => {
                      onSubmitSearch(onValid)
                    })}
                  >
                    <div className="w-fullitems-center flex w-full flex-col justify-center px-3">
                      <div className="flex w-full gap-10">
                        <div className="flex w-fit flex-col gap-4">
                          <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                            コード
                          </div>
                          <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                            名称
                          </div>
                          <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                            削除済み含む
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-4">
                          <FormField
                            control={control}
                            name="code"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name="keyword"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name="isDeleted"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center space-x-2 pt-2">
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="is-deleted"
                                  />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-5 px-3">
                      <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        検索
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClear}
                      >
                        <X className="mr-2 h-4 w-4" />
                        クリア
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value={AccordionValue.DATA_RESULT}
            className="card border-none shadow-sm"
          >
            <AccordionTrigger className="bg-emphasis focus:!bg-emphasis px-6 py-3 text-lg text-white focus:!text-white focus:!outline-0">
              データ一覧
            </AccordionTrigger>
            <AccordionContent className="flex flex-col justify-center">
              <>
                <div className="my-3 flex justify-end gap-4 px-3">
                  <AddJsonData
                    tenantCode={tenantCode}
                    onSave={async () => {
                      // Refresh data after all items are successfully created
                      await initSearch()
                    }}
                  />
                  <Button
                    onClick={() =>
                      router.push(
                        `${
                          urlProvider.ADD_DATA_PAGE_URL
                        }?typeCode=${encodeURIComponent(
                          searchProps.typeCode
                        )}&typeCodeId=${encodeURIComponent(currentSetting.id)}`
                      )
                    }
                  >
                    新規登録
                  </Button>
                </div>
                {/* <Pagination
                  className="px-3"
                  paginate={paginate}
                  columns={columns}
                  rowKey={(row) => row.id}
                  onChange={onChangeTable}
                  count={searchProps?.count ?? countDefault}
                  page={searchProps?.page}
                /> */}
                <div className="px-3">
                  <DataTable
                    columns={columns}
                    data={paginate?.results ?? []}
                    pageCount={
                      paginate
                        ? Math.ceil(paginate.count / pagination.pageSize)
                        : 0
                    }
                    rowCount={paginate?.count ?? 0}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    sorting={sorting}
                    onSortingChange={handleSortChange}
                    rowKey="id"
                  />
                </div>
              </>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <BackButton onClickPrev={onClickPrev} />
    </>
  )
}
