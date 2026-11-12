#!/bin/bash
# 开发环境发布构建：官网 + 管理后台 + 后端，并组装为后端静态目录
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "[build] 1/3 构建官网..."
npm run build

echo "[build] 2/3 构建管理后台..."
npm --prefix admin run build

echo "[build] 3/3 编译后端..."
npm --prefix server run build

echo "[build] 组装静态产物到 server/public..."
rm -rf server/public/site server/public/admin
mkdir -p server/public
cp -R dist server/public/site
cp -R admin/dist server/public/admin

echo "[build] 完成："
echo "  server/dist/index.js"
echo "  server/public/site/index.html"
echo "  server/public/admin/index.html"
