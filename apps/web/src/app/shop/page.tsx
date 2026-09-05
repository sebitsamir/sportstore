import { Suspense } from 'react';
import { ShopListing } from '@/components/ShopListing';

export const metadata = { title: 'Shop' };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-site py-20 text-muted">Loading shop…</div>}>
      <ShopListing title="Shop all gear" />
    </Suspense>
  );
}
