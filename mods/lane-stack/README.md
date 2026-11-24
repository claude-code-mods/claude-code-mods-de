# lane-stack (Claude Code plugin)

Claude-facing half of Claude Lane Stack: PM Agenten, slash commands, und playbook Skills.

Install von the repo marketplace (nicht by copying in `~/.claude/agents` / `~/.claude/skills`):

```bash
claude plugin marketplace add VKirill/claude-lane-stack
claude plugin install lane-stack@claude-lane-stack -y
```

`./install.sh` registers that GitHub marketplace mit `autoUpdate: true` und still rsyncs the host runtime (`bin/`, board, writer profiles) to `~/.agents`. Host Dateien do nicht automatisch-update — rerun `./install.sh`. Live checkout: `LANE_INSTALL_LOCAL_MARKETPLACE=1 ./install.sh`.

Skills are namespaced as `/lane-stack:<skill>`. Work cheat sheet: `/lane-stack:info` oder `/info`. New app/service talk: `/lane-stack:app-architect`. Living docs: `/lane-stack:docs-maintain`. Fact corpus: `/lane-stack:lane-memory`. PM playbooks (`orchestrator-lanes`, `orchestrator-workflow`, `info`, `app-architect`) live nur in dieses Plugin + `~/.agents/pm-skills` — they are nicht copied to the shared writer catalog.

## Quelle und Lizenz

- Originalautor: VKirill
- Originalrepository: https://github.com/VKirill/claude-lane-stack
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
