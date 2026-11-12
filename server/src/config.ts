import path from 'node:path';
import fs from 'node:fs';

/** 工作区默认数据目录，持久卷不可写时回退到这里 */
const FALLBACK_DATA_DIR = path.resolve(process.cwd(), 'data');

/**
 * 数据目录：SQLite 数据库与上传图片都存放在此（生产环境挂载持久卷 /app/data）。
 * 持久卷属主可能是 root，非 root 进程会收到 EACCES；此时回退到工作区目录保证服务能启动，
 * 但回退目录不会持久化，重新部署后数据会丢失，需要修复持久卷权限后重启。
 */
function ensureWritableDataDir(preferred: string): string {
  const candidates = preferred === FALLBACK_DATA_DIR ? [preferred] : [preferred, FALLBACK_DATA_DIR];

  for (const dir of candidates) {
    try {
      const uploads = path.join(dir, 'uploads');
      fs.mkdirSync(uploads, { recursive: true });
      fs.accessSync(uploads, fs.constants.W_OK);
      if (dir !== preferred) {
        console.warn(
          `[严重警告] DATA_DIR 不可写（${preferred}），已临时回退到 ${dir}；数据不会持久化，重新部署后会丢失`,
        );
      }
      return dir;
    } catch (err) {
      if (dir === preferred) {
        const code = (err as NodeJS.ErrnoException).code || (err as Error).message;
        console.warn(`[警告] 数据目录不可用（${dir}）：${code}`);
      } else {
        throw err;
      }
    }
  }

  throw new Error('无法创建可写的数据目录');
}

const DATA_DIR = ensureWritableDataDir(
  process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : FALLBACK_DATA_DIR,
);
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
/** 宣传片等大视频存放目录：与上传图片同在数据卷，避免随前端构建产物重复拷贝 */
const VIDEOS_DIR = path.join(DATA_DIR, 'videos');
fs.mkdirSync(VIDEOS_DIR, { recursive: true });

/** 静态站点目录：site/ 为官网构建产物，admin/ 为后台构建产物 */
const PUBLIC_DIR = process.env.PUBLIC_DIR
  ? path.resolve(process.env.PUBLIC_DIR)
  : path.resolve(process.cwd(), 'public');

const isProd = process.env.NODE_ENV === 'production';

const DEFAULT_JWT_SECRET = 'rezen-dev-secret-please-override';
const DEFAULT_ADMIN_PASSWORD = 'admin123456';

export const config = {
  isProd,
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '0.0.0.0',
  dataDir: DATA_DIR,
  uploadsDir: UPLOADS_DIR,
  videosDir: VIDEOS_DIR,
  dbFile: path.join(DATA_DIR, 'data.db'),
  publicDir: PUBLIC_DIR,
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  /** 后台 Cookie 是否仅 HTTPS 传输；HTTP 内网测试可显式设为 false */
  cookieSecure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProd,
  /** 企业微信群机器人 Webhook 地址，留空则不推送 */
  wecomWebhookUrl: (process.env.WECOM_WEBHOOK_URL || '').trim(),
  /** 钉钉群机器人 Webhook 地址，留空则不推送 */
  dingtalkWebhookUrl: (process.env.DINGTALK_WEBHOOK_URL || '').trim(),
  /** 钉钉机器人加签密钥（安全设置选择“加签”时填写） */
  dingtalkSecret: (process.env.DINGTALK_SECRET || '').trim(),
  /** 种子数据（离线图片资产 + JSON），位于包根目录 */
  seedAssetsDir: path.resolve(process.cwd(), 'seed-assets'),
  seedDataFile: path.resolve(process.cwd(), 'seed-data.json'),
  defaultJwtSecret: DEFAULT_JWT_SECRET,
  defaultAdminPassword: DEFAULT_ADMIN_PASSWORD,
};

// 内部测试阶段允许使用默认密钥启动，但正式对外前必须通过环境变量覆盖
if (isProd && config.jwtSecret === DEFAULT_JWT_SECRET) {
  console.warn('[安全警告] 生产环境正在使用默认 JWT_SECRET，仅限内部测试；正式对外前必须配置随机长串密钥');
}

if (!isProd && (config.jwtSecret === DEFAULT_JWT_SECRET || config.adminPassword === DEFAULT_ADMIN_PASSWORD)) {
  console.warn('[安全提醒] 正在使用默认 JWT_SECRET 或管理员密码，请通过环境变量 JWT_SECRET / ADMIN_PASSWORD 覆盖');
}
