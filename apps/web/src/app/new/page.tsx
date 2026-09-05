import { Suspense } from 'react';
import { ShopListing } from '@/components/ShopListing';

export const metadata = { title: 'New arrivals' };

export default function NewPage() {
  return (
    <Suspense fallback={<div className="container-site py-20 text-muted">Loading…</div>}>
      <ShopListing title="New arrivals" forced={{ badge: 'new' }} />
    </Suspense>
  );
}
