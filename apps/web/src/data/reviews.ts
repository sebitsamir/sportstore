import type { Review } from '@sport-store/shared';
import { appConfig } from '@/lib/config';

const SEED: Record<string, Review[]> = {
  'fb-boot-predator': [
    { id: 'r1', name: 'Marcus T.', rating: 5, title: 'Best boots I have owned', body: 'Lockdown on firm ground and the tongue stays put. Worth every dollar.', date: '2026-05-12', verified: true },
    { id: 'r2', name: 'Elena R.', rating: 4, title: 'Great control', body: 'Took a game to break in. Striking surface is excellent.', date: '2026-04-02', verified: true },
  ],
  'bb-shoe-kyrie': [
    { id: 'r3', name: 'Jay P.', rating: 5, title: 'Cuts like butter', body: 'Lateral support is unreal for pick-up and league nights.', date: '2026-06-01', verified: true },
  ],
  'bb-jersey-embiid': [
    { id: 'r4', name: 'Chris W.', rating: 5, title: 'Authentic look', body: 'Fit true to size. Mesh breathes well for summer leagues.', date: '2026-03-18', verified: false },
  ],
  'fb-ball-uwcl': [
    { id: 'r5', name: 'Sofia M.', rating: 5, title: 'Flight is true', body: 'Same ball we use in academy matches. Soft touch out of the box.', date: '2026-02-09', verified: true },
  ],
  'bb-ball-wilson-jr': [
    { id: 'r6', name: 'Andre K.', rating: 4, title: 'Solid outdoor/indoor', body: 'Grips well on asphalt. Slightly heavy after rain.', date: '2026-01-22', verified: true },
  ],
};

function loadAll(): Record<string, Review[]> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(appConfig.REVIEWS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, Review[]>) {
  localStorage.setItem(appConfig.REVIEWS_KEY, JSON.stringify(data));
}

export function getReviews(productId: string): Review[] {
  const user = loadAll()[productId] || [];
  const seed = SEED[productId] || [];
  return [...user, ...seed].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function addReview(
  productId: string,
  review: { name: string; rating: number; title: string; body: string }
) {
  const all = loadAll();
  const entry: Review = {
    id: 'u' + Date.now(),
    name: review.name,
    rating: Number(review.rating),
    title: review.title,
    body: review.body,
    date: new Date().toISOString().slice(0, 10),
    verified: false,
  };
  all[productId] = [entry, ...(all[productId] || [])];
  saveAll(all);
  return entry;
}

export function averageRating(productId: string, fallback: number) {
  const list = getReviews(productId);
  if (!list.length) return fallback;
  return list.reduce((s, r) => s + r.rating, 0) / list.length;
}

export const SIZE_GUIDES: Record<
  string,
  { title: string; note: string; headers: string[]; rows: string[][] }
> = {
  footwear: {
    title: 'Footwear size guide',
    note: 'Measure heel-to-toe in cm. If between sizes, size up for football boots; true-to-size for basketball.',
    headers: ['US', 'UK', 'EU', 'CM'],
    rows: [
      ['7', '6', '40', '25'],
      ['8', '7', '41', '26'],
      ['9', '8', '42.5', '27'],
      ['10', '9', '44', '28'],
      ['11', '10', '45', '29'],
      ['12', '11', '46', '30'],
      ['13', '12', '47.5', '31'],
    ],
  },
  jerseys: {
    title: 'Jersey & apparel size guide',
    note: 'Chest measured under arms. Replica jerseys run athletic; size up for a relaxed fan fit.',
    headers: ['Size', 'Chest (in)', 'Chest (cm)', 'Length'],
    rows: [
      ['S', '34–36', '86–91', 'Regular'],
      ['M', '38–40', '96–101', 'Regular'],
      ['L', '42–44', '106–111', 'Regular'],
      ['XL', '46–48', '116–121', 'Regular'],
      ['XXL', '50–52', '127–132', 'Regular'],
    ],
  },
  balls: {
    title: 'Ball size guide',
    note: 'Football size 5 is adult match. Basketball 29.5" (size 7) men / 28.5" (size 6) women & youth.',
    headers: ['Type', 'Size', 'Circumference', 'Use'],
    rows: [
      ['Football', '5', '68–70 cm', 'Adult match'],
      ['Football', '4', '63–66 cm', 'Youth'],
      ['Basketball', '7 / 29.5"', '75–78 cm', 'Men'],
      ['Basketball', '6 / 28.5"', '72–74 cm', 'Women / youth'],
    ],
  },
  default: {
    title: 'Fit tip',
    note: 'Check the product description for specific sizing. Contact support for team bulk sizing.',
    headers: ['Tip'],
    rows: [['When in doubt, check brand charts or message us before match day.']],
  },
};

export function getSizeGuide(category: string) {
  return SIZE_GUIDES[category] || SIZE_GUIDES.default;
}
