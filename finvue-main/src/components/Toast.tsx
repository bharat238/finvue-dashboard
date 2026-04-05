import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const icons = { success: CheckCircle, error: XCircle, info: Info };
const accents = { success: 'bg-secondary', error: 'bg-destructive', info: 'bg-amber-500' };

export default function Toast() {
  const { state } = useApp();
  if (!state.toast) return null;

  const Icon = icons[state.toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast-in">
      <div className="flex bg-card rounded-xl shadow-ambient-lg overflow-hidden">
        <div className={`w-1 ${accents[state.toast.type]}`} />
        <div className="flex items-center gap-3 px-4 py-3">
          <Icon size={18} className={state.toast.type === 'success' ? 'text-secondary' : state.toast.type === 'error' ? 'text-destructive' : 'text-amber-500'} />
          <span className="text-sm font-inter text-foreground">{state.toast.message}</span>
        </div>
      </div>
    </div>
  );
}
