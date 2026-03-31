'use client';

import { useState } from 'react';
import { User } from '@/types/database';
import { deleteMember, addMember, updateMember } from '@/actions/members';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import MemberForm from './MemberForm';
import { formatDate } from '@/lib/utils';

interface MemberTableProps {
  members: User[];
}

export default function MemberTable({ members }: MemberTableProps) {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.token_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member? This will also delete their subscriptions and attendance records.'))
      return;
    setDeletingId(id);
    const res = await deleteMember(id);
    if (res.error) setError(res.error);
    setDeletingId(null);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, phone, or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 text-sm"
          />
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Member
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

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
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Token ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    {search
                      ? 'No members found matching your search'
                      : 'No members yet. Click "Add Member" to get started.'}
                  </td>
                </tr>
              ) : (
                filtered.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                          <span className="text-emerald-400 text-sm font-bold">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-zinc-200">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {member.phone}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                        {member.token_id}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {formatDate(member.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMember(member)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={deletingId === member.id}
                          onClick={() => handleDelete(member.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Member"
      >
        <MemberForm
          onSuccess={() => setIsAddOpen(false)}
          action={addMember}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Edit Member"
      >
        {editingMember && (
          <MemberForm
            member={editingMember}
            onSuccess={() => setEditingMember(null)}
            action={async (formData: FormData) => {
              return updateMember(editingMember.id, formData);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
