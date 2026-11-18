import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (await prisma.transaction.count()) return;
  const now = new Date();
  const day = (offset: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset, 12);
  await prisma.transaction.createMany({
    data: [
      { title: "月度工资", amount: 850000, type: "INCOME", category: "工资", date: day(1), note: "11 月工资" },
      { title: "房租", amount: 260000, type: "EXPENSE", category: "住房", date: day(2), note: "月租" },
      { title: "超市采购", amount: 5680, type: "EXPENSE", category: "餐饮", date: day(3), note: "日常食材" },
      { title: "地铁充值", amount: 2500, type: "EXPENSE", category: "交通", date: day(4), note: "交通卡" },
      { title: "项目奖金", amount: 120000, type: "INCOME", category: "奖金", date: day(6), note: "季度绩效" },
      { title: "咖啡", amount: 3200, type: "EXPENSE", category: "餐饮", date: day(7), note: "周末咖啡" },
      { title: "线上课程", amount: 8900, type: "EXPENSE", category: "学习", date: day(9), note: "设计课程" }
    ]
  });
}

main().finally(() => prisma.$disconnect());
