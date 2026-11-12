# syntax=docker/dockerfile:1
# 丽呈智旅官网 · 单容器一体化部署
# 阶段：官网构建 → 管理后台构建 → 后端编译 → 精简运行时
# Sealos 应用启动器：镜像构建后，挂持久卷到 /app/data，暴露端口 3000 即可。

# ── 阶段 1：官网前端构建 ──────────────────────────────
FROM node:22-alpine AS site-build
WORKDIR /site
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public
RUN npm run build

# ── 阶段 2：管理后台前端构建 ──────────────────────────
FROM node:22-alpine AS admin-build
WORKDIR /admin
COPY admin/package.json admin/package-lock.json ./
RUN npm ci
COPY admin ./
RUN npm run build

# ── 阶段 3：服务端编译（含原生模块编译工具链）──────────
FROM node:22-alpine AS server-build
WORKDIR /server
RUN apk add --no-cache python3 make g++
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build && npm prune --omit=dev

# ── 阶段 4：运行时 ───────────────────────────────────
FROM node:22-alpine
ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/app/data \
    PUBLIC_DIR=/app/public
WORKDIR /app
RUN apk add --no-cache wget ca-certificates \
 && mkdir -p /app/data
COPY --from=server-build /server/node_modules ./node_modules
COPY --from=server-build /server/dist ./dist
COPY server/package.json ./package.json
COPY --from=site-build /site/dist ./public/site
COPY --from=admin-build /admin/dist ./public/admin
# entrypoint：修复数据卷权限（持久卷属主可能是 root，避免 EACCES）
COPY server/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
ENTRYPOINT ["entrypoint.sh"]
CMD ["node", "dist/index.js"]
