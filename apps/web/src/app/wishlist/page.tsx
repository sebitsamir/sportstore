'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@sport-store/shared';
import { getProductById } from '@/data/catalog';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';
import { useStore } from '@/store/store';

export default function WishlistPage() {
  const { wishlistIds } = useStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(
      wishlistIds.map((id) => getProductById(id)).filter(Boolean) as Product[]
    );
  }, [wishlistIds]);

  return (
    <div className="container-site py-10">
      <h1 className="font-display text-5xl">Wishlist</h1>
      <p className="mt-1 text-muted">{products.length} saved items</p>
      {!products.length ? (
        <div className="mt-10 rounded-lg border border-line bg-paper-elevated p-10 text-center">
          <p className="text-muted">No saved gear yet.</p>
          <Link href="/shop" className="mt-4 inline-block">
            <Button variant="accent">Browse shop</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
