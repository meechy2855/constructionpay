import { useEffect, useState } from 'react';
import { Check, Ban, X, Flag, Banknote } from 'lucide-react';

const ICONS = {
  approve: Check,
  deny: Ban,
  reject: Ban,
  flag: Flag,
  pay: Banknote,
  default: Check,
};

const COLORS = {
  approve: { bg: 'bg-emerald-600', icon: 'text-white' },
  deny: { bg: 'bg-red-500', icon: 'text-white' },
  reject: { bg: 'bg-red-500', icon: 'text-white' },
  flag: { bg: 'bg-amber-500', icon: 'text-white' },
  pay: { bg: 'bg-emerald-600', icon: 'text-white' },
  default: { bg: 'bg-stone-800', icon: 'text-white' },
};

/**
 * Toast notification that auto-dismisses.
 *
 * Props:
 *  - toast: { id, message, type, visible } | null
 *  - onDismiss: (id) => void
 */
export default function Toast({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!toast || !toast.visible) return;

    setExiting(false);

    const fadeTimer = setTimeout(() => {
      setExiting(true);
    }, 2500);

    const removeTimer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [toast?.id, toast?.visible]);

  if (!toast || !toast.visible) return null;

  const type = toast.type || 'default';
  const Icon = ICONS[type] || ICONS.default;
  const colors = COLORS[type] || COLORS.default;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border border-white/10 transition-all duration-500 ${
        exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      } ${colors.bg}`}
      style={{ animation: 'toastSlideUp 0.3s ease-out', minWidth: '320px', maxWidth: '500px' }}
      role="status"
      aria-live="polite"
    >
      <div className={`w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0`}>
        <Icon size={14} className={colors.icon} />
      </div>
      <span className="text-sm font-medium text-white flex-1">{toast.message}</span>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="text-white/60 hover:text-white transition-colors p-0.5 shrink-0"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-white/30 rounded-b-xl"
          style={{ animation: 'toastProgress 3s linear forwards' }}
        />
      </div>

      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
