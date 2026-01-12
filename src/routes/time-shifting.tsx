import { createFileRoute } from '@tanstack/react-router'

import TimeShiftingVideo from '@/features/video/time-shifting-video'

export const Route = createFileRoute('/time-shifting')({
  component: RouteComponent,
})

function RouteComponent() {
  const url = 'https://livepull-tcgi.iki-utl.cc/live/asb0011lo.flv'
  // 'https://livepull-bpsry.iki-utl.cc/live/aro0021hi.m3u8?mode=3&start=1729853071&end=1729853371'
  // const url = 'https://livepull-bpgi.iki-utl.cc/live/aro0021lo.m3u8'

  return (
    <div className="w-full p-4">
      <div className="h-full w-full flex-wrap gap-1 overflow-hidden rounded-lg">
        <TimeShiftingVideo url={url} />
      </div>
    </div>
  )
}
