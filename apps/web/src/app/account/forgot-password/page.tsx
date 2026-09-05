'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function ForgotPasswordPage() {
  const { toast } = useStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.forgotPassword(email);
      toast(res.data.message, 'success');
      setSent(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  return (
    <div className="container-site flex justify-center py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-line bg-paper-elevated p-6">
        <h1 className="font-display text-4xl">Reset password</h1>
        <p className="text-sm text-muted">
          Enter your email and we&apos;ll send a reset link (demo mode).
        </p>
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
        <Button type="submit" variant="primary" className="w-full" disabled={sent}>
          {sent ? 'Check your inbox' : 'Send reset link'}
        </Button>
        <p className="text-center text-sm">
          <Link href="/account/login" className="text-pitch">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
