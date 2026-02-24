'use client'

import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { API_URLS } from '../../../lib/constants/url'
import { cn } from '../../../lib/utils'
import { getYYYYMMDD_HHMMSS } from '../../../lib/utils/datetime'
import { statusClassMap, statusLabelMap } from '../constant'

import { BackButton } from '../../../components/buttons/back-button'
import { DataTable } from '../../../components/table/data-table'
import { Badge } from '../../../components/ui/badge'
import { useLoadingStore } from '../../../lib/stores/hooks'
import { useHttpClient } from '../../../provider'
import { TaskEntity } from '../../../types/TaskEntity'

// --- Helper Functions ---
function extractKeys(input: string): { pk: string; sk: string } {
  const [pkPart, ...skParts] = input.split('#')
  const pk = `${pkPart}#${skParts[0]}`
  const sk = skParts.slice(1).join('#')
  return { pk, sk }
}

// --- Main Component ---
export default function DetailCopy() {
  const rawParams = useParams<{ pk?: string; sk?: string; id?: string }>()
  const params = {
    pk: rawParams.pk ? decodeURIComponent(rawParams.pk) : undefined,
    sk: rawParams.sk ? decodeURIComponent(rawParams.sk) : undefined,
    id: rawParams.id ? decodeURIComponent(rawParams.id) : undefined,
  }
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const httpClient = useHttpClient()

  // --- State Management ---
  const [data, setData] = useState<TaskEntity[]>([])
  const loadingStore = useLoadingStore()
  const [sorting, setSorting] = useState<SortingState>([])

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: (parseInt(searchParams.get('page') || '1', 10) || 1) - 1,
      pageSize: parseInt(searchParams.get('pageSize') || '10', 10) || 10,
    }),
    [searchParams]
  )

  const paginatedData = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    return data.slice(startIndex, endIndex)
  }, [data, pagination.pageIndex, pagination.pageSize])

  useEffect(() => {
    if (!params?.id) return

    const fetchData = async () => {
      try {
        loadingStore.setLoading()
        const taskKey = extractKeys(params.id)
        const res = (
          await httpClient.get<TaskEntity[]>(
            `${API_URLS.TASK.DETAIL}/${encodeURIComponent(
              `${taskKey.pk}#${taskKey.sk}#0`
            )}`
          )
        ).data
        setData(res)
      } catch (error) {
        console.error('Failed to fetch task details:', error)
      } finally {
        loadingStore.closeLoading()
      }
    }

    fetchData()
  }, [params?.id, loadingStore, httpClient])

  const handlePaginationChange = (newState: PaginationState) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', (newState.pageIndex + 1).toString())
    newSearchParams.set('pageSize', newState.pageSize.toString())
    router.replace(`${pathname}?${newSearchParams.toString()}`)
  }

  const columns: ColumnDef<TaskEntity>[] = useMemo(
    () => [
      {
        header: 'テナントコード',
        accessorFn: (row) => row.input?.targetTenants?.[0],
        cell: ({ getValue }) => (
          <div className="text-center font-bold">{getValue() as string}</div>
        ),
      },
      {
        header: '状態',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue<string>()
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
      {
        header: '開始時間',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => getYYYYMMDD_HHMMSS(getValue<Date>()),
      },
      {
        header: '終了時間',
        accessorKey: 'updatedAt',
        cell: ({ row }) =>
          row.original.status === 'COMPLETED'
            ? getYYYYMMDD_HHMMSS(row.original.updatedAt)
            : '-',
      },
      {
        header: 'メッセージ',
        accessorFn: (row) =>
          row.attributes?.error
            ? row.attributes.error.split('\n')[0]
            : 'コピー成功',
      },
      {
        header: 'タスクID',
        accessorKey: 'sk',
      },
    ],
    []
  )

  return (
    <div className="p-4">
      <h3 className="mb-5 text-lg font-semibold">コピー結果詳細</h3>
      <DataTable
        columns={columns}
        data={paginatedData}
        rowCount={data.length}
        pageCount={Math.ceil(data.length / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        sorting={sorting}
        onSortingChange={setSorting}
        rowKey="id"
      />
      <BackButton onClickPrev={() => router.back()} />
    </div>
  )
}
