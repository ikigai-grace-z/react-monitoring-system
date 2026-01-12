import { createFileRoute } from '@tanstack/react-router'

import TimeShiftingVideo from '@/features/video/time-shifting-video'

export const Route = createFileRoute('/monitoring-system')({
  component: RouteComponent,
})

function RouteComponent() {
  const url = '/monitor-system/monitoring/output.m3u8'
  //   const url = 'rtsp://192.168.10.1:7447/NnHci31W4nOGNJHl'
  return (
    <div className="w-full p-4">
      <div className="h-full w-full flex-wrap gap-1 overflow-hidden rounded-lg">
        <TimeShiftingVideo url={url} />
      </div>
    </div>
  )
}
