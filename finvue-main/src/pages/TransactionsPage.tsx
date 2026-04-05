import { useMemo } from 'react';
import { ShieldCheck, Download, Plus, MoreHorizontal, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp, formatINR } from '@/context/AppContext';
import { categories } from '@/data/mockTransactions';
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';
import TransactionModal from '@/components/TransactionModal';

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const { transactions, filters, currentPage, activeRole, modalOpen } = state;
  const isAdmin = activeRole === 'admin';

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(q) || t.merchant.toLowerCase().includes(q));
    }
    if (filters.category !== 'All') result = result.filter(t => t.category === filters.category);
    if (filters.type !== 'all') result = result.filter(t => t.type === filters.type);
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        default: return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    return result;
  }, [transactions, filters]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  const stats = useMemo(() => {
    // Calculate from all transactions since mock data spans multiple months
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const volume = income + expense;
    const pending = transactions.filter(t => t.status === 'pending').length;
    return { volume, pending, outflow: expense, income };
  }, [transactions]);

  const exportCSV = () => {
    const header = 'Date,Description,Merchant,Category,Type,Amount,Status\n';
    const rows = filtered.map(t => `${t.date},"${t.description}","${t.merchant}",${t.category},${t.type},${t.amount},${t.status}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finvue-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'CSV exported successfully', type: 'success' } });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Transaction deleted', type: 'success' } });
  };

  return (
    <div className="animate-fade-slide-in" key="transactions">

      {/* Access Banner */}
      {isAdmin ? (
        <div className="rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ background: '#6366f1' }}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} color="white" />
            <div>
              <p className="text-sm font-bold text-white">Administrator Access Granted</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>Full permission to modify, delete, and add transaction records.</p>
            </div>
          </div>
          <button onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })} className="rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap text-white" style={{ background: '#4f46e5' }}>
            Switch to Viewer
          </button>
        </div>
      ) : (
        <div className="bg-accent rounded-xl p-4 mb-6 border border-border">
          <p className="text-sm text-muted-foreground">👁 Viewing in read-only mode. Switch to Admin for editing capabilities.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#6366f1' }}>Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage your cash flow across all accounts.</p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button onClick={exportCSV} className="flex items-center gap-1.5 bg-accent text-foreground rounded-full px-4 py-2 text-[13px] font-bold border border-border">
            <Download size={14} /> Export
          </button>
          {isAdmin && (
            <button onClick={() => dispatch({ type: 'OPEN_MODAL' })} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-white" style={{ background: '#6366f1' }}>
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Income" value={formatINR(stats.income)} trend="All time earnings" trendColor="#10b981" />
        <StatCard label="Pending Approvals" value={String(stats.pending)} />
        <StatCard label="Total Expenses" value={formatINR(stats.outflow)} trend="All time spending" trendColor="#f43f5e" />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {['All', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: { category: cat === 'All' ? 'All' : cat } })}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
            style={
              (filters.category === cat || (cat === 'All' && filters.category === 'All'))
                ? { background: '#6366f1', color: 'white', borderColor: '#6366f1' }
                : { background: 'transparent', color: '#64748b', borderColor: '#e2e8f0' }
            }
          >
            {cat === 'All' ? 'All Transactions' : cat}
          </button>
        ))}
        <select
          value={filters.sortBy}
          onChange={e => dispatch({ type: 'SET_FILTER', payload: { sortBy: e.target.value as any } })}
          className="ml-auto bg-accent rounded-full px-3 py-1.5 text-xs text-foreground outline-none border border-border"
        >
          <option value="date-desc">Sort by Date ↓</option>
          <option value="date-asc">Sort by Date ↑</option>
          <option value="amount-desc">Sort by Amount ↓</option>
          <option value="amount-asc">Sort by Amount ↑</option>
        </select>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={filters.search}
        onChange={e => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
        className="w-full bg-card rounded-[10px] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none mb-4 border border-border"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
        onFocus={e => (e.target.style.borderColor = '#6366f1')}
        onBlur={e => (e.target.style.borderColor = '')}
      />

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <SearchX size={64} className="text-muted-foreground/40 mb-4" />
          <p className="text-lg font-bold text-foreground">No transactions found</p>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
          <button onClick={() => dispatch({ type: 'SET_FILTER', payload: { search: '', category: 'All', type: 'all' } })} className="rounded-full px-5 py-2 text-sm font-bold text-white" style={{ background: '#6366f1' }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-card rounded-2xl shadow-ambient border border-border overflow-hidden">
            <div className="grid bg-accent border-b border-border" style={{ gridTemplateColumns: isAdmin ? '2fr 1fr 1fr 1fr 1fr 50px' : '2fr 1fr 1fr 1fr 1fr' }}>
              {['Description', 'Category', 'Date', 'Status', 'Amount'].map(h => (
                <div key={h} className="px-5 py-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground font-bold last:text-right">{h}</div>
              ))}
              {isAdmin && <div className="px-3 py-3" />}
            </div>
            {paginated.map(t => {
              const Icon = getCategoryIcon(t.category);
              const color = getCategoryColor(t.category);
              return (
                <div key={t.id} className="grid border-b border-border hover:bg-accent transition-colors duration-150 last:border-b-0" style={{ gridTemplateColumns: isAdmin ? '2fr 1fr 1fr 1fr 1fr 50px' : '2fr 1fr 1fr 1fr 1fr' }}>
                  <div className="px-5 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.merchant}</p>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex items-center">
                    <span className="bg-accent text-foreground text-[11px] uppercase font-bold rounded-md px-2 py-0.5 border border-border">{t.category}</span>
                  </div>
                  <div className="px-5 py-4 flex items-center text-[13px] text-muted-foreground">
                    {new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="px-5 py-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: t.status === 'completed' ? '#10b981' : t.status === 'pending' ? '#f59e0b' : '#f43f5e' }} />
                    <span className="text-[13px] text-foreground capitalize">{t.status}</span>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-end">
                    <span className="text-sm font-bold" style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e', fontFamily: 'DM Mono, monospace' }}>
                      {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="px-3 py-4 flex items-center">
                      <div className="relative group">
                        <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={18} /></button>
                        <div className="hidden group-hover:block absolute right-0 top-6 bg-card shadow-ambient-lg border border-border rounded-lg py-1 z-10 min-w-[120px]">
                          <button onClick={() => dispatch({ type: 'SET_EDITING', payload: t })} className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent">Edit</button>
                          <button onClick={() => handleDelete(t.id)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent" style={{ color: '#f43f5e' }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paginated.map(t => {
              const Icon = getCategoryIcon(t.category);
              const color = getCategoryColor(t.category);
              return (
                <div key={t.id} className="bg-card rounded-xl shadow-ambient border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{t.description}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e', fontFamily: 'DM Mono, monospace' }}>
                      {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-accent text-foreground text-[10px] uppercase font-bold rounded-md px-2 py-0.5">{t.category}</span>
                    <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-[13px] text-muted-foreground">
              Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1} onClick={() => dispatch({ type: 'SET_PAGE', payload: currentPage - 1 })} className="p-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: i + 1 })}
                  className="w-8 h-8 rounded-lg text-xs font-bold border transition-all"
                  style={currentPage === i + 1
                    ? { background: '#6366f1', color: 'white', borderColor: '#6366f1' }
                    : { background: 'transparent', borderColor: '#e2e8f0', color: '#64748b' }
                  }
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => dispatch({ type: 'SET_PAGE', payload: currentPage + 1 })} className="p-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {modalOpen && <TransactionModal />}
    </div>
  );
}

function StatCard({ label, value, trend, trendColor }: { label: string; value: string; trend?: string; trendColor?: string }) {
  return (
    <div className="bg-card rounded-2xl shadow-ambient border border-border p-5">
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {trend && <p className="text-xs mt-1" style={{ color: trendColor }}>{trend}</p>}
    </div>
  );
}
