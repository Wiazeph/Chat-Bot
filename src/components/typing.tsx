import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

type Props = {}

const TypingComponent = (props: Props) => {
  return (
    <div className="flex gap-x-4 max-w-[60%]">
      <Skeleton className="h-12 w-12 rounded-full" />

      <div className="border rounded-md p-4 space-y-2">
        <Skeleton className="h-4 w-[350px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    </div>
  )
}

export default TypingComponent
