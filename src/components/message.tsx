import React from 'react'

type Props = {
  index: number
  message: {
    type: string
    message: string
  }
}

const MessageComponent = (props: Props) => {
  return (
    <div
      key={props.index}
      className={`flex gap-x-4 max-w-[60%] ${
        props.message.type === 'User' ? 'User ml-auto max-w-[40%]' : ''
      }`}
    >
      {props.message.type === 'System' && (
        <div className="h-12 w-12 rounded-full border flex items-center justify-center shrink-0">
          AI
        </div>
      )}

      <div className="border rounded-md p-4">{props.message.message}</div>
    </div>
  )
}

export default MessageComponent
