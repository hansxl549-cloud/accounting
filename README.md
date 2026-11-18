# 小账本

一个使用 Next.js、Prisma 和 SQLite 构建的个人收支记账工具，可在本机运行，也可部署到公网后通过浏览器访问。

## 浏览器访问（部署到 Render）

仓库已包含 `render.yaml`，可用 Render Blueprint 部署 Web 服务：

1. 登录 [Render](https://dashboard.render.com/) 并选择 **New → Blueprint**。
2. 连接 GitHub 仓库 `hansxl549-cloud/accounting`，选择 `main` 分支并开始部署。
3. 首次创建时，为 `APP_PASSWORD` 设置一个强密码。访问用户名固定为 `lin`。
4. 等待部署完成，在 Render 服务页面打开 `onrender.com` 地址。浏览器会弹出登录框，输入用户名和密码即可使用。

部署配置会把 SQLite 文件写到 Render 的持久磁盘，因此重新部署或服务重启后账目仍会保留。Render 持久磁盘需要付费 Web 服务；不要改用没有持久磁盘的免费实例，否则 SQLite 文件可能在重启或重新部署后丢失。服务配置见 `render.yaml`。

需要更改登录密码时，在 Render 服务的 Environment 设置里更新 `APP_PASSWORD` 并重新部署。请勿把密码提交到 GitHub。浏览器登录保护同时覆盖网页和账目 API；健康检查接口只返回服务状态。

## 本机运行

需要 Node.js 20.9 或更新版本。

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

打开终端提示的本地地址即可使用。开发模式未配置 `APP_PASSWORD` 时不启用登录；如需本地登录，可在 `.env` 中设置用户名和密码。`db:seed` 会在数据库为空时添加示例账目，可跳过。

## 功能

- 记录收入或支出、金额、分类、日期和备注
- 查看本月收入、支出、余额和结余率
- 按账目名称、分类或备注搜索记录
- 查看本月支出分类汇总
- 删除账目
- 通过浏览器密码登录访问部署后的服务

金额以分为单位存入 SQLite，避免小数计算误差。本机默认数据库文件为项目目录下的 `prisma/dev.db`；Render 部署使用 `/var/data/accounting.db`。
