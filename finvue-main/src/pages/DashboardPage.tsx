import { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useApp, formatINR } from '@/context/AppContext';
import { useCountUp } from '@/hooks/useCountUp';
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';
import CurrencyConverter from '@/components/CurrencyConverter';
import DashboardSkeleton from '@/components/DashboardSkeleton';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#10b981', '#f43f5e', '#f59e0b'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;
  return <DashboardContent />;
}

function DashboardContent() {
  const { state, dispatch } = useApp();
  const { transactions } = state;

  const totals = useMemo(() => {
    // Calculate totals from all transactions since mock data spans multiple months
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }, [transactions]);

  const balanceRef = useCountUp(totals.balance);
  const totalRef = useCountUp(totals.balance);
  const incomeRef = useCountUp(totals.totalIncome);
  const expenseRef = useCountUp(totals.totalExpense);

  const areaData = useMemo(() => {
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const monthMap: Record<string, number> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleString('en', { month: 'short' });
      if (!monthMap[key]) monthMap[key] = 0;
      monthMap[key] += t.type === 'income' ? t.amount : -t.amount;
    });
    let running = 0;
    return months.map(m => {
      running += (monthMap[m] || 0);
      return { month: m, value: Math.max(running, 0) };
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const catTotals: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    return Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const totalSpent = pieData.reduce((s, d) => s + d.value, 0);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [transactions]);

  return (
    <div className="animate-fade-slide-in" key="dashboard">
      {/* Hero Balance */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Portfolio Valuation</p>
          <span ref={balanceRef} className="text-4xl md:text-5xl font-bold" style={{ color: '#6366f1' }}>₹0.00</span>
        </div>
        <div className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5" style={{ background: '#ecfdf5' }}>
          <TrendingUp size={16} style={{ color: '#10b981' }} />
          <span className="text-[13px] font-bold" style={{ color: '#10b981' }}>+12.4% this year</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard icon={Wallet} label="Total Balance" value={totals.balance} subtitle="Updated 2m ago" iconColor="#6366f1" />
        <KPICard icon={ArrowDownLeft} label="Total Income" value={totals.totalIncome} subtitle="All time earnings" iconColor="#10b981" subtitleStyle={{ color: '#10b981' }} />
        <KPICard icon={ArrowUpRight} label="Total Expenses" value={totals.totalExpense} subtitle="All time spending" iconColor="#f43f5e" subtitleStyle={{ color: '#f43f5e' }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-ambient p-6 border border-border hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Balance Trend</h3>
              <p className="text-[13px] text-muted-foreground">Net worth over the last 6 months</p>
            </div>
            <span className="text-xs bg-accent rounded-full px-3 py-1 text-muted-foreground">Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'DM Sans, sans-serif' }}
                formatter={(v: number) => [formatINR(v), 'Balance']}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-card rounded-2xl shadow-ambient p-6 border border-border hover:-translate-y-0.5 transition-transform duration-200">
          <h3 className="text-base font-bold text-foreground mb-4">Spending Breakdown</h3>
          <div className="flex justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-28 mb-20">
            <p className="text-[10px] uppercase text-muted-foreground">Total Spent</p>
            <p className="text-lg font-bold text-foreground">{formatINR(totalSpent)}</p>
          </div>
          <div className="space-y-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-foreground">{d.name}</span>
                </div>
                <span className="font-bold text-foreground">{formatINR(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Currency Converter + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl shadow-ambient p-6 border border-border h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
              <button onClick={() => dispatch({ type: 'SET_SECTION', payload: 'transactions' })} className="text-[13px] hover:underline" style={{ color: '#6366f1' }}>
                View All →
              </button>
            </div>
            <div className="space-y-1">
              {recentTransactions.map(t => {
                const Icon = getCategoryIcon(t.category);
                const color = getCategoryColor(t.category);
                return (
                  <div key={t.id} className="flex items-center gap-4 py-3.5 px-2 rounded-lg hover:bg-accent transition-colors duration-150">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.category} · {new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <span className="text-[15px] font-bold" style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
                      {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <CurrencyConverter />
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: '#6366f1' }}>
        <h3 className="text-lg font-bold text-white">Portfolio Insights</h3>
        <p className="text-[13px] mt-1 mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Unlock deep algorithmic analysis of your holdings across all global banks.
        </p>
        <button className="rounded-full px-5 py-2.5 text-[13px] font-bold transition-all duration-200" style={{ background: '#4f46e5', color: 'white' }}>
          Upgrade Now →
        </button>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, subtitle, iconColor, subtitleStyle }: {
  icon: React.ElementType; label: string; value: number; subtitle: string; iconColor: string; subtitleStyle?: React.CSSProperties;
}) {
  const valueRef = useCountUp(value);
  return (
    <div className="bg-card rounded-2xl shadow-ambient p-5 border border-border hover:-translate-y-1 hover:shadow-ambient-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${iconColor}1a` }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span ref={valueRef} className="text-2xl font-bold text-foreground">{formatINR(value)}</span>
      <p className="text-xs mt-1 text-muted-foreground" style={subtitleStyle}>{subtitle}</p>
    </div>
  );
}
