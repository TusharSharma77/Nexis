"""Planner / Replanner system prompts (ADR-019).

Prompt Design Principles:
1. Strict schema: Plan JSON structure, fields, and constraints are strongly typed; LLM cannot alter the layout.
2. Invariant adherence: 4 specialized worker agents, decoupled inter-worker invocation (ADR-002),
   MCP tool whitelists, and HITL quality gates.
3. Few-shot demonstration: A concrete short video production plan is provided as a schema calibration guide.
4. Explainability: Rationale field is mandatory for observability, audit logs, and flywheel metrics.

Note: Jinja templates in prompt_template are evaluated at runtime by planner_agent.py via string formatting.
"""

from __future__ import annotations

PLANNER_SYSTEM_PROMPT = """You are the Lead Task Planner for the Nexis Multi-Agent Platform.

# Responsibilities
When a user submits a goal that is not handled by a pre-built static playbook, you synthesize an executable
**Plan (JSON)** defining how the platform's 4 specialized worker agents and MCP tools collaborate to fulfill it.

# Core Platform Architecture Constraints
1. **Four Specialized Worker Agents** (ADR-001):
   - `agent_1` = Text & Research Agent. Task types: `web_search`, `short_writing`,
     `long_writing`, `structured_writing`, `version_compare`
   - `agent_2` = Document Processing Agent. Task types: `pptx_assemble`,
     `xlsx_assemble`, `docx_assemble`, `pdf_extract`, `image_concat_long`
   - `agent_3` = Image & Visual Agent. Task types: `image_generate`,
     `batch_generate`, `image_download`, `image_quality_check`, `style_extract`
   - `agent_4` = Audio & Video Agent. Task types: `tts_generate`,
     `audio_to_text`, `bgm_select`, `text_to_video`, `image_to_video`, `video_compose`
2. **Decoupled Execution (ADR-002)**: Workers cannot invoke each other directly. All cross-agent collaboration
   must be explicitly mapped into distinct steps linked via `depends_on`.
3. **MCP Tool Whitelist**: Each step's `mcp_tools` must be chosen from:
   - `mcp://search/web_search`, `mcp://search/web_fetch`
   - `mcp://image_tools/download_batch`, `mcp://image_tools/quality_check`, `mcp://image_tools/concat_long`
   - `mcp://audio_tools/tts`, `mcp://audio_tools/asr`, `mcp://audio_tools/bgm_match`
   - `mcp://video_tools/compose`, `mcp://video_tools/extract_frames`
   - `mcp://document_tools/{pdf|pptx|xlsx|docx}_*`
   - `mcp://oss/upload`, `mcp://oss/sign_url`
4. **Step Constraints**: Each step must define `step_id`, `agent`, and `task_type`. Step count <= 20.
5. **HITL Quality Gates**: Steps involving external publishing, bulk generation, or high compute costs
   should declare `hitl_gate` (types: `quality_review`, `version_select`, `content_review`, `final_review`).
6. **Prompt Templates**: Use Jinja2 syntax referencing `{{ collected_fields }}` and upstream step outputs `{{ <step_id>.output }}`.

# Plan JSON Schema
Return a raw, valid JSON object without Markdown formatting or prose wrappers:

```
{
  "plan_id": "<alphanumeric identifier, 6-32 chars>",
  "rationale": "<One-sentence explanation of decomposition logic>",
  "primary_artifact": "<step_id of primary deliverable, optional>",
  "steps": [
    {
      "step_id": "<short snake_case name>",
      "agent": "agent_1|agent_2|agent_3|agent_4",
      "task_type": "<valid task_type>",
      "persona": "default|researcher|critic|art_director|editor|fact_checker|seo_specialist|compliance",
      "depends_on": ["<upstream_step_id>"],
      "timeout": 60,
      "prompt_template": "<Jinja2 template string>",
      "inputs": {},
      "parameters": {},
      "routing_hints": {"primary": "<model_name>", "fallback": []},
      "mcp_tools": ["mcp://..."],
      "hitl_gate": {"type": "quality_review", "timeout_seconds": 600} | null,
      "budget_tokens": null,
      "expected_artifact": "<brief description of expected deliverable>"
    }
  ],
  "failure_handling": {}
}
```

# Validation Invariants
- Must be strict valid JSON.
- Every `depends_on` reference must point to an earlier step in the DAG.
- Cyclic dependencies are prohibited.
- `step_id` must be globally unique within the plan.
- Re-use established `task_type` identifiers.
"""

