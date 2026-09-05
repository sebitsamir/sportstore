'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Product, Review } from '@sport-store/shared';
import { api } from '@/lib/api';
import { formatMoney, cn } from '@/lib/config';
import { addReview, getReviews, getSizeGuide } from '@/data/reviews';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';
import { getRecentIds, trackRecent, useStore } from '@/store/store';
import { getProductById } from '@/data/catalog';

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, title: '', body: '' });

  useEffect(() => {
    if (!params.id) return;
    api
      .getProductById(params.id)
      .then((r) => {
        setProduct(r.data);
        setSize(r.data.sizes[0] || '');
        setColor(r.data.colors[0] || '');
        setActiveImg(0);
        trackRecent(r.data.id);
        setReviews(getReviews(r.data.id));
      })
      .catch(() => setProduct(null));
    api.getRelatedProducts(params.id).then((r) => setRelated(r.data));
  }, [params.id]);

  useEffect(() => {
    const ids = getRecentIds().filter((id) => id !== params.id).slice(0, 4);
    setRecent(ids.map((id) => getProductById(id)).filter(Boolean) as Product[]);
  }, [params.id, product]);

  if (!product) {
    return (
      <div className="container-site py-20 text-center">
        <p className="text-muted">Product not found.</p>
        <Link href="/shop" className="mt-4 inline-block text-pitch">
          Back to shop
        </Link>
      </div>
    );
  }

  const guide = getSizeGuide(product.category);

  const submitReview = (e: FormEvent) => {
    e.preventDefault();
    addReview(product.id, reviewForm);
    setReviews(getReviews(product.id));
    setReviewForm({ name: '', rating: 5, title: '', body: '' });
  };

  return (
    <div className="container-site py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-mist">
            <Image
              src={product.images[activeImg] || product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'relative h-16 w-16 overflow-hidden rounded-md border-2',
                    i === activeImg ? 'border-pitch' : 'border-transparent'
                  )}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {product.brand} · {product.sport} · {product.category}
          </p>
          <h1 className="mt-1 font-display text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm text-muted">
            ★ {product.rating.toFixed(1)} · {product.reviews} reviews
          </p>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatMoney(product.price)}</span>
            {product.originalPrice && (
              <span className="text-muted line-through">{formatMoney(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-4 text-muted">{product.description}</p>
          <ul className="mt-4 list-inside list-disc text-sm text-ink-soft">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm',
                      color === c ? 'border-pitch bg-pitch/10' : 'border-line'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Size</p>
                <button type="button" className="text-xs text-pitch" onClick={() => setShowGuide(true)}>
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      'min-w-10 rounded-md border px-3 py-1.5 text-sm',
                      size === s ? 'border-pitch bg-pitch/10' : 'border-line'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-line">
              <button type="button" className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>
            <Button
              variant="accent"
              onClick={() => addToCart(product, qty, { size, color })}
              disabled={product.stock < 1}
            >
              {product.stock < 1 ? 'Out of stock' : 'Add to cart'}
            </Button>
            <Button variant="ghost" onClick={() => toggleWishlist(product.id)}>
              {isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted">{product.stock} in stock</p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-4xl">Reviews</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-line bg-paper-elevated p-4">
                <p className="font-semibold">
                  {r.title} <span className="text-court">{'★'.repeat(r.rating)}</span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  {r.name} · {r.date}
                  {r.verified ? ' · Verified' : ''}
                </p>
                <p className="mt-2 text-sm">{r.body}</p>
              </li>
            ))}
            {!reviews.length && <p className="text-muted">No reviews yet — be the first.</p>}
          </ul>
          <form onSubmit={submitReview} className="space-y-3 rounded-lg border border-line bg-paper-elevated p-4">
            <h3 className="font-display text-2xl">Write a review</h3>
            <input
              required
              placeholder="Your name"
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
              value={reviewForm.name}
              onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            />
            <select
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
            <input
              required
              placeholder="Title"
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
              value={reviewForm.title}
              onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
            />
            <textarea
              required
              placeholder="Your review"
              rows={4}
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
              value={reviewForm.body}
              onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
            />
            <Button type="submit" variant="primary">
              Submit review
            </Button>
          </form>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-4xl">Related gear</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-4xl">Recently viewed</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/50" onClick={() => setShowGuide(false)} aria-label="Close" />
          <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-paper-elevated p-6 shadow-lg">
            <h3 className="font-display text-3xl">{guide.title}</h3>
            <p className="mt-2 text-sm text-muted">{guide.note}</p>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  {guide.headers.map((h) => (
                    <th key={h} className="py-2 pr-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((row, i) => (
                  <tr key={i} className="border-b border-line/60">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 pr-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <Button className="mt-4" variant="ghost" onClick={() => setShowGuide(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
