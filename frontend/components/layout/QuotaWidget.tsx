'use client';

// Quota summary widget + 80% proactive threshold alerts
import { AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useMyQuota } from '@/lib/api';

const QUOTA_LABEL: Record<string, string> = {
  auto_tasks_daily: 'Daily Tasks',
  video_tasks_daily: 'Daily Videos',
  groups_monthly: 'Monthly Groups',
};

export function QuotaWidget({ compact = false }: { compact?: boolean }) {
  const { data, isLoading } = useMyQuota();
  if (isLoading || !data) return null;

  const rows = [
    { key: 'auto_tasks_daily', row: data.auto_tasks_daily },
    { key: 'video_tasks_daily', row: data.video_tasks_daily },
    { key: 'groups_monthly', row: data.groups_monthly },
  ];
  const warnings = data.warnings ?? [];
  const hasWarning = warnings.length > 0;

  return (
    <div
      className={clsx(
        'flex flex-col gap-1 rounded-md border border-wechat-line bg-white',
        compact ? 'p-2' : 'p-3',
        hasWarning && 'border-amber-300 bg-amber-50',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-wechat-sub">
          Tier · {data.plan === 'free' ? 'Free Tier' : data.plan === 'personal' ? 'Pro Plan' : 'Enterprise'}
        </span>
        {hasWarning && (
          <span className="flex items-center gap-1 text-[10px] text-amber-700">
            <AlertTriangle size={10} /> Budget Warning
          </span>
        )}
      </div>
      {rows.map(({ key, row }) => (
        <div key={key} className="flex items-center gap-2 text-[11px]">
          <span className="w-20 flex-shrink-0 text-wechat-mute">
            {QUOTA_LABEL[key]}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded bg-neutral-200">
            <span
              className={clsx(
                'block h-full transition-all',
                row.percent >= 80 ? 'bg-amber-500' : 'bg-wechat-green',
              )}
              style={{ width: `${Math.min(100, row.percent)}%` }}
            />
          </div>
          <span className="w-12 flex-shrink-0 text-right tabular-nums text-wechat-fg">
            {row.used}/{row.total}
          </span>
        </div>
      ))}
      {hasWarning && (
        <div className="mt-1 text-[11px] text-amber-800">
          @Finance Manager Alert: You have reached 80%+ of your daily {warnings.includes('auto_tasks_daily') ? 'task' : 'video'} quota.
        </div>
      )}
    </div>
  );
}
