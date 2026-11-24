# Die besten Claude-Code-Mods

{{languages}}

**Handverlesen, geprüft, festgepinnt. Einmal hinzufügen, {{count}} Mods.**

> **Alle {{count}} Mods sind vollständig ins Deutsche lokalisiert.** Jede Beschriftung, jeder Befehl, jedes Panel, jeder Prompt und jede Dokumentation wurde übersetzt; die Plugin-Quellen sind in diesem Repository enthalten, sodass die Oberfläche nach der Installation sofort auf Deutsch ist – ohne zusätzliche Einrichtung. Nur Code-Bezeichner, Hook-Ereignisnamen, Skills und Anweisungen für das Modell bleiben englisch, damit sich das Verhalten nicht ändert.

Mods sind Claude-Code-Plugins aus Funktions-Hooks: Sie beobachten, ändern oder übernehmen, was Claude Code tut, und zeichnen ihre eigene Oberfläche. Dieser Marketplace sammelt die besten Mods der Community. Jeder ist mit `claude plugin validate` geprüft und auf den geprüften Commit festgelegt, sodass spätere Änderungen des Autors dich nie ungeprüft erreichen.

Erfordert Claude Code 2.1.287 oder neuer.

## Installation

In einer Claude-Code-Sitzung im Terminal:

```
/plugin marketplace add claude-code-mods/claude-code-mods-de
/plugin install <Mod-Name>@claude-code-mods-de
```

Zum Beispiel `/plugin install terminal-browser@claude-code-mods-de`. Mit `/plugin marketplace update claude-code-mods-de` holst du neue Mods und Updates.

## Katalog

Der Eintrag **Reichweite** auf jeder Karte zeigt, was der Code eines Mods laut Validator über das Zeichnen der Oberfläche hinaus tun kann. Lies den Quellcode eines Mods, bevor du ihn installierst: Die Prüfung liest den Code, ohne ihn auszuführen, und ist kein Sicherheitsaudit.

{{catalog}}

## Einen Mod vorschlagen

Öffne ein Issue mit dem Link zum Repository des Mods. Um ihn selbst hinzuzufügen, ergänze einen Eintrag in `community.json` (Repository, Ordner, geprüfter Commit, Kategorie, Lizenz), schreibe seine Einzeiler in `readme/summaries.json`, führe `python3 scripts/build-catalog.py` aus und öffne einen Pull Request.

## Danksagung und Lokalisierung

Jeder Mod gehört seinem Originalautor und behält seine eigene Lizenz. Neben dem Sammeln stellt dieses Repository eine **deutsche Lokalisierung** bereit: Die Plugins sind unter `mods/` gebündelt, ihre Beschriftungen, Befehlsbeschreibungen, Panels und Prompts sind übersetzt, und die Dokumentation jedes Mods ist ebenfalls übersetzt (das Original bleibt als `README.en.md` erhalten). Der Originalautor und die Lizenz sind am Ende jeder Dokumentation genannt. Wenn du eine lokalisierte Kopie entfernt oder die Urheberangabe geändert haben möchtest, öffne bitte ein Issue.

Inoffizielles Projekt; nicht mit Anthropic verbunden.
