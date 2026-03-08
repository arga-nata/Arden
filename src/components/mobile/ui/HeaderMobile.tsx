'use client';

import { ReactNode } from 'react';
import { Logo } from '@/components/logo'; // Import komponen Logo

interface HeaderMobileProps {
  children?: ReactNode;
  className?: string;
}

export const HeaderMobile = ({ children, className = '' }: HeaderMobileProps) => {
  return (
    <div className={`flex w-full items-center justify-between py-2 ${className}`}>
      {/* Ganti bagian Image/Text lama dengan komponen Logo */}
      <div className="flex items-center gap-2">
        <div className="scale-75 origin-left"> 
          {/* Scale 75% biar ga kegedean di HP */}
          <Logo /> 
        </div>
      </div>

      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};