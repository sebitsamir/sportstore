'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Product } from '@sport-store/shared';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';

const MARQUEE = [
  'Cleats', 'Court shoes', 'Match balls', 'Jerseys',
  'Hoops', 'Training', 'Goalkeeper', 'Swingman',
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [catalogSize, setCatalogSize] = useState(40);

  useEffect(() => {
    api.getProducts({ featured: true, limit: 8 }).then((r) => setFeatured(r.data));
    setCatalogSize(api.getCatalogSize());
  }, []);

  return (
    <>
      <section className="relative isolate min-h-[min(88vh,820px)] overflow-hidden">
        <Image
          src="/images/Celebrate_25_Years_Of_Mercurial_With_The_Limited_Edition_Nike_Air_Zoom_Mercurial_XXV_6d1848bf-4993-408a-b218-806bfa7e9e53.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
        <div className="container-site relative flex min-h-[min(88vh,820px)] flex-col justify-center py-20 text-white">
          <p className="animate-fade-up font-display text-5xl tracking-wide text-signal sm:text-6xl md:text-7xl">
            Sport Store
          </p>
          <h1 className="animate-fade-up mt-2 max-w-2xl font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95]">
            Gear that earns its minutes
          </h1>
          <p className="animate-fade-up mt-4 max-w-xl text-base text-white/85 sm:text-lg" style={{ animationDelay: '80ms' }}>
            Football boots, court shoes, match balls, and team kits — organized for athletes who train hard and play harder.
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '140ms' }}>
            <Link href="/shop"><Button variant="accent">Shop all gear</Button></Link>
            <Link href="/football"><Button variant="light">Explore football</Button></Link>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-line bg-pitch text-white" aria-hidden>
        <div className="marquee-track flex w-max gap-10 py-3 font-display text-2xl tracking-wide uppercase">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={`${t}-${i}`} className="px-2">{t}</span>
          ))}
        </div>
      </div>

      <section className="grid md:grid-cols-2">
        <Link href="/football" className="group relative min-h-[500px] overflow-hidden">
          <Image
            src="/images/a.webp"
            alt="Football boots"
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h2 className="font-display text-5xl">Football</h2>
            <p className="text-white/80">Built for the pitch</p>
            <span className="mt-3 text-signal">Enter hub →</span>
          </div>
        </Link>
        <Link href="/basketball" className="group relative min-h-[500px] overflow-hidden">
          <Image
            src="/images/b.webp"
            alt="Basketball shoes"
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h2 className="font-display text-5xl">Basketball</h2>
            <p className="text-white/80">Court-ready gear</p>
            <span className="mt-3 text-signal">Enter hub →</span>
          </div>
        </Link>
      </section>

      <section className="section py-16">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-court">Featured</span>
              <h2 className="font-display text-4xl md:text-5xl">Game-day picks</h2>
              <p className="mt-1 max-w-lg text-muted">Hand-selected football and basketball essentials with real match pedigree.</p>
            </div>
            <Link href="/shop"><Button variant="ghost">View shop</Button></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-site">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-court">Categories</span>
          <h2 className="mb-6 font-display text-4xl">Shop by kit</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { cat: 'footwear', img: '/images/bota-puma-future-7-match-mg-naranja-0.webp', label: 'Footwear' },
              { cat: 'jerseys', img: '/images/maillot-nba-swingman-kyrie-irving-brooklyn-nets-classic-edition-2020-dftdxk.jpg', label: 'Jerseys' },
              { cat: 'balls', img: '/images/g-60244-wilsonjr-nba-official-composite-basketball-sz6_2.webp', label: 'Balls' },
              { cat: 'equipment', img: '/images/adidas-predator-20-pro-fingersave-goalkeeper-gloves.webp', label: 'Equipment' },
            ].map((c) => (
              <Link key={c.cat} href={`/shop?category=${c.cat}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={c.img} alt={c.label} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="25vw" />
                <div className="absolute inset-0 bg-ink/35" />
                <span className="absolute bottom-4 left-4 font-display text-3xl text-white">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site">
          <div className="grid items-center gap-8 rounded-lg bg-pitch px-8 py-10 text-white md:grid-cols-[1.4fr_0.6fr]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-signal">Why Sport Store</span>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">Organized like a pro locker room</h2>
              <p className="mt-3 max-w-xl text-white/80">
                Every product tagged by sport and category — football or basketball — so you find cleats, court shoes, and kits without the noise.
              </p>
              <Link href="/about" className="mt-6 inline-block">
                <Button variant="accent">Our story</Button>
              </Link>
            </div>
            <div className="text-center">
              <p className="font-display text-6xl text-signal">{catalogSize}+</p>
              <p className="text-sm text-white/70">SKUs ready for your API</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
