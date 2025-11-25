'use client'

import type {
  SurveyTemplateCreateDto,
  SurveyTemplateDataEntity,
  SurveyTemplateUpdateDto,
} from '../types'
import type { SurveySchemaType } from '../types/schema'
import { clientAxiosInstance } from '../client/http'
import { useSubscribeCommandStatus } from '../client/appsync/useSubscribeMessage'
import type { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface UseEditSurveyTemplateProps {
  id?: string
}

interface UseEditSurveyTemplateReturn {
  // Data
  surveyData: SurveyTemplateDataEntity | null
  currentSchema: SurveySchemaType | null
  originalSchema: SurveySchemaType | null

  // States
  isLoading: boolean
  isSubmitting: boolean
  error: Error | null

  // Actions
  setCurrentSchema: (schema: SurveySchemaType | null) => void
  handleCreateSurvey: (schema: SurveySchemaType) => Promise<void>
  handleUpdateSurvey: (schema: SurveySchemaType) => Promise<void>
  retryFetchSurvey: () => Promise<void>

  // Computed
  isSchemaChanged: boolean
  isButtonDisabled: boolean
  submitButtonRef: React.RefObject<HTMLButtonElement>
}

export function useEditSurveyTemplate({
  id,
}: UseEditSurveyTemplateProps): UseEditSurveyTemplateReturn {
  const router = useRouter()
  const [surveyData, setSurveyData] = useState<SurveyTemplateDataEntity | null>(
    null
  )
  const [currentSchema, setCurrentSchema] = useState<SurveySchemaType | null>(
    null
  )
  const [originalSchema, setOriginalSchema] = useState<SurveySchemaType | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(
    null as unknown as HTMLButtonElement
  )

  const { start } = useSubscribeCommandStatus(
    useCallback(
      async (msg) => {
        if (msg) {
          toast.success(
            id ? 'アンケートが更新されました' : 'アンケートが作成されました' // Survey updated successfully / Survey created successfully
          )
          router.push('/admin/survey-management')
        } else {
          toast.error(
            id
              ? 'アンケートの更新に失敗しました'
              : 'アンケートの作成に失敗しました' // Failed to update survey / Failed to create survey
          )
          setSubmitting(false)
        }
      },
      [id, router]
    )
  )

  // Deep comparison function for schemas
  const isSchemaChanged = useCallback((): boolean => {
    if (!currentSchema) return false
    if (!originalSchema) return false
    return JSON.stringify(currentSchema) !== JSON.stringify(originalSchema)
  }, [currentSchema, originalSchema])

  // Check if the button should be disabled
  const isEditMode = Boolean(id)
  const isButtonDisabled = isSubmitting || (isEditMode && !isSchemaChanged())

  const handleCreateSurvey = useCallback(
    async (schema: SurveySchemaType) => {
      setSubmitting(true)
      setError(null)
      let res: SurveyTemplateDataEntity | null = null
      try {
        res = (
          await clientAxiosInstance.post<
            SurveyTemplateDataEntity,
            AxiosResponse<SurveyTemplateDataEntity>,
            SurveyTemplateCreateDto
          >('/api/survey-template', {
            name: schema.title,
            attributes: {
              surveyTemplate: schema,
              description: schema.description,
            },
          })
        ).data
      } catch (error) {
        console.error('アンケートの作成に失敗しました', error) // Failed to create survey
        setError(error as Error)
      }

      if (!res?.requestId) {
        setSubmitting(false)
        toast.error('アンケートの作成に失敗しました') // Failed to create survey
        return
      }

      start(res.requestId)
    },
    [start]
  )

  const handleUpdateSurvey = useCallback(
    async (schema: SurveySchemaType) => {
      if (!id) return

      setSubmitting(true)
      setError(null)
      let res: SurveyTemplateDataEntity | null = null
      try {
        res = (
          await clientAxiosInstance.put<
            SurveyTemplateDataEntity,
            AxiosResponse<SurveyTemplateDataEntity>,
            SurveyTemplateUpdateDto
          >(`/api/survey-template/${id}`, {
            name: schema.title,
            attributes: {
              description: schema.description,
              surveyTemplate: schema,
            },
          })
        ).data
      } catch (error) {
        console.error('アンケートの更新に失敗しました', error) // Failed to update survey
        setError(error as Error)
      }
      if (!res?.requestId) {
        setSubmitting(false)
        toast.error('アンケートの更新に失敗しました') // Failed to update survey
        return
      }

      start(res.requestId)
    },
    [id, start]
  )

  const retryFetchSurvey = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      setError(null)
      const response = await clientAxiosInstance.get(
        `/api/survey-template/${id}`
      )
      const data = response.data
      setSurveyData(data)
      // Set the original schema for comparison
      if (data?.attributes?.surveyTemplate) {
        setOriginalSchema(data.attributes.surveyTemplate as SurveySchemaType)
      }
    } catch (error) {
      console.error('アンケートデータの取得に失敗しました', error) // Failed to fetch survey data
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  // Fetch survey data on mount
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        setError(null)
        const response = await clientAxiosInstance.get(
          `/api/survey-template/${id}`
        )
        const data = response.data
        setSurveyData(data)
        // Set the original schema for comparison
        if (data?.attributes?.surveyTemplate) {
          setOriginalSchema(data.attributes.surveyTemplate as SurveySchemaType)
        }
      } catch (error) {
        console.error('アンケートデータの取得に失敗しました', error) // Failed to fetch survey data
        setError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSurveyData()
  }, [id])

  return {
    // Data
    surveyData,
    currentSchema,
    originalSchema,

    // States
    isLoading,
    isSubmitting,
    error,

    // Actions
    setCurrentSchema,
    handleCreateSurvey,
    handleUpdateSurvey,
    retryFetchSurvey,

    // Computed
    isSchemaChanged: isSchemaChanged(),
    isButtonDisabled,
    submitButtonRef,
  }
}
