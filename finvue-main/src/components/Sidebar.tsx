import { LayoutDashboard, Receipt, TrendingUp, Settings, HelpCircle, LogOut, Shield } from 'lucide-react';
import { useApp, SectionType } from '@/context/AppContext';
import { WalletLogo } from '@/components/WalletLogo';

const navItems: { label: string; section: SectionType; icon: React.ElementType }[] = [
  { label: 'Dashboard', section: 'dashboard', icon: LayoutDashboard },
  { label: 'Transactions', section: 'transactions', icon: Receipt },
  { label: 'Insights', section: 'insights', icon: TrendingUp },
  { label: 'Settings', section: 'settings', icon: Settings },
];

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const { state, dispatch } = useApp();

  const nav = (section: SectionType) => {
    dispatch({ type: 'SET_SECTION', payload: section });
    onClose?.();
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="px-5 pt-6 pb-7 flex items-center gap-2.5">
          <WalletLogo size={36} />
          <h1 className="text-[18px] font-bold text-foreground tracking-tight">FinVue</h1>
        </div>

        {/* Nav section label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground px-5 mb-1.5">Menu</p>

        {/* Nav items */}
        <nav className="px-3 space-y-0.5">
          {navItems.map(item => {
            const active = state.activeSection === item.section;
            return (
              <button
                key={item.section}
                onClick={() => nav(item.section)}
                style={active ? { background: '#eef2ff', color: '#6366f1' } : {}}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Role Card */}
        <div className="px-4 pb-4">
          <div className="bg-accent rounded-xl p-3.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground flex items-center gap-1.5 mb-2">
              <Shield size={12} /> User Role
            </label>
            <select
              value={state.activeRole}
              onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value as 'viewer' | 'admin' })}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground cursor-pointer outline-none transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Administrator</option>
            </select>
            <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold" style={{ color: state.activeRole === 'admin' ? '#6366f1' : '#f59e0b' }}>
              {state.activeRole === 'admin' ? '⬡ Admin Access' : '◎ Read-Only Mode'}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="px-5 pb-6 space-y-3">
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle size={14} /> Support
          </button>
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
