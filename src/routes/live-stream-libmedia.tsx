import { createFileRoute } from '@tanstack/react-router'

import LibMediaPlayer from '@/features/video/libmediaPlayer'

export const Route = createFileRoute('/live-stream-libmedia')({
  component: RouteComponent,
})

function RouteComponent() {
  const url = 'https://livepull-tcgi.iki-utl.cc/live/asb0011lo.flv'
  const url2 = 'https://livepull-tcgi.iki-utl.cc/live/aro0011lo.flv'
  const url3 = 'https://livepull-tcgi.iki-utl.cc/live/aro0021lo.flv'

  return (
    <div className="container w-full p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LibMediaPlayer
          src={url}
          autoPlay={true}
          loop={true}
          muted={false}
          width="100%"
          height="300px"
          className="rounded-lg"
        />
        <LibMediaPlayer
          src={url2}
          autoPlay={true}
          loop={true}
          muted={false}
          width="100%"
          height="300px"
          className="rounded-lg"
        />
        <LibMediaPlayer
          src={url3}
          autoPlay={true}
          loop={true}
          muted={false}
          width="100%"
          height="300px"
          className="rounded-lg"
        />
      </div>
    </div>
  )
}
