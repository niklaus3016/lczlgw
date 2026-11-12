import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ffmpegStatic from 'ffmpeg-static';

// ffmpeg-static 为 CJS 模块，运行时默认导出即二进制路径字符串
const ffmpegPath = ffmpegStatic as unknown as string;

/**
 * 后台异步压缩视频：等比缩到最长边 1920、H.264 / CRF 28，完成后同路径替换原文件。
 * 上传接口先返回原路径保证编辑器立即可用，压缩在后台进行，URL 保持不变。
 * 仅在压缩后确实更小时才替换；失败保留原文件，仅记录日志。
 */
export function compressVideoInPlace(filePath: string): void {
  if (!ffmpegPath) return;
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const tmp = path.join(dir, `${path.basename(filePath, ext)}.compressing.mp4`);

  const args = [
    '-i', filePath,
    // 等比缩放，宽度最多 1920，只缩不放，高度取偶数
    '-vf', "scale='min(1920,iw)':-2",
    '-c:v', 'libx264',
    '-crf', '28',
    '-preset', 'veryfast',
    '-c:a', 'aac',
    '-b:a', '128k',
    // moov 前置，支持边下边播
    '-movflags', '+faststart',
    '-y', tmp,
  ];

  const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] }) as ChildProcess;
  let errLog = '';
  proc.stderr?.on('data', (d: Buffer) => {
    errLog = (errLog + d.toString()).slice(-2000);
  });
  proc.on('error', (err: Error) => {
    console.error('[视频压缩] 进程启动失败', err);
    fs.rmSync(tmp, { force: true });
  });
  proc.on('close', (code: number | null) => {
    try {
      if (code === 0 && fs.existsSync(tmp)) {
        const before = fs.statSync(filePath).size;
        const after = fs.statSync(tmp).size;
        if (after < before) {
          fs.renameSync(tmp, filePath);
          console.log(
            `[视频压缩] ${path.basename(filePath)}：${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB`,
          );
        } else {
          // 越压越大（原片码率已很低），保留原文件
          fs.rmSync(tmp, { force: true });
        }
      } else {
        console.error(`[视频压缩] 失败 code=${code}`, errLog.slice(-400));
        fs.rmSync(tmp, { force: true });
      }
    } catch (e) {
      console.error('[视频压缩] 替换失败', e);
      fs.rmSync(tmp, { force: true });
    }
  });
}
