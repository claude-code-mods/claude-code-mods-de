# Agent Standup Leiste

![Agent Standup](.claude-plugin/icon.png)

Eine Zeile über deinem Prompt in Claude Code, wenn eine andere Claude-Code-Sitzung auf diesem Computer dich braucht:

    ✋ web-shop (VS Code) needs an approval
    Agent Standup · /agent-standup:open shows them all   Hide

und ein kurzer Toast, sobald eine Sitzung auf dich wartet oder ihren Zug beendet. Du bleibst in der Sitzung, an der du arbeitest, und weißt trotzdem, wann eine andere an einer Frage oder einer Freigabe hängt.

Es ist ein Mod: ein Plugin der Funktions-Hooks von Claude Code. Es zeichnet im Terminal und im Code-Tab der Claude-Desktop-App. In VS Code zeigt die [Agent-Standup-Erweiterung](https://marketplace.visualstudio.com/items?itemName=DoubleGeste.agent-standup) dasselbe in ihrer Statusleiste.

## Install

In Claude Code 2.1.294 oder neuer:

    /plugin install agent-standup-band --marketplace Atoll92/agent-standup

Mit einer früheren Version lädt es und tut nichts: Diese Versionen führen Mods nicht aus (und vor 2.1.221 im Terminal bzw. 2.1.269 anderswo schreiben sie auch den Status nicht, den es liest).

Um jede Sitzung als Live-Team-Call zu sehen, installiere zusätzlich das Haupt-Plugin: `/plugin install agent-standup --marketplace Atoll92/agent-standup`, danach `/agent-standup:open`.

## Was es liest und ausführt

- Alle 4 Sekunden die Statusdatei, die Claude Code für jede offene Sitzung führt, in `~/.claude/sessions/<pid>.json` (oder unter `CLAUDE_CONFIG_DIR`): welche Sitzung es ist, ihr Ordner und ob sie beschäftigt, untätig oder auf dich wartend ist. Nicht die Unterhaltungen. Eine Sitzung, die ein Programm mit `claude -p` gestartet hat, bleibt außen vor: Ihre Fragen gehen an dieses Programm. Eine Agent-SDK-App (Zed, eine selbst gebaute App) bleibt erhalten, da sie ihre Menüs einem Menschen zeigen kann.
- `ps`, um zu prüfen, ob eine Sitzung, die auf dich wartet, noch läuft: Eine abgestürzte Sitzung lässt ihre Datei zurück.

Es schreibt nichts und sendet nichts irgendwohin.

## Mehr

Quellen und Issues: https://github.com/Atoll92/agent-standup. Inoffiziell: nicht mit Anthropic verbunden und von Anthropic nicht unterstützt. MIT-lizenziert.

## Quelle und Lizenz

- Originalautor: Atoll92
- Originalrepository: https://github.com/Atoll92/agent-standup
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
