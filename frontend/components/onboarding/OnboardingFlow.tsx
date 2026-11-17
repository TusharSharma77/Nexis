'use client';

// Onboarding flow:
// - Executive Assistant / HR Lead / Finance Manager sequentially join session
// - 3 introduction beats
// - Interactive mode selector (Plan / Ask / Auto)
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ROLES } from '@/lib/agents';
import { useRouter } from 'next/navigation';
import { useConversationStore, type WorkMode } from '@/stores/conversation';
import { useCreateConversation } from '@/lib/api';

type Step =
  | { kind: 'join'; role: 'ceo_assistant' | 'hr' | 'finance_manager'; time: string }
  | { kind: 'intro'; role: 'ceo_assistant' | 'hr' | 'finance_manager'; time: string; text: string };

const SCRIPT: Step[] = [
  { kind: 'join',  time: '14:00', role: 'ceo_assistant' },
  { kind: 'join',  time: '14:00', role: 'hr' },
  { kind: 'join',  time: '14:00', role: 'finance_manager' },
  { kind: 'intro', time: '14:01', role: 'ceo_assistant',   text: 'Hello! I am your Executive Assistant. I coordinate tasks and orchestrate your autonomous agent team.' },
  { kind: 'intro', time: '14:01', role: 'hr',              text: 'I manage team capacity and skills. Reach out when you need to activate new playbooks or configure specialized workers.' },
  { kind: 'intro', time: '14:01', role: 'finance_manager', text: 'I track quotas, subscriptions, and billing to ensure budget efficiency across all workflows.' },
];

export function OnboardingFlow() {
  const [shown, setShown] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();
  const upsert = useConversationStore((s) => s.upsertConversation);
  const createConversation = useCreateConversation();

  useEffect(() => {
    if (shown >= SCRIPT.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [shown]);

  const finished = shown >= SCRIPT.length;

  function pickMode(target: WorkMode) {
    createConversation.mutate({
      mode: 'main_session',
      work_mode: target,
      name: 'Executive War Room',
    }, {
      onSuccess: (conversation) => {
        upsert(conversation);
        router.push(`/chat/${conversation.id}`);
      },
    });
  }

  const visible = useMemo(() => SCRIPT.slice(0, shown), [shown]);

  return (
    <div className="flex h-full w-full flex-col bg-wechat-bg">
      <header className="flex h-14 flex-shrink-0 items-center border-b border-wechat-line bg-white px-4">
        <span className="text-[14px] font-semibold text-wechat-fg">
          Executive War Room
        </span>
        <span className="ml-2 rounded bg-wechat-green-soft px-1.5 py-0.5 text-[10px] text-wechat-green">
          Main Session
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-2xl space-y-3">
          {visible.map((line, i) => (
            <Line key={i} step={line} />
          ))}

          {finished && (
            <div className="mt-6 animate-fade-up rounded-md border border-wechat-line bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="grid h-7 w-7 place-items-center rounded text-[11px] font-bold text-white"
                  style={{ background: ROLES.ceo_assistant.color }}
                >
                  EA
                </span>
                <span className="text-[13px] text-wechat-fg">
                  <span className="font-semibold">Executive Assistant:</span>{' '}
                  Which mode would you like to operate in today?
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <ModeButton
                  emoji="💭"
                  title="Plan Mode"
                  hint="Brainstorm and structure strategy together (zero quota cost)"
                  onClick={() => pickMode('plan')}
                />
                <ModeButton
                  emoji="❓"
                  title="Ask Mode"
                  hint="Direct Q&A and research without launching background tasks"
                  onClick={() => pickMode('ask')}
                />
                <ModeButton
                  emoji="🚀"
                  title="Auto Mode"
                  hint="Autonomous execution with human approval checkpoints"
                  onClick={() => pickMode('auto')}
                  primary
                />
              </div>

              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="mt-3 text-[11px] text-wechat-sub underline-offset-2 hover:text-wechat-green hover:underline"
              >
                Learn more about operational modes
              </button>

              {showHint && (
                <div className="mt-2 space-y-1 rounded bg-neutral-50 p-2.5 text-[11px] leading-[1.65] text-neutral-600">
                  <div><b>Plan</b>: Collaborate with agents to draft briefs and DAGs before kicking off work.</div>
                  <div><b>Ask</b>: Instant direct queries, citations, and brainstorming without consuming task credits.</div>
                  <div><b>Auto</b>: Autonomous multi-agent pipeline with HITL review gates for quality approval.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Line({ step }: { step: Step }) {
  if (step.kind === 'join') {
    const meta = ROLES[step.role];
    return (
      <div className="animate-fade-up py-1 text-center">
        <span className="rounded-sm bg-black/5 px-2.5 py-0.5 text-[11px] text-wechat-mute">
          [{step.time}] {meta.name} joined the session
        </span>
      </div>
    );
  }
  const meta = ROLES[step.role];
  return (
    <div className="flex animate-fade-up items-start gap-2.5">
      <span
        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded text-[12px] font-bold text-white"
        style={{ background: meta.color }}
      >
        {meta.initial}
      </span>
      <div className="flex flex-col">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="role-badge">{meta.name}</span>
          <span className="text-[11px] text-wechat-mute">{step.time}</span>
        </div>
        <div className="relative">
          <span className="absolute left-[-6px] top-2.5 h-0 w-0 border-y-[6px] border-r-[6px] border-y-transparent border-r-white" />
          <div className="rounded-md bg-white px-3 py-2 text-[13px] text-wechat-fg shadow-sm">
            {step.text}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  emoji,
  title,
  hint,
  onClick,
  primary,
}: {
  emoji: string;
  title: string;
  hint: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex flex-col items-start rounded border px-3.5 py-2 text-left transition-colors',
        primary
          ? 'border-wechat-green bg-wechat-green text-white hover:bg-[#06AE56]'
          : 'border-wechat-line bg-white text-wechat-fg hover:bg-neutral-50',
      )}
    >
      <span className="text-[13px] font-semibold">
        {emoji} {title}
      </span>
      <span className={clsx('mt-0.5 text-[11px]', primary ? 'text-white/85' : 'text-wechat-sub')}>
        {hint}
      </span>
    </button>
  );
}
