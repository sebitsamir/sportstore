'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Order } from '@sport-store/shared';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/config';
import { Button } from '@/components/Button';

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getOrderById(id).then((r) => setOrder(r.data)).catch(() => setOrder(null));
  }, [id]);

  if (!id) {
    return <p className="text-muted">Missing order id.</p>;
  }

  if (!order) {
    return <p className="text-muted">Loading order…</p>;
  }

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-line bg-paper-elevated p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-success">Order confirmed</p>
      <h1 className="mt-2 font-display text-5xl">Thanks for your order</h1>
      <p className="mt-3 text-muted">
        Order <strong className="text-ink">{order.id}</strong>
        {typeof order.total === 'number' ? ` · ${formatMoney(order.total)}` : ''}
      </p>
      <p className="mt-2 text-sm text-muted">
        Tracking {order.trackingNumber} via {order.carrier}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/order/${order.id}`}>
          <Button variant="primary">Track order</Button>
        </Link>
        <Link href="/shop">
          <Button variant="ghost">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="container-site py-16">
      <Suspense fallback={<p className="text-center text-muted">Loading…</p>}>
        <ConfirmationInner />
      </Suspense>
    </div>
  );
}
