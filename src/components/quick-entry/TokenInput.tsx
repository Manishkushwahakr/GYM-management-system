'use client';

import { useState, useRef, useEffect } from 'react';
import { checkIn } from '@/actions/attendance';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CheckInResult } from '@/types/database';

export default function TokenInput() {
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clear result after 5 seconds
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await checkIn(tokenId);
      setResult(res);
      if (res.success) {
        setTokenId('');
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Main Input Card */}
      <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl" />

        <div className="relative">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-zinc-100 mb-2">
            Quick Check-In
          </h2>
          <p className="text-zinc-500 text-center text-sm mb-6">
            Enter the member&apos;s token ID to mark attendance
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={inputRef}
              placeholder="Enter Token ID (e.g., M01)"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value.toUpperCase())}
              className="text-center text-xl tracking-widest font-mono !py-4"
              autoComplete="off"
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              {loading ? 'Checking in...' : '✓ Check In'}
            </Button>
          </form>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`mt-6 p-4 rounded-xl border animate-in slide-in-from-bottom-4 duration-300 ${
            result.success
              ? result.subscriptionExpired
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
              : result.alreadyCheckedIn
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {result.success
                ? result.subscriptionExpired
                  ? '⚠️'
                  : '✅'
                : result.alreadyCheckedIn
                ? '⏰'
                : '❌'}
            </span>
            <div>
              <p
                className={`font-semibold ${
                  result.success
                    ? result.subscriptionExpired
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                    : result.alreadyCheckedIn
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
