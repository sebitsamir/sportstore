'use client';

import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MiniCart } from './MiniCart';
import { ToastStack } from './ToastStack';

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MiniCart />
      <ToastStack />
    </div>
  );
}
