'use client'

import { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import {
  parseAsBoolean,
  parseAsString,
  UseQueryStatesKeysMap,
} from 'next-usequerystate'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { countDefault } from '../../../lib/constants/define'
import { API_URLS } from '../../../lib/constants/url'
import { usePagination } from '../../../lib/hook/usePagination'
import { formatDate } from '../../../lib/utils/datetime'
import { SettingDataEntity } from '../../../types'
import { Paginate } from '../../../types/common'
import { SearchPropsMasterData } from '../../../types/master-data'
import { PaginateProps } from '../../../types/pagination'

import { CommonButton } from '../../../components/buttons'
import { DataTable } from '../../../components/table/data-table'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Checkbox } from '../../../components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { MultiSelectCombobox } from '../../../components/ui/multi-select-combobox'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group'
import { Switch } from '../../../components/ui/switch'
import { useToast } from '../../../components/ui/use-toast'
import { useLoadingForm } from '../../../lib/hook/useLoadingForm'
import {
  useHttpClient,
  useUrlProvider,
  useUserContext,
} from '../../../provider'
import { DataCopyOptionDto } from '../../../types/DataCopyOptionDto'
import { MasterCopyDto } from '../../../types/MasterCopyDto'
import { MasterRdsEntity } from '../../../types/MasterRdsEntity'

// --- Main Component ---

