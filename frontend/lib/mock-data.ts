// Local mock data — used when backend is offline or in mock dev mode.
import type { ConversationSummary, AgentMember, Message } from '@/stores/conversation';

export const MOCK_CONVERSATIONS: ConversationSummary[] = [
  {
    id: 'main',
    name: 'AI Core Team',
    kind: 'main_session',
    work_mode: 'auto',
    preview: '@Nexis Team ready on standby',
    preview_time: '05:49',
    avatar_image: '/team-avatar.png',
  },
  {
    id: 'assistant',
    name: 'Executive Assistant',
    kind: 'private_chat',
    preview: 'How can I assist you today?',
    preview_time: '06:08',
    avatar_bg: '#F4C95D',
    avatar_text: 'EA',
  },
  {
    id: 'hr',
    name: 'HR Operations',
    kind: 'private_chat',
    preview: 'Latest onboarding tasks completed',
    preview_time: 'Yesterday',
    avatar_bg: '#5B9DD9',
    avatar_text: 'HR',
  },
  {
    id: 'short-video',
    name: 'Video Production Team',
    kind: 'group',
    work_mode: 'auto',
    preview: 'Researcher: This template works well',
    preview_time: '04:11',
    avatar_colors: ['#E05A5A', '#F4C95D', '#7EB872', '#5B9DD9'],
  },
  {
    id: 'ecom',
    name: 'E-Commerce Creative Team',
    kind: 'group',
    work_mode: 'plan',
    preview: 'Designer: New product assets uploaded',
    preview_time: 'Yesterday',
    avatar_colors: ['#E8A47E', '#F4C95D', '#A07BC8', '#BBBBBB'],
  },
];

export const MOCK_MEMBERS: Record<string, AgentMember[]> = {
  main: [
    { id: 'ceo_assistant',   status: 'idle' },
    { id: 'agent_1',         status: 'idle' },
    { id: 'agent_2',         status: 'idle' },
    { id: 'agent_3',         status: 'idle' },
    { id: 'agent_4',         status: 'idle' },
    { id: 'hr',              status: 'idle' },
    { id: 'finance_manager', status: 'idle' },
  ],
  'short-video': [
    { id: 'ceo_assistant', status: 'working' },
    { id: 'agent_1',       status: 'working' },
    { id: 'agent_2',       status: 'idle' },
    { id: 'agent_3',       status: 'fishing' },
    { id: 'agent_4',       status: 'idle' },
  ],
  ecom: [
    { id: 'ceo_assistant', status: 'idle' },
    { id: 'agent_1',       status: 'idle' },
    { id: 'agent_2',       status: 'idle' },
    { id: 'agent_3',       status: 'training' },
    { id: 'agent_4',       status: 'idle' },
  ],
};

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'short-video': [
    {
      id: 'm1',
      conversation_id: 'short-video',
      kind: 'user_text',
      role: 'user',
      text: '@Researcher Create a city exploration short video',
    },
    {
      id: 'm2',
      conversation_id: 'short-video',
      kind: 'agent_text',
      role: 'agent_1',
      time: '14:36',
      text: 'Got it! Quick clarification: Target audience and visual tone?',
    },
    {
      id: 'm3',
      conversation_id: 'short-video',
      kind: 'user_text',
      role: 'user',
      text: 'Urban professionals + relaxing vibe',
    },
    {
      id: 'm4',
      conversation_id: 'short-video',
      kind: 'agent_card',
      role: 'agent_1',
      time: '14:38',
      card: {
        icon: 'doc',
        title: 'Research Summary',
        tag: 'Report · markdown',
        tag_status: 'done',
        items: [
          '8 high-resolution urban media assets',
          'Historic street morning golden hour — primary b-roll',
          'Riverfront trail and community cafes — secondary b-roll',
          '4 core traits: relaxed / walkable / authentic / easy to shoot',
        ],
        footer: 'View execution details in the right panel',
        word_count: '2,140 words',
      },
    } as Message,
    {
      id: 'm5',
      conversation_id: 'short-video',
      kind: 'agent_text',
      role: 'agent_1',
      time: '14:38',
      text: 'Reviewed the brief, drafting video script now...',
    },
    {
      id: 'm6',
      conversation_id: 'short-video',
      kind: 'agent_card',
      role: 'agent_1',
      time: '14:40',
      card: {
        icon: 'pen',
        title: 'Drafting Script',
        tag: 'Script_v1 · 2/4 scenes · in progress',
        tag_status: 'running',
        items: [
          'Scene 1: Hook / "7:00 AM, the city is just waking up..."',
          'Scene 2: Route from historic avenue to riverfront promenade...',
        ],
        word_count: '156 / 380 words',
        progress: 41,
      },
    } as Message,
  ],
};
