import { createFileRoute } from '@tanstack/react-router'

import TimeShiftingVideo from '@/features/video/time-shifting-video'

import { url, url2, url3 } from './-constants'

export const Route = createFileRoute('/live-stream')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-fit p-4">
      <div className="w-screen-max h-screen-max mx-auto">
        <div className="flex flex-wrap gap-4">
          <TimeShiftingVideo url={url} />
          <TimeShiftingVideo url={url2} />
          <TimeShiftingVideo url={url3} />
        </div>
      </div>
    </div>
  )
}
