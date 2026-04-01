---
name: new-task
description: Start a new task in an isolated worktree with a feature branch
---

Start working on a new task by creating an isolated worktree. This keeps the main working directory clean and makes it easy to context-switch between tasks.

## Steps

1. If the task description is vague, ambiguous or missing, ask the user to clarify before proceeding.
2. Ask if there is a linked ticket (e.g. GitHub issue, Linear) unless the user already provided one.
3. Determine a short, descriptive branch name from the task description (e.g. `feat/add-profile-page`, `fix/login-redirect`). Use conventional prefixes: `feat/`, `fix/`, `refactor/`, `chore/`.
4. Use `EnterWorktree` with the branch name as the worktree name.
5. Read the relevant CLAUDE.md files and any code related to the task to build context.
