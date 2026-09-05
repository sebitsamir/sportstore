'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@sport-store/shared';
import { formatMoney, cn } from '@/lib/config';
import { useStore } from '@/store/store';
import { Button } from './Button';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-paper-elevated shadow-sm transition hover:shadow-md">
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-mist">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {product.badge && (
          <span
            className={cn(
              'absolute left-3 top-3 rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white',
              product.badge === 'sale' && 'bg-court',
              product.badge === 'new' && 'bg-pitch',
              product.badge === 'hot' && 'bg-danger',
              !['sale', 'new', 'hot'].includes(product.badge) && 'bg-ink'
            )}
          >
            {product.badge}
          </span>
        )}
      </Link>
      <button
        type="button"
        aria-label="Toggle wishlist"
        onClick={() => toggleWishlist(product.id)}
        className={cn(
          'absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-sm shadow-sm transition hover:scale-105',
          wished ? 'text-court' : 'text-muted'
        )}
      >
        ♥
      </button>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wider text-muted">
          {product.brand} · {product.sport}
        </p>
        <Link href={`/product/${product.id}`} className="font-display text-xl leading-tight hover:text-pitch">
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="font-semibold text-ink">{formatMoney(product.price)}</p>
            {product.originalPrice && (
              <p className="text-sm text-muted line-through">
                {formatMoney(product.originalPrice)}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="primary"
            className="px-3 py-2 text-xs"
            onClick={() =>
              addToCart(product, 1, {
                size: product.sizes[0],
                color: product.colors[0],
              })
            }
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
