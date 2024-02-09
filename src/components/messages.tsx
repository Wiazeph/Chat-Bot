import React from 'react'

import type { Message } from 'ai/react'

import { ScrollArea } from './ui/scroll-area'

type Props = {
  message: Message[]
}

const MessagesComponent = (props: Props) => {
  return (
    <ScrollArea className="Messages h-full rounded-md border p-4">
      <div className="flex flex-col gap-y-6">
        {props.message.map((m) => (
          <div
            key={m.id}
            className={`flex gap-x-4 ${
              m.role === 'user'
                ? 'User ml-auto max-w-[40%]'
                : 'System max-w-[60%]'
            }`}
          >
            {m.role === 'system' && (
              <div className="h-12 w-12 rounded-full border flex items-center justify-center shrink-0">
                AI
              </div>
            )}

            <div className="border rounded-md p-4 whitespace-pre-wrap">
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div
        ref={(scrollAreaRef) =>
          scrollAreaRef?.scrollIntoView({ behavior: 'smooth' })
        }
      />
    </ScrollArea>
  )
}

export default MessagesComponent
