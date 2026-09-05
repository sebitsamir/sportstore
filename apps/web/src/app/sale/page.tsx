import { Suspense } from 'react';
import { ShopListing } from '@/components/ShopListing';

export const metadata = { title: 'Sale' };

export default function SalePage() {
  return (
    <Suspense fallback={<div className="container-site py-20 text-muted">Loading…</div>}>
      <ShopListing title="Sale" forced={{ onSale: true }} />
    </Suspense>
  );
}
