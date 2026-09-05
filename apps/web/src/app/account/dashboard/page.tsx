'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@sport-store/shared';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/config';
import { getProductById } from '@/data/catalog';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';

export default function DashboardPage() {
  const router = useRouter();
  const {
    ready,
    user,
    updateProfile,
    addresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
    wishlistIds,
    logout,
  } = useStore();
  const [tab, setTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [addrForm, setAddrForm] = useState({
    name: '',
    line1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/account/login');
      return;
    }
    setProfile({ name: user.name, email: user.email, phone: user.phone || '' });
    api.getOrders().then((r) => setOrders(r.data));
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="container-site py-20 text-muted">Loading account…</div>;
  }

  const onProfile = async (e: FormEvent) => {
    e.preventDefault();
    await updateProfile(profile);
  };

  const onAddress = (e: FormEvent) => {
    e.preventDefault();
    addAddress(addrForm);
    setAddrForm({ name: '', line1: '', city: '', state: '', zip: '', country: 'US' });
  };

  const wishProducts = wishlistIds
    .map((id) => getProductById(id))
    .filter(Boolean);

  return (
    <div className="container-site py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">Account</h1>
          <p className="text-muted">Welcome, {user.name}</p>
        </div>
        <Button variant="ghost" onClick={() => logout().then(() => router.push('/'))}>
          Sign out
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(['profile', 'orders', 'addresses', 'wishlist'] as const).map((t) => (
          <Button key={t} variant={tab === t ? 'primary' : 'ghost'} onClick={() => setTab(t)} className="capitalize">
            {t}
          </Button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={onProfile} className="max-w-lg space-y-3 rounded-lg border border-line bg-paper-elevated p-5">
          {(['name', 'email', 'phone'] as const).map((key) => (
            <label key={key} className="block text-sm capitalize">
              {key}
              <input
                className="mt-1 w-full rounded-md border border-line px-3 py-2"
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                type={key === 'email' ? 'email' : 'text'}
                required={key !== 'phone'}
              />
            </label>
          ))}
          <Button type="submit" variant="primary">
            Save profile
          </Button>
        </form>
      )}

      {tab === 'orders' && (
        <div className="space-y-3">
          {!orders.length && <p className="text-muted">No orders yet.</p>}
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/order/${o.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-paper-elevated p-4 hover:border-pitch"
            >
              <div>
                <p className="font-semibold">{o.id}</p>
                <p className="text-sm text-muted capitalize">{o.status.replace(/_/g, ' ')}</p>
              </div>
              <p className="font-semibold">
                {typeof o.total === 'number' ? formatMoney(o.total) : '—'}
              </p>
            </Link>
          ))}
        </div>
      )}

      {tab === 'addresses' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ul className="space-y-3">
            {addresses.map((a) => (
              <li key={a.id} className="rounded-lg border border-line bg-paper-elevated p-4 text-sm">
                <p className="font-semibold">
                  {a.name} {a.isDefault ? <span className="text-pitch">(default)</span> : null}
                </p>
                <p>
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ''}
                </p>
                <p>
                  {a.city}, {a.state} {a.zip}
                </p>
                <div className="mt-2 flex gap-3">
                  {!a.isDefault && (
                    <button type="button" className="text-pitch" onClick={() => setDefaultAddress(a.id)}>
                      Set default
                    </button>
                  )}
                  <button type="button" className="text-danger" onClick={() => removeAddress(a.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={onAddress} className="space-y-3 rounded-lg border border-line bg-paper-elevated p-5">
            <h2 className="font-display text-2xl">Add address</h2>
            {(['name', 'line1', 'city', 'state', 'zip'] as const).map((key) => (
              <input
                key={key}
                required
                placeholder={key}
                className="w-full rounded-md border border-line px-3 py-2 text-sm capitalize"
                value={addrForm[key]}
                onChange={(e) => setAddrForm({ ...addrForm, [key]: e.target.value })}
              />
            ))}
            <Button type="submit" variant="accent">
              Save address
            </Button>
          </form>
        </div>
      )}

      {tab === 'wishlist' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {wishProducts.map((p) => p && <ProductCard key={p.id} product={p} />)}
          {!wishProducts.length && <p className="text-muted">Wishlist is empty.</p>}
        </div>
      )}
    </div>
  );
}
