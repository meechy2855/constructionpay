import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable centered modal shell.
 *
 * Props:
 *  - open        : boolean
 *  - onClose     : () => void
 *  - title       : string (header text)
 *  - subtitle    : ReactNode (optional sub-line)
 *  - headerRight : ReactNode (optional right-side slot in header)
 *  - footer      : ReactNode (sticky bottom bar)
 *  - children    : scrollable body
 *  - maxWidth    : string (default "max-w-[900px]")
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  headerRight,
  footer,
  children,
  maxWidth = 'max-w-[900px]',
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Click outside to close */
  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
      style={{ animation: 'modalFadeIn 0.15s ease-out' }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={contentRef}
        className={`relative w-full ${maxWidth} mx-4 bg-white rounded-2xl shadow-2xl flex flex-col`}
        style={{
          maxHeight: 'calc(100vh - 80px)',
          animation: 'modalSlideUp 0.2s ease-out',
        }}
      >
        {/* ─── Sticky header ─── */}
        <div className="px-6 pt-5 pb-4 border-b border-stone-200 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-stone-900 tracking-tight truncate">{title}</h2>
              {subtitle && <div className="mt-1">{subtitle}</div>}
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {headerRight}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Scrollable body ─── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* ─── Sticky footer ─── */}
        {footer && (
          <div className="border-t border-stone-200 px-6 py-3 bg-white rounded-b-2xl shrink-0">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
