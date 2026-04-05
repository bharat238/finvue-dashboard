import { useState } from 'react';
import { User, Users, Bell, Shield, AlertTriangle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const isAdmin = state.activeRole === 'admin';

  const [notifications, setNotifications] = useState({ volatility: true, transfers: true, marketing: false });
  const [security, setSecurity] = useState({ biometric: true, twoFactor: true });

  return (
    <div className="animate-fade-slide-in pb-20" key="settings">
      <h1 className="text-4xl font-bold mb-1" style={{ color: "#6366f1" }}>Settings</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-lg">
        Manage your personal identity, security protocols, and organizational access within The Vault.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Identity */}
          <div className="bg-card rounded-2xl shadow-ambient p-7">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#10b981]" />
                <h2 className="text-xl font-bold text-foreground">Personal Identity</h2>
              </div>
              <button className="rounded-full px-4 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity" style={{ background: "#6366f1" }}>Save Changes</button>
            </div>
            <p className="text-[13px] text-muted-foreground mb-6">Update your public information and avatar.</p>

            <div className="flex items-center gap-5 mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white border-[3px] border-[#afefdd]" style={{ background: "#6366f1" }}>
                AT
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Alexander Thorne</p>
                <p className="text-xs text-muted-foreground">Tier 1 Private Client</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingsInput label="Full Name" value="Alexander Thorne" disabled={!isAdmin} />
              <SettingsInput label="Email Address" value="alex.thorne@vault.com" disabled={!isAdmin} />
              <div className="sm:col-span-2">
                <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">Biography</label>
                <textarea rows={3} disabled={!isAdmin} defaultValue="Senior portfolio manager with 12+ years of experience in global equity markets and alternative investments." className="w-full bg-accent rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400 resize-none disabled:opacity-60" />
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-card rounded-2xl shadow-ambient p-7">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#10b981]" />
                <h2 className="text-xl font-bold text-foreground">Role Management</h2>
              </div>
              <div className="flex bg-accent rounded-full p-1">
                {(['viewer', 'admin'] as const).map(role => (
                  <button key={role} onClick={() => dispatch({ type: 'SET_ROLE', payload: role })}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${state.activeRole === role ? 'bg-[#6366f1] text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground mb-6">Define your administrative capabilities and data visibility.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Viewer Card */}
              <div className={`rounded-xl p-5 ${state.activeRole === 'viewer' ? 'bg-card ring-1 ring-secondary/30' : 'bg-accent'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={18} className="" style={{ color: "#10b981" }} />
                  <span className="text-base font-bold text-foreground">Account Viewer</span>
                </div>
                {state.activeRole === 'viewer' && <span className="inline-block bg-[#eef2ff] text-[#6366f1] text-[10px] uppercase font-bold rounded-full px-2 py-0.5 mb-3">Current Role</span>}
                <div className="space-y-2 text-[13px] ">
                  <div className="flex items-center gap-2 text-foreground"><CheckCircle size={14} className="" style={{ color: "#10b981" }} />Full Transaction Visibility</div>
                  <div className="flex items-center gap-2 text-foreground"><CheckCircle size={14} className="" style={{ color: "#10b981" }} />Generate Expense Reports</div>
                  <div className="flex items-center gap-2 text-muted-foreground line-through"><XCircle size={14} className="text-muted-foreground" />Authorize Outbound Transfers</div>
                </div>
              </div>

              {/* Admin Card */}
              <div className={`rounded-xl p-5 ${state.activeRole === 'admin' ? 'bg-[#6366f1] text-white' : 'bg-accent'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={18} className={state.activeRole === 'admin' ? 'text-white' : 'text-[#10b981]'} />
                  <span className={`text-base font-bold ${state.activeRole === 'admin' ? 'text-white' : 'text-foreground'}`}>System Administrator</span>
                </div>
                {state.activeRole === 'admin' && (
                  <span className="inline-block bg-[#10b981] text-white text-[10px] uppercase font-bold rounded-full px-2.5 py-1 mb-3">Active</span>
                )}
                <div className={`space-y-2 text-[13px] ${state.activeRole === 'admin' ? 'text-white' : ''}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className={state.activeRole === 'admin' ? 'text-white' : 'text-[#6366f1]'} />
                    <span>Asset Rebalancing Controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className={state.activeRole === 'admin' ? 'text-white' : 'text-[#6366f1]'} />
                    <span>API Management Keys</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className={state.activeRole === 'admin' ? 'text-white' : 'text-[#6366f1]'} />
                    <span>Approve High-Risk Transfers</span>
                  </div>
                </div>
                {state.activeRole !== 'admin' && (
                  <button onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })} className="mt-4 w-full rounded-full py-2 text-xs font-bold text-white" style={{ background: "#6366f1" }}>
                    Elevate to Admin
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-2xl shadow-ambient p-7">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="" style={{ color: "#10b981" }} />
              <h2 className="text-xl font-bold text-foreground">Notifications</h2>
            </div>
            <div className="space-y-4">
              <Toggle label="Market Volatility Alerts" desc="Instant push for ±5% swing" checked={notifications.volatility} onChange={v => setNotifications(n => ({ ...n, volatility: v }))} />
              <Toggle label="Transfer Confirmations" desc="Mandatory email for all outbound funds" checked={notifications.transfers} onChange={v => setNotifications(n => ({ ...n, transfers: v }))} />
              <Toggle label="Marketing & Insights" desc="Weekly summaries and growth opportunities" checked={notifications.marketing} onChange={v => setNotifications(n => ({ ...n, marketing: v }))} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Security */}
          <div className="rounded-2xl p-6 text-white bg-[#6366f1]">
            <Shield size={24} className="mb-3" />
            <h3 className="text-lg font-bold">Security Checkup</h3>
            <p className="text-[13px] mt-1 mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Your account security is currently high. 2FA is active.
            </p>
            <button className="w-full rounded-full py-2.5 text-[13px] font-bold mb-5 text-white hover:opacity-90 transition-opacity" style={{ background: "#10b981" }}>Review Protocols</button>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm ">Biometric Login</span>
                <ToggleSwitch checked={security.biometric} onChange={v => setSecurity(s => ({ ...s, biometric: v }))} light />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm ">Two-Factor Auth</span>
                <ToggleSwitch checked={security.twoFactor} onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))} light />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-2xl p-6" style={{ border: '1.5px solid rgba(186,26,26,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="" style={{ color: "#f43f5e" }} />
              <h3 className="text-lg font-bold " style={{ color: "#f43f5e" }}>Danger Zone</h3>
            </div>
            <p className="text-[13px] text-muted-foreground mb-4">Permanently remove your account and all associated vault data.</p>
            <button className="w-full bg-destructive text-destructive-foreground rounded-full py-2.5 text-[13px] font-bold ">Delete Vault Account</button>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 py-3 px-6 flex items-center justify-between border-t border-border" style={{ background: 'rgba(248,249,250,0.95)', backdropFilter: 'blur(8px)' }}>
        <span className="text-xs text-muted-foreground">Last saved: Oct 24, 2023 • 14:32 GMT</span>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-full bg-accent text-foreground text-[13px] font-bold hover:bg-accent/80 transition-colors border border-border">Cancel</button>
          <button className="px-6 py-2.5 rounded-full text-[13px] font-bold text-white hover:opacity-90 transition-opacity shadow-lg" style={{ background: "#6366f1" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function SettingsInput({ label, value, disabled }: { label: string; value: string; disabled: boolean }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-1 block">{label}</label>
      <input type="text" defaultValue={value} disabled={disabled} className="w-full bg-accent rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60" />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

function ToggleSwitch({ checked, onChange, light }: { checked: boolean; onChange: (v: boolean) => void; light?: boolean }) {
  return (
    <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${checked ? (light ? 'bg-secondary' : 'bg-secondary') : 'bg-accent'}`}>
      <span className={`block w-5 h-5 rounded-full bg-card shadow-sm absolute top-0.5 transition-transform duration-200 ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );
}
