'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { formatMoney } from '@/lib/config';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function CartPage() {
  const {
    cart,
    updateCart,
    removeFromCart,
    applyPromo,
    removePromo,
    setShippingMethod,
  } = useStore();
  const [code, setCode] = useState('');

  const onPromo = (e: FormEvent) => {
    e.preventDefault();
    applyPromo(code);
  };

  return (
    <div className="container-site py-10">
      <h1 className="font-display text-5xl">Cart</h1>
      {!cart.items.length ? (
        <div className="mt-10 rounded-lg border border-line bg-paper-elevated p-10 text-center">
          <p className="text-muted">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block">
            <Button variant="accent">Shop gear</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li
                key={`${item.id}-${JSON.stringify(item.variant)}`}
                className="flex gap-4 rounded-lg border border-line bg-paper-elevated p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-mist">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.id}`} className="font-medium hover:text-pitch">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {[item.variant.size, item.variant.color].filter(Boolean).join(' · ')}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-line"
                        onClick={() => updateCart(item.id, item.quantity - 1, item.variant)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-line"
                        onClick={() => updateCart(item.id, item.quantity + 1, item.variant)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold">{formatMoney(item.price * item.quantity)}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 text-xs text-danger"
                    onClick={() => removeFromCart(item.id, item.variant)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit space-y-4 rounded-lg border border-line bg-paper-elevated p-5">
            <h2 className="font-display text-2xl">Summary</h2>
            <form onSubmit={onPromo} className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Promo code"
                className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-sm"
              />
              <Button type="submit" variant="ghost">
                Apply
              </Button>
            </form>
            {cart.promo && (
              <p className="text-sm">
                {cart.promo.label}{' '}
                <button type="button" className="text-danger" onClick={removePromo}>
                  Remove
                </button>
              </p>
            )}
            <div>
              <p className="mb-2 text-sm font-semibold">Shipping</p>
              {cart.shippingMethods.map((m) => (
                <label key={m.id} className="mb-2 flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ship"
                      checked={cart.shippingMethodId === m.id}
                      onChange={() => setShippingMethod(m.id)}
                    />
                    {m.name} <span className="text-muted">({m.eta})</span>
                  </span>
                  <span>{m.price === 0 ? 'Free' : formatMoney(m.price)}</span>
                </label>
              ))}
            </div>
            <dl className="space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(cart.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Discount</dt><dd>-{formatMoney(cart.discount)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{formatMoney(cart.shipping)}</dd></div>
              <div className="flex justify-between"><dt>Tax</dt><dd>{formatMoney(cart.tax)}</dd></div>
              <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{formatMoney(cart.total)}</dd></div>
            </dl>
            <Link href="/checkout" className="block">
              <Button variant="accent" className="w-full">
                Checkout
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
