import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'usehooks-ts'

import {
  ActionEnum,
  CommandStatusContent,
  DecodedMessage,
  subscribeMessage,
} from '../../appsync'
import { useToast } from '../../components/ui/use-toast'
import { useApolloClient } from '../../provider'

export type CommandDoneCallback = (
  msg: DecodedMessage | null
) => Promise<void> | void

export function useSubscribeCommandStatus(
  xTenantCode: string,
  doneCallback: CommandDoneCallback,
  isShowProcess: boolean = true
) {
  const [reqId, setReqId] = useState<string | null>()
  const [timeoutMs, setTimeoutMs] = useState<number>(0)
  const [message, setMessage] = useState<DecodedMessage | null>()
  const doneCbRef = useRef(doneCallback)
  const appsyncClient = useApolloClient()
  const { toast } = useToast()

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    doneCbRef.current = doneCallback
  }, [doneCallback])

  const done = useCallback((message: DecodedMessage | null) => {
    setReqId(null)
    if (doneCbRef.current) {
      doneCbRef.current(message)
    }
  }, [])

  const start = useCallback((reqId: string, timeoutMs: number = 0) => {
    setMessage(null)
    setTimeoutMs(timeoutMs)
    setReqId(reqId)
  }, [])

  useEffect(() => {
    let msgSubs: any
    let timeoutId: any
    if (reqId) {
      msgSubs = subscribeMessage(
        appsyncClient,
        {
          tenantCode: xTenantCode,
          action: ActionEnum.COMMAND_STATUS,
          id: reqId,
        },
        (message) => {
          if (message.id !== reqId) {
            return
          }
          setMessage(message)
          const content: CommandStatusContent = message.content as any
          if (content.status === 'check_version:STARTED') {
            toast({
              description: 'データを処理しています。少々お待ちください。',
              variant: 'success',
            })
          }
          if (content.status === 'finish:FINISHED') {
            if (timeoutId) {
              clearTimeout(timeoutId)
              timeoutId = undefined
            }
            done(message)
          }
        }
      )

      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          if (reqId) {
            done(null)
          }
        }, timeoutMs)
      }
    }

    return () => {
      console.warn('msgSubs unsubscribe', msgSubs)
      msgSubs?.unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [reqId])

  return {
    isListening: !!reqId,
    message,
    start,
  }
}

/**
 * Hook for bulk operations that receive multiple finish:FINISHED messages
 * Component must track count and manually call stop() when all items are processed
 */
export function useSubscribeBulkCommandStatus(
  xTenantCode: string,
  onTimeout?: () => void
) {
  const [reqId, setReqId] = useState<string | null>()
  const [timeoutMs, setTimeoutMs] = useState<number>(0)
  const [messages, setMessages] = useState<DecodedMessage[]>([])
  const [finishedCount, setFinishedCount] = useState(0)
  const hasShownStartToastRef = useRef(false)
  const onTimeoutRef = useRef(onTimeout)
  const appsyncClient = useApolloClient()
  const { toast } = useToast()

  // Remember the latest callback if it changes
  useIsomorphicLayoutEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  const stop = useCallback(() => {
    setReqId(null)
    setMessages([])
    setFinishedCount(0)
    hasShownStartToastRef.current = false
  }, [])

  const start = useCallback((reqId: string, timeoutMs: number = 0) => {
    setMessages([])
    setFinishedCount(0)
    hasShownStartToastRef.current = false
    setTimeoutMs(timeoutMs)
    setReqId(reqId)
  }, [])

  useEffect(() => {
    let msgSubs: any
    let timeoutId: any

    if (reqId) {
      msgSubs = subscribeMessage(
        appsyncClient,
        {
          tenantCode: xTenantCode,
          action: ActionEnum.COMMAND_STATUS,
          id: reqId,
        },
        (message) => {
          if (message.id !== reqId) {
            return
          }

          setMessages((prev) => [...prev, message])

          const content: CommandStatusContent = message.content as any
          if (
            content.status === 'check_version:STARTED' &&
            !hasShownStartToastRef.current
          ) {
            hasShownStartToastRef.current = true
            toast({
              description: 'データを処理しています。少々お待ちください。',
              variant: 'success',
            })
          }

          if (content.status === 'finish:FINISHED') {
            setFinishedCount((prev) => prev + 1)
          }
        }
      )

      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          if (reqId) {
            stop()
            if (onTimeoutRef.current) {
              onTimeoutRef.current()
            }
          }
        }, timeoutMs)
      }
    }

    return () => {
      console.warn('msgSubs unsubscribe (bulk)', msgSubs)
      msgSubs?.unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [reqId])

  return {
    isListening: !!reqId,
    messages,
    finishedCount,
    start,
    stop,
  }
}
