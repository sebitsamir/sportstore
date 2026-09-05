'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function ContactPage() {
  const { toast } = useStore();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.contact(form);
      toast(res.data.message, 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  return (
    <div className="container-site py-14">
      <h1 className="font-display text-5xl">Contact</h1>
      <p className="mt-2 max-w-xl text-muted">
        Questions about sizing, team orders, or shipping? Send a note — we reply shortly.
      </p>
      <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-3 rounded-lg border border-line bg-paper-elevated p-5">
        {(['name', 'email', 'subject'] as const).map((key) => (
          <label key={key} className="block text-sm capitalize">
            {key}
            <input
              required
              type={key === 'email' ? 'email' : 'text'}
              className="mt-1 w-full rounded-md border border-line px-3 py-2"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <label className="block text-sm">
          Message
          <textarea
            required
            rows={5}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        <Button type="submit" variant="primary">
          Send message
        </Button>
      </form>
    </div>
  );
}
