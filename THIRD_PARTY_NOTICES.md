# Third-Party Notices

Date of review: 2026-07-21.

## Third-Party Components & Notices

This repository incorporates certain open-source tools and skill templates adapted under open-source licenses as documented below:

### hermes-agent

- **Project**: `NousResearch/hermes-agent`
- **Source**: https://github.com/NousResearch/hermes-agent
- **License**: MIT
- **Copyright**: © 2025 Nous Research
- **Usage**: Utilities in `backend/app/utils/` retaining Hermes headers, `agents/agents/_common/think_scrubber.py`, and `backend/skills/md_skills/hermes/`.
- **Modifications**: Adapted for project typing, structured logging, configuration, and security sandbox boundaries.

### obra/superpowers

- **Project**: `obra/superpowers`
- **Source**: https://github.com/obra/superpowers
- **License**: MIT
- **Copyright**: © 2025 Jesse Vincent
- **Usage**: Skill templates adapted via hermes-agent including `SKILL_writing-plans.md`, `SKILL_systematic-debugging.md`, `SKILL_test-driven-development.md`, `SKILL_subagent-driven-development.md`, `SKILL_requesting-code-review.md`.
- **Modifications**: Retained upstream attribution and utilized for planner/critic agent reference.

### gsd-build/get-shit-done

- **Project**: `gsd-build/get-shit-done`
- **Source**: https://github.com/gsd-build/get-shit-done
- **License**: MIT
- **Copyright**: © 2025 Lex Christopherson
- **Usage**: Skill templates adapted via hermes-agent (`SKILL_spike.md` and related development workflows).
- **Modifications**: Adapted for automated planner workflows while retaining embedded origin notices.

---

## MIT License Text

The following license terms apply to the MIT-licensed third-party components identified above:

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
