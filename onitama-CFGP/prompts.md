# Onitama Prompt Log

## 2026-04-16T17:23:12-05:00
Model: "GPT-5.4"
User prompt: "I need to keep a 'prompt log' of any interaction in the sessions with the AI agent. The file should be created under onitama-CFGP and named prompts.md. Every time I prompt anything agent should write a log first in that file with the response."
Agent response: "I created the instruction at .github/instructions/onitama-prompt-log.instructions.md and initialized the log at onitama-CFGP/prompts.md. The instruction is scoped to work in onitama-CFGP and tells the agent to append a timestamped entry with the user prompt and an agent response summary before substantive replies. I also seeded the first session entry in the log. Both files validate cleanly. The main weak point is enforcement: an instruction can strongly guide this behavior, but it is not as deterministic as a hook. I also chose concise response summaries rather than full verbatim responses, and I scoped it only to onitama-CFGP because that matches your target log location."

## 2026-04-16T17:26:39-05:00
Model: "GPT-5.4"
User prompt: "1. I think that include the model used. Full agent response is ok."
Agent response: "Updated the instruction and prompt log so entries now include the model used and store the full agent response. I also normalized the existing first entry and added this interaction to onitama-CFGP/prompts.md. The configured model in the log is GPT-5.4."

## 2026-04-16T17:41:05-05:00
Model: "GPT-5.3-Codex"
User prompt: "Follow instructions in #prompt:create-instructions.prompt.md with these arguments: Use conventional commits"
Agent response: "Created a new workspace instruction at .github/instructions/conventional-commits.instructions.md. It enforces Conventional Commits with header format <type>(<scope>): <subject>, optional scope, recommended 72-character header limit, allowed commit types, and breaking change conventions using ! plus BREAKING CHANGE footer. It also includes body/footer guidance and concrete examples. Ambiguous points to confirm: should scope be mandatory for this repository, and do you want to restrict allowed types to a smaller subset such as feat/fix/docs/chore only? Example prompts to test it: 'Suggest 5 conventional commit messages for these staged changes', 'Rewrite this message to conventional commits: updated stuff', and 'Check whether this commit title is valid: feat(ui): add move hint panel'. Related customizations to consider next are PR-title conventions, commitlint hook enforcement, and release-note mapping by commit type."

## 2026-04-16T18:30:00-05:00
Model: "Claude Sonnet 4.6"
User prompt: "Follow instructions in #prompt:opsx-propose.prompt.md with these arguments: Read this draft-prd file and based on this propose"
Agent response: "Read the draft-prd.md (Project Pixel-Tama / Onitama Web) and created the full change `onitama-web-game-mvp` under `openspec/changes/onitama-web-game-mvp/` using the spec-driven schema. All 4 artifacts are complete:

- **proposal.md**: Explains why — greenfield Phaser 3 browser Onitama game. Lists 8 new capabilities: board, pieces, cards, movement, game-state, win-conditions, ai-opponent, ui-layout.
- **design.md**: Technical decisions — Phaser 3 via CDN, 3-scene architecture (Boot/Game/GameOver), plain JS state machine with 4 phases, card data as a static JS module, 5×5 logical array + Phaser objects, 3-click input flow, random-move AI with 500ms delay. Risks include card offset mirroring for Player 2 and pixel art scaling.
- **specs/**: 8 spec files, one per capability, each with ADDED Requirements and scenarios in WHEN/THEN format.
- **tasks.md**: 11 task groups, 35 checkbox tasks covering scaffold → card data → board → pieces → movement → card rotation → state machine → win conditions → AI → UI polish → integration testing.

All artifacts complete. Ready to implement — run `/opsx:apply` to start."