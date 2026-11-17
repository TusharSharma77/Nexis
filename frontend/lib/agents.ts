// Agent metadata (Role -> Palette / Short Name / Avatar Initial / Agent ID)

export type RoleKey =
  | 'user'
  | 'ceo_assistant'
  | 'agent_1'
  | 'agent_2'
  | 'agent_3'
  | 'agent_4'
  | 'hr'
  | 'finance_manager';

export type AgentStatus = 'working' | 'idle' | 'fishing' | 'training';

export const STATUS_DOT: Record<AgentStatus, string> = {
  working: 'bg-emerald-500 animate-pulse',
  idle: 'bg-neutral-300',
  fishing: 'bg-amber-400',
  training: 'bg-blue-400',
};

export const STATUS_LABEL: Record<AgentStatus, string> = {
  working: 'Working',
  idle: 'Idle',
  fishing: 'Standby',
  training: 'Busy',
};

export interface RoleMeta {
  id: RoleKey;
  name: string;        // Full name (for badge / group member panel)
  short: string;       // Short name (for avatar labels)
  initial: string;     // 1-2 character avatar initials
  color: string;       // Avatar background color
  description?: string;
}

export const ROLES: Record<RoleKey, RoleMeta> = {
  user:            { id: 'user',            name: 'Leader',         short: 'Me',        initial: 'ME', color: '#E8755A' },
  ceo_assistant:   { id: 'ceo_assistant',   name: 'Assistant',      short: 'Assistant', initial: 'EA', color: '#F4C95D', description: 'Coordinates workflows and schedules team tasks' },
  agent_1:         { id: 'agent_1',         name: 'Researcher',     short: 'Research',  initial: 'RE', color: '#7EB872', description: 'Text, research, and copywriting (Agent 1)' },
  agent_2:         { id: 'agent_2',         name: 'Doc Specialist', short: 'Docs',      initial: 'DC', color: '#5B9DD9', description: 'Document processing and summaries (Agent 2)' },
  agent_3:         { id: 'agent_3',         name: 'Designer',       short: 'Design',    initial: 'DS', color: '#A07BC8', description: 'Image generation and visual design (Agent 3)' },
  agent_4:         { id: 'agent_4',         name: 'Media Producer', short: 'Media',     initial: 'AV', color: '#7EB872', description: 'Audio/video editing and speech synthesis (Agent 4)' },
  hr:              { id: 'hr',              name: 'HR Lead',        short: 'HR',        initial: 'HR', color: '#5B9DD9', description: 'Manages AI team members and skills' },
  finance_manager: { id: 'finance_manager', name: 'Finance Lead',   short: 'Finance',   initial: 'FN', color: '#E8755A', description: 'Quotas, usage, and billing' },
};

export const MAIN_SESSION_ROLES: RoleKey[] = [
  'ceo_assistant',
  'agent_1',
  'agent_2',
  'agent_3',
  'agent_4',
  'hr',
  'finance_manager',
];

// General group: Executive Assistant + 4 Core Task Agents
export const GROUP_ROLES: RoleKey[] = [
  'ceo_assistant',
  'agent_1',
  'agent_2',
  'agent_3',
  'agent_4',
];

// E-commerce visual creation team: Assistant + Copy + Doc + Image
export const ECOMMERCE_GROUP_ROLES: RoleKey[] = [
  'ceo_assistant',
  'agent_1',
  'agent_2',
  'agent_3',
];

export function getRoleMeta(id: RoleKey | string): RoleMeta {
  if (id in ROLES) return ROLES[id as RoleKey];
  return {
    id: id as RoleKey,
    name: id,
    short: id.slice(0, 4),
    initial: id.slice(0, 2).toUpperCase(),
    color: '#888888',
  };
}
