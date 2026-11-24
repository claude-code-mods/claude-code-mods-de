# lane-stack (Claude Code plugin)

Die Claude-seitige Hälfte von Claude Lane Stack: PM-Agenten, Slash-Befehle und Playbook-Skills.

Installation über den Repo-Marketplace (nicht durch Kopieren nach `~/.claude/agents` / `~/.claude/skills`):

```bash
claude plugin marketplace add VKirill/claude-lane-stack
claude plugin install lane-stack@claude-lane-stack -y
```

`./install.sh` registriert diesen GitHub-Marketplace mit `autoUpdate: true` und synchronisiert außerdem die Host-Laufzeit (`bin/`, Board, Writer-Profile) per rsync nach `~/.agents`. Host-Dateien werden nicht automatisch aktualisiert – führe `./install.sh` erneut aus. Für einen Live-Checkout: `LANE_INSTALL_LOCAL_MARKETPLACE=1 ./install.sh`.

Skills haben den Namensraum `/lane-stack:<skill>`. Das Spickzettel zur Arbeit: `/lane-stack:info` oder `/info`. Für neue App-/Dienst-Gespräche: `/lane-stack:app-architect`. Lebende Dokumentation: `/lane-stack:docs-maintain`. Faktenkorpus: `/lane-stack:lane-memory`. Die PM-Playbooks (`orchestrator-lanes`, `orchestrator-workflow`, `info`, `app-architect`) liegen nur in diesem Plugin und in `~/.agents/pm-skills` – sie werden nicht in den gemeinsamen Writer-Katalog kopiert.

## Quelle und Lizenz

- Originalautor: VKirill
- Originalrepository: https://github.com/VKirill/claude-lane-stack
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
