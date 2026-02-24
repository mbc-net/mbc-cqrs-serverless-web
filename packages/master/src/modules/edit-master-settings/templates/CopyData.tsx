'use client'

import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import Link from 'next/link'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

// Local Project Imports
import { API_URLS } from '../../../lib/constants/url'
import useHealthCheck from '../../../lib/hook/useHealthCheck'
import { cn } from '../../../lib/utils'
import { getYYYYMMDD_HHMMSS } from '../../../lib/utils/datetime'
import { statusClassMap, statusLabelMap } from '../constant'

import { BackButton } from '../../../components/buttons/back-button'
import { DataTable } from '../../../components/table/data-table'
import { Badge } from '../../../components/ui/badge'
import { useLoadingStore } from '../../../lib/stores/hooks'
import {
  useHttpClient,
  useUrlProvider,
  useUserContext,
} from '../../../provider'
import { TaskEntity } from '../../../types/TaskEntity'
export default function CopyMasterSettings() {
  const user = useUserContext()
  const tenantCode = user.tenantCode
  const urlProvider = useUrlProvider()
  let rawParams = useParams<{ pk?: string; sk?: string }>()
  const params = {
    pk: rawParams.pk ? decodeURIComponent(rawParams.pk) : undefined,
    sk: rawParams.sk ? decodeURIComponent(rawParams.sk) : undefined,
  }
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const httpClient = useHttpClient()
  // --- State Management ---
  const [data, setData] = useState<TaskEntity[]>([])
  const loadingStore = useLoadingStore()
  const [sorting, setSorting] = useState<SortingState>([]) // Required for DataTable
  useHealthCheck()

  // --- Derived State from URL for Pagination ---
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: (parseInt(searchParams.get('page') || '1', 10) || 1) - 1,
      pageSize: parseInt(searchParams.get('pageSize') || '10', 10) || 10,
    }),
    [searchParams]
  )

  // --- Data Fetching ---
  useEffect(() => {
    if (!params?.pk || !params?.sk) return

    const fetchData = async () => {
      loadingStore.setLoading()
      try {
        const res = await httpClient.get<TaskEntity[]>(
          API_URLS.TASK.PARENT_TASK,
          {
            params: { masterSettingCode: params.sk.split('#').at(-1) },
          }
        )
        setData(res.data)
      } catch (error) {
        console.error('Failed to fetch copy results:', error)
      } finally {
        loadingStore.closeLoading()
      }
    }
    fetchData()
  }, [params?.pk, params?.sk, loadingStore, httpClient])

  // --- Event Handlers ---
  const handlePaginationChange = (newState: PaginationState) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', (newState.pageIndex + 1).toString())
    newSearchParams.set('pageSize', newState.pageSize.toString())
    router.replace(`${pathname}?${newSearchParams.toString()}`)
  }

  // --- Client-side Data Slicing ---
  const paginatedData = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    return data.slice(startIndex, endIndex)
  }, [data, pagination.pageIndex, pagination.pageSize])

  // --- Column Definitions for Tanstack Table ---
  const columns: ColumnDef<TaskEntity>[] = useMemo(
    () => [
      {
        header: '名前',
        accessorKey: 'sk',
        cell: ({ row }) => (
          <Link
            className="block w-full overflow-hidden text-ellipsis text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] hover:underline"
            href={`${urlProvider.getDetailedCopySettingPageUrl(
              `${encodeURIComponent(params.pk!)}/${encodeURIComponent(
                params.sk!
              )}`
            )}/${encodeURIComponent(row.original['id'])}`}
          >
            {row.original['sk'].slice('MASTER_COPY_'.length)}
          </Link>
        ),
      },
      {
        header: '開始時間',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => (
          <div>{getYYYYMMDD_HHMMSS(getValue() as Date)}</div>
        ),
      },
      {
        header: '終了時間',
        accessorKey: 'updatedAt',
        cell: ({ row }) => (
          <div>
            {row.original.status === 'COMPLETED'
              ? getYYYYMMDD_HHMMSS(row.original.updatedAt)
              : '-'}
          </div>
        ),
      },
      {
        header: '総数',
        accessorFn: (row) => row.attributes?.subTaskCount,
        cell: ({ getValue }) => (
          <div className="text-center">{getValue() as number}</div>
        ),
      },
      {
        header: '実行中数',
        accessorFn: (row) => row.attributes?.subTaskRunningCount,
        cell: ({ getValue }) => (
          <div className="text-center">{getValue() as number}</div>
        ),
      },
      {
        header: '成功数',
        accessorFn: (row) => row.attributes?.subTaskSucceedCount,
        cell: ({ getValue }) => (
          <div className="text-center">{getValue() as number}</div>
        ),
      },
      {
        header: '失敗数',
        accessorFn: (row) => row.attributes?.subTaskFailedCount,
        cell: ({ getValue }) => (
          <div className="text-center">{getValue() as number}</div>
        ),
      },
      {
        header: '状態',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Badge
              className={cn(
                'whitespace-nowrap text-center',
                statusClassMap[status]
              )}
              variant="outline"
            >
              {statusLabelMap[status] || status}
            </Badge>
          )
        },
      },
    ],
    [tenantCode, params.pk, params.sk]
  )

  return (
    <div className="p-4">
      <h3 className="mb-5 text-lg font-semibold">コピー結果一覧</h3>

      <DataTable
        columns={columns}
        data={paginatedData}
        rowCount={data.length}
        pageCount={Math.ceil(data.length / pagination.pageSize)}
        // Pagination
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        // Sorting (required by DataTable, but not implemented for this page)
        sorting={sorting}
        onSortingChange={setSorting}
        rowKey="id"
      />

      <BackButton onClickPrev={() => router.back()} />
    </div>
  )
}
