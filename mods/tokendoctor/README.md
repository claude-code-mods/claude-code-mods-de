<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo.svg">
    <img src="docs/logo-light.svg" width="72" height="72" alt="tokendoctor">
  </picture>
</p>

<h1 align="center">tokendoctor</h1>

<p align="center">
  <strong>Dasselbe Claude Code für bis zu 38 % weniger</strong>
  <br>
  Spielt deine eigenen vergangenen Sitzungen erneut ab, um zu zeigen, was jede Änderung eingespart hätte – und ändert nur, was du auswählst.
</p>

<p align="center">
  <a href="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml"><img src="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/github/v/tag/localixai/tokendoctor?label=version" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#install">Install</a> &bull;
  <a href="https://tokendoctor.localix.ai/docs">Docs</a> &bull;
  <a href="https://tokendoctor.localix.ai">Website</a> &bull;
  <a href="CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <img src="docs/demo.gif" alt="tokendoctor in a real Claude Code session: /tokendoctor:sessions, then the daily trend" width="880">
</p>

**Deine eigenen vergangenen Sitzungen entscheiden, nicht irgendein Benchmark.** Was eine Einstellung spart, hängt davon ab, wie du arbeitest: wie lange deine Sitzungen dauern, welche Modelle du verwendest und woran du arbeitest. Eine Zahl aus jemand anderem Sitzungen – meiner eingeschlossen – sagt über deine nur wenig aus. Deshalb blickt tokendoctor zuerst auf deine eigenen.

**① Zurückblick auf die letzten 30 Tage.** `/tokendoctor:sessions` spielt jede deiner Sitzungen Anfrage für Anfrage mit Kompaktierungsfenstern von 200K, 300K, 400K und 600K ab und zeigt, was jede gekostet hätte. Es liest nur deine Transkripte, tätigt keine Modellaufrufe und ändert nichts. Die Zahl ist eine Obergrenze: Eine Wiedergabe kann nicht sehen, welche Arbeit das Modell nach einer Zusammenfassung wiederholt hätte.

**② Nur ändern, was sich deinen Sitzungen zufolge lohnt – und rücknehmbar.** `/tokendoctor:optimize` schlägt aufgrund dieser Zahlen Änderungen vor und prüft deine Einstellungen anhand der Claude-Code-Dokumentation; angewendet werden nur die, die du auswählst, jeweils vorher als Diff angezeigt. Mit `/tokendoctor undo` kannst du jede davon rücknehmen.

**③ Optional: verschieben statt zusammenfassen.** Wenn Claude Code das Gespräch zusammenfassen würde, verwirft tokendoctor stattdessen alte Werkzeugausgaben und behält jede Nachricht. Es gibt keinen Modellaufruf, daher dauert es Millisekunden statt einer Minute.

## Install

```bash
claude plugin marketplace add localixai/tokendoctor
claude plugin install tokendoctor@tokendoctor
```

Starte Claude Code neu und führe `/tokendoctor:sessions` aus, um zu sehen, was deine letzten 30 Tage bei jedem Fenster gekostet hätten. Es wird nichts geändert, bis du etwas auswählst.

## Was es in meinen Sitzungen gefunden hat

Jede Anfrage sendet das gesamte Gespräch an das Modell. Bei Modellen mit einem 1M-Fenster kompaktiert Claude Code erst nahe 967K Tokens, deshalb ist das Ende einer langen Sitzung der teure Teil. Bei mir gingen zwei Drittel der Kosten im Hauptthread auf Anfragen mit mehr als 400K Kontext zurück.

Deshalb habe ich ein 400K-Fenster und Sonnet für Subagenten eingestellt. Verglichen mit dem Monat davor und der Woche danach – etwa 23K bzw. 19K Anfragen im Hauptthread – sank der Kontext pro Anfrage von 412K auf 219K und die Kosten pro Anfrage um 38 % nach API-Listenpreisen. Das ist ein Vorher-Nachher-Vergleich einer Person, kein kontrolliertes Experiment.

