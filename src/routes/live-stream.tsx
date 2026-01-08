import { createFileRoute } from '@tanstack/react-router'

import TimeShiftingVideo from '@/features/video/time-shifting-video'

export const Route = createFileRoute('/live-stream')({
  component: RouteComponent,
})

function RouteComponent() {
  const live =
    'https://livepull-bpsry.iki-utl.cc/live/aro0011lo.m3u8?abr_pts=-1000'
  const live2 =
    'https://livepull-bpsry.iki-utl.cc/live/aro0021lo.m3u8?abr_pts=-1000'

  const sicbo =
    'https://livepull-bpsry.iki-utl.cc/live/asb0011lo.m3u8?abr_pts=-1000'

  return (
    <div className="w-fit p-4">
      <div className="w-screen-max h-screen-max mx-auto">
        <div className="flex flex-wrap gap-4">
          <TimeShiftingVideo url={live} />
          <TimeShiftingVideo url={live2} />
          <TimeShiftingVideo url={sicbo} />
        </div>
      </div>
    </div>
  )
}
