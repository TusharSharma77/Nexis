# Third-Party Notices

审计日期：2026-07-21。

## Third-Party Components & Notices

This repository incorporates certain open-source tools and skill templates adapted under open-source licenses as documented below:

## hermes-agent

- 项目：`NousResearch/hermes-agent`
- 来源：https://github.com/NousResearch/hermes-agent
- 许可证：MIT
- Copyright：© 2025 Nous Research
- 使用位置：`backend/app/utils/` 中带 Hermes 文件头的工具、`agents/agents/_common/think_scrubber.py`、`backend/skills/md_skills/hermes/`
- 修改：适配本项目类型、日志、配置和安全边界；Skill 卡片经筛选并用于 Planner/Critic/Persona 知识引用。

所有派生源文件继续保留原始来源文件头。Hermes Skill 卡片还标注了它们自身引用的上游项目，见下文。

## obra/superpowers

- 项目：`obra/superpowers`
- 来源：https://github.com/obra/superpowers
- 许可证：MIT
- Copyright：© 2025 Jesse Vincent
- 使用位置：经 hermes-agent 改编的 `SKILL_writing-plans.md`、`SKILL_systematic-debugging.md`、`SKILL_test-driven-development.md`、`SKILL_subagent-driven-development.md`、`SKILL_requesting-code-review.md`
- 修改：由 hermes-agent 改写为其工程工作流，本仓库保留上游说明并作为知识卡片使用。

## gsd-build/get-shit-done

- 项目：`gsd-build/get-shit-done`
- 来源：https://github.com/gsd-build/get-shit-done
- 许可证：MIT
- Copyright：© 2025 Lex Christopherson
- 使用位置：经 hermes-agent 改编的 `SKILL_spike.md`，以及 `SKILL_subagent-driven-development.md` 中明确标注的参考段落
- 修改：由 hermes-agent 改写，本仓库保留嵌入的来源说明。

## MIT License Text

The following license terms apply to the MIT-licensed third-party components identified above. The applicable copyright holder is the holder listed in that component's section.

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contributor instruction

不得删除上述文件中的 attribution、license、copyright、author 或来源字段。新增第三方代码时，请在本文件补充项目、链接、许可证、使用位置和修改范围。
