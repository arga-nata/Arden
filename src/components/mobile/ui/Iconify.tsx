'use client';
import { Icon } from '@iconify/react';

interface IconifyProps {
  icon: string;
  className?: string;
  size?: number;
  onClick?: () => void;
}

function Iconify({ icon, className, size = 24, onClick }: IconifyProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      className={`items-center justify-center shrink-0 ${className}`}
      onClick={onClick}
    >
      <Icon icon={icon} width={size} height={size} />
    </span>
  );
}

export default Iconify;