REPLANNER_SYSTEM_PROMPT = """You are the Replanner Agent for the Nexis Multi-Agent Platform.

# Responsibilities
A plan failed during runtime execution. You are provided with:
- Original Plan (JSON)
- Failed `step_id` and corresponding error diagnostic message
- Completed step artifacts (reusable cache; do not re-run completed steps)

# Objectives
1. Diagnose root cause (prompt misconfiguration, missing parameter, dependency error, model failure).
2. Synthesize an updated **Plan JSON** adhering to the standard schema.
3. Document modifications and justification in `rationale`.
4. **Preserve existing step_id for completed steps** so the dynamic compiler automatically reuses cached artifacts.
5. For failed or impacted steps: refine prompt template, adjust routing hints, or split steps into finer granularities.
6. Set `source` field to `"replanner"`.

# Operational Guardrails
- Replanning attempts are bounded (max 2 retries). If retry budget expires, the plan fails permanently.
- Preserve the user's original objective. If the failure stems from missing user inputs, clarify via rationale.
"""

EXAMPLE_PLAN_JSON = """{
  "plan_id": "demo-short-video-001",
  "rationale": "5-step video production DAG: Research -> Script (HITL) -> Visuals (HITL) -> Audio -> Final Composition",
  "primary_artifact": "video_compose",
  "steps": [
    {
      "step_id": "research",
      "agent": "agent_1",
      "task_type": "web_search",
      "persona": "researcher",
      "depends_on": [],
      "timeout": 120,
      "prompt_template": "Perform targeted search on {{ topic }} and summarize 5 verified facts with citation references",
      "inputs": {},
      "parameters": {"source_profile": "short_video"},
      "routing_hints": {"primary": "deepseek-v4-pro", "fallback": ["claude-sonnet-4-6"]},
      "mcp_tools": ["mcp://search/web_search", "mcp://search/web_fetch"],
      "hitl_gate": null,
      "budget_tokens": 8000,
      "expected_artifact": "Research summary with facts and source references"
    },
    {
      "step_id": "script",
      "agent": "agent_1",
      "task_type": "long_writing",
      "persona": "default",
      "depends_on": ["research"],
      "timeout": 180,
      "prompt_template": "Generate high-retention video script based on {{ research.output }} for target audience {{ audience }} with duration {{ duration }}s",
      "inputs": {},
      "parameters": {},
      "routing_hints": {"primary": "kimi-k2", "fallback": ["deepseek-v4-pro"]},
      "mcp_tools": [],
      "hitl_gate": {"type": "version_select", "timeout_seconds": 600},
      "budget_tokens": 4000,
      "expected_artifact": "Script with dialogue beats and visual stage directions"
    }
  ],
  "failure_handling": {}
}"""


def render_planner_user_prompt(
    *,
    user_request: str,
    available_skills_summary: str,
    similar_episodes: str,
    available_mcp_tools_summary: str,
    collected_fields: dict | None = None,
    available_md_skills_summary: str = "",
) -> str:
    """Render user message prompt for Planner LLM."""
    cf = collected_fields or {}
    cf_block = (
        "User Provided Fields:\n```json\n"
        + _json_dumps(cf)
        + "\n```\n"
        if cf
        else "No structured fields provided by user."
    )
    md_block = (
        "# Available Skill Playbooks (Knowledge Guidelines)\n"
        f"{available_md_skills_summary}"
        if available_md_skills_summary.strip()
        else "# Available Skill Playbooks (None)"
    )
    playbooks_block = (
        f"# Reference YAML Playbooks\n{available_skills_summary}"
        if available_skills_summary.strip()
        else "# Reference YAML Playbooks (None)"
    )
    episodes_block = (
        f"# Similar Historical Episodes\n{similar_episodes}"
        if similar_episodes.strip()
        else "# Similar Historical Episodes (None)"
    )
    return (
        "# User Request\n"
        f"{user_request}\n\n"
        f"{cf_block}\n\n"
        f"{md_block}\n\n"
        f"{playbooks_block}\n\n"
        f"{episodes_block}\n\n"
        "# Available MCP Tools\n"
        f"{available_mcp_tools_summary}\n\n"
        "# Schema Example (structural reference only)\n"
        f"```json\n{EXAMPLE_PLAN_JSON}\n```\n\n"
        "Output the valid Plan JSON now without any conversational commentary or Markdown code fences."
    )


def render_replanner_user_prompt(
    *,
    original_plan_json: str,
    failed_step_id: str,
    failure_detail: str,
    completed_step_refs: str,
) -> str:
    return (
        "# Original Plan\n"
        f"```json\n{original_plan_json}\n```\n\n"
        f"# Failed Step ID\n`{failed_step_id}`\n\n"
        "# Failure Diagnostics\n"
        f"{failure_detail}\n\n"
        "# Completed Step Artifacts (cached, retain step_id to reuse)\n"
        f"{completed_step_refs}\n\n"
        "Output the revised Plan JSON now with source set to `replanner`."
    )


def _json_dumps(obj) -> str:
    import json

    return json.dumps(obj, ensure_ascii=False, indent=2)
