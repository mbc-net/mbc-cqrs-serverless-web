'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { API_URLS } from '../../../lib/constants/url'
import useHealthCheck from '../../../lib/hook/useHealthCheck'
import { useLoadingStore } from '../../../lib/stores/hooks'
import { useHttpClient } from '../../../provider'
import { SettingDataEntity } from '../../../types'
import SettingsForm from '../components/SettingsForm'
import '../../../components/JsonEditor'
import '../../../components/RichTextEditor'
export default function EditMasterSettings() {
  const rawParams = useParams<{ pk?: string; sk?: string }>()
  const params = {
    pk: rawParams.pk ? decodeURIComponent(rawParams.pk) : undefined,
    sk: rawParams.sk ? decodeURIComponent(rawParams.sk) : undefined,
  }
  const [editedData, setEditedData] = useState<SettingDataEntity | undefined>()
  const httpClient = useHttpClient()
  const loadingStore = useLoadingStore()

  useHealthCheck()

  useEffect(() => {
    const fetchData = async () => {
      loadingStore.setLoading()

      const { pk, sk } = params
      if (!pk || !sk) {
        loadingStore.closeLoading()
        return
      }

      try {
        const url = `${API_URLS.SETTING.GET_ONE}/${encodeURIComponent(
          `${pk}#${sk}`
        )}`
        const { data } = await httpClient.get<SettingDataEntity>(url)
        setEditedData(data)
      } catch (error) {
        console.error('Failed to fetch setting data:', error)
      } finally {
        loadingStore.closeLoading()
      }
    }

    fetchData()
  }, [params.pk, params.sk, loadingStore, httpClient])

  return <SettingsForm editedData={editedData} setEditedData={setEditedData} />
}
