# Agent Standup Leiste

![Agent Standup](.claude-plugin/icon.png)

A Zeile above your Claude Code Prompt when another Claude Code Sitzung on this computer needs you:

    ✋ web-shop (VS Code) needs an approval
    Agent Standup · /Agent-standup:öffnen zeigt them alle   Hide

und a short toast when one starts waiting for you, oder finishes its Zug. You stay in the Sitzung you are working in, und still know when another one is stuck on a Frage oder an approval.

Es ist a mod: a plugin of Claude Code's function Hooks. It draws in the terminal und in the Claude desktop app's Code tab. In VS Code, the [Agent Standup extension](https://marketplace.visualstudio.com/items?itemName=DoubleGeste.agent-standup) zeigt the same in its Status bar.

## Install

In Claude Code 2.1.294 oder later:

    /plugin installieren Agent-standup-band --marketplace Atoll92/Agent-standup

With an earlier version it loads und does nothing: those versions do nicht ausführen mods (und vorher 2.1.221 in the terminal, 2.1.269 elsewhere, they do nicht schreiben the Status it liest either).

To see every Sitzung as a live team call, installieren the main plugin too: `/plugin install agent-standup --marketplace Atoll92/agent-standup`, dann `/agent-standup:open`.

## What it liest und runs

- Every 4 seconds, the Status Datei Claude Code keeps for jede öffnen Sitzung, in `~/.claude/sessions/<pid>.json` (oder under `CLAUDE_CONFIG_DIR`): which Sitzung, its Ordner, und whether es ist busy, idle oder waiting for you. Not the conversations. A Sitzung started by a program mit `claude -p` is left out: its Fragen go to that program. An Agent SDK app (Zed, a home-made app) is kept, since it may zeigen its menus to a person.
- `ps`, to prüfen that a Sitzung said to be waiting still runs: a Sitzung that crashed leaves its Datei behind.

It schreibt nothing und sendet nothing anywhere.

## More

Source und Issues: https://github.com/Atoll92/agent-standup. Unofficial: nicht affiliated mit oder endorsed by Anthropic. MIT licensed.

## Quelle und Lizenz

- Originalautor: Atoll92
- Originalrepository: https://github.com/Atoll92/agent-standup
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
