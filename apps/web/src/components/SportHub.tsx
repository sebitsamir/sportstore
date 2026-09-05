'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Product } from '@sport-store/shared';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';

export function SportHub({
  sport,
  title,
  tagline,
  heroImage,
}: {
  sport: 'football' | 'basketball';
  title: string;
  tagline: string;
  heroImage: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts({ sport, limit: 8, sort: 'featured' }).then((r) => setProducts(r.data));
  }, [sport]);

  const cats =
    sport === 'football'
      ? [
          { id: 'footwear', label: 'Cleats & boots' },
          { id: 'jerseys', label: 'Jerseys' },
          { id: 'balls', label: 'Match balls' },
          { id: 'equipment', label: 'Equipment' },
        ]
      : [
          { id: 'footwear', label: 'Court shoes' },
          { id: 'jerseys', label: 'Jerseys' },
          { id: 'balls', label: 'Basketballs' },
          { id: 'equipment', label: 'Hoops & gear' },
        ];

  return (
    <>
      <section className="relative isolate min-h-[420px] overflow-hidden">
        <Image src={heroImage} alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="container-site relative flex min-h-[420px] flex-col justify-end pb-12 pt-24 text-white">
          <p className="font-display text-5xl text-signal sm:text-6xl">Sport Store</p>
          <h1 className="font-display text-[clamp(3rem,8vw,5rem)]">{title}</h1>
          <p className="mt-2 max-w-lg text-white/85">{tagline}</p>
          <Link href={`/shop?sport=${sport}`} className="mt-6 inline-block">
            <Button variant="accent">Shop {title.toLowerCase()}</Button>
          </Link>
        </div>
      </section>

      <section className="container-site py-12">
        <h2 className="mb-6 font-display text-4xl">Shop categories</h2>
        <div className="flex flex-wrap gap-3">
          {cats.map((c) => (
            <Link key={c.id} href={`/shop?sport=${sport}&category=${c.id}`}>
              <Button variant="ghost">{c.label}</Button>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-site pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl">Featured {title.toLowerCase()}</h2>
          <Link href={`/shop?sport=${sport}`} className="text-sm font-semibold text-pitch">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
