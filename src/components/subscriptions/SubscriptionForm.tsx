'use client';

import { useState } from 'react';
import { assignSubscription } from '@/actions/subscriptions';
import { PLAN_OPTIONS } from '@/lib/constants';
import Button from '@/components/ui/Button';

interface SubscriptionFormProps {
  members: Array<{ id: string; name: string; token_id: string }>;
  onSuccess: () => void;
}

export default function SubscriptionForm({
  members,
  onSuccess,
}: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter members by token or name
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.token_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a valid member from the list.');
      return;
    }
    
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await assignSubscription(formData);

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

      {/* Member Search / Select */}
      <div className="space-y-1.5 relative">
        <label className="block text-sm font-medium text-zinc-300">
          Member (Search by Name or Token)
        </label>
        <input type="hidden" name="user_id" value={selectedUserId} />
        <input
          type="text"
          placeholder="Type token (e.g. M01) or name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedUserId(''); // reset selection if modifying search
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          required={!selectedUserId}
          className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
          autoComplete="off"
        />
        
        {isDropdownOpen && !selectedUserId && (
          <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="px-4 py-2.5 hover:bg-zinc-700 cursor-pointer flex justify-between items-center border-b border-zinc-700/50 last:border-0"
                  onClick={() => {
                    setSelectedUserId(m.id);
                    setSearch(`${m.name} (${m.token_id})`);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="text-sm font-medium text-zinc-200">{m.name}</span>
                  <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-0.5 rounded">{m.token_id}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-zinc-500 text-center">No members found matching "{search}"</div>
            )}
          </div>
        )}
      </div>

      {/* Plan Select */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">
          Plan
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PLAN_OPTIONS.map((plan) => (
            <label
              key={plan.value}
              className="relative flex items-center justify-center p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-700/50 transition-all has-[:checked]:bg-emerald-500/10 has-[:checked]:border-emerald-500/30"
            >
              <input
                type="radio"
                name="plan"
                value={plan.value}
                required
                className="sr-only"
              />
              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-200">
                  {plan.label}
                </p>
                <p className="text-xs text-zinc-500">{plan.days} days</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Start Date */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">
          Start Date
        </label>
        <input
          type="date"
          name="start_date"
          defaultValue={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Assign Plan
      </Button>
    </form>
  );
}
