# 星怒

## 技术栈

采用 _pnpm_ 作为包管理工具搭建 Monorepo 仓库。

前端：Vue3 + Vite + TypeScript + Element Plus + Less + Pinia + Vue Router

后端：Node.js + Koa + TypeScript + koa-router + leveldb

后端技术文档：[packages/backend/README.md](packages/backend/README.md)

## 项目结构

```
.
├── packages
│   ├── api      # 接口定义
│   ├── backend  # 游戏后端
|   ├── db       # 数据库
│   ├── game     # 游戏前端
│   └── shared   # 共享方法
└── README.md
```

## 项目启动

1. 下载依赖

```bash
pnpm install
```

2. 配置环境变量

在 `config/env` 目录下创建 `.env` 文件，复制 `.env.template` 中的内容，并修改为自己的配置。

3. 启动项目

```bash
pnpm dev:backend # 启动后端
pnpm dev:game    # 启动前端
```

4. 项目部署

前端打包:

```bash
pnpm build:game
```

打包好后的文件在 `packages/game/dist` 目录下。放到 nginx 中。

nginx 如何配置？参考 [packages/game/nginx.conf](packages/game/nginx.conf)。

后端无需打包直接部署，比如使用 pm2：

```bash
# 安装 pm2
npm install -g pm2
# 启动后端
pm2 start pnpm --name star-anrgy -- run dev:backend
```

## 提交规范

建议不要使用 `git commit` 命令，而是使用封装好的 `pnpm commit` 命令或者 `git-cz` 命令，这样可以保证提交信息的格式统一。

```bash
pnpm commit
```

## 注意

目前前端环境变量解析有些问题，请不要轻易修改端口号。
