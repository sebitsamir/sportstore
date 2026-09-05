'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Order } from '@sport-store/shared';
import { api } from '@/lib/api';
import { formatMoney, cn } from '@/lib/config';

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;
    api
      .getOrderById(params.id)
      .then((r) => setOrder(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'));
  }, [params.id]);

  if (error) {
    return (
      <div className="container-site py-20 text-center">
        <p className="text-danger">{error}</p>
        <Link href="/account/dashboard" className="mt-4 inline-block text-pitch">
          Account
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="container-site py-20 text-muted">Loading…</div>;
  }

  return (
    <div className="container-site max-w-2xl py-10">
      <h1 className="font-display text-5xl">Order {order.id}</h1>
      <p className="mt-2 text-muted capitalize">Status: {order.status.replace(/_/g, ' ')}</p>
      <p className="text-sm text-muted">
        {order.carrier} · {order.trackingNumber}
        {typeof order.total === 'number' ? ` · ${formatMoney(order.total)}` : ''}
      </p>

      <ol className="relative mt-10 space-y-6 border-l-2 border-line pl-6">
        {(order.tracking || []).map((step) => (
          <li key={step.key} className="relative">
            <span
              className={cn(
                'absolute -left-[1.9rem] top-1 h-3.5 w-3.5 rounded-full border-2',
                step.done ? 'border-pitch bg-pitch' : 'border-line bg-paper'
              )}
            />
            <p className={cn('font-semibold', step.done ? 'text-ink' : 'text-muted')}>{step.label}</p>
            <p className="text-xs text-muted">{new Date(step.at).toLocaleString()}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
