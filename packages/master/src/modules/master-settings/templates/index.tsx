// src/common/master-ms/modules/master-settings/templates/index.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { parseAsString, UseQueryStatesKeysMap } from 'next-usequerystate'
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Search, X } from 'lucide-react'
import { CommonButton } from '../../../components/buttons'
import { BackButton } from '../../../components/buttons/back-button'
import { DataTable } from '../../../components/table/data-table'
import { Button } from '../../../components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { countDefault } from '../../../lib/constants/define'
import { API_URLS } from '../../../lib/constants/url'
import useHealthCheck from '../../../lib/hook/useHealthCheck'
import { useLoadingForm } from '../../../lib/hook/useLoadingForm'
import { useNavigation } from '../../../lib/hook/useNavigation'
import { usePagination } from '../../../lib/hook/usePagination'
import {
  useHttpClient,
  useUrlProvider,
  useUserContext,
} from '../../../provider'
import { Paginate } from '../../../types/common'
import { SearchPropsMasterSetting } from '../../../types/master-setting'
import { MasterRdsEntity } from '../../../types/MasterRdsEntity'
import { MasterRdsListEntity } from '../../../types/MasterRdsListEntity'
import { PaginateProps } from '../../../types/pagination'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'
import AddJsonData, { MapResult } from '../components/AddJsonData'
import '../../../components/JsonEditor'

// Re-export mapper types for external usage
export type {
  MapResult,
  MappedSetting,
  MappedData,
} from '../components/AddJsonData'

// type MappedSetting = {
//   kind: 'setting'
//   value: {
//     name: string
//     code: string
//     tenantCode?: string
//     settingValue: Record<string, any>
//   }
// }

// type MappedData = {
//   kind: 'data'
//   value: {
//     settingCode: string
//     code: string
//     name: string
//     seq: number
//     attributes: Record<string, any>
//     tenantCode?: string
//   }
// }

// type MapResult = MappedSetting | MappedData

export default function MasterSetting({
  inputSampleJson,
  mapRawItem,
}: {
  inputSampleJson?: string
  mapRawItem?: (raw: unknown) => MapResult | null | undefined
}) {
  const user = useUserContext()
  const tenantCode = user.tenantCode
  const urlProvider = useUrlProvider()

  const httpClient = useHttpClient()

  const { loadingStore, control, handleSubmit, reset } =
    useLoadingForm<SearchPropsMasterSetting>({
      defaultValues: {
        code: '',
        name: '',
        keyword: '',
      },
    })
  const { navigate } = useNavigation()
  const form = useForm<SearchPropsMasterSetting>()

  const searchPropDefinitions: UseQueryStatesKeysMap<SearchPropsMasterSetting> =
    {
      code: parseAsString.withDefault(''),
      name: parseAsString.withDefault(''),
      keyword: parseAsString.withDefault(''),
      ordering: parseAsString.withDefault(''),
    }

  const getData = async (
    data: SearchPropsMasterSetting
  ): Promise<Paginate<MasterRdsEntity>> => {
    const props: PaginateProps = {
      ...data,
      page: data?.page || 1,
      count: data?.count || countDefault,
      pageSize: data?.count || countDefault,
    }
    const res = (
      await httpClient.get<MasterRdsListEntity>(API_URLS.SETTING.GET_ALL, {
        params: {
          ...props,
          orderBys: data.ordering ? [data.ordering] : undefined,
        },
      })
    ).data
    return {
      count: res.total,
      results: res.items,
    }
  }

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
    SearchPropsMasterSetting,
    Paginate<MasterRdsEntity>
  >({
    searchPropDefinitions: searchPropDefinitions,
    getData: getData,
    reset: reset,
    rootPath: urlProvider.SETTINGS_PAGE_URL,
  })

  useEffect(() => {
    ;(async () => {
      await initSearch()
    })()
  }, [])

  useHealthCheck()

  useEffect(() => {
    if (isCalledSearch) {
      ;(async () => {
        await initSearch()
      })()
    }
  }, [isCalledSearch])

  const initSearch = async () => {
    const { paginate: newPaginate } = await executeSearch()
    if (newPaginate) {
      loadingStore.closeLoading()
    }
  }

  const columns: ColumnDef<MasterRdsEntity>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        meta: {
          size: '25%',
        },
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title="コード" />
        },
        cell: ({ row }) => (
          <Link
            prefetch={false}
            className="block w-full overflow-clip break-words text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] hover:underline"
            href={`${
              urlProvider.DATA_PAGE_URL
            }?isTypeCodeFixed=1&typeCode=${encodeURIComponent(
              row.original.code
            )}&typeCodeId=${encodeURIComponent(row.original.id)}`}
          >
            {row.original.code.split('#')[1]}
          </Link>
        ),
      },
      {
        accessorKey: 'name',
        meta: {
          size: '25%',
        },
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title="名称" />
        },
      },
      {
        accessorKey: 'attributes.description',
        meta: {
          size: '50%',
        },
        header: () => {
          return (
            <div className="flex w-full items-center justify-between px-4 font-bold">
              説明
            </div>
          )
        },
        cell: ({ row }) => (
          <div className="px-4">{row.original.attributes['description']}</div>
        ),
      },
    ],
    [tenantCode]
  )

  const onClickCreate = () => {
    navigate(urlProvider.ADD_SETTINGS_PAGE_URL)
  }

  const onClickPrev = () => {
    navigate(urlProvider.TOP_URL)
  }

  const handleClear = () => {
    const clearedValues: SearchPropsMasterSetting = {
      code: '',
      name: '',
      keyword: '',
    }
    reset(clearedValues)
    onSubmitSearch(clearedValues)
  }

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

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full py-3">
          <Form {...form}>
            <form
              className="w-full"
              onSubmit={handleSubmit((onValid) => {
                onSubmitSearch(onValid)
              })}
            >
              <div className="flex w-full flex-col items-center justify-center px-3">
                <div className="flex w-full gap-10">
                  <div className="flex w-fit flex-col gap-4">
                    <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                      コード
                    </div>
                    <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                      名称
                    </div>
                    <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                      説明
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
                      name="name"
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
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-5 px-3">
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  検索
                </Button>
                <Button type="button" variant="secondary" onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" />
                  クリア
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="mx-3 mb-2 flex justify-end gap-2 pt-3">
        <AddJsonData
          tenantCode={tenantCode}
          inputSampleJson={inputSampleJson}
          mapRawItem={mapRawItem}
          onSave={async () => {
            // Refresh data after all items are successfully created
            await initSearch()
          }}
        />
        <CommonButton variant="primary" onClick={onClickCreate}>
          新規作成
        </CommonButton>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={paginate?.results ?? []}
          pageCount={
            paginate ? Math.ceil(paginate.count / pagination.pageSize) : 0
          }
          rowCount={paginate?.count ?? 0}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          sorting={sorting}
          onSortingChange={handleSortChange}
          rowKey="id"
        />
      </div>

      <BackButton onClickPrev={onClickPrev} />
    </>
  )
}
