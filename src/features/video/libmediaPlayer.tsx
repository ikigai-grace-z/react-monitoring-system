import AVPlayer from '@libmedia/avplayer'
import { useEffect, useRef, useState } from 'react'

interface LibMediaPlayerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  width?: number | string
  height?: number | string
  className?: string
  // onError?: (error: Error) => void
  // onLoadedMetadata?: () => void
  // onEnded?: () => void
  // onPlay?: () => void
  // onPause?: () => void
}

const LibMediaPlayer = ({
  src,
  autoPlay = false,
  loop = false,
  muted = false,
  width = '100%',
  height = 'auto',
  className = '',
  // onError,
  // onLoadedMetadata,
  // onEnded,
  // onPlay,
  // onPause,
}: LibMediaPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerRef = useRef<AVPlayer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let mounted = true

    const initPlayer = async () => {
      if (!containerRef.current || !canvasRef.current) return

      try {
        setIsLoading(true)
        setError(null)

        // 创建 AVPlayer 实例
        const player = new AVPlayer({
          container: containerRef.current,
          getWasm: (type, codecId) => {
            switch (type) {
              case 'decoder': {
                if (codecId === undefined)
                  return `/monitor-system/libmedia/wasm/decode/h264-simd.wasm`
                if (codecId >= 65536 && codecId <= 65572) {
                  return `/monitor-system/libmedia/wasm/decode/pcm-simd.wasm`
                }
                if (codecId >= 69632 && codecId <= 69683) {
                  return `/monitor-system/libmedia/wasm/decode/adpcm-simd.wasm`
                }

                switch (codecId) {
                  // mpeg1/2
                  case 2:
                    return `/monitor-system/libmedia/wasm/decode/mpeg2video-simd.wasm`
                  // H264
                  case 27:
                    return `/monitor-system/libmedia/wasm/decode/h264-simd.wasm`
                  // theora
                  case 30:
                    return `/monitor-system/libmedia/wasm/decode/theora-simd.wasm`
                  // AAC
                  case 86018:
                    return `/monitor-system/libmedia/wasm/decode/aac-simd.wasm`
                  // ac3
                  case 86019:
                    return `/monitor-system/libmedia/wasm/decode/ac3-simd.wasm`
                  // eac3
                  case 86056:
                    return `/monitor-system/libmedia/wasm/decode/eac3-simd.wasm`
                  // dts
                  case 86020:
                    return `/monitor-system/libmedia/wasm/decode/dca-simd.wasm`
                  // MP3
                  case 86017:
                    return `/monitor-system/libmedia/wasm/decode/mp3-simd.wasm`
                  // HEVC
                  case 173:
                    return `/monitor-system/libmedia/wasm/decode/hevc-simd.wasm`
                  // VVC
                  case 196:
                    return `/monitor-system/libmedia/wasm/decode/vvc-simd.wasm`
                  // Mpeg4
                  case 12:
                    return `/monitor-system/libmedia/wasm/decode/mpeg4-simd.wasm`
                  // AV1
                  case 225:
                    return `/monitor-system/libmedia/wasm/decode/av1-simd.wasm`
                  // Speex
                  case 86051:
                    return `/monitor-system/libmedia/wasm/decode/speex-simd.wasm`
                  // Opus
                  case 86076:
                    return `/monitor-system/libmedia/wasm/decode/opus-simd.wasm`
                  // flac
                  case 86028:
                    return `/monitor-system/libmedia/wasm/decode/flac-simd.wasm`
                  // vorbis
                  case 86021:
                    return `/monitor-system/libmedia/wasm/decode/vorbis-simd.wasm`
                  // vp8
                  case 139:
                    return `/monitor-system/libmedia/wasm/decode/vp8-simd.wasm`
                  // vp9
                  case 167:
                    return `/monitor-system/libmedia/wasm/decode/vp9-simd.wasm`
                  case 86022 /* AVCodecID.AV_CODEC_ID_DVAUDIO */:
                    return `/monitor-system/libmedia/wasm/decode/dvaudio-simd.wasm`
                  case 24 /* AVCodecID.AV_CODEC_ID_DVVIDEO */:
                    return `/monitor-system/libmedia/wasm/decode/dvvideo-simd.wasm`
                  case 3 /* AVCodecID.AV_CODEC_ID_H261 */:
                    return `/monitor-system/libmedia/wasm/decode/h261-simd.wasm`
                  case 4 /* AVCodecID.AV_CODEC_ID_H263 */:
                  case 20 /* AVCodecID.AV_CODEC_ID_H263I */:
                  case 19 /* AVCodecID.AV_CODEC_ID_H263P */:
                    return `/monitor-system/libmedia/wasm/decode/h263-simd.wasm`
                  case 14 /* AVCodecID.AV_CODEC_ID_MSMPEG4V1 */:
                  case 15 /* AVCodecID.AV_CODEC_ID_MSMPEG4V2 */:
                  case 16 /* AVCodecID.AV_CODEC_ID_MSMPEG4V3 */:
                    return `/monitor-system/libmedia/wasm/decode/msmpeg4-simd.wasm`
                  case 5 /* AVCodecID.AV_CODEC_ID_RV10 */:
                  case 6 /* AVCodecID.AV_CODEC_ID_RV20 */:
                  case 68 /* AVCodecID.AV_CODEC_ID_RV30 */:
                  case 69 /* AVCodecID.AV_CODEC_ID_RV40 */:
                    return `/monitor-system/libmedia/wasm/decode/msmpeg4-simd.wasm`
                  case 86036 /* AVCodecID.AV_CODEC_ID_COOK */:
                  case 86057 /* AVCodecID.AV_CODEC_ID_SIPR */:
                  case 86073 /* AVCodecID.AV_CODEC_ID_RALF */:
                    return `/monitor-system/libmedia/wasm/decode/ra-simd.wasm`
                  case 86023 /* AVCodecID.AV_CODEC_ID_WMAV1 */:
                  case 86024 /* AVCodecID.AV_CODEC_ID_WMAV2 */:
                  case 86052 /* AVCodecID.AV_CODEC_ID_WMAVOICE */:
                  case 86054 /* AVCodecID.AV_CODEC_ID_WMALOSSLESS */:
                  case 86053 /* AVCodecID.AV_CODEC_ID_WMAPRO */:
                    return `/monitor-system/libmedia/wasm/decode/wma-simd.wasm`
                  case 17 /* AVCodecID.AV_CODEC_ID_WMV1 */:
                  case 18 /* AVCodecID.AV_CODEC_ID_WMV2 */:
                  case 71 /* AVCodecID.AV_CODEC_ID_WMV3 */:
                    return `/monitor-system/libmedia/wasm/decode/wmv-simd.wasm`
                  case 7 /* AVCodecID.AV_CODEC_ID_MJPEG */:
                    return `/monitor-system/libmedia/wasm/decode/mjpeg-simd.wasm`
                  case 61 /* AVCodecID.AV_CODEC_ID_MJPEG */:
                    return `/monitor-system/libmedia/wasm/decode/png-simd.wasm`
                  case 171 /* AVCodecID.AV_CODEC_ID_MJPEG */:
                    return `/monitor-system/libmedia/wasm/decode/webp-simd.wasm`
                  case 97 /* AVCodecID.AV_CODEC_ID_MJPEG */:
                    return `/monitor-system/libmedia/wasm/decode/gif-simd.wasm`
                  case 96 /* AVCodecID.AV_CODEC_ID_MJPEG */:
                    return `/monitor-system/libmedia/wasm/decode/tiff-simd.wasm`
                  case 78 /* AVCodecID.AV_CODEC_ID_MJPEG */:
                    return `/monitor-system/libmedia/wasm/decode/bmp-simd.wasm`
                  default:
                    return ''
                }
              }
              case 'resampler':
                return `/monitor-system/libmedia/wasm/resample/resample-simd.wasm`
              case 'stretchpitcher':
                return `/monitor-system/libmedia/wasm/stretchpitch/stretchpitch-simd.wasm`
            }
          },

          enableWebGPU: true, // 启用 WebGPU 加速（如果可用）
          enableWorker: true, // 启用 Web Worker
          isLive: true, // FLV 直播流设置为 true
          jitterBufferMax: 4,
          jitterBufferMin: 1,
          lowLatency: true,
          // audioWorkletBufferLength: 40,
          // drmSystemOptions: {
          //   // requestUrl: 'https://cwip-shaka-proxy.appspot.com/no_auth',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          // },
        })

        playerRef.current = player

        // 设置事件监听
        player.on('error', (err: Error) => {
          if (mounted) {
            console.error('LibMedia Player error:', err)
            setError(err.message || '播放发生错误')
            setIsLoading(false)
            // onError?.(err)
          }
        })

        player.on('loadedmetadata', () => {
          if (mounted) {
            setIsLoading(false)
            // onLoadedMetadata?.()
          }
        })

        player.on('ended', () => {
          if (mounted) {
            setIsPlaying(false)
            player.pause()
            // onEnded?.()
            // if (loop) {
            //   player.seek(0)
            //   player.play({ video: true })
            // }
          }
        })

        // player.on('loading', () => {
        //   if (mounted) {
        //     console.log('Video is loading')
        //   }
        // })

        player.on('loaded', () => {
          if (mounted) {
            console.log('Video is loaded')
            setIsLoading(false)
            // 自动播放
            if (autoPlay) {
              player.play({ video: true }).catch((err) => {
                console.error('Auto play error:', err)
              })
            }
          }
        })

        player.on('play', () => {
          if (mounted) {
            console.log('Video started playing')
            setIsPlaying(true)
            // onPlay?.()
          }
        })

        player.on('pause', () => {
          if (mounted) {
            setIsPlaying(false)
            // onPause?.()
          }
        })

        // 设置静音
        if (muted) {
          player.setVolume(0)
        }

        // 加载视频源（只调用一次）
        await player.load(src)
        // 注意：自动播放将在 'loaded' 事件中处理
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : '播放器初始化失败'
          console.error('LibMedia Player initialization error:', err)
          setError(errorMessage)
          setIsLoading(false)
          if (err instanceof Error) {
            // onError?.(err)
          }
        }
      }
    }

    initPlayer()

    return () => {
      mounted = false
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [src, autoPlay, loop, muted])

  const handlePlayPause = async () => {
    if (!playerRef.current) return

    try {
      if (isPlaying) {
        await playerRef.current.pause()
      } else {
        console.log('Playing video...')
        await playerRef.current.play({ video: true })
      }
    } catch (err) {
      console.error('Play/Pause error:', err)
    }
  }

  const handleStop = async () => {
    if (!playerRef.current) return

    try {
      await playerRef.current.pause()
      // await playerRef.current.seek(0)
      setIsPlaying(false)
    } catch (err) {
      console.error('Stop error:', err)
    }
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, minHeight: height }}
    >
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden bg-black"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>

      {isLoading && (
        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white">loading...</div>
        </div>
      )}

      {error && (
        <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-red-500">
            <p className="mb-2 font-semibold">error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* control */}
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="rounded bg-white/20 px-4 py-2 text-white transition hover:bg-white/30"
            // disabled={isLoading || !!error}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleStop}
            className="rounded bg-white/20 px-4 py-2 text-white transition hover:bg-white/30"
            disabled={isLoading || !!error}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  )
}

export default LibMediaPlayer
