import { SportHub } from '@/components/SportHub';

export const metadata = { title: 'Basketball' };

export default function BasketballPage() {
  return (
    <SportHub
      sport="basketball"
      title="Basketball"
      tagline="Court-ready gear — shoes, swingman jerseys, balls, and more."
      heroImage="/images/b.webp"
    />
  );
}