export default function NewCopyMasterSettings() {
  const user = useUserContext()
  const tenantCode = user.tenantCode
  const urlProvider = useUrlProvider()
  const { toast } = useToast()
  const router = useRouter()
  const rawParams = useParams<{ pk?: string; sk?: string }>()
  const params = {
    pk: rawParams.pk ? decodeURIComponent(rawParams.pk) : undefined,
    sk: rawParams.sk ? decodeURIComponent(rawParams.sk) : undefined,
  }
  const httpClient = useHttpClient()
  // --- State Management ---
  const [copyDestination, setCopyDestination] = useState('ALL') // 'ALL' or 'PARTIAL'
  const [copyMode, setCopyMode] = useState<MasterCopyDto.copyType>(
    MasterCopyDto.copyType.BOTH
  )
  const [isSubmitting, setSubmitting] = useState(false)
  const [chambersList, setChambersList] = useState<
    { value: string; label: string }[]
  >([])
  const [localChambersList, setLocalChambersList] = useState<string[]>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [currentSetting, setCurrentSetting] = useState<SettingDataEntity>()

  const selectedRowIds = useMemo(
    () => Object.keys(rowSelection),
    [rowSelection]
  )
  const isExistCodeInFields = useMemo(
    () =>
      currentSetting?.attributes?.fields?.some(
        (field) => field.physicalName === 'code'
      ),
    [currentSetting]
  )

  // --- Form & Pagination Hooks ---
  const searchPropDefinitions: UseQueryStatesKeysMap<SearchPropsMasterData> = {
    code: parseAsString.withDefault(''),
    keyword: parseAsString.withDefault(''),
    isDeleted: parseAsBoolean.withDefault(false),
    typeCode: parseAsString.withDefault(''),
    typeCodeId: parseAsString.withDefault(''),
  }
  const { form, loading, loadingStore, control, handleSubmit, reset, errors } =
    useLoadingForm<SearchPropsMasterData>({
      defaultValues: {
        code: '',
        keyword: '',
        isDeleted: false,
      },
    })
  const getData = async (data: SearchPropsMasterData) => {
    const props: PaginateProps = {
      ...data,
      page: data?.page || 1,
      count: data?.count || countDefault,
      pageSize: data?.count || countDefault,
    }
    const paginate = (
      await httpClient.get(API_URLS.DATA.GET_ALL, {
        params: {
          ...props,
          settingCode: params.sk.split('#').at(-1),
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
    rootPath: urlProvider.getCopySettingPageUrl(
      `${encodeURIComponent(params.pk)}/${encodeURIComponent(params.sk)}`
    ),
  })

  // --- Data Fetching Effects ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const settingRes = await httpClient.get<SettingDataEntity>(
          `${API_URLS.DATA.GET_ONE}/${encodeURIComponent(
            `${params.pk!}#${params.sk!}`
          )}`
        )
        setCurrentSetting(settingRes.data)

        const cciRes = await httpClient.get(API_URLS.CCI)
        setChambersList(
          cciRes.data.map((el: any) => ({
            value: el['商工会議所番号'],
            label: el['商工会議所名_和文'],
          }))
        )
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
    }
    fetchInitialData()
  }, [params.pk, params.sk])

  useEffect(() => {
    if (isCalledSearch && copyMode === MasterCopyDto.copyType.DATA_ONLY) {
      executeSearch()
    }
  }, [isCalledSearch, copyMode, executeSearch])

  // --- Event Handlers ---
  const handleCreateCopy = async () => {
    setSubmitting(true)
    const requestBody: MasterCopyDto = {
      masterSettingId: `${params.pk}#${params.sk}`,
      targetTenants:
        localChambersList.length > 0
          ? localChambersList
          : chambersList.map((el) => `${el.value}`),
      copyType: copyMode,
      ...(copyMode === MasterCopyDto.copyType.DATA_ONLY && {
        dataCopyOption: {
          mode:
            selectedRowIds.length > 0
              ? DataCopyOptionDto.mode.PARTIAL
              : DataCopyOptionDto.mode.ALL,
          id: selectedRowIds,
        },
      }),
    }
    try {
      await httpClient.post(API_URLS.MASTER_COPY, requestBody)
      toast({
        description: '汎用マスタコピーを登録しました。',
        variant: 'success',
      })
      router.back()
    } catch (error) {
      toast({
        title: '汎用マスタコピーの登録に失敗しました。',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      await initSearch()
    })()
  }, [])

  // 一覧を取得(検索ボタンクリック時)
  useEffect(() => {
    if (copyMode !== MasterCopyDto.copyType.DATA_ONLY) return
    ;(async () => {
      await executeSearch()
    })()
  }, [isCalledSearch, copyMode])

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
  const columns: ColumnDef<MasterRdsEntity>[] = useMemo(() => {
    // This is the special column for rendering checkboxes.
    const selectionColumn: ColumnDef<MasterRdsEntity> = {
      id: 'select',
      header: ({ table }) => (
        <div className="flex w-full items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="-mx-1 flex w-full items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
    }

    const dynamicColumns: ColumnDef<MasterRdsEntity>[] =
      currentSetting?.attributes?.fields
        ?.filter((field) => field.isShowedOnList)
        .map((item) => {
          if (item.physicalName === 'code') {
            return {
              id: item.physicalName,
              accessorKey: 'masterCode',
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title={item.name} />
              ),
              cell: ({ row }) => (
                <div className="block w-full overflow-hidden text-ellipsis text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]">
                  {row.original.masterCode}
                </div>
              ),
            }
          }

          if (item.physicalName === 'seq' || item.physicalName === 'name') {
            return {
              accessorKey: item.physicalName,
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title={item.name} />
              ),
            }
          }

          return {
            id: `attr-${item.physicalName}`,
            accessorFn: (row) => row.attributes?.[item.physicalName],
            header: () => <div className="px-4 font-bold">{item.name}</div>,
            cell: ({ getValue }) => {
              const value = getValue()
              const dataType = item.dataType

              if (dataType === 'boolean' || dataType === 'array') {
                return JSON.stringify(value)
              }
              if (dataType === 'date') {
                return formatDate(value as any)
              }
              return value
            },
          }
        }) || []

    if (!isExistCodeInFields) {
      const defaultColumns: ColumnDef<MasterRdsEntity>[] = [
        {
          accessorKey: 'masterCode',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="コード" />
          ),
          cell: ({ row }) => (
            <div className="block w-full overflow-hidden text-ellipsis text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]">
              {row.original.masterCode}
            </div>
          ),
        },
        {
          accessorKey: 'name',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="名称" />
          ),
        },
      ]
      return [selectionColumn, ...defaultColumns, ...dynamicColumns]
    }

    return [selectionColumn, ...dynamicColumns]
  }, [currentSetting, isExistCodeInFields])

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
    return [
      {
        id: desc ? searchProps.ordering.substring(1) : searchProps.ordering,
        desc,
      },
    ]
  }, [searchProps?.ordering])

  // --- Render ---
  return (
    <div className="space-y-6 p-5">
      <Card>
        <CardHeader>
          <CardTitle>データのコピー先</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={copyDestination}
            onValueChange={setCopyDestination}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={DataCopyOptionDto.mode.ALL}
                id="dest_all"
              />
              <label htmlFor="dest_all">全商工会議所</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={DataCopyOptionDto.mode.PARTIAL}
                id="dest_partial"
              />
              <label htmlFor="dest_partial">指定した商工会議所</label>
            </div>
          </RadioGroup>
          {copyDestination === DataCopyOptionDto.mode.PARTIAL && (
            <div className="mt-2 px-5">
              <div>各地会議所選択してください</div>
              <MultiSelectCombobox
                options={chambersList}
                selected={localChambersList}
                onChange={setLocalChambersList}
                placeholder="データのコピー先を選択してください"
                className="mt-3 w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>コピーデータ</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={copyMode}
            onValueChange={(v) => setCopyMode(v as MasterCopyDto.copyType)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={MasterCopyDto.copyType.BOTH}
                id="mode_both"
              />
              <label htmlFor="mode_both">設定データ & 全マスタデータ</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={MasterCopyDto.copyType.SETTING_ONLY}
                id="mode_setting"
              />
              <label htmlFor="mode_setting">設定データのみ</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={MasterCopyDto.copyType.DATA_ONLY}
                id="mode_data"
              />
              <label htmlFor="mode_data">指定したマスタデータのみ</label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {copyMode === MasterCopyDto.copyType.DATA_ONLY && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(
                  (onValid) => {
                    onSubmitSearch(onValid)
                  }
                  //   () => scrollToError(errors)
                )}
              >
                <div className="w-fullitems-center flex flex-col justify-center px-6">
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                  <div className="flex justify-end gap-5">
                    <Button type="submit">
                      <Search className="mr-2 h-4 w-4" />
                      検索
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            <div style={{ marginBottom: 16 }}>
              <span style={{ marginLeft: 8 }}>
                {selectedRowIds.length > 0
                  ? `選択した ${selectedRowIds.length} つのアイテム`
                  : ''}
              </span>
            </div>

            <DataTable
              columns={columns}
              data={paginate?.results ?? []}
              rowCount={paginate?.count ?? 0}
              pageCount={
                paginate ? Math.ceil(paginate.count / pagination.pageSize) : 0
              }
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              sorting={sorting}
              onSortingChange={handleSortChange}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              rowKey="id"
            />
          </CardContent>
        </Card>
      )}

      <div className="mt-10 flex justify-evenly">
        <CommonButton
          className="min-w-[200px] shadow-[0px_4px_8px_#00000065]"
          variant="outline"
          onClick={() => router.back()}
        >
          戻る
        </CommonButton>
        <CommonButton
          className="min-w-[200px] shadow-[0px_4px_8px_#00000065]"
          variant="primary"
          onClick={handleCreateCopy}
          loading={isSubmitting}
        >
          コピー登録
        </CommonButton>
      </div>
    </div>
  )
}
