'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function LoginPage() {
  const { login, toast } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push('/account/dashboard');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-site flex justify-center py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-line bg-paper-elevated p-6">
        <h1 className="font-display text-4xl">Sign in</h1>
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-center text-sm text-muted">
          <Link href="/account/forgot-password" className="text-pitch">
            Forgot password?
          </Link>
          {' · '}
          <Link href="/account/register" className="text-pitch">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
