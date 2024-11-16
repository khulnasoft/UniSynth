import { component$ } from '@khulnasoft.com/unisynth';
import { Link } from '@khulnasoft.com/unisynth-city';
import { useSession, useSignOut } from '~/routes/plugin@auth';
import Avatar from '../avatar';
import { UnisynthIcon } from '../icons/unisynth';

export default component$(() => {
  const signOutSig = useSignOut();
  const userCtx = useSession();

  return (
    <header class="flex items-center gap-3 border border-b-slate-200 px-6 py-3">
      <Link href="/app/">
        <UnisynthIcon width="46" height="50" />
      </Link>
      <span class="font-thin">Insights</span>

      {userCtx.value?.user?.email && (
        <div class="ml-auto flex items-center justify-center gap-8">
          <Link href="/">Setting</Link>
          <Link
            class="cursor-pointer"
            onClick$={() => {
              signOutSig.submit({ redirectTo: '/' });
            }}
          >
            Logout
          </Link>
          <Avatar
            src={userCtx.value.user.image ?? ''}
            alt={userCtx.value.user.name ?? ''}
            size="small"
          />
        </div>
      )}
    </header>
  );
});
