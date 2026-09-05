'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@sport-store/shared';
import { CATEGORIES } from '@sport-store/shared';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';

type Props = {
  title: string;
  forced?: { onSale?: boolean; badge?: string };
};

export function ShopListing({ title, forced }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [brands, setBrands] = useState<string[]>([]);

  const filters = useMemo(() => {
    const sport = searchParams.get('sport') || undefined;
    const category = searchParams.getAll('category');
    const brand = searchParams.getAll('brand');
    const size = searchParams.getAll('size');
    const q = searchParams.get('q') || undefined;
    const sort = searchParams.get('sort') || 'featured';
    const page = searchParams.get('page') || '1';
    const inStock = searchParams.get('inStock') === 'true';
    return {
      sport,
      category: category.length ? category : undefined,
      brand: brand.length ? brand : undefined,
      size: size.length ? size : undefined,
      q,
      sort,
      page,
      inStock: inStock || undefined,
      onSale: forced?.onSale || searchParams.get('onSale') === 'true' || undefined,
      badge: forced?.badge,
      limit: 12,
    };
  }, [searchParams, forced]);

  useEffect(() => {
    api.getProducts(filters).then((r) => {
      setProducts(r.data);
      if (r.meta) setMeta(r.meta);
    });
    api.getBrands(filters.sport).then((r) => setBrands(r.data));
  }, [filters]);

  const setParam = (key: string, value: string | null, multi = false) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (multi) {
      const existing = sp.getAll(key);
      if (value == null) sp.delete(key);
      else if (existing.includes(value)) {
        const next = existing.filter((v) => v !== value);
        sp.delete(key);
        next.forEach((v) => sp.append(key, v));
      } else sp.append(key, value);
    } else if (!value) sp.delete(key);
    else sp.set(key, value);
    sp.delete('page');
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="container-site py-10">
      <div className="mb-8">
        <h1 className="font-display text-5xl">{title}</h1>
        <p className="mt-1 text-muted">{meta.total} products</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 rounded-lg border border-line bg-paper-elevated p-4 h-fit">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Sport</h3>
            {['football', 'basketball'].map((s) => (
              <label key={s} className="mb-1 flex items-center gap-2 text-sm capitalize">
                <input
                  type="radio"
                  name="sport"
                  checked={(filters.sport || '') === s}
                  onChange={() => setParam('sport', s)}
                />
                {s}
              </label>
            ))}
            <button type="button" className="mt-1 text-xs text-pitch" onClick={() => setParam('sport', null)}>
              Clear
            </button>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Category</h3>
            {CATEGORIES.map((c) => (
              <label key={c.id} className="mb-1 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(filters.category || []).includes(c.id)}
                  onChange={() => setParam('category', c.id, true)}
                />
                {c.name}
              </label>
            ))}
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Brand</h3>
            <div className="max-h-40 overflow-y-auto">
              {brands.map((b) => (
                <label key={b} className="mb-1 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(filters.brand || []).includes(b)}
                    onChange={() => setParam('brand', b, true)}
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(filters.inStock)}
              onChange={(e) => setParam('inStock', e.target.checked ? 'true' : null)}
            />
            In stock only
          </label>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <input
              defaultValue={filters.q || ''}
              placeholder="Search…"
              className="rounded-md border border-line bg-paper-elevated px-3 py-2 text-sm outline-none focus:border-pitch"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setParam('q', (e.target as HTMLInputElement).value || null);
                }
              }}
            />
            <select
              value={filters.sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="rounded-md border border-line bg-paper-elevated px-3 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
              <option value="newest">Newest</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {!products.length && (
            <p className="py-16 text-center text-muted">No products match these filters.</p>
          )}
          {meta.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === meta.page ? 'primary' : 'ghost'}
                  className="min-w-10"
                  onClick={() => {
                    const sp = new URLSearchParams(searchParams.toString());
                    sp.set('page', String(p));
                    router.push(`${pathname}?${sp.toString()}`);
                  }}
                >
                  {p}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
