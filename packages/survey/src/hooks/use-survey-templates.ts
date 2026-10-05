import type {
  SurveyTemplateControllerSearchDataResponse,
  SurveyTemplateDataListEntity,
} from '../types'
import { clientAxiosInstance } from '../client/http'
import { useEffect, useState } from 'react'

type UseSurveyTemplatesParams = {
  page: number
  pageSize: number
  keyword?: string
  orderBy?: string
  orderType?: 'asc' | 'desc'
}

type UseSurveyTemplatesReturn = {
  surveys: SurveyTemplateDataListEntity['items']
  totalItems: number
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch survey templates with pagination and search using pure axios
 *
 * @param params - Query parameters for fetching survey templates
 * @returns Object containing surveys data, loading state, and error
 */
export const useSurveyTemplates = (
  params: UseSurveyTemplatesParams
): UseSurveyTemplatesReturn => {
  const { page, pageSize, keyword, orderBy, orderType } = params

  const [surveys, setSurveys] = useState<SurveyTemplateDataListEntity['items']>(
    []
  )
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSurveys = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response =
        await clientAxiosInstance.get<SurveyTemplateControllerSearchDataResponse>(
          '/api/survey-template',
          {
            params: {
              page,
              pageSize,
              keyword: keyword || undefined,
              orderBys: orderBy
                ? [`${orderBy}:${orderType ?? 'desc'}`]
                : undefined,
            },
          }
        )

      const data = response.data
      setSurveys(data.items ?? [])
      setTotalItems(data.total ?? 0)
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error('Failed to fetch survey templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys()
  }, [page, pageSize, keyword, orderBy, orderType])

  return {
    surveys,
    totalItems,
    isLoading,
    error,
    refetch: fetchSurveys,
  }
}
