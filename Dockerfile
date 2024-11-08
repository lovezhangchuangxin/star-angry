# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 pnpm 配置文件和 lock 文件
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# 安装 pnpm
RUN npm install -g pnpm

# 复制项目文件
COPY package.json pnpm-workspace.yaml ./
COPY packages/game ./packages/game

# 安装依赖
RUN pnpm install

# 切换到前端项目目录并构建项目
WORKDIR /app/packages/game
RUN pnpm run build

# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 复制构建后的文件到 Nginx 的 html 目录
COPY --from=build /app/packages/game/dist /usr/share/nginx/html

# 复制 Nginx 配置文件
COPY packages/game/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
