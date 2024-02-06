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
      className={`flex gap-x-4 items-center border rounded-md p-4 w-max max-w-[75%] ${
        props.message.type === 'User' ? 'User text-right flex-row-reverse' : ''
      }`}
    >
      {props.message.type === 'System' ? (
        <div className="h-12 w-full min-w-12 max-w-12 rounded-full border flex items-center justify-center">
          AI
        </div>
      ) : (
        <div className="h-12 w-full min-w-12 max-w-12 rounded-full border flex items-center justify-center">
          You
        </div>
      )}

      {props.message.message}
    </div>
  )
}

export default MessageComponent
