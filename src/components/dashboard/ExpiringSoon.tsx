import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, getDaysRemaining } from '@/lib/utils';

interface ExpiringSoonProps {
  subscriptions: Array<{
    id: string;
    end_date: string;
    plan: string;
    users: { name: string; phone: string; token_id: string } | null;
  }>;
}

export default function ExpiringSoon({ subscriptions }: ExpiringSoonProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">
          ⏰ Expiring Soon
        </h2>
        <Badge variant="warning">{subscriptions.length} members</Badge>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500">No subscriptions expiring in the next 3 days</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const daysLeft = getDaysRemaining(sub.end_date);
            return (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <span className="text-amber-400 text-sm font-bold">
                      {sub.users?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {sub.users?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Token: {sub.users?.token_id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={daysLeft <= 1 ? 'danger' : 'warning'}>
                    {daysLeft === 0
                      ? 'Expires today'
                      : daysLeft === 1
                      ? '1 day left'
                      : `${daysLeft} days left`}
                  </Badge>
                  <p className="text-xs text-zinc-500 mt-1">
                    {formatDate(sub.end_date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
