'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import type { Product } from '@sport-store/shared';
import { api } from '@/lib/api';
import { formatMoney, cn } from '@/lib/config';
import { useStore } from '@/store/store';

function Mega({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{title}</div>
      <div className="flex flex-col gap-1.5">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm hover:text-pitch">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlistIds, user, openDrawer, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!searchOpen || q.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await api.searchProducts(q.trim());
      setResults(res.data);
    }, 200);
    return () => clearTimeout(t);
  }, [q, searchOpen]);

  const navActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <div className="bg-pitch-deep text-center text-xs font-medium text-white sm:text-sm" style={{ minHeight: 'var(--announcement-h)' }}>
        <div className="container-site flex h-9 items-center justify-center gap-1">
          <strong>Free shipping</strong> on orders over $75 · Use code <strong>PITCH10</strong> for 10% off
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-md">
        <div className="container-site flex h-[var(--header-h)] items-center gap-4">
          <Link href="/" className="shrink-0" aria-label="Sport Store home">
            <span className="font-display text-3xl leading-none tracking-wide">
              Sport <span className="text-pitch">Store</span>
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-muted">
              Pitch & Court
            </span>
          </Link>

          <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            {[
              { href: '/', label: 'Home' },
              { href: '/football', label: 'Football', mega: 'football' as const },
              { href: '/basketball', label: 'Basketball', mega: 'basketball' as const },
              { href: '/shop', label: 'Shop' },
              { href: '/sale', label: 'Sale' },
              { href: '/new', label: 'New' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition hover:text-pitch',
                    navActive(item.href) && 'text-pitch'
                  )}
                >
                  {item.label}
                </Link>
                {item.mega === 'football' && (
                  <div className="invisible absolute left-0 top-full z-50 grid w-[420px] grid-cols-2 gap-6 rounded-lg border border-line bg-paper-elevated p-5 opacity-0 shadow-md transition group-hover:visible group-hover:opacity-100">
                    <Mega
                      title="Shop Football"
                      links={[
                        { href: '/shop?sport=football', label: 'All football' },
                        { href: '/shop?sport=football&category=footwear', label: 'Cleats & boots' },
                        { href: '/shop?sport=football&category=jerseys', label: 'Jerseys' },
                        { href: '/shop?sport=football&category=balls', label: 'Match balls' },
                      ]}
                    />
                    <Mega
                      title="Gear"
                      links={[
                        { href: '/shop?sport=football&category=equipment', label: 'Equipment' },
                        { href: '/shop?sport=football&category=apparel', label: 'Training apparel' },
                        { href: '/shop?sport=football&category=accessories', label: 'Accessories' },
                        { href: '/football', label: 'Football hub' },
                      ]}
                    />
                  </div>
                )}
                {item.mega === 'basketball' && (
                  <div className="invisible absolute left-0 top-full z-50 grid w-[420px] grid-cols-2 gap-6 rounded-lg border border-line bg-paper-elevated p-5 opacity-0 shadow-md transition group-hover:visible group-hover:opacity-100">
                    <Mega
                      title="Shop Basketball"
                      links={[
                        { href: '/shop?sport=basketball', label: 'All basketball' },
                        { href: '/shop?sport=basketball&category=footwear', label: 'Court shoes' },
                        { href: '/shop?sport=basketball&category=jerseys', label: 'Jerseys' },
                        { href: '/shop?sport=basketball&category=balls', label: 'Basketballs' },
                      ]}
                    />
                    <Mega
                      title="Gear"
                      links={[
                        { href: '/shop?sport=basketball&category=equipment', label: 'Hoops & gear' },
                        { href: '/shop?sport=basketball&category=apparel', label: 'Apparel' },
                        { href: '/shop?sport=basketball&category=accessories', label: 'Accessories' },
                        { href: '/basketball', label: 'Basketball hub' },
                      ]}
                    />
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-md hover:bg-mist"
              onClick={() => setSearchOpen(true)}
            >
              ⌕
            </button>
            <Link href="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-mist" aria-label="Wishlist">
              ♥
              {wishlistIds.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-court px-1 text-[10px] font-bold text-white">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-mist"
              onClick={openDrawer}
            >
              🛒
              {cart.count > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-pitch px-1 text-[10px] font-bold text-white">
                  {cart.count}
                </span>
              )}
            </button>
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/account/dashboard" className="text-sm font-medium hover:text-pitch">
                  {user.name}
                </Link>
                <button type="button" className="text-xs text-muted hover:text-ink" onClick={() => logout()}>
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/account/login" className="hidden text-sm font-medium hover:text-pitch sm:inline">
                Sign in
              </Link>
            )}
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-md border border-line lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-line bg-paper-elevated px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {['/', '/football', '/basketball', '/shop', '/sale', '/new', '/contact', '/account/login'].map(
                (href) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-md px-2 py-2 text-sm font-medium hover:bg-mist"
                    onClick={() => setMobileOpen(false)}
                  >
                    {href === '/' ? 'Home' : href.replace(/^\//, '').replace('account/', '')}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[80]">
          <button type="button" className="absolute inset-0 bg-ink/50" onClick={() => setSearchOpen(false)} aria-label="Close search" />
          <div className="animate-fade-up relative mx-auto mt-24 w-[min(640px,calc(100%-2rem))] rounded-lg bg-paper-elevated p-4 shadow-lg">
            <form onSubmit={onSearchSubmit}>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search gear… (Ctrl/Cmd+K)"
                className="w-full rounded-md border border-line bg-paper px-4 py-3 outline-none focus:border-pitch"
              />
            </form>
            {results.length > 0 && (
              <ul className="mt-3 max-h-80 overflow-y-auto divide-y divide-line">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.id}`}
                      className="flex items-center justify-between gap-3 px-2 py-3 hover:bg-mist"
                      onClick={() => setSearchOpen(false)}
                    >
                      <span className="truncate font-medium">{p.name}</span>
                      <span className="shrink-0 text-sm text-muted">{formatMoney(p.price)}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/shop?q=${encodeURIComponent(q)}`}
                    className="block px-2 py-3 text-sm font-semibold text-pitch"
                    onClick={() => setSearchOpen(false)}
                  >
                    View all results →
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
