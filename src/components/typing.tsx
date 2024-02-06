import React from 'react'

type Props = {}

const TypingComponent = (props: Props) => {
  return (
    <div className="flex gap-x-4 items-center">
      <div className="h-12 w-full min-w-12 max-w-12 rounded-full border flex items-center justify-center">
        AI
      </div>

      <div>Loading...</div>
    </div>
  )
}

export default TypingComponent
