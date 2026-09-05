'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/config';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, clearCart, addresses, addAddress, toast } = useStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || '',
    name: user?.name || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    saveAddress: false,
  });

  if (!cart.items.length) {
    return (
      <div className="container-site py-20 text-center">
        <p className="text-muted">Nothing to checkout.</p>
        <Link href="/shop" className="mt-4 inline-block text-pitch">
          Shop gear
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name || !form.line1 || !form.city || !form.state || !form.zip) {
      toast('Please fill required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      if (form.saveAddress && user) {
        addAddress({
          name: form.name,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          phone: form.phone,
        });
      }
      const res = await api.checkout({
        email: form.email,
        items: cart.items,
        subtotal: cart.subtotal,
        discount: cart.discount,
        shipping: cart.shipping,
        tax: cart.tax,
        total: cart.total,
        promo: cart.promo,
        shippingMethodId: cart.shippingMethodId,
        shippingAddress: {
          name: form.name,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          phone: form.phone,
        },
      });
      clearCart();
      router.push(`/order-confirmation?id=${res.data.id}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Checkout failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fillAddress = (id: string) => {
    const a = addresses.find((x) => x.id === id);
    if (!a) return;
    setForm((f) => ({
      ...f,
      name: a.name,
      line1: a.line1,
      line2: a.line2 || '',
      city: a.city,
      state: a.state,
      zip: a.zip,
      country: a.country,
      phone: a.phone || '',
    }));
  };

  const field = (key: keyof typeof form, label: string, opts?: { required?: boolean; type?: string }) => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        required={opts?.required}
        type={opts?.type || 'text'}
        value={String(form[key] ?? '')}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-md border border-line px-3 py-2"
      />
    </label>
  );

  return (
    <div className="container-site py-10">
      <h1 className="font-display text-5xl">Checkout</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4 rounded-lg border border-line bg-paper-elevated p-5">
          {addresses.length > 0 && (
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Saved address</span>
              <select
                className="w-full rounded-md border border-line px-3 py-2"
                defaultValue=""
                onChange={(e) => fillAddress(e.target.value)}
              >
                <option value="">Select…</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label || a.line1} — {a.city}
                  </option>
                ))}
              </select>
            </label>
          )}
          {field('email', 'Email', { required: true, type: 'email' })}
          {field('name', 'Full name', { required: true })}
          {field('line1', 'Address', { required: true })}
          {field('line2', 'Apt / suite')}
          <div className="grid gap-3 sm:grid-cols-3">
            {field('city', 'City', { required: true })}
            {field('state', 'State', { required: true })}
            {field('zip', 'ZIP', { required: true })}
          </div>
          {field('phone', 'Phone', { type: 'tel' })}
          {user && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.saveAddress}
                onChange={(e) => setForm({ ...form, saveAddress: e.target.checked })}
              />
              Save this address
            </label>
          )}
          <Button type="submit" variant="accent" disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Placing order…' : `Pay ${formatMoney(cart.total)}`}
          </Button>
        </div>
        <aside className="h-fit rounded-lg border border-line bg-paper-elevated p-5 text-sm">
          <h2 className="font-display text-2xl">Order</h2>
          <ul className="mt-4 space-y-2">
            {cart.items.map((i) => (
              <li key={`${i.id}-${JSON.stringify(i.variant)}`} className="flex justify-between gap-2">
                <span className="truncate">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatMoney(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-line pt-3">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(cart.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{formatMoney(cart.shipping)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{formatMoney(cart.tax)}</dd></div>
            <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatMoney(cart.total)}</dd></div>
          </dl>
        </aside>
      </form>
    </div>
  );
}
