'use client'

import { SurveyCreator } from '../../../creators/survey-creator'
import type { SurveySchemaType } from '../../../types/schema'
import { useDeleteSurveyTemplate } from '../../../hooks/use-delete-survey-template'
import { useEditSurveyTemplate } from '../../../hooks/use-edit-survey-template'
import { useParams } from 'next/navigation'
import { useCallback } from 'react'
import {
  EditSurveyTemplateErrorBoundary,
  EditSurveyTemplateErrorState,
  EditSurveyTemplateLoadingState,
  SurveyFormActionButtons,
} from '../components'

export function EditSurveyTemplatePage() {
  const rawParams = useParams<{ id: string }>()
  const id = rawParams.id

  const {
    surveyData,
    isLoading,
    isSubmitting,
    error,
    setCurrentSchema,
    handleCreateSurvey,
    handleUpdateSurvey,
    retryFetchSurvey,
    isButtonDisabled,
    submitButtonRef,
  } = useEditSurveyTemplate({ id })

  const { isDeleting, handleDeleteSurvey } = useDeleteSurveyTemplate()

  const handleSubmit = useCallback(
    (schema: SurveySchemaType) => {
      if (id) {
        handleUpdateSurvey(schema)
      } else {
        handleCreateSurvey(schema)
      }
    },
    [id, handleUpdateSurvey, handleCreateSurvey]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (id) {
      await handleDeleteSurvey(id)
    }
  }, [id, handleDeleteSurvey])

  if (isLoading) {
    return <EditSurveyTemplateLoadingState id={id} />
  }

  if (error) {
    return (
      <EditSurveyTemplateErrorState error={error} onRetry={retryFetchSurvey} />
    )
  }

  return (
    <EditSurveyTemplateErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <SurveyCreator
          initialSchema={
            surveyData?.attributes.surveyTemplate as SurveySchemaType
          }
          onSubmit={handleSubmit}
          submitButtonRef={submitButtonRef}
          disabled={false}
          onSchemaChange={setCurrentSchema}
        />
        <SurveyFormActionButtons
          id={id}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          isButtonDisabled={isButtonDisabled}
          onSubmit={() => submitButtonRef.current?.click()}
          onDelete={handleConfirmDelete}
        />
      </div>
    </EditSurveyTemplateErrorBoundary>
  )
}
