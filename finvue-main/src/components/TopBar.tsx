import { Menu, Search, Bell, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { WalletLogoSmall } from '@/components/WalletLogo';

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { state, dispatch } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-border flex items-center justify-between px-4 md:px-7 py-4" style={{ background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-muted-foreground" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center bg-accent rounded-[10px] px-3 py-2 w-64 border border-border">
          <Search size={15} className="text-muted-foreground mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role toggle */}
        <div className="flex bg-accent rounded-[10px] p-1 border border-border">
          {(['viewer', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: role })}
              className="px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all duration-150"
              style={state.activeRole === role
                ? { background: '#6366f1', color: 'white' }
                : { color: '#64748b' }
              }
            >
              {role}
            </button>
          ))}
        </div>

        {/* Add Transaction shortcut */}
        {state.activeRole === 'admin' && (
          <button
            onClick={() => dispatch({ type: 'OPEN_MODAL' })}
            className="hidden sm:flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-xs font-bold text-white transition-all"
            style={{ background: '#6366f1' }}
          >
            <Plus size={14} /> Add
          </button>
        )}

        {/* Bell */}
        <button className="relative text-muted-foreground p-2 rounded-[10px] bg-card border border-border">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#f43f5e' }} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <WalletLogoSmall size={36} className="rounded-full" />
          <div className="hidden md:block">
            <div className="text-[13px] font-bold text-foreground">Alexander Thorne</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tier 1 Client</div>
          </div>
        </div>
      </div>
    </header>
  );
}
