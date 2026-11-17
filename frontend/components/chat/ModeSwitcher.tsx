'use client';

// Group top mode switch chip (Plan/Ask/Auto)
import clsx from 'clsx';
import { useConversationStore, type WorkMode } from '@/stores/conversation';
import { useSwitchWorkMode } from '@/lib/api';

const LABELS: Record<WorkMode, string> = {
  plan: 'Plan',
  ask: 'Ask',
  auto: 'Auto',
};

const HINTS: Record<WorkMode, string> = {
  plan: 'Plan · Strategic planning (no quota consumed)',
  ask: 'Ask · Clarify questions (no quota consumed)',
  auto: 'Auto · Autonomous task execution',
};

export function ModeSwitcher({ conversationId }: { conversationId: string }) {
  const mode = useConversationStore(
    (s) => s.list.find((c) => c.id === conversationId)?.work_mode ?? 'auto',
  );
  const patchMode = useConversationStore((s) => s.patchMode);
  const { mutate, isPending } = useSwitchWorkMode();

  function switchTo(target: WorkMode) {
    if (target === mode || isPending) return;
    patchMode(conversationId, target);
    mutate({ conversationId, target });
  }

  return (
    <div className="ml-2 flex items-center gap-1 rounded-full border border-wechat-line bg-neutral-50 p-0.5">
      {(['plan', 'ask', 'auto'] as const).map((m) => (
        <button
          key={m}
          type="button"
          title={HINTS[m]}
          onClick={() => switchTo(m)}
          className={clsx(
            'rounded-full px-2.5 py-0.5 text-[11px] transition-colors',
            mode === m
              ? 'bg-wechat-green text-white shadow-sm'
              : 'text-neutral-500 hover:bg-white hover:text-wechat-fg',
          )}
        >
          {LABELS[m]}
        </button>
      ))}
    </div>
  );
}
