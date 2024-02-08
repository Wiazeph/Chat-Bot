import React from 'react'

import type { Message } from 'ai/react'

type Props = {
  message: Message
}

const MessageComponent = (props: Props) => {
  return (
    <div
      key={props.message.id}
      className={`flex gap-x-4 ${
        props.message.role === 'user'
          ? 'User ml-auto max-w-[40%]'
          : 'System max-w-[60%]'
      }`}
    >
      {props.message.role === 'system' && (
        <div className="h-12 w-12 rounded-full border flex items-center justify-center shrink-0">
          AI
        </div>
      )}

      <div className="border rounded-md p-4 whitespace-pre-wrap">
        {props.message.content}
      </div>
    </div>
  )
}

export default MessageComponent
