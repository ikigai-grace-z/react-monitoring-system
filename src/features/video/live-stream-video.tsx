import { IKGPlayerFactory, type IKGPlayer } from '@ikigaians/ikgplayer'
import { useEffect, useRef, useState } from 'react'

interface LiveStreamProps {
  url: string
  width?: number
  height?: number
  autoPlay?: boolean
  wasmBaseUrl?: string
}

const LiveStreamVideo = ({
  url,
  width = 500,
  height = 500,
  autoPlay = true,
  wasmBaseUrl,
}: LiveStreamProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<IKGPlayer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initPlayer = async () => {
      if (!containerRef.current) return

      try {
        setIsLoading(true)
        setError(null)

        // const { origin, pathname } = window.location
        // const defaultWasmUrl = `${origin}${pathname}libmedia/wasm`

        const playerOptions = {
          // wasmBaseUrl: defaultWasmUrl,
          container: containerRef.current,
          enableWebCodecs: true,
        }

        // 創建播放器實例
        playerRef.current = IKGPlayerFactory.create('libmedia', playerOptions)
        playerRef.current.setLogLevel(1)

        // 設置事件監聽
        playerRef.current.on('error', (err: Error) => {
          if (mounted) {
            setError(err.message || '播放發生錯誤')
            setIsLoading(false)
          }
        })

        playerRef.current.on('loaded', () => {
          if (mounted) {
            setIsLoading(false)
          }
        })

        // 加載視頻源 - isLive 應該在 load 方法中設置
        await playerRef.current.load(url)

        if (mounted && autoPlay) {
          await playerRef.current.play()
        }
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : '播放器初始化失敗'
          console.error('IKGPlayer error:', err)
          setError(errorMessage)
          setIsLoading(false)
        }
      }
    }

    initPlayer()

    return () => {
      mounted = false
      if (playerRef.current) {
        playerRef.current.destroy().catch(console.error)
        playerRef.current = null
      }
    }
  }, [url, autoPlay, wasmBaseUrl])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="h-full w-full bg-black"
      />

      {isLoading && (
        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white">載入中...</div>
        </div>
      )}

      {error && (
        <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-black">
          <div className="p-4 text-center text-red-500">
            <div className="mb-2 font-bold">播放錯誤</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveStreamVideo
