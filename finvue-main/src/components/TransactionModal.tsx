import { useState } from 'react';
import { useApp, formatINR } from '@/context/AppContext';
import { Transaction, categories } from '@/data/mockTransactions';

export default function TransactionModal() {
  const { state, dispatch } = useApp();
  const editing = state.editingTransaction;
  const [form, setForm] = useState<Omit<Transaction, 'id'>>({
    description: editing?.description || '',
    merchant: editing?.merchant || '',
    amount: editing?.amount || 0,
    date: editing?.date || new Date().toISOString().slice(0, 10),
    category: editing?.category || 'Salary',
    type: editing?.type || 'income',
    status: editing?.status || 'completed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.merchant || form.amount <= 0) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Please fill all fields correctly', type: 'error' } });
      return;
    }
    if (editing) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...form, id: editing.id } });
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Transaction updated', type: 'success' } });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...form, id: Date.now().toString() } });
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Transaction added', type: 'success' } });
    }
    dispatch({ type: 'CLOSE_MODAL' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(25,28,29,0.5)', backdropFilter: 'blur(4px)' }}>
      <form onSubmit={handleSubmit} className="bg-card rounded-[20px] shadow-ambient-lg w-full max-w-md p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{editing ? 'Edit' : 'Add'} Transaction</h2>
          <button type="button" onClick={() => dispatch({ type: 'CLOSE_MODAL' })} className="text-muted-foreground hover:text-foreground text-xl">×</button>
        </div>

        <div className="space-y-4">
          <Field label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} />
          <Field label="Merchant" value={form.merchant} onChange={v => setForm(f => ({ ...f, merchant: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">Amount</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className="w-full bg-accent rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-accent rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-accent rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">Type</label>
            <div className="flex gap-2">
              {(['income', 'expense'] as const).map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-full text-sm font-bold capitalize transition-all ${form.type === t ? '" style={{ background: "#6366f1", color: "white" }} className="' : 'bg-accent text-foreground'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} className="w-full bg-accent rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={() => dispatch({ type: 'CLOSE_MODAL' })} className="flex-1 py-2.5 rounded-full bg-accent text-foreground text-sm font-bold hover:bg-accent/80 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ background: "#6366f1" }}>Save Transaction</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-accent rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400" />
    </div>
  );
}
