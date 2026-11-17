import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nexis — Your Collaborative AI Team',
  description: 'Group-chat multi-agent platform: 1 Executive Assistant + 4 Task Agents + 2 Support Agents',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-wechat-bg font-wechat text-wechat-fg">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
