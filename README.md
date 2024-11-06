# 星怒

## 技术栈

Vue3 + Vite + TypeScript + Element Plus + Less + Pinia + Vue Router

项目采用 _pnpm_ 作为包管理工具搭建 Monorepo 仓库。

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

在根目录下创建 `.env` 文件，内容如下，填写必要内容：

```env
GAME_PORT=7788
JWT_SECRET=

# 邮箱配置
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
```

3. 启动项目

```bash
pnpm dev:backend # 启动后端
pnpm dev:game    # 启动前端
```

## 提交规范

建议不要使用 `git commit` 命令，而是使用封装好的 `pnpm commit` 命令或者 `git-cz` 命令，这样可以保证提交信息的格式统一。

```bash
pnpm commit
```
