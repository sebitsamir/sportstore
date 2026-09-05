'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/store/store';
import { Button } from './Button';

export function Footer() {
  const { toast } = useStore();
  const [email, setEmail] = useState('');

  const onNewsletter = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.newsletter(email);
      toast(res.data.message, 'success');
      setEmail('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  return (
    <footer className="mt-16 border-t border-line bg-ink text-paper">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-3xl">
            Sport <span className="text-signal">Store</span>
          </p>
          <p className="mt-3 text-sm text-mist/80">
            Football and basketball gear organized for athletes who train hard and play harder.
          </p>
        </div>
        <div>
          <h3 className="font-display text-xl text-signal">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-mist/90">
            <li><Link href="/football" className="hover:text-white">Football</Link></li>
            <li><Link href="/basketball" className="hover:text-white">Basketball</Link></li>
            <li><Link href="/sale" className="hover:text-white">Sale</Link></li>
            <li><Link href="/new" className="hover:text-white">New arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xl text-signal">Help</h3>
          <ul className="mt-3 space-y-2 text-sm text-mist/90">
            <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
            <li><Link href="/size-guide" className="hover:text-white">Size guide</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xl text-signal">Newsletter</h3>
          <p className="mt-3 text-sm text-mist/80">Drops, restocks, and pitch-side tips.</p>
          <form onSubmit={onNewsletter} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-md border border-white/20 bg-ink-soft px-3 py-2 text-sm text-white outline-none focus:border-signal"
            />
            <Button type="submit" variant="accent" className="shrink-0">
              Join
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-mist/60">
        © {new Date().getFullYear()} Sport Store. Built for the next play.
      </div>
    </footer>
  );
}
