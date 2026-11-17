import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MessagesSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Users,
    title: 'One Group Chat, A Complete AI Team',
    description: 'The Executive Assistant breaks down requests; writing, research, visual, and media agents collaborate under a unified task contract.',
  },
  {
    icon: MessagesSquare,
    title: 'Unified Context Across Group & Private Chats',
    description: 'Collaborate with the whole team or open 1-on-1 chats with any agent; chat history and task execution states stay synchronized.',
  },
  {
    icon: Radio,
    title: 'Real-Time Transparent Execution',
    description: 'SSE streams token deltas, step transitions, human approvals, and deliverable events with reconnectable cursor recovery.',
  },
  {
    icon: Store,
    title: 'Extensible & Auditable Skills',
    description: 'Browse the Skill Marketplace to inspect agent requirements, tool scopes, and security metadata before installing or enabling.',
  },
  {
    icon: ShieldCheck,
    title: 'Human-in-the-Loop Control',
    description: 'Scripts, image generations, and final outputs pass through interactive approval gates. Automation without loss of control.',
  },
  {
    icon: Bot,
    title: 'Unified MCP & Agent Protocols',
    description: 'AgentTask, AgentResult, and Model Context Protocol (MCP) URIs provide explicit contracts to easily extend capabilities.',
  },
];

const STEPS = [
  ['01', 'State Your Goal', 'Post requirements in the main chat, or use @ to assign specific agents.'],
  ['02', 'Choose Your Mode', 'Select Ask, Plan, or Auto mode, and approve key decision checkpoints.'],
  ['03', 'Live Collaboration', 'Watch live agent states, step progression, streaming tokens, and intermediate drafts.'],
  ['04', 'Deliver & Reuse', 'Final outputs enter your Deliverables Library; successful workflows can be saved as Skills.'],
];

export default function WebsitePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0e1713] text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0e1713]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/website" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-wechat-green text-sm font-bold">N</span>
            Nexis
          </Link>
          <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
            <a href="#features" className="hover:text-white">Capabilities</a>
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#architecture" className="hover:text-white">Architecture</a>
          </div>
          <Link href="/login" className="rounded-full bg-wechat-green px-4 py-2 text-sm font-medium">
            Launch Workspace
          </Link>
        </div>
      </nav>

      <section className="relative flex min-h-[760px] items-center px-6 pt-16">
        <div className="absolute left-1/2 top-1/3 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-wechat-green/15 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-wechat-green/30 bg-wechat-green/10 px-3 py-1 text-xs text-[#77e9ad]">
            <Sparkles size={12} /> Autonomous Multi-Agent Workspace
          </span>
          <h1 className="mt-7 text-5xl font-semibold leading-[1.08] tracking-tight md:text-7xl">
            Don't just add another chat box.
            <span className="block text-[#77e9ad]">Organize AI into a real team.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Nexis unifies group chat, LangGraph orchestration, specialized agents, skills, MCP tools, and human approval into a single operating platform.
            You define the vision and judgment; the system coordinates execution.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-wechat-green px-7 py-3.5 text-sm font-semibold">
              Enter Workspace <ArrowRight size={15} />
            </Link>
            <a href="#workflow" className="rounded-full border border-white/15 px-7 py-3.5 text-sm text-white/70 hover:bg-white/5">
              See How It Works
            </a>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl gap-3 text-left text-xs text-white/55 sm:grid-cols-3">
            {['Unified Task & Event Contracts', 'Validated Skill Permissions', 'Durable Reconnectable SSE Stream'].map((item) => (
              <span key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <CheckCircle2 size={14} className="text-[#77e9ad]" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#f4f3ee] px-6 py-24 text-[#17201b]">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wechat-green">Product capabilities</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">From a single prompt to an auditable execution chain.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-wechat-green-soft text-wechat-green"><Icon size={19} /></span>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/55">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77e9ad]">How it works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Delegate to a team, not a black box.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {STEPS.map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <div className="text-2xl font-semibold text-[#77e9ad]">{number}</div>
                <h3 className="mt-7 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="border-y border-white/10 bg-black/15 px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">Start building your AI team today.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Production-ready group chats, 1-on-1 channels, 3 execution modes, real-time streaming, HITL approval gates, and skill lifecycle management.</p>
          </div>
          <Link href="/login" className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#17201b]">
            Get Started <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-white/30">
        Nexis · Event-Driven Multi-Agent Collaborative Workspace
      </footer>
    </main>
  );
}
