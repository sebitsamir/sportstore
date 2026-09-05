'use client';

import { useStore } from '@/store/store';
import { cn } from '@/lib/config';

export function ToastStack() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'animate-toast pointer-events-auto flex items-start justify-between gap-3 rounded-md px-4 py-3 text-sm text-white shadow-md',
            t.kind === 'success' && 'bg-success',
            t.kind === 'error' && 'bg-danger',
            t.kind === 'info' && 'bg-ink-soft'
          )}
        >
          <span>{t.message}</span>
          <button type="button" onClick={() => dismissToast(t.id)} className="opacity-80">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
