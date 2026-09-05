export const metadata = { title: 'Shipping' };

export default function ShippingPage() {
  return (
    <div className="container-site max-w-3xl py-14">
      <h1 className="font-display text-5xl">Shipping</h1>
      <div className="mt-6 space-y-4 text-muted">
        <p>
          <strong className="text-ink">Standard</strong> — 5–7 business days ($7.99, free over $75).
        </p>
        <p>
          <strong className="text-ink">Express</strong> — 2–3 business days ($14.99).
        </p>
        <p>
          <strong className="text-ink">Overnight</strong> — 1 business day ($24.99).
        </p>
        <p>
          Orders placed before 2pm local warehouse time typically ship the same day. You will receive a
          tracking timeline on the confirmation page.
        </p>
      </div>
    </div>
  );
}
