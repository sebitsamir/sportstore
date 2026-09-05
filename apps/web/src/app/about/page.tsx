import Link from 'next/link';
import { Button } from '@/components/Button';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="container-site max-w-3xl py-14">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-court">Our story</span>
      <h1 className="mt-2 font-display text-5xl md:text-6xl">Built for pitch and court</h1>
      <p className="mt-6 text-lg text-muted">
        Sport Store started as a simple idea: football and basketball gear should be as organized as a
        pro locker room. Every SKU is tagged by sport and category so you can find cleats, court shoes,
        kits, and balls without the noise.
      </p>
      <p className="mt-4 text-muted">
        We are migrating to a scalable Next.js frontend and Express + PostgreSQL backend — so the same
        catalog you browse today can grow into real inventory, accounts, and fulfillment tomorrow.
      </p>
      <Link href="/shop" className="mt-8 inline-block">
        <Button variant="accent">Shop the catalog</Button>
      </Link>
    </div>
  );
}
