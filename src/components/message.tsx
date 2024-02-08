import React from 'react'

type Props = {
  message: {
    id: string
    role: string
    content: string
  }
}

const MessageComponent = (props: Props) => {
  return (
    <div
      key={props.message.id}
      className={`flex gap-x-4 max-w-[60%] ${
        props.message.role === 'user' ? 'User ml-auto max-w-[40%]' : 'System'
      }`}
    >
      {props.message.role === 'system' && (
        <div className="h-12 w-12 rounded-full border flex items-center justify-center shrink-0">
          AI
        </div>
      )}

      <div className="border rounded-md p-4">{props.message.content}</div>
    </div>
  )
}

export default MessageComponent
