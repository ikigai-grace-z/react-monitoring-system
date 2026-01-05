// import { IKGPlayerFactory, type IKGPlayer } from '@ikigaians/ikgplayer'
// import { useEffect, useRef, useState } from 'react'

// interface LiveStreamProps {
//   url: string
//   width?: number
//   height?: number
//   autoPlay?: boolean
//   wasmBaseUrl?: string
// }

// const LiveStreamVideo = ({
//   url,
//   width = 500,
//   height = 500,
//   autoPlay = true,
//   wasmBaseUrl,
// }: LiveStreamProps) => {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const playerRef = useRef<IKGPlayer | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     let mounted = true

//     const initPlayer = async () => {
//       if (!containerRef.current) return

//       try {
//         setIsLoading(true)
//         setError(null)

//         const { origin, pathname } = window.location
//         const options = {
//           // wasmBaseUrl: wasmBaseUrl || `${origin}${pathname}libmedia/wasm`,
//           container: containerRef.current,
//           isLive: true,
//           enableWebCodecs: true,
//           lowLatency: true,
//         }

//         // 創建播放器實例
//         playerRef.current = IKGPlayerFactory.create('libmedia', options)

//         // 設置事件監聽
//         playerRef.current.on('error', (err: Error) => {
//           if (mounted) {
//             setError(err.message || '播放發生錯誤')
//             setIsLoading(false)
//           }
//         })

//         playerRef.current.on('loaded', () => {
//           if (mounted) {
//             setIsLoading(false)
//           }
//         })

//         // 加載視頻源
//         await playerRef.current.load(url)

//         if (mounted && autoPlay) {
//           await playerRef.current.play()
//         }
//       } catch (err) {
//         if (mounted) {
//           const errorMessage =
//             err instanceof Error ? err.message : '播放器初始化失敗'
//           setError(errorMessage)
//           setIsLoading(false)
//           console.error('IKGPlayer error:', err)
//         }
//       }
//     }

//     initPlayer()

//     return () => {
//       mounted = false
//       // 銷毀播放器實例以釋放資源
//       if (playerRef.current) {
//         playerRef.current.destroy().catch(console.error)
//         playerRef.current = null
//       }
//     }
//   }, [url, autoPlay, wasmBaseUrl])

//   return (
//     <div className="relative h-full w-full">
//       <div
//         ref={containerRef}
//         style={{ width: `${width}px`, height: `${height}px` }}
//         className="h-full w-full bg-black"
//       />

//       {isLoading && (
//         <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
//           <div className="text-white">載入中...</div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-black">
//           <div className="p-4 text-center text-red-500">
//             <div className="mb-2 font-bold">播放錯誤</div>
//             <div className="text-sm">{error}</div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default LiveStreamVideo
