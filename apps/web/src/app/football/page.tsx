import { SportHub } from '@/components/SportHub';

export const metadata = { title: 'Football' };

export default function FootballPage() {
  return (
    <SportHub
      sport="football"
      title="Football"
      tagline="Built for the pitch — boots, kits, balls, and training gear."
      heroImage="/images/a.webp"
    />
  );
}
