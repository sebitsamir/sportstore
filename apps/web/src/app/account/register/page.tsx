'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function RegisterPage() {
  const { register, toast } = useStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      router.push('/account/dashboard');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-site flex justify-center py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-line bg-paper-elevated p-6">
        <h1 className="font-display text-4xl">Create account</h1>
        <label className="block text-sm">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </Button>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link href="/account/login" className="text-pitch">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
