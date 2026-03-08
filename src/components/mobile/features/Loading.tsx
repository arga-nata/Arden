import { Icon } from '@iconify/react';

// PERBAIKAN: Ubah 'loading' menjadi 'Loading' (Huruf Depan Kapital)
export function Loading({ className = '' }: { className?: string }) {
  return (
    <div className={`flex w-full p-4 items-center justify-center gap-3 text-white/50 ${className}`}>
      <Icon icon="line-md:loading-twotone-loop" width="24" />
      <span className="text-sm font-mono">Loading data...</span>
    </div>
  );
}