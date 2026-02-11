import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client'
import {
  Message,
  OnMessageSubscription,
  OnMessageSubscriptionVariables,
} from './API'
import { onMessage } from './graphql/subscriptions'

export type CommandStatusContent = {
  status:
    | 'finish:FINISHED'
    | 'finish:STARTED'
    | 'sync_data:FINISHED'
    | 'sync_data:STARTED'
    | 'transform_data:FINISHED'
    | 'transform_data:STARTED'
    | 'history_copy:FINISHED'
    | 'history_copy:STARTED'
    | 'check_version:FINISHED'
    | 'check_version:STARTED'
}

export type MessageContent = string | CommandStatusContent

export type DecodedMessage = Omit<Message, 'content'> & {
  content: MessageContent
}

export enum ActionEnum {
  COMMAND_STATUS = 'command-status',
}

export function subscribeMessage(
  client: ApolloClient<NormalizedCacheObject>,
  filters: OnMessageSubscriptionVariables,
  handler: (value: DecodedMessage) => void | Promise<void>
) {
  const observable = client.subscribe<
    OnMessageSubscription,
    OnMessageSubscriptionVariables
  >({
    query: gql`
      ${onMessage}
    `,
    variables: filters,
  })

  return observable.subscribe({
    next: ({ data }) => {
      if (!data || !data.onMessage) {
        return
      }
      const message: DecodedMessage = {
        ...data.onMessage,
        content: parseContent(data.onMessage.content),
      }
      if (message) {
        handler(message)
      }
    },
    error: (error) => console.error('subscribeMessage error:', error),
  })
}

export function parseContent(content: string): MessageContent {
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}
