'use client';

// User Profile & Settings
import { useState } from 'react';
import { Crown, ListTodo, Package } from 'lucide-react';
import { QuotaWidget } from '@/components/layout/QuotaWidget';
import {
  useMyQuota,
  usePatchProfile,
  useProfile,
  useProfileStats,
} from '@/lib/api';

const PLAN_LABEL: Record<string, string> = {
  free: 'Free Tier',
  personal: 'Pro Plan',
  team: 'Enterprise Team',
};

export default function ProfilePage() {
  const { data: profile } = useProfile();
  const { data: stats } = useProfileStats();
  const { data: quota } = useMyQuota();
  const patch = usePatchProfile();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');

  function saveName() {
    if (name.trim() && name !== profile?.nickname) {
      patch.mutate({ nickname: name.trim() });
    }
    setEditingName(false);
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">
      <header className="flex h-14 flex-shrink-0 items-center border-b border-wechat-line px-5">
        <h1 className="text-[15px] font-semibold text-wechat-fg">Account Profile</h1>
      </header>

      <div className="mx-auto w-full max-w-2xl space-y-5 p-6">
        {/* User Info */}
        <section className="flex items-center gap-4 rounded-md border border-wechat-line bg-white p-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-wechat-green-soft">
            <span className="grid h-full w-full place-items-center text-[18px] font-semibold text-wechat-green">
              {profile?.nickname?.slice(0, 2) ?? 'Me'}
            </span>
          </div>
          <div className="flex-1">
            {editingName ? (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                className="w-full rounded-sm border border-wechat-line bg-white px-2 py-1 text-[14px] outline-none focus:border-wechat-green"
              />
            ) : (
              <div
                className="cursor-text text-[15px] font-semibold text-wechat-fg"
                onClick={() => {
                  setName(profile?.nickname ?? '');
                  setEditingName(true);
                }}
              >
                {profile?.nickname ?? 'Unnamed Workspace'}
              </div>
            )}
            <div className="text-[12px] text-wechat-mute">
              {profile?.phone ?? '—'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-wechat-sub">
              <Crown size={11} />
              {PLAN_LABEL[profile?.plan ?? 'free']}
            </div>
          </div>
        </section>

        {/* Quotas */}
        <section>
          <h2 className="mb-2 text-[12px] font-medium text-wechat-sub">Quotas & Usage</h2>
          <QuotaWidget />
        </section>

        {/* Deliverables stats */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Package}
            label="Deliverables"
            value={stats?.artifacts ?? 0}
            suffix="items"
          />
          <StatCard
            icon={ListTodo}
            label="Active Skills"
            value={stats?.skills_used ?? 0}
            suffix="skills"
          />
        </section>

        {/* Preference Profile */}
        <section className="rounded-md border border-wechat-line bg-white p-4">
          <h2 className="mb-2 text-[12px] font-medium text-wechat-sub">Continuous Preference Learning</h2>
          <p className="text-[11px] text-wechat-mute">
            Preferences and guidelines repeated across 3 consecutive interactions are automatically synthesized into
            your default persona profile. You can also directly prompt the Executive Assistant to register new workspace defaults.
          </p>
          <div className="mt-3 text-[11px] text-wechat-sub">
            {quota ? `Currently ${quota.auto_tasks_daily.used} tasks completed in current billing cycle.` : ''}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="rounded-md border border-wechat-line bg-white p-3">
      <div className="mb-1 flex items-center gap-1 text-[11px] text-wechat-mute">
        <Icon size={11} /> {label}
      </div>
      <div className="text-[20px] font-semibold tabular-nums text-wechat-fg">
        {value}
        <span className="ml-1 text-[11px] font-normal text-wechat-mute">{suffix}</span>
      </div>
    </div>
  );
}
