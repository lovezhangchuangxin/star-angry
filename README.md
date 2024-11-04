# 星怒

## 技术栈

Vue3 + Vite + TypeScript + Element Plus + Less + Pinia + Vue Router

项目采用 _pnpm_ 作为包管理工具搭建 Monorepo 仓库。

## 项目结构

```
.
├── packages
│   ├── api      # 接口定义
│   ├── game     # 游戏前端
│   └── shared   # 通用方法
└── README.md
```

## 项目启动

```bash
pnpm install
pnpm dev
```

## 提交规范

建议不要使用 `git commit` 命令，而是使用封装好的 `pnpm commit` 命令或者 `git-cz` 命令，这样可以保证提交信息的格式统一。

```bash
pnpm commit
```
