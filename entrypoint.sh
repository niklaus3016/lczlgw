#!/bin/bash
# Sealos DevBox 启动入口：只负责启动，所有构建在开发环境完成
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"

# Sealos 通过环境变量注入端口；监听地址必须是 0.0.0.0
export NODE_ENV="${NODE_ENV:-production}"
export PORT="${PORT:-3000}"
export HOST="${HOST:-0.0.0.0}"

# 数据目录默认放在项目内，生产环境建议通过 DATA_DIR 指向持久卷
export DATA_DIR="${DATA_DIR:-$SERVER_DIR/data}"
# 后端静态目录，内部需包含 site/ 与 admin/
export PUBLIC_DIR="${PUBLIC_DIR:-$SERVER_DIR/public}"

# 确保数据目录存在并可写（Sealos PVC 挂载时属主通常是 root）
if ! mkdir -p "$DATA_DIR/uploads" 2>/dev/null; then
  # devbox 用户默认在 sudo 组内，且为免密 sudo；用它把持久卷属主交还给当前用户
  if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
    echo "[entrypoint] 数据目录不可写，使用 sudo 修复属主：$DATA_DIR"
    sudo -n mkdir -p "$DATA_DIR/uploads" 2>/dev/null || true
    sudo -n chown -R "$(id -u):$(id -g)" "$DATA_DIR" 2>/dev/null || true
    sudo -n chmod -R u+rwX "$DATA_DIR" 2>/dev/null || true
  fi
fi

if [ -w "$DATA_DIR" ]; then
  echo "[entrypoint] 数据目录可写：$DATA_DIR"
else
  echo "[entrypoint][警告] 数据目录不可写：$DATA_DIR"
  echo "[entrypoint] 请用 root 执行：chown -R $(id -u):$(id -g) $DATA_DIR && chmod -R u+rwX $DATA_DIR"
  echo "[entrypoint] 应用将回退到工作区 data 目录，数据不会持久化"
fi

# 构建产物检查：缺失时明确提示，不在启动阶段执行构建
for file in \
  "$SERVER_DIR/dist/index.js" \
  "$PUBLIC_DIR/site/index.html" \
  "$PUBLIC_DIR/admin/index.html"; do
  if [ ! -f "$file" ]; then
    echo "[entrypoint] 缺少构建产物：$file" >&2
    echo "[entrypoint] 请先在开发环境执行 npm run build:release" >&2
    exit 1
  fi
done

cd "$SERVER_DIR"
exec node dist/index.js
