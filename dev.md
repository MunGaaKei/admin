# 初始化到运行

```bash
# 1. 安装 pnpm（如果未安装）
npm install -g pnpm

# 2. 安装依赖
pnpm install

# 3. 初始化数据库（Prisma + SQLite）
cd apps/api
pnpm db:push
pnpm db:seed
cd ../..

# 4. 首次生成翻译 catalog
cd apps/web
pnpm extract
修改.po文件
pnpm compile --typescript
cd ../..

# 5. 启动开发环境
pnpm dev
```

> 后端 API 在 `localhost:3000`，前端配置了 proxy `/api` -> `http://localhost:3000`。

## 日常开发

| 场景                | 命令                                                       |
| ------------------- | ---------------------------------------------------------- |
| 启动开发服务器      | `pnpm dev`                                                 |
| 修改了数据库 schema | `cd apps/api && pnpm db:push`                              |
| 修改了翻译文本后    | `cd apps/web && pnpm extract && pnpm compile --typescript` |
| 生产构建            | `pnpm build`                                               |

> 新增或修改 `msg``xxx``` 等翻译标记后，需要手动执行 `extract`更新`.po`文件，然后`compile` 编译为运行时文件。`.po` 文件需要提交到 git。
