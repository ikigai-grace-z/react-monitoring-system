import { createFileRoute } from '@tanstack/react-router'

import TimeShiftingVideo from '@/features/video/time-shifting-video'

export const Route = createFileRoute('/time-shifting')({
  component: RouteComponent,
})

function RouteComponent() {
  const url =
    'https://livepull-bpsry.iki-utl.cc/live/aro0011hd.flv?abr_pts=-1000'
  // const url = 'https://livepull-bpgi.iki-utl.cc/live/aro0021lo.m3u8'

  return (
    <div className="w-full p-4">
      <div className="h-full w-full flex-wrap gap-1 overflow-hidden rounded-lg">
        <TimeShiftingVideo url={url} />
      </div>
    </div>
  )
}
