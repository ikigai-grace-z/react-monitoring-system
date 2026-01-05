import VePlayer from '@byteplus/veplayer'
import '@byteplus/veplayer/index.min.css'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface TimeShiftingVideoProps {
  url: string
}

const TimeShiftingVideo = ({ url }: TimeShiftingVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<VePlayer | null>(null)
  const playerId = `ve-player-${useId().replace(/:/g, '-')}`
  const [isLive, setIsLive] = useState(true)
  const [inputTime, setInputTime] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [seekableRange, setSeekableRange] = useState({ end: 0, start: 0 })
  const liveThreshold = 3

  useEffect(() => {
    if (!containerRef.current) return

    // 設置容器 ID
    containerRef.current.id = playerId

    // Initialize BytePlus VEPlayer
    const player = new VePlayer({
      autoplay: true,
      closeVideoClick: false,
      closeVideoTouch: false,
      controls: true,
      cssFullscreen: true,
      height: '100%',
      id: playerId,
      ignores: [],
      isLive: true, // M3U8 live stream
      keyShortcut: true,
      lang: 'en',
      playsinline: true,
      preload: 'auto',
      url,
      width: '100%',
    })
    playerRef.current = player

    player.on('ready', () => {
      // Obtain player kernel
      const playerCore = player.player
      console.log('player core', playerCore)
    })

    // Listen to player events
    player.on('error', (error: Error) => {
      console.error('VEPlayer error:', error)
    })

    player.on('ended', () => {
      console.log('Playback ended')
    })

    // Listen to time updates
    player.on('timeupdate', () => {
      if (!player.player) return
      const video = player.player.video
      if (!video) return

      const currentVideoTime = video.currentTime
      setCurrentTime(currentVideoTime)

      if (video.seekable && video.seekable.length > 0) {
        const start = video.seekable.start(0)
        const end = video.seekable.end(0)
        setSeekableRange({ end, start })

        const gap = Math.abs(currentVideoTime - end)
        const isAtLive = gap < liveThreshold || (end > 0 && gap / end < 0.01) // 相對誤差 < 1%
        setIsLive(isAtLive)

        if (!isAtLive && currentVideoTime > 0 && end > 0) {
          console.log('⏱️ Time gap:', {
            currentTime: currentVideoTime.toFixed(2),
            gap: gap.toFixed(2),
            liveEdge: end.toFixed(2),
            relativeGap: `${((gap / end) * 100).toFixed(2)}%`,
          })
        }
      }
    })

    // Listen to seek events
    // player.on('seeked', () => {
    //   if (!player.player) return
    //   const video = player.player.video
    //   if (video) {
    //     console.log('🎬 Seeked event fired:', {
    //       currentTime: video.currentTime.toFixed(2),
    //       paused: video.paused,
    //       readyState: video.readyState,
    //     })
    //   }
    // })

    // player.on('seeking', () => {
    //   if (!player.player) return
    //   const video = player.player.video
    //   if (video) {
    //     console.log('⏳ Seeking event fired:', {
    //       targetTime: video.currentTime.toFixed(2),
    //     })
    //   }
    // })

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [url, playerId]) // 移除 playerId 依赖，因为它现在是稳定的 ref

  // Go to live point
  const goToLive = useCallback(() => {
    const player = playerRef.current

    if (!player?.player) return // Check if player.player exists
    const video = player.player.video
    if (!video || !video.seekable || video.seekable.length === 0) return

    const liveEdge = video.seekable.end(0)

    console.log('🔴 Going to live:', {
      currentTime: video.currentTime.toFixed(2),
      gap: (liveEdge - video.currentTime).toFixed(2),
      liveEdge: liveEdge.toFixed(2),
    })

    // Resume normal playback rate for live
    video.playbackRate = 1.0
    // Seek to live edge using native video element (更精確)
    video.currentTime = liveEdge
    console.log('Seeking to live time:', video.currentTime)
    // Verify we reached live point
    // setTimeout(() => {
    //   const actualTime = video.currentTime
    //   const currentLiveEdge = video.seekable.end(0)
    // console.log('✅ Live verification:', {
    //   expected: liveEdge.toFixed(2),
    //   actual: actualTime.toFixed(2),
    //   currentLiveEdge: currentLiveEdge.toFixed(2),
    //   isAtLive: Math.abs(actualTime - currentLiveEdge) < 3,
    // })
    // }, 300)

    setIsLive(true)
  }, [])

  // Seek to specified time
  const seekToOffset = useCallback(
    (offsetSeconds: number) => {
      const player = playerRef.current
      if (!player?.player) return // Check if player.player exists
      const video = player.player.video

      if (!video) return

      const currentVideoTime = video.currentTime
      const targetTime = currentVideoTime + offsetSeconds
      const newTime = Math.max(
        seekableRange.start,
        Math.min(seekableRange.end, targetTime)
      )

      console.log('⏩ Seeking offset:', {
        clampedTime: newTime.toFixed(2),
        currentVideoTime: currentVideoTime.toFixed(2),
        offsetSeconds,
        seekableRange: {
          end: seekableRange.end.toFixed(2),
          start: seekableRange.start.toFixed(2),
        },
        targetTime: targetTime.toFixed(2),
      })

      // Pause before seeking to prevent auto-catchup
      const wasPaused = video.paused
      video.pause()

      // Seek to new time
      player.player.seek(newTime)

      // Resume playback after a short delay
      setTimeout(() => {
        if (!wasPaused) {
          video.play()
        }
        // Slow down playback slightly to stay in the past
        video.playbackRate = 0.98
      }, 100)

      setIsLive(Math.abs(newTime - seekableRange.end) < 3)
    },
    [seekableRange]
  )

  // Parse time input (supports formats like "1:30", "90", "0:45")
  const parseTimeInput = (timeString: string): number | null => {
    if (!timeString.trim()) return null

    // Format: MM:SS or H:MM:SS
    if (timeString.includes(':')) {
      const parts = timeString.split(':').map((p) => parseInt(p, 10))
      if (parts.some(isNaN)) return null

      if (parts.length === 2) {
        // MM:SS
        return parts[0] * 60 + parts[1]
      } else if (parts.length === 3) {
        // H:MM:SS
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
      }
    }

    // Format: just seconds
    const seconds = parseFloat(timeString)
    return isNaN(seconds) ? null : seconds
  }

  const jumpToTime = useCallback(
    (timeInput: string) => {
      const player = playerRef.current
      if (!player?.player) return
      const video = player.player.video
      if (!video) return

      const time = parseTimeInput(timeInput)
      if (time === null) {
        console.error('❌ Invalid time format:', timeInput)
        return
      }

      const newTime = Math.max(
        seekableRange.start,
        Math.min(seekableRange.end, time)
      )

      console.log('🎯 Jumping to time:', {
        clampedTime: newTime.toFixed(2),
        input: timeInput,
        parsedTime: time.toFixed(2),
        seekableRange: {
          end: seekableRange.end.toFixed(2),
          start: seekableRange.start.toFixed(2),
        },
      })

      // Pause before seeking
      const wasPaused = video.paused
      video.pause()

      // 使用 video.currentTime 而不是 player.player.currentTime（更精確）
      video.currentTime = newTime

      // Verify jump operation after a short delay
      setTimeout(() => {
        const actualTime = video.currentTime
        console.log('✅ Jump verification:', {
          actual: actualTime.toFixed(2),
          difference: Math.abs(actualTime - newTime).toFixed(2),
          expected: newTime.toFixed(2),
          success: Math.abs(actualTime - newTime) < 1,
        })

        // Resume playback
        if (!wasPaused) {
          video.play()
        }
        // Slow down playback to prevent catching up to live
        video.playbackRate = 0.98
      }, 300)

      setIsLive(Math.abs(newTime - seekableRange.end) < 3)
      setInputTime('') // Clear input after jump
      setCurrentTime(newTime)
    },
    [seekableRange]
  )

  // Format time display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const seekableSeconds = formatTime(
    Math.floor(seekableRange.end - seekableRange.start)
  )

  return (
    <>
      <div className="flex h-150 w-125 flex-col gap-3">
        <div
          ref={containerRef}
          className="relative aspect-video flex-1 overflow-hidden rounded-lg border bg-black"
          style={{ minHeight: '300px' }}
        />

        {/* Time shifting control panel */}
        <div className="bg-card flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Time Shifting Control</span>

              <span className="flex items-center gap-1 text-xs text-red-500">
                <span className="inline-block size-2 animate-pulse rounded-full bg-red-500" />
                Live
              </span>
            </div>
            <div className="text-muted-foreground text-xs">
              Duration: {seekableSeconds}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={goToLive}
              // disabled={isLive}
              className="min-w-24 text-red-500"
            >
              {isLive ? (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <span className="inline-block size-2 animate-pulse rounded-full bg-red-500" />
                  Live
                </span>
              ) : (
                'Go to Live'
              )}
            </Button>

            <div className="bg-border mx-2 h-6 w-px" />

            <Button
              size="sm"
              variant="outline"
              onClick={() => seekToOffset(-10)}
              disabled={seekableRange.end <= seekableRange.start}
            >
              -10s
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => seekToOffset(-30)}
              disabled={seekableRange.end <= seekableRange.start}
            >
              -30s
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => seekToOffset(-60)}
              disabled={seekableRange.end <= seekableRange.start}
            >
              -1min
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => seekToOffset(-300)}
              disabled={seekableRange.end <= seekableRange.start}
            >
              -5min
            </Button>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="MM:SS or seconds"
                value={inputTime}
                onChange={(e) => {
                  setInputTime(e.target.value)
                }}
                className="w-2xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => jumpToTime(inputTime)}
                disabled={!inputTime.trim()}
              >
                Jump
              </Button>
            </div>
          </div>
          {/* <input
            type="range"
            className="flex-1"
            min={seekableRange.start}
            max={isLive ? seekableRange.end : Infinity} // Use a large number to represent live point
            // step={1}
            defaultValue={time}
            value={time}
            // onChangeCapture={(e) => {
            //   setInputTime(Number(e.target.value))
            // }}
            onChange={(e) => jumpToTime(Number(e.target.value))}
          /> */}

          {/* Progress information */}
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              Current Position: {formatTime(currentTime)} / {seekableSeconds}
            </span>
            <span>
              {isLive
                ? 'Live'
                : `Delay: ${formatTime(Math.max(0, seekableRange.end - currentTime))}`}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimeShiftingVideo
