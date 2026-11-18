# 小账本

一个使用 Next.js、Prisma 和 SQLite 构建的个人收支记账工具。

## 启动

需要 Node.js 20.9 或更新版本。

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

打开终端提示的本地地址即可使用。`db:seed` 会在数据库为空时添加几笔示例账目；不想要示例数据可跳过这一步。

## 功能

- 记录收入或支出、金额、分类、日期和备注
- 查看本月收入、支出、余额和结余率
- 按账目名称、分类或备注搜索记录
- 查看本月支出分类汇总
- 删除账目

金额以分为单位存入 SQLite，避免小数计算误差。默认数据库文件为项目目录下的 `prisma/dev.db`。
