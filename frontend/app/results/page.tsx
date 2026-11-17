'use client';

// Deliverables archive view
import { useState } from 'react';
import { Download, ExternalLink, FileText, Image as ImageIcon, Music, Video } from 'lucide-react';
import clsx from 'clsx';
import { useArtifacts, type ArtifactRow } from '@/lib/api';

type TypeKey = 'all' | 'text' | 'image' | 'video' | 'document' | 'audio';

const TYPE_LABEL: Record<TypeKey, { label: string; icon: typeof FileText }> = {
  all: { label: 'All Files', icon: FileText },
  text: { label: 'Text', icon: FileText },
  image: { label: 'Images', icon: ImageIcon },
  video: { label: 'Videos', icon: Video },
  document: { label: 'Docs', icon: FileText },
  audio: { label: 'Audio', icon: Music },
};

export default function ResultsPage() {
  const [typeFilter, setTypeFilter] = useState<TypeKey>('all');
  const [onlyFinal, setOnlyFinal] = useState(true);
  const { data: items = [] } = useArtifacts({
    type: typeFilter === 'all' ? undefined : typeFilter,
    only_final: onlyFinal,
  });

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-wechat-line px-5">
        <div>
          <h1 className="text-[15px] font-semibold text-wechat-fg">Deliverables</h1>
          <p className="text-[11px] text-wechat-mute">Unified archive of deliverables across all agent sessions</p>
        </div>
        <label className="flex items-center gap-1 text-[12px] text-wechat-sub">
          <input
            type="checkbox"
            checked={onlyFinal}
            onChange={(e) => setOnlyFinal(e.target.checked)}
            className="h-3 w-3"
          />
          Final deliverables only
        </label>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-44 flex-shrink-0 border-r border-wechat-line bg-neutral-50 p-2">
          <div className="px-2 pb-1 pt-1 text-[10px] font-medium text-wechat-mute">Media Type</div>
          {(Object.keys(TYPE_LABEL) as TypeKey[]).map((k) => {
            const Icon = TYPE_LABEL[k].icon;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setTypeFilter(k)}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-sm px-2 py-1 text-left text-[12px] transition-colors',
                  typeFilter === k
                    ? 'bg-wechat-green-soft text-wechat-fg'
                    : 'text-wechat-sub hover:bg-neutral-100',
                )}
              >
                <Icon size={13} />
                {TYPE_LABEL[k].label}
              </button>
            );
          })}
        </aside>

        <main className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-[13px] text-wechat-mute">
              No deliverables found
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.map((a) => (
                <ArtifactCard key={a.id} item={a} />
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}

function ArtifactCard({ item }: { item: ArtifactRow }) {
  const Icon =
    item.type === 'image'
      ? ImageIcon
      : item.type === 'video'
        ? Video
        : item.type === 'audio'
          ? Music
          : FileText;
  const date = new Date(item.created_at).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <li className="flex flex-col justify-between rounded-md border border-wechat-line bg-white p-3 hover:border-wechat-green">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-wechat-fg">
            <Icon size={14} className="text-wechat-sub" />
            <span className="truncate max-w-[160px]">{item.title}</span>
          </span>
          {item.is_final && (
            <span className="rounded-sm bg-wechat-green-soft px-1.5 py-0.5 text-[9px] text-wechat-green">
              Final
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-[11px] text-wechat-mute">
          {item.summary || item.type}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2 text-[10px] text-wechat-mute">
        <span>{date}</span>
        <div className="flex items-center gap-2">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-0.5 text-wechat-green hover:underline"
            >
              <Download size={11} /> Download
            </a>
          )}
          {item.conversation_id && (
            <a
              href={`/chat/${item.conversation_id}`}
              className="flex items-center gap-0.5 hover:text-wechat-fg"
            >
              <ExternalLink size={11} /> View Session
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
