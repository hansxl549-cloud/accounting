import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const transactions = await prisma.transaction.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const amount = Number(body.amount);
  const title = String(body.title ?? "").trim();
  const type = String(body.type ?? "");
  const category = String(body.category ?? "").trim();
  const date = new Date(`${body.date}T12:00:00`);
  if (!title || !category || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(date.getTime()) || !["INCOME", "EXPENSE"].includes(type)) {
    return NextResponse.json({ error: "请填写正确的账目内容、金额和日期。" }, { status: 400 });
  }
  const transaction = await prisma.transaction.create({
    data: { title, category, type, amount: Math.round(amount * 100), date, note: String(body.note ?? "").trim() }
  });
  return NextResponse.json(transaction, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (typeof id !== "string" || !id) return NextResponse.json({ error: "账目编号无效。" }, { status: 400 });
  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
