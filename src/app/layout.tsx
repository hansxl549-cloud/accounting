import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "小账本 · 个人财务", description: "简单记录每一笔收支" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
