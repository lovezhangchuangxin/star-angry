# 游戏后端

## 后端架构

- 使用 `Node.js` 作为后端开发语言
- 使用 `Koa` 作为后端框架
- 使用 `TypeScript` 编写代码
- 使用 `koa-router` 处理路由
- 使用 `leveldb` 作为数据库

## 项目结构

```
.
├── src
│   ├── controller  # 控制器层
│   ├── error       # 错误处理
|   ├── router      # 路由
│   ├── service     # 服务层
│   ├── utils       # 工具方法
│   └── app.ts      # 入口文件
```

app.ts 为入口文件，负责启动服务，加载路由等。

处理请求的流程为：app.ts -> 路由 -> 控制器 -> 服务 -> 数据库。

- router层负责接收请求，将请求转发给controller层。
- controller层负责处理请求，调用service层提供的服务。
- service层负责处理业务逻辑，调用db层提供的方法操作数据库。
