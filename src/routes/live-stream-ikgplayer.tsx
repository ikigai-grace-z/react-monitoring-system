import { createFileRoute } from '@tanstack/react-router'

import LiveStreamVideo from '@/features/video/live-stream-video'

export const Route = createFileRoute('/live-stream-ikgplayer')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-fit p-4">
      <div className="w-screen-max h-screen-max mx-auto">
        <div className="flex flex-wrap gap-4">
          <LiveStreamVideo url="https://livepull-tcgi.iki-utl.cc/live/asb0011lo.flv" />
          <LiveStreamVideo url="https://livepull-tcgi.iki-utl.cc/live/aro0011lo.flv" />
          <LiveStreamVideo url="https://livepull-tcgi.iki-utl.cc/live/aro0021lo.flv" />
        </div>
      </div>
    </div>
  )
}
