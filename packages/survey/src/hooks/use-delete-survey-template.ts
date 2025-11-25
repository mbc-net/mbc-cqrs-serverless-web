'use client'

import type { SurveyTemplateDataEntity } from '../types'
import { clientAxiosInstance } from '../client/http'
import { useSubscribeCommandStatus } from '../client/appsync/useSubscribeMessage'
import type { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface UseDeleteSurveyTemplateProps {
  onSuccess?: () => void
}

interface UseDeleteSurveyTemplateReturn {
  isDeleting: boolean
  handleDeleteSurvey: (id: string) => Promise<void>
}

export function useDeleteSurveyTemplate({
  onSuccess,
}: UseDeleteSurveyTemplateProps = {}): UseDeleteSurveyTemplateReturn {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const { start } = useSubscribeCommandStatus(
    useCallback(
      async (msg) => {
        setIsDeleting(false)
        if (msg) {
          toast.success('アンケートテンプレートが削除されました') // Survey template deleted successfully
          onSuccess?.()
          router.push('/admin/survey-management')
        } else {
          toast.error('アンケートテンプレートの削除に失敗しました') // Failed to delete survey template
        }
      },
      [router, onSuccess]
    )
  )

  const handleDeleteSurvey = useCallback(
    async (id: string) => {
      if (isDeleting) return

      setIsDeleting(true)
      let res: SurveyTemplateDataEntity | null = null

      try {
        res = (
          await clientAxiosInstance.delete<
            SurveyTemplateDataEntity,
            AxiosResponse<SurveyTemplateDataEntity>
          >(`/api/survey-template/${id}`)
        ).data
      } catch (error) {
        console.error('アンケートテンプレートの削除に失敗しました', error) // Failed to delete survey template
        setIsDeleting(false)
        toast.error('アンケートテンプレートの削除に失敗しました') // Failed to delete survey template
        return
      }

      if (!res?.requestId) {
        setIsDeleting(false)
        toast.error('アンケートテンプレートの削除に失敗しました') // Failed to delete survey template
        return
      }

      start(res.requestId)
    },
    [isDeleting, start]
  )

  return {
    isDeleting,
    handleDeleteSurvey,
  }
}
