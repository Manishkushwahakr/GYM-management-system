'use client';

import { useState } from 'react';
import { User } from '@/types/database';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface MemberFormProps {
  member?: User;
  onSuccess: () => void;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean; data?: User }>;
}

export default function MemberForm({ member, onSuccess, action }: MemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await action(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        placeholder="Enter member name"
        defaultValue={member?.name || ''}
        required
      />

      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="Enter phone number"
        defaultValue={member?.phone || ''}
        required
      />

      {member && (
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500 mb-1">Token ID</p>
          <code className="text-emerald-400 font-mono text-lg">{member.token_id}</code>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {member ? 'Update Member' : 'Add Member'}
        </Button>
      </div>

      {!member && (
        <p className="text-xs text-zinc-500 text-center">
          A unique token will be generated automatically based on the member&apos;s initial and serial number (e.g., M01).
        </p>
      )}
    </form>
  );
}
