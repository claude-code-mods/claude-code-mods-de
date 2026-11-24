<h1 align="center">compact-adviser</h1>

<p align="center">
  <a href="https://github.com/kunchenguid/compact-adviser/blob/main/LICENSE"
    ><img
      alt="Lizenz"
      src="https://img.shields.io/badge/license-MIT-green?style=flat-square"
  /></a>
  <a
    href="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
    ><img
      alt="Plattform"
      src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
  /></a>
  <a href="https://x.com/kunchenguid"
    ><img
      alt="X"
      src="https://img.shields.io/badge/X-@kunchenguid-black?style=flat-square"
  /></a>
  <a href="https://discord.gg/Wsy2NpnZDu"
    ><img
      alt="Discord"
      src="https://img.shields.io/discord/1439901831038763092?style=flat-square&label=discord"
  /></a>
</p>

**compact-adviser** ist ein Agenten-Plugin, das eine einzige Frage beantwortet: Sollte ich jetzt `/compact` ausführen?

![Compact adviser status line: "Compact adviser: work appears completed or recorded. Run /compact to save tokens." shown above a terminal prompt](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/hint-status-line.png)

Es nutzt [Jev](https://typesafe.ai), um sofort zu beurteilen, ob sich die aktuelle Sitzung wahrscheinlich an einem Punkt befindet, an dem eine Komprimierung sicher möglich ist.

Es kann dir einen Hinweis geben, `/compact` auszuführen — oder auf Pi und Claude Code kann es das, wenn du es aktivierst, zur richtigen Zeit auch automatisch für dich tun. Codex CLI und Grok bieten nur Hinweise: Nichts außerhalb ihrer Sitzungen kann `/compact` auslösen.

Die Beurteilung besteht aus zwei Jev-Fragen mit je einem Satz in einer einzigen Anfrage (ist die Einheit fertig; handelt es sich um praktische Arbeit oder um Koordination), die im Code zu einer Punktzahl zusammengesetzt werden. Die Untergrenze für den Hinweis liegt bei 0,90, solange der Kontext weitgehend leer ist (bis etwa 10%), und sinkt bis etwa 90% Füllung hin auf 0,50 — ein falscher Hinweis kostet am meisten, wenn noch Platz ist. „Voll“ bedeutet den Punkt, an dem der Host komprimiert: bei Claude Code dessen automatische Komprimierungsschwelle, wenn aktiviert, anderswo das Fenster des Modells. Wenn du lieber deutlich vorher komprimieren willst (lange Kontexte kosten in jedem Zug mehr), lege ein Kontext-Budget fest: Die Untergrenze sinkt dann, wenn sich der Kontext dem kleineren Wert aus Budget und diesem Punkt nähert. Der automatische Modus ist dieselbe Schwelle, plus einer Bestätigung bei der ersten Nutzung.

## Schnellstart

Voraussetzungen: Node 22+ (22.18+ für Codex und Grok) sowie eine der Versionen [Pi](https://pi.dev) 0.82.0 oder neuer (geprüft auf **0.85.1**), Claude Code 2.1.274 oder neuer (geprüft auf **2.1.275**), Codex CLI 0.153.0 oder neuer (geprüft auf **0.153.4**) oder [Grok Build](https://docs.x.ai/build/overview) 1.0.34 oder neuer (geprüft auf **1.0.34**), dazu ein [TypeSafe-API-Key](https://console.typesafe.ai/settings/keys). Gib ihn als `TYPESAFE_API_KEY` in der Startumgebung an oder lege ihn in `./.env` im Arbeitsverzeichnis der Sitzung ab; Pi und Claude Code können ihn auch über ihre Einstellungen speichern, während Codex und Grok ein externes compact-adviser-CLI bereitstellen. Jev ist TypeSafes strukturiertes Entscheidungsmodell; dieses Paket stellt ihm zwei Klassifikationsfragen mit je einem Satz und bittet es nie, eine Zusammenfassung zu schreiben.

Die Installation des Pakets gilt als Zustimmung, geeigneten Checkpoint-Kontext an TypeSafe zu senden, sofern ein Key vorhanden ist und die anderen Produktvoraussetzungen erfüllt sind. Mit gesetztem `TYPESAFE_BASE` gehen dieser Kontext und der Key stattdessen an diese Basis.

### Pi

```sh
pi install npm:compact-adviser
```

Starte Pi neu oder führe `/reload` aus, dann `/compact-adviser`.
`/compact-adviser status` sollte `Key: env`, `Key: saved` oder `Key: .env` zeigen.

Installation aus Git: `pi install git:github.com/kunchenguid/compact-adviser` (`-l` für eine projektlokale Installation).

### Claude Code

Dieses Plugin nutzt Claude Mod, eine experimentelle Funktion, die in deiner Umgebung `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` erfordert.

```sh
claude plugin marketplace add kunchenguid/compact-adviser
claude plugin install compact-adviser@compact-adviser
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
```

Danach `/compact-adviser`.

### Codex CLI

Codex wird **nur unter macOS und Linux** unterstützt. Die Hooks des Plugins laufen über POSIX-`sh`, passend zum Plattform-Badge dieses Repositories; Windows wird in dieser Fassung nicht unterstützt.

```sh
codex plugin marketplace add kunchenguid/compact-adviser
codex plugin add compact-adviser@compact-adviser
```

Starte Codex neu und prüfe den Hook einmal in `/hooks`, damit er als vertrauenswürdig gilt. Nach einem abgeschlossenen Checkpoint erscheint der Rat als Zeile `↳ Hook · Compact adviser: ...` unter der Antwort.

Codex bietet **nur Hinweise**: Es gibt keine Stelle, über die ein anderer Prozess `/compact` ausführen könnte, also gibt es dort keinen automatischen Modus. Einstellungen liegen in einem kleinen CLI statt in einem Slash-Befehl; bitte Codex um „compact-adviser status“, und das gebündelte Skill führt es aus, oder führe es selbst aus:

```sh
node "$(ls -d "${CODEX_HOME:-$HOME/.codex}"/plugins/cache/*/compact-adviser/*/ | tail -1)src/cli.ts" status
```

### Grok Build

Grok bietet **nur Hinweise**: Nichts außerhalb einer laufenden Sitzung kann `/compact` auslösen, auch hier gibt es also keinen automatischen Modus. Der Hinweis wird in die Statuszeile gezeichnet und gelangt nie in den Kontext des Modells.

```sh
grok plugin install kunchenguid/compact-adviser#packages/grok-plugin --trust
```

(Installiere aus dem Unterverzeichnis, nicht aus dem Repository-Stamm: Grok liest auch den Claude-Marketplace-Index in diesem Repo, ein einfaches `grok plugin marketplace add` bietet also zwei Plugins mit demselben Namen an und lehnt eine Installation ohne Pfadangabe ab.)

Danach zwei einmalige Schritte, denn Grok überlässt keinem Plugin eines davon. Starte Grok und führe aus:

```
/compact-adviser-install
```

Das schreibt `${GROK_HOME:-~/.grok}/hooks/compact-adviser.json`, denn **Grok 1.0.34 listet die `hooks/hooks.json` eines Plugins, lädt sie aber nie in eine Sitzung**. Hooks im eigenen Grok-Homeverzeichnis sind immer vertrauenswürdig, sonst ist nichts nötig; lösche die Datei, um sie zu entfernen. Von einer Shell aus ist es `node "$(node -e 'const l=JSON.parse(require("child_process").execFileSync("grok",["plugin","list","--json"],{encoding:"utf8"})); const p=(Array.isArray(l)?l:[]).find(x=>x&&x.name==="compact-adviser"); if(!p||typeof p.path!=="string") throw new Error("compact-adviser is not installed"); process.stdout.write(p.path)')/bin/adviser.ts" install`. Nach `install` löst `${GROK_HOME:-~/.grok}/compact-adviser/adviser.sh` das aktuell installierte Plugin auf dieselbe Weise auf.

Füge dann den von `install` ausgegebenen `[ui.status_line]`-Block in die genannte `config.toml` ein und starte Grok neu. Die Statuszeile ist standardmäßig aus und kann nur von deiner eigenen Konfiguration eingeschaltet werden — kein Plugin und kein Repository kann das. Grok hat eine einzige Statuszeile, dieses Script zeichnet deshalb auch die eingebauten Segmente (`cwd`, `model`, `context`). Im minimalen Render-Modus gibt es gar keine Statuszeile.

Speichere den TypeSafe-Key auf Grok als `TYPESAFE_API_KEY` oder in einer `.env` im Arbeitsverzeichnis, oder mit dem `key`-Befehl des CLIs aus einer Shell außerhalb von Grok. Tippe keine Geheimnisse nach einem Grok-Slash-Befehl; Grok hängt diese Wörter an das Modell an.

## Wenn es nichts tut

| Symptom | Ursache |
| --- | --- |
| TypeSafe verlangt Bezahlung (HTTP 402) | Prüfe Abrechnung und Guthaben des TypeSafe-Kontos; bloßes Warten löst eine Zahlungsanforderung nicht. Der Kontext bleibt unverändert. |
| `Key: missing` in `/compact-adviser status` (Pi, Claude Code) oder `/compact-adviser` (Grok) | Kein `TYPESAFE_API_KEY` in Startumgebung, gespeicherten Einstellungen oder `./.env` im Arbeitsverzeichnis der Sitzung |
| Kein `/compact-adviser`-Befehl in Claude Code | `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` ist nicht genau `1` |
| Befehl vorhanden, kein Hinweis | Der Kontext liegt unter dem festen Minimum von 40.000 Token, die Sitzung ist nicht untätig, oder der letzte Zug war keine abgeschlossene Endantwort |
| Claude Code: „nonessential traffic“ | `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` blockiert Netzwerkanfragen des Plugins |
| Kein Hinweis in Codex | Der Hook ist nicht vertrauenswürdig (in `/hooks` prüfen), Node älter als 22.18, oder der Hook findet Node gar nicht — Codex baut seinen PATH neu, setze `COMPACT_ADVISER_NODE` auf einen absoluten `node`-Pfad |
| Grok: gar keine Hinweiszeile | `[ui.status_line]` fehlt in dem von `install` genannten `config.toml`, oder Grok ist im minimalen Render-Modus |
| Grok: kein Hinweis nach einem abgeschlossenen Zug | `/compact-adviser-install` wurde nicht ausgeführt, also beurteilt kein Stop-Hook |
| Pi print / RPC / JSON, Claude `-p` oder `codex exec` | Der Adviser bleibt in zuverlässig erkannten nicht-interaktiven Sitzungen untätig |
| Gar nichts, in keinem Host | `COMPACT_ADVISER_DISABLE` ist auf einen Wert gesetzt, der als wahr gilt |

## Umgebungsvariablen

| Variable | Wirkung |
| --- | --- |
| `TYPESAFE_API_KEY` | Der Jev-Key; wenn er fehlt, werden ein gespeicherter Key oder `./.env` im Arbeitsverzeichnis verwendet |
| `TYPESAFE_BASE` | Ersetzt die TypeSafe-API-Basis-URL, standardmäßig `https://api.typesafe.ai`; die Anfrage geht an `<base>/v1/systemone`, ein abschließender Schrägstrich wird entfernt. Nur aus der Startumgebung gelesen, nie aus gespeicherten Einstellungen oder `./.env`. Es muss eine `https`-URL sein; einfaches `http` wird nur für einen Loopback-Host akzeptiert (`127.0.0.1`, `[::1]`, `localhost`). Jeder andere Wert oder einer mit Zugangsdaten, Query oder Fragment ist ein Konfigurationsfehler: keine Anfrage und kein Rat |
| `COMPACT_ADVISER_DISABLE` | `1`, `true`, `yes` oder `on` (beliebige Schreibweise) macht die Sitzung untätig: keine TypeSafe-Anfrage, kein Hinweis, keine automatische Komprimierung, kein Befehl. Es gewinnt über einen gespeicherten `hint`- oder `auto`-Modus |
| `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Nur Claude Code; muss genau `1` sein, damit der Mod lädt |
| `COMPACT_ADVISER_NODE` | Nur Codex; absoluter Pfad zu einer Node-22.18+-Executable, wenn der Hook auf seinem neu gebauten PATH keine findet |

Exportiere `COMPACT_ADVISER_DISABLE=1` für unbeaufsichtigte Agenten-Sitzungen, in denen niemand den Rat lesen kann.

## Was an TypeSafe gesendet wird

| Enthalten | Nicht gesendet |
| --- | --- |
| Begrenzte Nutzer-Vorgaben, bis zu den letzten 64 sichtbaren Antworten und Werkzeugergebnissen (gekürzt), kurze Auszüge aus Werkzeugergebnissen, eine vorhandene Zusammenfassung, Namen gespeicherter Artefakte, Auslassungsmarkierungen | System-Prompts, verborgenes Denken, Bilder, Umgebungsvariablen, der API-Key im Modellkontext und Anfragekörper, vollständige Transkripte |
| Nach bestem Bemühen Schwärzung bekannter Key-Muster und offensichtlich sensibler Dateiergebnisse | Eine Garantie. Deinstalliere oder setze den Modus Off für Material, das den Rechner nicht verlassen darf |

Anfragen gehen an `https://api.typesafe.ai/v1/systemone`, bzw. an `<TYPESAFE_BASE>/v1/systemone`, wenn gesetzt, sind auf 32.000 serialisierte UTF-8-Bytes begrenzt und behandeln einen Fehler nie als zustimmendes Urteil.
Der TypeSafe-API-Key gelangt nie in den Modellkontext oder den Anfragekörper; er wird als Authorization-Header zur Authentifizierung des Aufrufs gesendet.
Details: [SECURITY.md](https://github.com/kunchenguid/compact-adviser/blob/main/SECURITY.md).

## So funktioniert es

```
abgeschlossener Zug
      │
      ▼
┌───────────────────┐
│ günstige lokale Gates │  Modus, 40k-Minimum, untätige Sitzung, Key, Cooldowns
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ TypeSafe Jev      │  fertig × Form-Punktzahl, Untergrenze sinkt 0,90→0,50 mit Nutzung
└─────────┬─────────┘
          ▼
 Hinweis: /compact ausführen   oder, mit explizitem auto, native Komprimierung
```

Automatische Komprimierung gibt es auf Pi und Claude Code. Auf Codex ergibt dieselbe Beurteilung immer nur den Hinweis, als `↳ Hook ·`-Zeile im Verlauf. Auf Grok sind die beiden Hälften getrennte Prozesse: Ein `Stop`-Hook beurteilt und speichert ein Urteil, das `[ui.status_line]`-Script liest es und zeichnet den Hinweis. Der Grok-Hook erlaubt immer das Stoppen und gibt nichts aus, damit ein Hinweis nie an das Modell zurückfließen kann.

Auf Claude Code führt eine optionale `beforeCompactPrompt`-Einstellung (standardmäßig leer; in `/config` setzen) einen Zug vor dieser automatischen Komprimierung aus, und erst nachdem der automatische Modus bestätigt wurde. Setze sie auf `/stow`, um zuerst den Befehl `stow` auszuführen. Claude Code erweitert Slash-Befehle oder `@file`-Erwähnungen nicht in einem Prompt, den ein Plugin einreicht, und lehnt einen Plugin-Prompt ab, der mit `/` beginnt — ein Wert, der mit `/` beginnt, wird daher als Befehl ausgeführt statt als Text an das Modell gesendet. Wenn du dazwischen deinen eigenen Prompt sendest oder einen Befehl ausführst, oder dieser Zug unterbrochen wird, einen Fehler hat oder nicht innerhalb von 5 Minuten fertig wird, wird nichts komprimiert. Hinweis-Modus, aus und eine leere Einstellung bleiben unverändert. Pi, Codex und Grok haben diese Einstellung nicht.

## Verwendung

| Befehl | Wirkung |
| --- | --- |
| `/compact-adviser` (Pi und Claude Code) | Einstellungen (Modus, Minimum, Anfrageprotokoll, TypeSafe-API-Key) |
| `/compact-adviser auto` / `hint` / `off` (Pi und Claude Code) | Speichert diesen Modus; auto verlangt eine Bestätigung bei erster Nutzung |
| `/compact-adviser status` (Pi und Claude Code) | Modus, Minimum, Budget, Kontext, Key-Quelle (`env` / `saved` / `.env` / `missing`), Cooldown |
| `/compact-adviser threshold 60000` (Pi und Claude Code) | Speichert ein absolutes Token-Minimum |
| `/compact-adviser budget 450000` / `budget off` (Pi und Claude Code) | Speichert ein Kontext-Budget: Die Hinweis-Untergrenze ist bei dieser Token-Anzahl vollständig gelockert, oder beim Komprimierungspunkt des Hosts, falls kleiner (standardmäßig aus) |
| `/compact-adviser snooze` / `dismiss` (Pi und Claude Code) | Unterdrückt die nächsten drei Wechsel, oder löscht den aktuellen Hinweis |
| `beforeCompactPrompt` in `/config` (Claude Code) | Optionaler Text, der vor automatischer Komprimierung ausgeführt wird. Standardmäßig leer. `/stow` führt diesen Befehl aus |
| `/compact-adviser` (Grok) | Status zeigen; keine Argumente hinzufügen, weil Grok sie an das Modell sendet |
| `/compact-adviser-hint` / `/compact-adviser-off` (Grok) | Hinweis-Modus speichern oder den Adviser deaktivieren |
| `/compact-adviser-snooze` / `/compact-adviser-dismiss` (Grok) | Unterdrückt die nächsten drei Wechsel, oder löscht den aktuellen Hinweis |
| `/compact-adviser-install` (Grok) | Registriert die Hooks und gibt den Statuszeilen-Block zum Einfügen in die genannte `config.toml` aus |
| `${GROK_HOME:-$HOME/.grok}/compact-adviser/adviser.sh threshold 60000` (Grok-Shell) | Speichert ein absolutes Token-Minimum; `budget <tokens\|off>` speichert ein Kontext-Budget; `help` listet die übrigen nur in der Shell verfügbaren Einstellungen |

Auf Codex sind dieselben Befehle Argumente an `src/cli.ts` des Plugins (`status`, `hint`, `off`,
`threshold`, `budget <tokens|off>`, `log on|off`, `key set|clear|status`) statt eines Slash-
Befehls, denn Codex-Plugins können keinen Befehl mit Code dahinter registrieren. Codex hat kein
Snooze oder Dismiss: Das CLI kann nicht sagen, welche Sitzung aktuell ist.

## Beurteilungsprofile

Ein optionales [Beurteilungsprofil](https://github.com/kunchenguid/compact-adviser/blob/main/docs/judge-profiles.md) ändert die zwei Fragen, die Gewichtung oder den Verlauf der Untergrenze, ohne die mitgelieferten Standardwerte zu ändern. Alle vier Hosts akzeptieren denselben begrenzten JSON-String in der `profile`-Einstellung. Behalte den Hinweis-Modus, während du ein Profil auswertest. Ungültige Profile deaktivieren den Rat, und das Laden eines Profils gewährt nie die Zustimmung zum automatischen Modus.

## Auswertung

Die lokale Beurteilungs-Auswertung nutzt echte Sitzungs-Checkpoints, um zu bewerten, wann der Adviser `/compact` vorschlagen sollte. Die Kurve unten stammt aus einem Gold-Datensatz mit Follow-up-Bezug (96 Checkpoints, 40 Sitzungen): Wenn sich das Kontextfenster füllt, lockert sich die Punktzahl-Schwelle von **0,90** (≤10% genutzt) auf **0,50** (≥90% genutzt), sodass die **Erinnerungsquote steigt**, während die Präzision hoch bleibt — Token-Ersparnisse werden bevorzugt, wenn eine Komprimierung ohnehin bald erzwungen wird.

![Use Jev to answer "should I /compact now?" — precision stays high while recall rises as context used goes from ≤10% to ≥90%](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/eval-usage-floor-curve.png)

Das Auswertungsgerüst liegt in [packages/pi-extension/eval/](https://github.com/kunchenguid/compact-adviser/blob/main/packages/pi-extension/eval/README.md). Es ist kein veröffentlichter Datensatz: Richte es auf deine eigenen Sitzungen und behalte die Transkripte lokal.

## Quelle und Lizenz

- Originalautor: kunchenguid
- Originalrepository: https://github.com/kunchenguid/compact-adviser
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
