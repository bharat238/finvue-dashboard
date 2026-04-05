import { useMemo } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Download, ChevronRight } from 'lucide-react';
import { useApp, formatINR } from '@/context/AppContext';

export default function InsightsPage() {
  const { state } = useApp();
  const { transactions } = state;

  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const topCategory = expensesByCategory[0];
  const maxExpense = topCategory?.[1] || 1;

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);

  const barData = useMemo(() => {
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    return months.map(m => {
      const inc = transactions.filter(t => t.type === 'income' && new Date(t.date).toLocaleString('en', { month: 'short' }) === m).reduce((s, t) => s + t.amount, 0);
      const exp = transactions.filter(t => t.type === 'expense' && new Date(t.date).toLocaleString('en', { month: 'short' }) === m).reduce((s, t) => s + t.amount, 0);
      return { month: m, income: inc, expenses: exp };
    });
  }, [transactions]);

  return (
    <div className="animate-fade-slide-in" key="insights">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#6366f1' }}>Financial Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep analysis of your portfolio and spending patterns.</p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <span className="bg-accent rounded-full px-3 py-1.5 text-xs text-foreground border border-border">📅 Last 30 Days</span>
          <button className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white" style={{ background: '#6366f1' }}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Top Bento */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {/* Top Expenditure */}
        <div className="md:col-span-5 bg-card rounded-2xl shadow-ambient border border-border p-7">
          <span className="inline-block bg-accent text-muted-foreground text-[10px] uppercase font-bold rounded-full px-2.5 py-1 mb-3">Top Expenditure</span>
          <h2 className="text-3xl font-bold" style={{ color: '#6366f1' }}>{topCategory?.[0] || 'N/A'}</h2>
          <p className="text-xl font-bold text-foreground mt-1">
            {formatINR(topCategory?.[1] || 0)} <span className="text-sm text-muted-foreground font-normal">/mo</span>
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} style={{ color: '#f43f5e' }} />
            <span className="text-[13px]" style={{ color: '#f43f5e' }}>12.3% higher than average</span>
          </div>
        </div>

        {/* Net Inflow */}
        <div className="md:col-span-3 bg-card rounded-2xl shadow-ambient border border-border p-7">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-4">Net Inflow</p>
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-xl font-bold" style={{ color: '#10b981' }}>+{formatINR(totalIncome)}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-xl font-bold" style={{ color: '#f43f5e' }}>-{formatINR(totalExpense)}</p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1">Monthly Delta</p>
          <p className="text-lg font-bold" style={{ color: '#6366f1' }}>{formatINR(totalIncome - totalExpense)}</p>
        </div>

        {/* Investment Yield */}
        <div className="md:col-span-4 rounded-2xl p-7 text-white" style={{ background: '#6366f1' }}>
          <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.7)' }}>Investment Yield</p>
          <p className="text-4xl font-bold mt-2">8.2%</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Annualized Return YTD</p>
          <div className="flex items-end gap-1.5 mt-6 h-10">
            {[30, 40, 35, 50, 55, 65, 80].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: i === 6 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-card rounded-2xl shadow-ambient border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-foreground">Spending by Category</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />This Month</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent border border-border" />Last Month</span>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground mb-6">Monthly breakdown vs. previous period benchmarks.</p>
        <div className="space-y-5">
          {expensesByCategory.slice(0, 5).map(([cat, amount]) => (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-foreground">{cat}</span>
                <span className="text-sm font-bold text-foreground">{formatINR(amount)}</span>
              </div>
              <div className="h-1.5 bg-accent rounded-full mb-1 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(amount / maxExpense) * 100}%`, background: '#6366f1' }} />
              </div>
              <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(amount / maxExpense) * 70}%`, background: '#c7d2fe' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Bar Chart */}
        <div className="bg-card rounded-2xl shadow-ambient border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">6-Month Cash Flow</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />Income</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#f43f5e' }} />Expenses</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                formatter={(v: number) => formatINR(v)}
                contentStyle={{ fontFamily: 'DM Sans, sans-serif', borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#fda4af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Savings Opportunities */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Savings Opportunities</h3>
          {[
            { title: 'Subscription Bloat', desc: '3 unused streaming services detected. Potential savings of ₹3,500/mo.' },
            { title: 'Utility Variance', desc: 'Energy bill is 15% higher than local average.' },
            { title: 'High-Yield Transfer', desc: 'Move ₹15k from savings for an extra 4.5% APY.' },
          ].map(item => (
            <div key={item.title} className="bg-card rounded-xl shadow-ambient border border-border p-4 flex items-center gap-3 hover:bg-accent transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#eef2ff' }}>
                <TrendingUp size={18} style={{ color: '#6366f1' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="text-[13px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          ))}
          <div className="rounded-2xl p-5 text-white" style={{ background: '#6366f1' }}>
            <h4 className="text-base font-bold">Global Market Outlook</h4>
            <p className="text-xs mt-1 mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>Q2 2025 analysis and forecasts</p>
            <button className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ background: '#4f46e5' }}>Read Thesis</button>
          </div>
        </div>
      </div>
    </div>
  );
}
