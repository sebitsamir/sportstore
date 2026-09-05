'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/store/store';
import { formatMoney } from '@/lib/config';
import { Button } from './Button';

export function MiniCart() {
  const { cart, drawerOpen, closeDrawer, removeFromCart, updateCart } = useStore();
  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close cart"
        onClick={closeDrawer}
      />
      <aside className="animate-drawer absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper-elevated shadow-lg">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-2xl">Your bag ({cart.count})</h2>
          <button type="button" onClick={closeDrawer} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!cart.items.length && (
            <p className="text-muted">Your cart is empty. Gear up from the shop.</p>
          )}
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li key={`${item.id}-${JSON.stringify(item.variant)}`} className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-mist">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-xs text-muted">
                    {[item.variant.size, item.variant.color].filter(Boolean).join(' · ')}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-7 w-7 rounded border border-line"
                        onClick={() => updateCart(item.id, item.quantity - 1, item.variant)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-7 w-7 rounded border border-line"
                        onClick={() => updateCart(item.id, item.quantity + 1, item.variant)}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold">{formatMoney(item.price * item.quantity)}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 text-xs text-danger"
                    onClick={() => removeFromCart(item.id, item.variant)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 border-t border-line px-5 py-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{formatMoney(cart.subtotal)}</span>
          </div>
          <Link href="/cart" onClick={closeDrawer} className="block">
            <Button variant="ghost" className="w-full">
              View cart
            </Button>
          </Link>
          <Link href="/checkout" onClick={closeDrawer} className="block">
            <Button variant="accent" className="w-full" disabled={!cart.items.length}>
              Checkout
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}
