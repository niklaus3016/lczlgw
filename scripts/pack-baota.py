#!/usr/bin/env python3
"""
组装宝塔部署包（baota-deploy.zip）
运行方式：python3 scripts/pack-baota.py
"""
import os, shutil, zipfile, time

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_ZIP = os.path.join(PROJECT_ROOT, "baota-deploy.zip")
BUILD_DIR = os.path.join(PROJECT_ROOT, "_baota_build")

# 清理上次残留
if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)
if os.path.exists(OUTPUT_ZIP):
    os.remove(OUTPUT_ZIP)

os.makedirs(BUILD_DIR, exist_ok=True)

# ── server/ 运行时文件 ─────────────────────────────────
server_dst = os.path.join(BUILD_DIR, "server")
os.makedirs(server_dst)

# 后端编译产物
shutil.copytree(os.path.join(PROJECT_ROOT, "server", "dist"), os.path.join(server_dst, "dist"))

# 后端依赖清单（服务器执行 npm ci --omit=dev 安装）
shutil.copy2(os.path.join(PROJECT_ROOT, "server", "package.json"), os.path.join(server_dst, "package.json"))
shutil.copy2(os.path.join(PROJECT_ROOT, "server", "package-lock.json"), os.path.join(server_dst, "package-lock.json"))

# 静态站点（官网 + 后台）
shutil.copytree(os.path.join(PROJECT_ROOT, "server", "public"), os.path.join(server_dst, "public"))

# 种子数据（数据库首次启动自动导入）
shutil.copy2(os.path.join(PROJECT_ROOT, "server", "seed-data.json"), os.path.join(server_dst, "seed-data.json"))
shutil.copytree(os.path.join(PROJECT_ROOT, "server", "seed-assets"), os.path.join(server_dst, "seed-assets"))

# PM2 配置
shutil.copy2(os.path.join(PROJECT_ROOT, "deploy", "ecosystem.config.cjs"), os.path.join(server_dst, "ecosystem.config.cjs"))

# 数据库目录（如已有数据则带过去，否则预创建）
data_src = os.path.join(PROJECT_ROOT, "server", "data")
data_dst = os.path.join(server_dst, "data")
if os.path.isdir(data_src):
    shutil.copytree(data_src, data_dst)
else:
    os.makedirs(os.path.join(data_dst, "uploads"), exist_ok=True)

