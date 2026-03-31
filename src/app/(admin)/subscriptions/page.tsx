import Topbar from '@/components/layout/Topbar';
import SubscriptionTable from '@/components/subscriptions/SubscriptionTable';
import { getSubscriptions, getMembersForDropdown } from '@/actions/subscriptions';

export default async function SubscriptionsPage() {
  const [subscriptions, members] = await Promise.all([
    getSubscriptions(),
    getMembersForDropdown(),
  ]);

  return (
    <>
      <Topbar title="Subscriptions" />
      <div className="p-8">
        <SubscriptionTable
          subscriptions={subscriptions as any}
          members={members}
        />
      </div>
    </>
  );
}
