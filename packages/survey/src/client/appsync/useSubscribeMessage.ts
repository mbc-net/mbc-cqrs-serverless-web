import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'usehooks-ts'

import {
  ActionEnum,
  type CommandStatusContent,
  type DecodedMessage,
  subscribeMessage,
} from './subscribe'
import { getTenantCode } from '../http/config'
import apolloClient from './index'

export type CommandDoneCallback = (
  msg: DecodedMessage | null
) => Promise<void> | void

export function useSubscribeCommandStatus(doneCallback: CommandDoneCallback) {
  const [reqId, setReqId] = useState<string | null>()
  const [timeoutMs, setTimeoutMs] = useState<number>(0)
  const [message, setMessage] = useState<DecodedMessage | null>()
  const doneCbRef = useRef(doneCallback)

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

  const start = useCallback((reqId: string, timeoutMs = 0) => {
    setMessage(null)
    setTimeoutMs(timeoutMs)
    setReqId(reqId)
  }, [])

  useEffect(() => {
    let msgSubs: any
    let timeoutId: any
    if (reqId) {
      msgSubs = subscribeMessage(
        apolloClient,
        {
          tenantCode: getTenantCode(),
          action: ActionEnum.COMMAND_STATUS,
          id: reqId,
        },
        (message) => {
          if (message.id !== reqId) {
            return
          }
          setMessage(message)
          const content: CommandStatusContent = message.content as any
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
