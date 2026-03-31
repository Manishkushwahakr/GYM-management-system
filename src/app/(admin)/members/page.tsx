import Topbar from '@/components/layout/Topbar';
import MemberTable from '@/components/members/MemberTable';
import { getMembers } from '@/actions/members';

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <>
      <Topbar title="Members" />
      <div className="p-8">
        <MemberTable members={members} />
      </div>
    </>
  );
}
