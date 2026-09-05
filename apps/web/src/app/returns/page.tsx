export const metadata = { title: 'Returns' };

export default function ReturnsPage() {
  return (
    <div className="container-site max-w-3xl py-14">
      <h1 className="font-display text-5xl">Returns</h1>
      <div className="mt-6 space-y-4 text-muted">
        <p>You have 30 days from delivery to return unused items in original packaging with tags attached.</p>
        <p>Defective products are eligible for exchange or refund regardless of wear within the first 14 days.</p>
        <p>Sale items marked final sale cannot be returned. Contact support with your order ID to start a return.</p>
      </div>
    </div>
  );
}
