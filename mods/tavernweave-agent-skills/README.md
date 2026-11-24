# TavernWeaveX 2.4.0

> Deutsche Fassung des Mods. Originalautor und Lizenz siehe unten.

TavernWeaveX 2.4.0 bietet 23 gemeinsame Skills für Rollenkarten, Softwarearbeit und begrenzte Cloud-Aufgaben, mit Fähigkeitsprüfungen und fortsetzbaren Übergaben. In Claude Code fügt es die Host Front Door ein, ergänzt den Agenten `tavernweave` und einen Soul-Modus-Schalter über der Eingabe. Die tatsächliche Ausführung hängt von den Werkzeugen und Berechtigungen des Hosts ab.

## Funktionen

- **23 Skills:** Gemeinsame Arbeitsabläufe für Rollenkarten, Softwareprojekte und begrenzte Cloud-Aufgaben.
- **Fähigkeitsprüfungen:** Vor jedem Schritt wird geprüft, ob der Host die nötigen Werkzeuge und Rechte bereitstellt.
- **Fortsetzbare Übergaben:** Arbeiten lassen sich unterbrechen und später mit dem bisherigen Kontext fortsetzen.
- **Host Front Door:** Der Claude-Code-Plugin-Teil ergänzt einen Einstiegspunkt, den Agenten `tavernweave` und den Soul-Modus-Schalter.

## Installation

```
/plugin install tavernweave-agent-skills@claude-code-mods-de
```

## Verwendung

Beschreibe die gewünschte Aufgabe; die Skills werden bedarfsgerecht geladen. Welche Aktionen ausgeführt werden können, hängt von den Rechten des Hosts ab. Hinweise zur Einrichtung und zu den einzelnen Skills befinden sich in der Originaldokumentation unter `skills/`.

## Quelle und Lizenz

- Originalautor: LiarMTTT
- Originalrepository: https://github.com/LiarMTTT/TavernWeave
- Lizenz: siehe Originalrepository
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
