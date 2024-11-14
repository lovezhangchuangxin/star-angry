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

### 1. 下载依赖

```bash
pnpm install
```

### 2. 配置环境变量

在 `config/env` 目录下创建 `.env` 文件，复制 `.env.template` 中的内容，并修改为自己的配置。

### 3. 启动项目

```bash
pnpm dev:backend # 启动后端
pnpm dev:game    # 启动前端
```

### 4. 项目部署

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

### 5. Docker 部署

```bash
# 克隆仓库
git clone https://github.com/lovezhangchuangxin/star-angry.git

# 进入项目目录
cd star-angry/

# 配置文件
cp ./config/env/.env.template ./config/env/.env
# 修改后台端口 GAME_PORT=7788
sed -i 's/GAME_PORT=xxxx/GAME_PORT=7788/g' ./config/env/.env
# 其他配置自行修改

# 编译镜像 (如有必要, 自行修改镜像源 /etc/docker/daemon.json)
docker build -t star-angry/server:1.0.0 .
# 启动容器
docker run --restart always -d -p 7788:7788 --name star-angry -v $(pwd)/config/:/www/config/ -v $(pwd)/game-data/:/www/packages/backend/dist/ star-angry/server:1.0.0
# 直接访问 7788 端口, 或者自行转发端口
curl http://localhost:7788/
```

### 6. Docker-compose 部署


> 如需修改 `.env` 的配置, 可以直接修改 `docker-compose.yml` 文件中的配置, 例如修改 `JWT_SECRET`

```bash
# 克隆仓库
git clone https://github.com/lovezhangchuangxin/star-angry.git

# 进入项目目录
cd star-angry/

# 启动
docker-compose up -d

# 直接访问 7788 端口, 或者自行转发端口
curl http://localhost:7788/
```

## 提交规范

建议不要使用 `git commit` 命令，而是使用封装好的 `pnpm commit` 命令或者 `git-cz` 命令，这样可以保证提交信息的格式统一。

```bash
pnpm commit
```