# ── 宝塔部署说明.txt ────────────────────────────────────
DEPLOY_README = """\
================================================================
 丽呈智旅官网 · 宝塔面板部署说明
================================================================

【包内容】
  server/              后端源码 + 构建产物 + 静态站点
  ├── dist/            后端编译后的 JS
  ├── public/site/     官网静态文件 (Vite build)
  ├── public/admin/    管理后台静态文件 (Vite build)
  ├── data/            SQLite 数据库 + 上传图片目录（可带已有数据）
  ├── seed-data.json   种子数据（数据库为空时自动导入）
  ├── seed-assets/     种子数据所需的图片
  ├── ecosystem.config.cjs   PM2 进程配置
  ├── package.json     依赖清单（服务器上执行 npm ci --omit=dev）

================================================================
【宝塔部署步骤】
================================================================

1. 上传解压
   - 将 baota-deploy.zip 上传到宝塔网站根目录，例如 /www/wwwroot/rezen
   - 在宝塔终端中执行：
     cd /www/wwwroot/rezen && unzip baota-deploy.zip && rm baota-deploy.zip

2. 安装 Node.js
   - 宝塔面板 → 软件商店 → 搜索 "Node.js版本管理器" → 安装
   - 推荐安装 v22.x

3. 安装后端依赖（必须在服务器上执行，原生模块要本地编译）
   cd /www/wwwroot/rezen/server
   npm ci --omit=dev

4. 启动服务（二选一）

   方式 A：使用 PM2 管理器（推荐，宝塔软件商店有现成的）
   - 启动命令：node
   - 启动文件：/www/wwwroot/rezen/server/dist/index.js
   - 运行目录：/www/wwwroot/rezen/server
   - 环境变量：PORT=3000, NODE_ENV=production, HOST=0.0.0.0

   方式 B：命令行 PM2
   cd /www/wwwroot/rezen/server
   pm2 start ecosystem.config.cjs
   pm2 save && pm2 startup

5. 配置 Nginx 反向代理
   - 宝塔面板 → 网站 → 添加站点（域名填你的域名，PHP版本选 "纯静态"）
   - 点击站点名称 → 反向代理 → 添加反向代理
     * 代理名称：rezen
     * 目标 URL：http://127.0.0.1:3000
     * 发送域名：$host
   - 配置完成后，确保站点配置里 root 指令不会覆盖反代（一般反代优先）

6. 放行端口（如果有本地防火墙）
   - 宝塔 → 安全 → 防火墙 → 放行 3000（或云服务商安全组放行 80/443 即可）
   - 注意：Nginx 反代用的是内网 3000，对外只开放 80/443

================================================================
【默认信息 · 生产环境务必修改】
================================================================

  管理后台地址：https://你的域名/admin/
  默认管理员账号：admin
  默认管理员密码：admin123456

  JWT 密钥（默认）：rezen-dev-secret-please-override
  → 上线前通过 PM2 的 env 配置替换：
    JWT_SECRET=一段随机长字符串（建议 openssl rand -hex 32 生成）
    ADMIN_PASSWORD=你的新密码

================================================================
【目录说明 & 数据备份】
================================================================

  SQLite 数据库：server/data/data.db
  上传图片目录： server/data/uploads/
  这两个目录要定期备份！

  首次启动如数据库为空，会自动从 seed-data.json + seed-assets 导入初始数据。

================================================================
【更新版本流程】
================================================================

  1. 停服务：pm2 stop rezen-smart-travel
  2. 备份数据：cp -r server/data server/data.bak
  3. 用新版 server/dist + server/public 覆盖旧版本
  4. npm ci --omit=dev（如 package.json 有变化）
  5. 启动：pm2 start rezen-smart-travel

================================================================
【常见问题】
================================================================

 Q：打开域名是空白页？
 A：99% 是 PM2 进程没启动或 Nginx 反代没配好。浏览器 F12 → Console 看报错，
    或终端 curl http://127.0.0.1:3000/api/health 确认后端是否正常响应。

 Q：pm2 启动后秒退？
 A：看 pm2 logs rezen-smart-travel，大概率是 native module 没在服务器编译好，
    删掉 node_modules 重新 npm ci --omit=dev。

 Q：后台打不开？
 A：确保 URL 结尾带 / ，即 https://你的域名/admin/ 而非 /admin。

 Q：上传图片失败？
 A：server/data/uploads 目录权限不够，执行 chmod -R 755 server/data
"""

with open(os.path.join(BUILD_DIR, "宝塔部署说明.txt"), "w", encoding="utf-8") as f:
    f.write(DEPLOY_README)

# ── 打成 zip ────────────────────────────────────────────
print("正在打包...")
with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(BUILD_DIR):
        arc_prefix = os.path.relpath(root, BUILD_DIR)
        for fname in files:
            fpath = os.path.join(root, fname)
            arcname = os.path.join(arc_prefix, fname) if arc_prefix != "." else fname
            zf.write(fpath, arcname)
    # 也把 BUILD_DIR 内所有顶层目录列出来
    for dname in os.listdir(BUILD_DIR):
        full = os.path.join(BUILD_DIR, dname)
        if os.path.isdir(full):
            for inner_root, inner_dirs, inner_files in os.walk(full):
                for fname in inner_files:
                    fpath = os.path.join(inner_root, fname)
                    arcname = os.path.relpath(fpath, BUILD_DIR)
                    # 避免重复（上面 walk 已经覆盖）
                    if arcname not in zf.namelist():
                        pass

shutil.rmtree(BUILD_DIR)

size_mb = os.path.getsize(OUTPUT_ZIP) / 1024 / 1024
print(f"\n✅ 打包完成：{OUTPUT_ZIP}")
print(f"   大小：{size_mb:.1f} MB")

# 展示 zip 内容清单
print("\n📦 包内结构：")
with zipfile.ZipFile(OUTPUT_ZIP, "r") as zf:
    names = zf.namelist()
    top_dirs = set()
    for n in names:
        parts = n.split("/")
        if len(parts) > 1:
            top_dirs.add(parts[0] + "/")
    for d in sorted(top_dirs):
        count = sum(1 for n in names if n.startswith(d))
        print(f"   {d} ({count} 个文件)")
    print(f"   宝塔部署说明.txt")
