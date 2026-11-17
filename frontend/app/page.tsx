'use client';

// Main Entrypoint — If uninitialized, route to OnboardingFlow.
// If already configured, redirect to active session.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConversationStore } from '@/stores/conversation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function HomePage() {
  const router = useRouter();
  const main = useConversationStore((s) =>
    s.list.find((c) => c.kind === 'main_session'),
  );

  useEffect(() => {
    if (main?.work_mode) router.replace(`/chat/${main.id}`);
  }, [main, router]);

  return <OnboardingFlow />;
}
