# jev-auto-compact

> Dieser englische Bezugstext wurde aus dem Upstream-Plugin-Manifest und Katalogmetadaten zusammengestellt; der festgelegte Upstream-Commit enthält keine README.

Bei 60% Kontext werden veraltete Werkzeugaufrufe ohne jede Generierung entfernt; stattdessen wird übersprungen, statt auf eine LLM-Zusammenfassung zurückzufallen.

Wortgetreue Komprimierung mit Jev: Sobald der Kontext 60% erreicht, werden veraltete Werkzeugaufrufe ohne jede Generierung entfernt. Wenn nichts entfernbar ist, wird übersprungen (nie Rückfall auf den LLM-Zusammenfasser); Nachweise werden für learning.db aufgezeichnet.

## Installation

```
/plugin install jev-auto-compact@claude-code-mods-de
```

## Quelle und Lizenz

- Originalautor: notque
- Originalrepository: https://github.com/notque/vexjoy-agent
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