Der Nachteil sind mehr Zusammenfassungen, und jede bedeutet eine Pause: durchschnittlich 79 Sekunden in meinen Sitzungen. Genau dafür gibt es das Verschieben. Deine Sitzungen können etwas ganz anderes zeigen – deshalb schaut man zuerst auf sie.

## Was der Benchmark zeigt

Beim [Benchmark](bench/README.md) baut Claude Code ein TypeScript-Projekt gegen Tests, die es nicht ändern darf; ein Lauf zählt also nur, wenn die Tests bestehen. Die Kosten gelten pro Aufgabe mit Haiku 5.5:

| Vergleich | Kosten | Zeit |
| --- | --- | --- |
| Verschieben statt Zusammenfassung, ein Arbeitstag | −19 % | −33 % |
| Verschieben statt Zusammenfassung, ein Eval-Harness | −35 % | −28 % |
| Verschieben statt Zusammenfassung, eine kurze Aufgabe | +6 % | −17 % |
| Nur die Einstellungsempfehlungen, gegen Claude Code im Auslieferungszustand | in 3 von 4 Läufen teurer | |
| Empfehlungen und Verschieben zusammen, eine Arbeitswoche | −11 % bis −21 % | |

Bei jedem Lauf bestanden alle Tests. Die Empfehlungen allein lohnten sich hier nicht, weil diese Aufgaben selten 400K überschreiten – dort beginnt das Fenster eine Rolle zu spielen. Wenn deine Sitzungen das ebenfalls nicht tun, zeigt dir deine Wiedergabe das, und du solltest dein Fenster unverändert lassen. Jeder Lauf, auch die Verlierer, steht in [bench/HISTORY.md](bench/HISTORY.md).

<p align="center">
  <img src="docs/dashboard.png" alt="Das tokendoctor-Dashboard des Autors: 57 % der Ausgaben gingen darauf, dass Claude das Gespräch erneut las" width="880"><br>
  <sub><code>/tokendoctor:dashboard</code>: wohin jedes Token ging, nach Tag, Modell, Subagent und Projekt. Eine lokale Datei; diese hier gehört mir.</sub>
</p>

## Befehle

| Befehl | Was er tut |
| --- | --- |
| `/tokendoctor:sessions [days]` | Spielt deine vergangenen Sitzungen (30 Tage oder `days`) mit kleineren Fenstern ab: was jedes eingespart hätte und wohin deine Tokens gingen. Nur lesend. |
| `/tokendoctor:audit` | Prüft deine Einstellungen, dein Gedächtnis und CLAUDE.md anhand der Dokumentation, nach Schweregrad geordnet. Nur lesend. |
| `/tokendoctor:dashboard [days]` | Öffnet ein lokales Dashboard aller Sitzungen auf diesem Rechner. |
| `/tokendoctor:optimize [focus]` | Schlägt aufgrund deiner Zahlen bis zu füf Änderungen vor und wendet die ausgewählten an. |
| `/tokendoctor [name] [value]` | Zeigt, erklärt oder ändert eine Einstellung, ohne Modellaufruf. |
| `/tokendoctor undo [n]` | Listet alle Änderungen von tokendoctor auf und nimmt eine zurück. |

Nichts verlässt deinen Rechner: Der einzige Netzwerkaufruf gilt einmal täglich zwei öffentlichen Dokumentationsseiten von Claude Code. Modelle wechselt es nie von selbst.

## Dokumentation

**[tokendoctor.localix.ai/docs](https://tokendoctor.localix.ai/docs)** enthält den Rest: die [38 Prüfungen](https://tokendoctor.localix.ai/docs/audit), jede [Einstellung](https://tokendoctor.localix.ai/docs/settings), [wie das Verschieben funktioniert](https://tokendoctor.localix.ai/docs/slide) (sowie Team- und Enterprise-Anmeldungen), die Befehle von der Shell aus, die [Messwerte](https://tokendoctor.localix.ai/docs/proof) und die [Grenzen](https://tokendoctor.localix.ai/docs/limits). Um an tokendoctor selbst zu arbeiten, siehe [CONTRIBUTING.md](CONTRIBUTING.md).

## Lizenz

MIT

## Quelle und Lizenz

- Originalautor: localixai
- Originalrepository: https://github.com/localixai/tokendoctor
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
