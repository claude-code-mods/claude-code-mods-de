# jevmem-Bereich

Ein Seitenbereich für Claude Code neben deinem Chat, der zeigt, was [jevmem](https://github.com/Avinash-jetwani/jevmem) für den gerade gesendeten Prompt und den eben beendeten Zug getan hat:

1. **Für diesen Prompt erinnert**: jede Erinnerungszeile, die Claude serviert wurde (ihre id, Art und Text), und wie viele zurückgehalten wurden.
2. **Der Wächter**: der letzte Aufruf, zu dem der Wächter gefragt oder den er abgelehnt hat, mit der Regel und ihrer Punktzahl, passend zum Aufruf.
3. **Letzten Zug gespeichert**: die Zeile, die jevmem aus dem Zug gespeichert hat, und ihre Art, oder warum der Zug übersprungen wurde.

Jede Zeile hat die Schaltflächen `why`, `wrong` und `forget`. `forget` und `wrong` ändern `JEVMEM.md` (die Zeile bleibt als `[retired]` erhalten), deshalb fragen sie zuerst; eine Regel wird nur im Terminal stillgelegt, so wie `jevmem trust` arbeitet. Der Bereich liest drei lokale Dateien unter `.jevmem/` und führt den Befehl `jevmem` als Argumentvektor aus; er sendet nichts irgendwohin und liest keinen Key.

## Install

In Claude Code, mit hinzugefügtem jevmem-Marketplace (`claude plugin marketplace add Avinash-jetwani/jevmem`):

```
/plugin install jevmem-pane@jevmem
```

Er braucht den `jevmem`-Befehl (`npm install -g jevmem`) und ein eingeschaltetes Projekt (`jevmem setup`). Der Bereich öffnet sich von selbst in einem Terminal mit 144 Spalten oder mehr; `/jevmem` öffnet oder schließt ihn bei jeder Breite (im Vollbild-Terminal ab 110 Spalten neben dem Chat angedockt, darunter über dem Prompt). Nur Claude Code: Cursor hat keinen Bereich.

Die vollständige Beschreibung mit der Bedeutung jedes Zustands steht in [docs/pane.md](https://avinash-jetwani.github.io/jevmem/pane/).

## Quelle und Lizenz

- Originalautor: Avinash-jetwani
- Originalrepository: https://github.com/Avinash-jetwani/jevmem
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
