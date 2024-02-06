import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

type Props = {}

const TypingComponent = (props: Props) => {
  return (
    <div className="flex items-center gap-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

export default TypingComponent
