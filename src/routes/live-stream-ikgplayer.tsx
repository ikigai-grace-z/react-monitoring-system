import { createFileRoute } from '@tanstack/react-router'

import LiveStreamVideo from '@/features/video/live-stream-video'

import { url, url2, url3 } from './-constants'

export const Route = createFileRoute('/live-stream-ikgplayer')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-fit p-4">
      <div className="w-screen-max h-screen-max mx-auto">
        <div className="flex flex-wrap gap-4">
          <LiveStreamVideo url={url} />
          <LiveStreamVideo url={url2} />
          <LiveStreamVideo url={url3} />
        </div>
      </div>
    </div>
  )
}
