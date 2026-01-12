import { spawn } from 'child_process'
import { mkdirSync, rmSync } from 'fs'

import ffmpeg from '@ffmpeg-installer/ffmpeg'

const ffmpegPath = ffmpeg.path

// clear monitoring files
const monitoringDir = 'public/monitoring'
try {
  console.log('清空 monitoring 資料夾...')
  rmSync(monitoringDir, { recursive: true, force: true })
  mkdirSync(monitoringDir, { recursive: true })
  console.log('monitoring 資料夾已清空')
} catch (error) {
  console.error('清空資料夾時發生錯誤:', error)
}

// 定義參數列表 (注意:每個參數與數值都要分開成陣列的一個元素)
const args = [
  // --- 輸入參數 ---
  '-rtsp_transport',
  'tcp', // 強制 TCP
  '-fflags',
  'nobuffer', // 無緩衝
  '-max_delay',
  '1', // 延遲限制
  '-i',
  'rtsp://192.168.10.1:7447/NnHci31W4nOGNJHl', // 輸入來源

  // --- 輸出參數 ---
  '-an', // 移除音訊
  '-vcodec',
  'libx264', // 影像編碼
  '-preset',
  'ultrafast', // 編碼速度優先
  '-tune',
  'zerolatency', // 低延遲調優
  '-s',
  '216x384', // 解析度
  '-b:v',
  '1024k', // 位元率

  '-flags',
  '+global_header', // HLS 必要標頭 (注意寫法通常是 +global_header)
  '-hls_time',
  '1', // 切片時間
  '-hls_list_size',
  '0', // 保留所有切片 (0 = 不限制)
  '-hls_flags',
  'append_list+delete_segments', // append_list 保留歷史，delete_segments 清理舊檔
  '-hls_delete_threshold',
  '10', // 保留最近 10 個切片
  '-y', // 覆蓋檔案
  'public/monitoring/output.m3u8', // 輸出檔名
]

// 啟動 FFmpeg 子進程
const ffmpegProcess = spawn(ffmpegPath, args)

console.log(`FFmpeg PID: ${ffmpegProcess.pid} 已啟動`)

// --- 處理日誌 (FFmpeg 的日誌大部分在 stderr) ---
ffmpegProcess.stderr.on('data', (data) => {
  const message = data.toString()

  // 這裡可以做過濾，只顯示關鍵訊息，避免 console 被洗版
  // 範例：只顯示包含 'frame=' 或 'Error' 的行
  if (message.includes('frame=') || message.includes('Error')) {
    console.log(`[FFmpeg]: ${message.trim()}`)
  }
})

// --- 錯誤處理 ---
ffmpegProcess.on('error', (err) => {
  console.error('無法啟動 FFmpeg:', err)
})

// --- 結束處理 ---
ffmpegProcess.on('close', (code) => {
  if (code === 0) {
    console.log('FFmpeg 正常結束')
  } else {
    console.error(`FFmpeg 異常退出，退出碼: ${code}`)
  }
})

// --- 如何停止 ---
// 如果你需要手動停止轉檔，可以呼叫 kill
// setTimeout(() => {
//   console.log('停止轉檔...');
//   ffmpegProcess.kill('SIGINT');
// }, 60000); // 60秒後停止
