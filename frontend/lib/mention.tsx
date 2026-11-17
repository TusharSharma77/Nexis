import type { ReactNode } from 'react';

// Highlights @mentions in message text
export function highlightMentions(text: string): ReactNode {
  return text.split(/(@\S+)/g).map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="font-semibold text-[#5B9DD9]">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
