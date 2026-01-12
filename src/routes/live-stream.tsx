import { createFileRoute } from '@tanstack/react-router'

import TimeShiftingVideo from '@/features/video/time-shifting-video'

export const Route = createFileRoute('/live-stream')({
  component: RouteComponent,
})

function RouteComponent() {
  const url = 'https://livepull-tcgi.iki-utl.cc/live/asb0011lo.flv'
  const url2 = 'https://livepull-tcgi.iki-utl.cc/live/aro0011lo.flv'
  const url3 = 'https://livepull-tcgi.iki-utl.cc/live/aro0021lo.flv'

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
