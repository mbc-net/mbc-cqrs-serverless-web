'use client'

import type { SurveyTemplateDataEntity } from '../../../types'
import { Container } from '../../../ui/container'
import { useSurveyTemplates } from '../../../hooks/use-survey-templates'
import { useRouter } from 'next/navigation'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useCallback, useMemo } from 'react'
import {
  SearchHeader,
  SurveyList,
  SurveyTemplateErrorBoundary,
  SurveyTemplateLoadingState,
} from '../components'

export function SurveyTemplatePage() {
  const [searchParams, setSearchParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    keyword: parseAsString.withDefault(''),
  })
  const router = useRouter()
  const { surveys, totalItems, isLoading, error } = useSurveyTemplates({
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    keyword: searchParams.keyword,
  })

  // Memoize handlers to prevent unnecessary re-renders
  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page })
    },
    [setSearchParams]
  )

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setSearchParams({ pageSize, page: 1 })
    },
    [setSearchParams]
  )

  const handleCreateNew = useCallback(() => {
    router.push('/dashboard/survey-management/create')
  }, [])

  const handleSurveyClick = useCallback((survey: SurveyTemplateDataEntity) => {
    router.push(`/dashboard/survey-management/${encodeURIComponent(survey.id)}`)
  }, [])

  // Memoize survey data to prevent unnecessary re-renders
  const surveyData = useMemo(
    () => ({
      items: surveys,
      total: totalItems,
    }),
    [surveys, totalItems]
  )

  return (
    <SurveyTemplateErrorBoundary>
      <Container className="flex flex-col gap-9">
        <SearchHeader onCreateNew={handleCreateNew} />

        {isLoading ? (
          <SurveyTemplateLoadingState />
        ) : (
          <SurveyList
            surveys={surveyData}
            error={error}
            onClick={handleSurveyClick}
            page={searchParams.page}
            pageSize={searchParams.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </Container>
    </SurveyTemplateErrorBoundary>
  )
}
