export const metadata = { title: 'FAQ' };

const FAQS = [
  {
    q: 'Do you ship internationally?',
    a: 'Standard shipping covers the contiguous US. Express and overnight options are available at checkout. International shipping lands with the Express backend.',
  },
  {
    q: 'How do promo codes work?',
    a: 'Try PITCH10 (10% off), COURT15 (15% off over $100), FREESHIP, or WELCOME20 ($20 off over $80).',
  },
  {
    q: 'Can I return boots after wearing them on turf?',
    a: 'Unworn items with tags can be returned within 30 days. Match-used footwear is final sale unless defective.',
  },
  {
    q: 'Is the catalog connected to a real database?',
    a: 'Today the storefront uses a mock API. Flip USE_MOCK off and point NEXT_PUBLIC_API_URL at the Express API once Postgres handlers are live.',
  },
  {
    q: 'How do I track an order?',
    a: 'After checkout you get an order ID and tracking timeline. Signed-in shoppers can also open Account → Orders.',
  },
];

export default function FaqPage() {
  return (
    <div className="container-site max-w-3xl py-14">
      <h1 className="font-display text-5xl">FAQ</h1>
      <div className="mt-8 space-y-4">
        {FAQS.map((item) => (
          <details key={item.q} className="rounded-lg border border-line bg-paper-elevated p-4">
            <summary className="cursor-pointer font-semibold">{item.q}</summary>
            <p className="mt-3 text-sm text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
