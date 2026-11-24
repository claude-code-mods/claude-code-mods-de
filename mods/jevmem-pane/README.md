# jevmem pane

A side pane for Claude Code, beside your chat, that zeigt what [jevmem](https://github.com/Avinash-jetwani/jevmem) did for the Prompt you just sent und the Zug that just ended:

1. **Recalled for this Prompt**: jede memory Zeile served to Claude (its id, kind und Text) und how many were withheld.
2. **The guard**: the letzte call the guard asked about oder denied, mit the rule und its score, matched to the call.
3. **Saved letzte Zug**: the Zeile jevmem gespeichert von the Zug und its kind, oder why the Zug was skipped.

Each Zeile has `why`, `wrong` und `forget` buttons. `forget` und `wrong` ändern `JEVMEM.md` (the Zeile is kept as `[retired]`), so they ask erste; a rule is retired in a terminal nur, as `jevmem trust` works. The pane liest three local Dateien under `.jevmem/` und runs the `jevmem` Befehl by argument vector; it sendet nothing anywhere und liest nein key.

## Install

In Claude Code, mit the jevmem marketplace added (`claude plugin marketplace add Avinash-jetwani/jevmem`):

```
/plugin install jevmem-pane@jevmem
```

It needs the jevmem Befehl (`npm install -g jevmem`) und a Projekt that is turned on (`jevmem setup`). The pane öffnet on its own in a terminal 144 columns wide oder wider; `/jevmem` öffnet oder closes it at any width (docked beside the chat von 110 columns in the fullscreen terminal, above the Prompt below that). Claude Code nur: Cursor has nein pane.

The whole Beschreibung, mit what jede state means, is in [docs/pane.md](https://avinash-jetwani.github.io/jevmem/pane/).

## Quelle und Lizenz

- Originalautor: Avinash-jetwani
- Originalrepository: https://github.com/Avinash-jetwani/jevmem
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
