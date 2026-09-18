# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Genzify: single-page Next.js app that converts input text into deliberately cringe Gen-Z slang via an LLM. Built primarily through Vercel's v0 (component structure/style reflects that origin - shadcn/ui components in `components/ui/` are generated, treat as vendored).

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` is the real lockfile; `bun.lock` is an empty stub, ignore it).

```bash
pnpm install
pnpm dev      # next dev, http://localhost:3000
pnpm build    # next build
pnpm start    # serve production build
pnpm lint     # next lint
```

No test suite exists in this repo.

Note: `next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` - `pnpm build` will succeed even with type/lint errors, so don't rely on a clean build as a correctness signal. Run `pnpm lint` and `tsc --noEmit` explicitly when you need that check.

## Architecture

- `app/actions.ts` - the single server action (`genzifyText`, `"use server"`). Builds the system prompt (slang rules, emoji-level instruction) and calls `generateText` from the Vercel AI SDK against `openai("gpt-4o")` via `@ai-sdk/openai`. Requires `OPENAI_API_KEY` in the environment. Also sets a `genzify_fingerprint` httpOnly cookie from the client-supplied fingerprint, but nothing currently reads that cookie server-side - actual rate limiting is client-side only (see below).
- `components/genzify-converter.tsx` - the entire UI/interaction layer as one client component: input textarea, emoji-level radio group, convert/reset flow, and the quota display. State is mirrored to `localStorage` under `genzify_*` keys so input/output survive a refresh.
- `utils/usage-tracker.ts` - client-only rate limiting: generates a browser fingerprint from `navigator`/`screen` properties, tracks a request count against a 10-per-12-hour limit in `localStorage` (XOR "encrypted" - obfuscation, not real security; trivially reset by clearing storage). This is the only quota enforcement that exists; the server action does not independently verify quota.
- `components/quota-limit-message.tsx` - a standalone quota-reached component that is **not currently wired into the app** (`genzify-converter.tsx` renders its own inline quota UI instead). Check before assuming it's live.
- `utils/logger.ts` - `logger.debug` is a no-op by design; use `logger.user`/`logger.error` for anything that should actually surface in the browser console.
- Styling: Tailwind + shadcn/ui (`components.json`), no CSS-in-JS. Visual style is intentionally maximalist/glitchy (gradients, animate-pulse, neon text shadows) - this is the intended aesthetic, not something to "clean up".


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:970c3bf2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd dolt push
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->
