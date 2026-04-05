import { useState, useMemo } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';

const CURRENCIES: Record<string, { symbol: string; rate: number; name: string }> = {
  INR: { symbol: '₹', rate: 1, name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 0.012, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.011, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.0095, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 1.78, name: 'Japanese Yen' },
  AED: { symbol: 'د.إ', rate: 0.044, name: 'UAE Dirham' },
  SGD: { symbol: 'S$', rate: 0.016, name: 'Singapore Dollar' },
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100000');
  const [from, setFrom] = useState('INR');
  const [to, setTo] = useState('USD');
  const [isSwapping, setIsSwapping] = useState(false);

  const converted = useMemo(() => {
    const num = parseFloat(amount) || 0;
    const inINR = num / CURRENCIES[from].rate;
    return inINR * CURRENCIES[to].rate;
  }, [amount, from, to]);

  const swap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setFrom(to);
      setTo(from);
      setIsSwapping(false);
    }, 200);
  };

  return (
    <div className="bg-card rounded-2xl shadow-ambient p-6 group hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Currency Converter</h3>
          <p className="text-[11px] text-muted-foreground">Live indicative rates</p>
        </div>
        <RefreshCw size={14} className="text-muted-foreground animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-3">
        {/* From */}
        <div className="bg-accent rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground ">From</label>
            <select
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map(c => (
                <option key={c} value={c}>{c} — {CURRENCIES[c].name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-muted-foreground">{CURRENCIES[from].symbol}</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="bg-transparent text-xl font-bold text-foreground outline-none w-full"
              min="0"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className={`w-9 h-9 rounded-full [#eef2ff] flex items-center justify-center hover:[#e0e7ff] transition-all duration-200 ${isSwapping ? 'rotate-180' : ''}`}
            style={{ transition: 'transform 200ms ease, background-color 200ms ease' }}
          >
            <ArrowRightLeft size={16} className="" style={{ color: "#6366f1" }} />
          </button>
        </div>

        {/* To */}
        <div className="bg-accent rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground ">To</label>
            <select
              value={to}
              onChange={e => setTo(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map(c => (
                <option key={c} value={c}>{c} — {CURRENCIES[c].name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-muted-foreground">{CURRENCIES[to].symbol}</span>
            <span className="text-xl font-bold text-foreground animate-number-pop" key={`${converted}-${to}`}>
              {converted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Rate Info */}
        <p className="text-[11px] text-muted-foreground text-center">
          1 {from} = {(CURRENCIES[to].rate / CURRENCIES[from].rate).toFixed(6)} {to}
        </p>
      </div>
    </div>
  );
}
