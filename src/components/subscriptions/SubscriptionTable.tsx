'use client';

import { useState } from 'react';
import { Subscription } from '@/types/database';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SubscriptionForm from './SubscriptionForm';
import { formatDate, getDaysRemaining, isExpired } from '@/lib/utils';
import { PLAN_OPTIONS } from '@/lib/constants';

interface SubscriptionTableProps {
  subscriptions: Array<Subscription & { users: { name: string; phone: string; token_id: string } | null }>;
  members: Array<{ id: string; name: string; token_id: string }>;
}

export default function SubscriptionTable({
  subscriptions,
  members,
}: SubscriptionTableProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = subscriptions.filter((s) =>
    filter === 'all' ? true : s.status === filter
  );

  const getPlanLabel = (plan: string) =>
    PLAN_OPTIONS.find((p) => p.value === plan)?.label || plan;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                filter === f
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Assign Plan
        </Button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/30">
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    {filter !== 'all'
                      ? `No ${filter} subscriptions found`
                      : 'No subscriptions yet. Click "Assign Plan" to get started.'}
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const expired = isExpired(sub.end_date);
                  const daysLeft = getDaysRemaining(sub.end_date);
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                            <span className="text-emerald-400 text-sm font-bold">
                              {sub.users?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-200">
                              {sub.users?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {sub.users?.token_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {getPlanLabel(sub.plan)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {formatDate(sub.start_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {formatDate(sub.end_date)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <Badge variant={expired ? 'danger' : 'success'}>
                            {expired ? 'Expired' : 'Active'}
                          </Badge>
                          {!expired && daysLeft <= 3 && (
                            <p className="text-xs text-amber-400 mt-1">
                              {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Plan Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Assign Subscription Plan"
      >
        <SubscriptionForm
          members={members}
          onSuccess={() => setIsAddOpen(false)}
        />
      </Modal>
    </div>
  );
}
