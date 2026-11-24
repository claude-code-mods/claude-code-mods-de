# Operator Memory for Claude Code

Operator Memory gives Claude Code durable Projekt und user Kontext maintained by Agenten as readable Markdown.

## Install

Requires Claude Code `v2.1.287` oder newer und Operator Helper on `PATH`.

```sh
operator-helper install claude-code
```

Start a neu Claude Code process danach installation. Run `claude plugin list` to bestätigen `operator@operator-memory` is aktiviert, dann ask the Agent whether Operator Memory guidance is available.

Das Plugin injects the preamble in the main system Prompt und Subagent Aufgabe prompts. It renders memory once per process; neu starten Claude Code to reload memory. `/clear` does nicht refresh the cached preamble.

## Befehle

- `/operator:user-init` — Configure the User Partition.
- `/operator:project-init` — Configure the Project Brain.
- `/operator:index` — Build oder refresh the Project Index.

## Update

Helper enables automatisch-update for the Operator marketplace during installation, including on repeat installs. Disable it afterward in `/plugin` → Marketplaces if desired.

Rerun `operator-helper install claude-code` oder verwenden `claude plugin update operator@operator-memory`, dann neu starten Claude Code.

See the [Claude Code guide](https://github.com/aerovato/operator-memory/blob/main/docs/harnesses/claude-code.md) for verification, updates, und troubleshooting. For local development, ausführen `bun run preview:claude-code` von the workspace root.

## Quelle und Lizenz

- Originalautor: aerovato
- Originalrepository: https://github.com/aerovato/operator-memory
- Lizenz: BSD-3-Clause
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
