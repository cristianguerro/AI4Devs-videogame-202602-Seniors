---
description: "Use when working in onitama-CFGP or openspec, maintaining session history, or updating the prompt log in onitama-CFGP/prompts.md. Before each substantive user-facing response for those areas, append a timestamped log entry with the model used, the user's prompt, and the full agent response."
name: "Onitama Prompt Log"
applyTo: "{onitama-CFGP,openspec}/**"
---
# Onitama Prompt Log

- Treat `onitama-CFGP/prompts.md` as the running interaction log for work in `onitama-CFGP` and `openspec`.
- Before sending a substantive response, append a new entry to `onitama-CFGP/prompts.md`.
- Only log prompts that are meaningful to the project (requirements, design, implementation, debugging, planning, or decisions).
- Do not log trivial operational prompts that are not project-meaningful (for example: `commit`, `status`, `thanks`, `ok`, or similar command-only chatter).
- Keep each entry brief and factual.
- Include these fields in every entry:
  - `Timestamp`
  - `Model`
  - `User prompt`
  - `Agent response`
- Preserve existing history and only append new entries.
- If no file changes were needed, still record the interaction summary.

Example entry:

```md
## 2026-04-16T17:23:12-05:00
Model: "GPT-5.4"
User prompt: "Create a prompt log for this project."
Agent response: "Created the instruction file and initialized onitama-CFGP/prompts.md."
```