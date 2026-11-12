# 丽呈智旅官网

丽呈智旅（Rezen Smart Travel）官方网站，含官网前台、运营管理后台与一体化后端服务。线上域名：<https://www.lczl.net>。

## 技术栈

- 官网：React 19 + TypeScript + Vite 8 + Tailwind CSS 4
- 管理后台（`admin/`）：React 19 + Vite + Tailwind CSS 4 + wangEditor 5
- 后端（`server/`）：Fastify 5 + Drizzle ORM + SQLite（better-sqlite3）+ Zod + sharp
- 部署：多阶段 Docker 构建，单容器运行，持久卷 `/app/data`

## 目录结构

```
├── src/                # 官网前台源码（自实现 History 路由）
├── public/             # 官网静态资源（图片、视频、robots.txt、llms.txt）
├── admin/              # 运营管理后台（独立 Vite 应用，构建到 /admin）
├── server/             # Fastify 后端（API、静态托管、SQLite、种子数据）
├── docs/               # 管理后台技术方案
├── Dockerfile          # 多阶段构建（官网 → 后台 → 后端 → 运行时）
└── index.html          # 官网入口与 SEO 基础标签
```

## 本地开发

需要 Node.js 22+。三个应用分别启动：

```bash
npm install                 # 官网依赖
npm --prefix server install # 后端依赖
npm --prefix admin install  # 后台依赖

npm run dev                 # 官网，http://localhost:3000
npm run dev:server          # 后端，http://localhost:8080（含 /api 与 /uploads）
npm run dev:admin           # 后台，http://localhost:3002/admin/
```

官网与后台的 Vite 开发代理均已指向 `http://localhost:8080`，与 `dev:server` 的默认端口一致。

其他脚本：

```bash
npm run lint          # 官网 + 后端 + 后台全量类型检查
npm run build         # 构建官网
npm run build:server  # 编译后端
npm run seed          # 数据库为空时导入种子数据
npm run extract-seed  # 开发期重建种子数据与本地化图片
```

## 环境变量

| 变量 | 说明 | 默认 |
|---|---|---|
| `PORT` | 后端监听端口 | `3000`（开发脚本固定为 `8080`） |
| `DATA_DIR` | SQLite 与上传图片目录 | `./data` |
| `PUBLIC_DIR` | 官网/后台构建产物目录 | `./public` |
| `JWT_SECRET` | 后台会话签名密钥 | 开发默认值；**正式对外前必填** |
| `ADMIN_USERNAME` | 首次建号的管理员账号 | `admin` |
| `ADMIN_PASSWORD` | 首次建号的管理员密码 | 开发默认值；**正式对外前必填** |
| `COOKIE_SECURE` | 后台 Cookie 是否仅 HTTPS 传输 | 生产 `true`，开发 `false`；HTTP 内网测试可设为 `false` |
| `WECOM_WEBHOOK_URL` | 企业微信群机器人 Webhook | 空（不推送） |
| `DINGTALK_WEBHOOK_URL` | 钉钉群机器人 Webhook | 空（不推送） |
| `DINGTALK_SECRET` | 钉钉机器人加签密钥（可选） | 空 |

生产环境未配置 `JWT_SECRET` 或首次建库未配置 `ADMIN_PASSWORD` 时，当前内部测试版本只打印安全警告并继续使用默认值；正式对外前必须补配这两个环境变量。

## 数据与内容

- 前台 Banner、新闻、酒店名录优先读取后端 API，接口不可用时静默回退到内置静态数据。
- 首次启动且数据库为空时，自动从 `server/seed-data.json` 与 `server/seed-assets/` 导入内容，全程离线。
- 线索提交写入 `leads` 表；配置 `WECOM_WEBHOOK_URL` 和/或 `DINGTALK_WEBHOOK_URL` 后异步推送到对应群机器人。
- 访问统计与 AI 来源归因写入 `pageviews` 表，后台可在「访问统计 / AI 流量归因」查看。

## 部署

### Sealos DevBox

Sealos DevBox 发布 OCI 镜像时使用根目录的 `entrypoint.sh` 作为启动入口，构建必须在开发环境提前完成：

```bash
npm run build:release   # 构建官网、后台、后端，并组装到 server/public
./entrypoint.sh         # 发布前本地验证启动
```

`entrypoint.sh` 只启动 `server/dist/index.js`，不执行任何构建步骤。发布前确认：

- `server/dist/index.js`、`server/public/site/index.html`、`server/public/admin/index.html` 均存在
- `server/node_modules` 已安装（运行时依赖，发布前不要删除）
- 应用监听 `0.0.0.0`，端口读取 Sealos 注入的 `PORT`
- `entrypoint.sh` 具备执行权限

应用管理中建议配置：

| 变量 | 建议值 |
|---|---|
| `PORT` | `3000` |
| `DATA_DIR` | 持久卷内的目录，例如 `/home/devbox/project/data` |
| `COOKIE_SECURE` | 内部 HTTP 测试填 `false`；正式 HTTPS 域名填 `true` |
| `JWT_SECRET` / `ADMIN_PASSWORD` | 正式对外前必须配置 |

### Docker

```bash
docker build -t rezen-site .
docker run -p 3000:3000 \
  -e JWT_SECRET=your-random-secret \
  -e ADMIN_PASSWORD=your-strong-password \
  -v /app/data:/app/data \
  rezen-site
```

容器内：

- `/` → 官网静态站
- `/admin` → 运营管理后台
- `/api/*` → REST API
- `/uploads/*` → 已上传图片
- `/app/data` → SQLite（`data.db`）与上传图片，需挂载持久卷

Sealos 应用启动器按「单实例 + 1Gi 持久卷 + 端口 3000」部署即可，健康检查地址为 `/api/health`。
