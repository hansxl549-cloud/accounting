"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, BarChart3, Bell, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, CreditCard, Ellipsis, LayoutDashboard, Plus, Search, Settings2, SlidersHorizontal, Sparkles, Trash2, Wallet, X } from "lucide-react";

type Tx = { id: string; title: string; amount: number; type: "INCOME" | "EXPENSE"; category: string; date: string; note: string };
const money = (cents: number) => new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(cents / 100);
const categories = ["餐饮", "住房", "交通", "购物", "娱乐", "医疗", "学习", "工资", "奖金", "其他"];
const colors: Record<string, string> = { 餐饮: "orange", 住房: "blue", 交通: "purple", 购物: "pink", 娱乐: "yellow", 医疗: "green", 学习: "violet", 工资: "mint", 奖金: "mint", 其他: "gray" };
const icons: Record<string, string> = { 餐饮: "☕", 住房: "⌂", 交通: "↗", 购物: "◇", 娱乐: "♫", 医疗: "+", 学习: "▤", 工资: "↙", 奖金: "✳", 其他: "•••" };

export default function Home() {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("本月");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ type: "EXPENSE", title: "", amount: "", category: "餐饮", date: new Date().toISOString().slice(0, 10), note: "" });
  const refresh = useCallback(async () => { const res = await fetch("/api/transactions"); setTransactions(await res.json()); setLoading(false); }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const monthTx = useMemo(() => transactions.filter(t => { const d = new Date(t.date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }), [transactions]);
  const income = monthTx.filter(t => t.type === "INCOME").reduce((n, t) => n + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === "EXPENSE").reduce((n, t) => n + t.amount, 0);
  const filtered = transactions.filter(t => `${t.title}${t.category}${t.note}`.toLowerCase().includes(query.toLowerCase()));
  const expenseGroups = categories.map(category => ({ category, total: monthTx.filter(t => t.type === "EXPENSE" && t.category === category).reduce((n, t) => n + t.amount, 0) })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const maxGroup = Math.max(...expenseGroups.map(g => g.total), 1);
  async function save(e: React.FormEvent) {
    e.preventDefault(); const res = await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) { setToast("请检查填写内容"); return; }
    setForm({ ...form, title: "", amount: "", note: "" }); setModal(false); setToast("账目已保存"); refresh(); window.setTimeout(() => setToast(""), 2400);
  }
  async function remove(id: string) { await fetch("/api/transactions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); refresh(); }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Wallet size={19}/></div><span>小账本</span><span className="brand-dot">.</span></div>
      <div className="workspace"><div className="avatar">L</div><div><b>我的空间</b><small>个人账户</small></div><ChevronDown size={15} className="muted"/></div>
      <div className="nav-label">工作台</div>
      <nav><a className="nav-item active"><LayoutDashboard size={17}/>总览</a><a className="nav-item"><Wallet size={17}/>收支明细<span className="nav-count">{transactions.length}</span></a><a className="nav-item"><BarChart3 size={17}/>统计分析</a><a className="nav-item"><CreditCard size={17}/>账户管理</a></nav>
      <div className="nav-label categories-label">常用分类 <button aria-label="设置分类"><Ellipsis size={18}/></button></div>
      <nav>{["餐饮", "住房", "交通", "购物"].map(c => <a className="nav-item category-nav" key={c}><span className={`mini-dot ${colors[c]}`}/>{c}</a>)}</nav>
      <div className="sidebar-bottom"><div className="upgrade"><div className="upgrade-star"><Sparkles size={15}/></div><strong>让理财更简单</strong><p>每一笔记录，都是更好的开始。</p><button onClick={() => setModal(true)}>记一笔 <ArrowUpRight size={14}/></button></div><a className="nav-item"><CircleHelp size={17}/>帮助与反馈</a><a className="nav-item"><Settings2 size={17}/>设置</a><div className="profile"><div className="profile-avatar">林</div><div><b>Lin</b><small>免费账户</small></div><Ellipsis size={18}/></div></div>
    </aside>

    <section className="main-content">
      <header className="topbar"><div className="breadcrumb">工作台 <span>/</span> <b>总览</b></div><div className="top-actions"><button className="icon-button" aria-label="通知"><Bell size={18}/><i/></button><div className="top-divider"/><div className="top-user"><div className="profile-avatar">林</div><span>Lin</span><ChevronDown size={14}/></div></div></header>
      <div className="page-wrap">
        <div className="welcome-row"><div><div className="eyebrow">星期一 · 好好生活，也好好记账</div><h1>早上好，Lin <span>✳</span></h1><p className="subheading">看看你的财务近况，为今天做好准备。</p></div><button className="primary-button" onClick={() => setModal(true)}><Plus size={17}/>记一笔</button></div>
        <div className="overview-heading"><h2>财务概览</h2><button className="period-select" onClick={() => setPeriod(period === "本月" ? "本周" : "本月")}><span className="calendar-icon">▦</span>{period}<ChevronDown size={15}/></button></div>
        <div className="stats-grid">
          <div className="stat-card balance-card"><div className="stat-top"><span>总余额</span><button aria-label="更多"><Ellipsis size={19}/></button></div><div className="stat-value">{money(income - expenses)}</div><div className="stat-foot"><span className="trend-pill"><ArrowUpRight size={13}/> 本月</span><span>收入减去支出</span><div className="sparkline"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0 24 C10 22 12 16 20 19 S30 23 38 13 S49 18 58 11 S69 17 78 9 S90 11 100 2"/></svg></div></div></div>
          <div className="stat-card"><div className="stat-top"><span>本月收入</span><div className="stat-icon income-icon"><ArrowDownLeft size={17}/></div></div><div className="stat-value">{money(income)}</div><div className="stat-foot"><span className="stat-note">共 {monthTx.filter(t => t.type === "INCOME").length} 笔收入</span><span className="foot-accent green">收入</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>本月支出</span><div className="stat-icon expense-icon"><ArrowUpRight size={17}/></div></div><div className="stat-value">{money(expenses)}</div><div className="stat-foot"><span className="stat-note">共 {monthTx.filter(t => t.type === "EXPENSE").length} 笔支出</span><span className="foot-accent coral">支出</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>结余率</span><div className="stat-icon rate-icon">%</div></div><div className="stat-value">{income ? Math.round((income - expenses) / income * 100) : 0}<small>%</small></div><div className="stat-foot"><span className="stat-note">收入中留下的比例</span><div className="rate-track"><i style={{ width: `${income ? Math.max(0, Math.min(100, (income - expenses) / income * 100)) : 0}%` }}/></div></div></div>
        </div>

        <div className="content-grid">
          <section className="panel transactions-panel"><div className="panel-heading"><div><h2>最近账目</h2><p>查看你最近的收支记录</p></div><button className="text-button" onClick={() => setQuery("")}>查看全部 <ChevronRight size={15}/></button></div>
            <div className="table-tools"><div className="searchbox"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索账目..."/></div><button className="filter-button" onClick={() => setQuery("")}><SlidersHorizontal size={15}/>筛选</button></div>
            <div className="transaction-table"><div className="table-head"><span>账目</span><span>分类</span><span>日期</span><span>金额</span><span/></div>
              {loading ? <div className="empty-state">正在载入账目…</div> : filtered.length ? filtered.slice(0, 7).map(t => <div className="transaction-row" key={t.id}><div className="tx-name"><div className={`tx-icon ${colors[t.category] || "gray"}`}>{icons[t.category] || "•"}</div><div><b>{t.title}</b><small>{t.note || (t.type === "INCOME" ? "收入记录" : "日常支出")}</small></div></div><span className="category-tag">{t.category}</span><span className="date-cell">{new Date(t.date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}</span><strong className={t.type === "INCOME" ? "amount-positive" : "amount-negative"}>{t.type === "INCOME" ? "+" : "−"}{money(t.amount)}</strong><button className="delete-button" title="删除账目" onClick={() => remove(t.id)}><Trash2 size={14}/></button></div>) : <div className="empty-state">还没有账目，记下第一笔吧。</div>}
            </div><div className="table-footer"><span>显示 {Math.min(filtered.length, 7)} 条，共 {filtered.length} 条记录</span><div><button disabled><ChevronLeft size={15}/></button><button className="page-number">1</button><button disabled><ChevronRight size={15}/></button></div></div>
          </section>
          <section className="panel spending-panel"><div className="panel-heading"><div><h2>支出分类</h2><p>本月消费分布</p></div><button className="icon-button subtle" aria-label="更多"><Ellipsis size={19}/></button></div>
            <div className="spending-total"><span>总支出</span><b>{money(expenses)}</b><small>本月累计支出</small></div>
            <div className="category-list">{expenseGroups.length ? expenseGroups.slice(0, 5).map(g => <div className="spending-row" key={g.category}><div className="spending-label"><div className={`tx-icon small ${colors[g.category]}`}>{icons[g.category]}</div><span>{g.category}</span><b>{money(g.total)}</b></div><div className="bar-track"><i className={colors[g.category]} style={{ width: `${Math.max(4, g.total / maxGroup * 100)}%` }}/></div></div>) : <div className="empty-mini">本月还没有支出</div>}</div>
            <button className="all-categories" onClick={() => setQuery("")}>查看全部分类 <ChevronRight size={15}/></button>
          </section>
        </div>
        <footer className="footer"><span>© 2025 小账本</span><span>让每一笔都有迹可循</span><span>数据保存在你的本地数据库中</span></footer>
      </div>
    </section>
    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}><form className="entry-modal" onSubmit={save}><div className="modal-header"><div><h2>记一笔</h2><p>把今天的收支好好记下来</p></div><button type="button" className="icon-button" onClick={() => setModal(false)}><X size={19}/></button></div><div className="type-switch"><button type="button" className={form.type === "EXPENSE" ? "selected expense-selected" : ""} onClick={() => setForm({ ...form, type: "EXPENSE" })}>支出</button><button type="button" className={form.type === "INCOME" ? "selected income-selected" : ""} onClick={() => setForm({ ...form, type: "INCOME" })}>收入</button></div><label className="amount-label">金额<div className="amount-input"><span>¥</span><input required type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}/></div></label><label>账目名称<input required placeholder="例如：午餐" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/></label><div className="form-row"><label>分类<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>日期<input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}/></label></div><label>备注（选填）<input placeholder="添加一点说明..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}/></label><button className="primary-button modal-submit" type="submit">保存账目</button></form></div>}
    {toast && <div className="toast">✓ &nbsp;{toast}</div>}
  </main>;
}
