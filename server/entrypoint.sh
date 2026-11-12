#!/bin/sh
# Sealos 数据卷首次挂载可能属主为 root，修复权限避免 EACCES
if [ -d /app/data ]; then
  chown -R $(id -u):$(id -g) /app/data 2>/dev/null || true
fi

exec "$@"
