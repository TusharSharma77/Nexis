'use client';

// Agent Academy: Skill Playbook Catalog & Management
import { useState } from 'react';
import { CheckCircle, GraduationCap, Layers } from 'lucide-react';
import clsx from 'clsx';
import { useMySkills, useSkills, type SkillCard } from '@/lib/api';

type Tab = 'browse' | 'mine';

export default function AcademyPage() {
  const [tab, setTab] = useState<Tab>('browse');
  const { data: all = [] } = useSkills();
  const { data: mine = [] } = useMySkills();
  const items = tab === 'browse' ? all : mine;

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-wechat-line px-5">
        <div>
          <h1 className="flex items-center gap-2 text-[15px] font-semibold text-wechat-fg">
            <GraduationCap size={16} /> Agent Academy
          </h1>
          <p className="text-[11px] text-wechat-mute">
            Explore skill playbooks and manage agent competencies across workflows
          </p>
        </div>
        <div className="flex rounded-md border border-wechat-line bg-white p-0.5 text-[12px]">
          {(['browse', 'mine'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={clsx(
                'rounded-sm px-3 py-1 transition-colors',
                tab === t
                  ? 'bg-wechat-green-soft text-wechat-green'
                  : 'text-wechat-mute hover:bg-neutral-50',
              )}
            >
              {t === 'browse' ? 'Catalog' : 'My Active Skills'}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="grid h-full place-items-center text-[13px] text-wechat-mute">
            {tab === 'browse' ? 'No skill playbooks found' : 'No skills enabled yet'}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((s) => (
              <SkillCardView key={s.id} skill={s} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function SkillCardView({ skill }: { skill: SkillCard }) {
  return (
    <li className="rounded-md border border-wechat-line bg-white p-3 hover:border-wechat-green">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-wechat-fg">{skill.name}</span>
        {skill.installed && (
          <span className="flex items-center gap-1 text-[10px] text-wechat-green">
            <CheckCircle size={10} /> {skill.enabled ? 'Active' : 'Disabled'}
          </span>
        )}
      </div>
      <p className="mb-2 line-clamp-2 text-[11px] text-wechat-sub">
        {skill.description || 'No description provided'}
      </p>
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-wechat-mute">
        <span className="flex items-center gap-0.5">
          <Layers size={10} /> v{skill.version}
        </span>
        {skill.domain && (
          <span className="rounded-sm bg-neutral-100 px-1.5 py-0.5">{skill.domain}</span>
        )}
        {(skill.keywords ?? []).slice(0, 3).map((k) => (
          <span key={k} className="rounded-sm bg-wechat-green-soft px-1.5 py-0.5 text-wechat-green">
            {k}
          </span>
        ))}
      </div>
    </li>
  );
}
