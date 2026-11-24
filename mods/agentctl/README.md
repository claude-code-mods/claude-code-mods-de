# agentctl — Agent Control Plane für eine Claude-Code-Sitzung

Getestet mit **Claude Code 2.1.288** (headless) und **2.1.289** (interaktiv, nachdem der Host sich automatisch aktualisiert hatte) (`claude plugin validate .`, `claude plugin test .`: 203 Tests); 0.2.x wurde am 2.1.289 erneut live verifiziert (§ Live verifiziert, 0.2.x).
Die Mods-API ist als zwischen Releases veränderlich markiert; die Typdeklarationen, die der Host nach
`.claude-plugin/types/` schreibt, sind maßgeblich für die installierte Version. Führe `claude plugin validate .`
nach jedem Claude-Code-Upgrade aus.

Design: `docs/features/agent-control-plane-mod/` in diesem Repository (Anforderungen, Machbarkeitsstudie,
technische Spezifikation, Anforderungstickets). Dieses Verzeichnis gehört nicht zum sd0x-dev-flow-Plugin: Die Installation
des Plugins installiert den Mod nicht. Um ihn zu installieren, führe `/agentctl-setup` aus (es prüft den Host, installiert
`agentctl@sd0xdev-marketplace`, nachdem du zugestimmt hast, und baut deine erste Aufgaben-Zeile; `/agentctl-setup --task`
und die Workflow-Skills entwerfen stattdessen einen Vorschlag für dich), oder lade ihn für eine
Sitzung mit `claude --plugin-dir mods/agentctl`.

## Erster Lauf

Tippe, was du tust — du brauchst keinen anderen Befehl:

```text
/agentctl 測試一下這個新功能
```

1. Der Mod legt eine Anfrage für Claude in dein Prompt-Feld (er sendet sie nie). Drücke **Enter**.
2. Claude liest das Projekt und entwirft einen Umfang — was es ändern darf, welche Prüfungen als Nachweis zählen,
   was „fertig“ bedeutet — und schreibt ihn mit dem im Mod gebündelten Helfer (`bin/propose.mjs`). Wenn
   etwas unklar ist, fragt es dich, statt Berechtigungen zu erfinden.
3. Am Ende dieser Antwort zeigt der Mod den Umfang und bietet `/agentctl accept <digest>` im Feld an:
   **Tab**, dann **Enter**. Das Akzeptieren bindet den Umfang; es startet keine Arbeit.
4. Bitte Claude zu beginnen. `/agentctl` zeigt, wo die Dinge stehen und was als Nächstes zu tun ist — die Prüfungen
   ausführen, dann `/agentctl handoff` — und `/agentctl help` listet den Rest.

Ein Tester, der das Design nicht gelesen hatte, ging die Schritte 1–4 und die Übergabe ohne Hilfe durch (§ Unbegleiteter Lauf).

Das Senden der Anfrage ist ein gewöhnlicher Claude-Zug; der Mod selbst ruft kein Modell auf. Antworten verwenden Traditional
Chinese, wenn dein Ziel auf Chinesisch geschrieben ist, sonst Englisch — eine einfache Heuristik, keine
Sprachumgebungs-Erkennung.

## Was es tut

| Funktion | Wie |
|---|---|
| Aufgaben-Umfang | Claude entwirft einen Vorschlag (`/agentctl-setup --task` oder `/feature-dev`, `/bug-fix`, `/refactor`, wenn der Mod installiert ist); der Mod zeigt eine Vorschau, und `/agentctl accept`, in dein eigenes Prompt-Feld getippt, bindet genau das, was in der Vorschau stand — siehe § Vorschläge. Auch `/agentctl task set <json>`, in dein Prompt-Feld getippt, bindet eine Aufgabe an den Worktree. Werkzeug-Ausgaben, Dateien und Nachrichten können das nicht ändern — nur ein Befehl, den du selbst tippst. Die Bindung gilt pro Worktree, dein eigenes `task set` / `task clear` in einer anderen Sitzung desselben Worktrees ersetzt oder löscht sie also doch. Aufgaben-Datensätze und Übergaben werden pro Worktree geführt, dieselbe Aufgaben-ID in zwei Worktrees benennt also zwei getrennte Aufgaben. Ein Speicherfehler wird als solcher gemeldet, und die vorherige Aufgabe gilt weiter; eine Bindung, deren Datensatz fehlt, verweigert alles außer Lesezugriffen im Worktree |
| Verweigerung | Eine Ablehnungsliste. Erkannte direkte Produktions-Schreibzugriffe und Git-Schreibzugriffe auf Remotes werden verweigert **mit oder ohne Aufgabe**; während eine Aufgabe gebunden ist, werden auch deren eigene `forbid`-Einträge und Änderungen außerhalb ihrer Wurzeln verweigert. Änderungs-Wurzeln binden die Edit-Werkzeuge (Write, Edit, NotebookEdit); eine über eine Shell-Umleitung geschriebene Datei ist ein Bash-Befehl, den der Mod nicht einordnen kann, und geht daher an den Host — die Verweigerung sagt Claude, dasselbe Ergebnis nicht auf einem anderen Weg zu erreichen, aber Wurzeln sind keine Sandbox. Alles, was der Mod nicht einordnen kann — Skripte, zusammengesetzte Shell, unbekannte Werkzeuge — geht an den eigenen Berechtigungsdialog oder Auto-Modus von Claude Code und wird als `delegated` protokolliert. Eine nachgelagerte Ablehnung wird nie abgeschwächt und eine Erlaubnis nie erzeugt. **Best-Effort**: Der Mod liest jeden Werkzeugaufruf, nie den Inhalt eines Skripts oder die von ihm gestarteten Befehle, ein Push in einem Skript ist also Sache des Hosts und jenes Workflows, ihn zu autorisieren |
| Nachweise | Ein Lauf zählt, wenn er zu einem deklarierten `check`-Executor passt — zuerst seine Worte, sodass zusätzliche Argumente weiterhin zählen und er weniger prüfen darf als deklariert, während eine Pipe, Umleitung oder ein Wrapper (`npm test \| grep pass`) nicht zählt; die Accept-Antwort und `/agentctl` nennen jede Prüfung als eine Zeile, die zu ihr passt, oder — wenn der Formatterer ein Wort nicht in einem Stück zitieren kann — als ihre JSON-Worte, die nicht passen, wenn man sie unverändert kopiert (eine korrekt zitierte Schreibweise derselben Worte passt). Ein passender Aufruf wird von baumbezogenen Git-Ablesungen eingeschlossen (Executoren werden zuerst abgeglichen, eine deklarierte `git status`-Prüfung ist also eine Prüfung); eine spätere Änderung zeigt das Ergebnis binnen 30 s als veraltet; eine Hintergrundprüfung bleibt „Abschluss unbeobachtet“, bis ein terminales Ergebnis gesehen wird. Nachweise gehören zu der Aufgabe und der Policy-Version, unter der sie beobachtet wurden, und eine Ablesung mit teilweiser Abdeckung wird nie als verifiziert gelistet |
| Leiste | Das Band über dem Prompt ist kompakt: Aufgabe, Laufzeit und deren Dauer, was dich braucht, die Gate-Ablesung mit ihrem Alter (und `stale` nach 30 s), die letzte Übergabezeit. `/agentctl` ist eine kompakte Statusantwort — der nächste Schritt, die Aufgabe, was dich braucht, das Gate und die Nachweise; `/agentctl status --details` ergänzt Speichergesundheit, Laufzeit, Kontext und das 5-h-Fenster. Die Zeilen für Gate, Kontext und Fenster nennen ihre Quelle und ihr Alter oder lauten `missing` / `unavailable`, und jede Nachweiszeile nennt ihr Ergebnis, ihre Frische, Abdeckung und ihr Alter |
| Übergabe | `/agentctl handoff` — acht Antworten aus Datensätzen, kein Modell, kein Netzwerk, kein Prozess; beim Wiederöffnen vollständig protokolliert (nur Transkript); das bloße `/agentctl` zeigt nur darauf, `/agentctl last` gibt es aus |
| Stopp | `/agentctl stop` — speichert die Übergabe, fordert den Abbruch des laufenden Zugs an, listet verfolgte Vorgänge; nie „alles gestoppt“ |

## Vorschläge

Claude schreibt `~/.claude/agentctl/proposals/<URI-encoded worktree>.json` (außerhalb des Worktrees) über
den gebündelten `bin/propose.mjs` des Mods (den `/agentctl <goal>`-Pfad) oder sd0x-dev-flows
`agentctl-setup.js propose` (Setup und Workflow-Skills); beide wenden zuerst die eigene Validierung des Mods an. Bei Sitzungsbeginn und am
Ende jedes Haupt-Zugs liest der Mod ihn einmal, validiert ihn erneut und behält das **tatsächlich gültige** Objekt:
Der Worktree kommt aus der Sitzung, ein Vorschlag, der einen anderen Worktree benennt, gegen eine Aufgabe entworfen wurde,
die nicht mehr gebunden ist, oder sich mit einer eingebauten Klasse überschneidet, wird verweigert (der Grund wird protokolliert). Die Vorschau
listet jede akzeptierte Berechtigung mit einem SHA-256-Digest (24 Hex) im Transkript und im Band.
Jeder Eintrag wird bis zu 160 Zeichen angezeigt; ein längerer endet mit `…`, und der Digest — und was accept
bindet — umfasst weiterhin alles, verwirfe also einen Entwurf, dessen Einträge du nicht vollständig siehst.

| Befehl | Wer | Tut |
|---|---|---|
| `/agentctl proposal` | jeder | Gibt die wartende Vorschau aus |
| `/agentctl accept [digest prefix]` | **nur dein Prompt-Feld** | Bindet das beibehaltene Objekt — nie die Datei erneut gelesen — wenn sich die gebundene Aufgabe seit der Vorschau nicht geändert hat |
| `/agentctl discard` | jeder | Verwirft den wartenden Vorschlag; die gebundene Aufgabe bleibt |

Eine spätere Änderung der Datei erzeugt eine neue Vorschau und einen neuen Digest; ein älterer Digest passt nicht mehr.
Gleichzeitige Sitzungen an einem Worktree teilen sich eine Bindung und einen Speicher, die über
Sitzungen hinweg nicht atomar sind: akzeptiere in der Sitzung, die die Vorschau gezeigt hat.

## Aufgaben-JSON

```json
{
  "goal": "investigate the quiz service timeout",
  "allow": ["edit"],
  "editRoots": ["src", "tests"],
  "forbid": ["terraform apply"],
  "executors": [{ "argv": ["npm", "test"], "check": true }],
  "needsUser": [["npm", "publish"]],
  "tools": ["mcp__docs__search"],
  "acceptance": ["unit tests pass on the final tree"]
}
```

Eingebaute verbotene Klassen gelten mit oder ohne Aufgabe, zusätzlich zu den eigenen einer Aufgabe: Produktions-Schreibzugriffe (`kubectl apply|delete|patch|rollout|scale|edit|replace`,
`helm install|upgrade|uninstall|rollback`, `gcloud … deploy|delete|update`) und Git-Schreibzugriffe auf Remotes
(`git push`, `gh pr merge`). Geheimnisse gehören nie in eine Aufgabe: ein credential-artiger Wert in einem Policy-Feld
wird verweigert.

`needsUser` fragt nur dort, wo ein Mensch beim Antworten gesehen wurde: das interaktive Terminal unter den
Berechtigungsmodi `default` (manuell), `acceptEdits` und `auto` (`lib/verdict.js`). Der Modus wird
bei jedem Prompt und jedem Werkzeug-Ende aus den klassischen Hook-Eingaben gelesen; bis einer gesehen wurde, und auf jeder anderen
Fläche oder in jedem anderen Modus — `-p`, `dontAsk`, `plan`, `bypassPermissions`, Desktop, VS Code, mobil — wird
ein `needsUser`-Aufruf verweigert. Ein Moduswechsel mitten im Zug wird beim nächsten Werkzeug-Ende gesehen.

## Was es nicht ist

- **Keine Isolationsgrenze.** Es läuft mit deinen Berechtigungen. Produktions-Read-only ist die Aufgabe
deiner Zugangsdaten und des IAM/RBAC des Ziels.
- **Nicht die einzige Linie.** Wenn der Host seinen Hook überspringt (Mod deaktiviert, Worker-Absturz), verweigert hier nichts.
  Halte benannte gefährliche Befehle in deinem eigenen `permissions.deny`, zum Beispiel:

  ```json
  { "permissions": { "deny": ["Bash(kubectl delete:*)", "Bash(kubectl rollout:*)", "Bash(helm upgrade:*)"] } }
  ```

  Diese Regeln passen auf Befehlstext, nicht auf Programme (`git -C . push` ist ein anderer Text), weshalb
  es beide Ebenen gibt. `Bash(git push:*)` bleibt absichtlich außen vor: sd0x-dev-flows `/push-ci` führt es aus.
- Ein anderer Mod kann ein Urteil an `tool.check` ändern; dieser Mod legt das in `/agentctl policy` offen.
- Autorisierte Executoren (z. B. `npm test`) laufen mit unklassifizierten Wirkungen.

## Entwickeln

```bash
cd mods/agentctl            # vom Repository-Wurzelverzeichnis aus
claude plugin validate .   # hooks und $-Aufrufe: kein $.model.*, $.http.*, $.tool.register, $.prompt.submit (fill/suggest/read erlaubt)
claude plugin test .       # jede *.test.ts unter tests/
```

## Release

Der Mod wird eigenständig versioniert und unter `agentctl-v<version>`-Tags veröffentlicht
(`.github/workflows/release-agentctl.yml`), getrennt von sd0x-dev-flows Releases. Claude Code cacht ein
installiertes Plugin nach Version, eine Änderung an allem außer diesem README oder `tests/` braucht also einen Versionssprung:
erhöhe `"version"` in `.claude-plugin/plugin.json` und führe dann `node .github/scripts/agentctl-version.js update`
vom Repository-Wurzelverzeichnis aus (oder `/bump-version agentctl`). CIs Version-Sperre schlägt fehl, bis beides erledigt ist, und
CI führt hier außerdem `claude plugin validate` und `claude plugin test` aus.

## Live verifiziert (2026-10-04, Scratch-Repository: headless `claude -p --plugin-dir` auf 2.1.288, interaktives tmux auf 2.1.289)

Diese Zeilen halten Version 0.1.0 fest. Seit 0.2.0 wird ein unklassifizierter Aufruf an den Host delegiert, statt
verweigert zu werden, und es gibt die Vorschlags-Befehle; die 0.2.x-Zeilen folgen der Tabelle.

| Prüfung | Ergebnis |
|---|---|
| Laden und `/agentctl` unter `-p` | Lädt nur für die Sitzung; antwortet in ~3,7 s ohne Modell-Zug |
| `task set` aus einem `-p`-Prompt | Verweigert: ein `-p`-Prompt ist nicht als `composer` gestempelt. Headless-Läufe können keine Aufgabe setzen; setze sie aus einem interaktiven Prompt |
| Verbotene und unklassifizierte Bash-Aufrufe | Vor dem Ausführen verweigert, Regel benannt (`task-forbid: …`, `unclassified: python3 has no adapter`) |
| Ein erlaubter Lesezugriff (`git status`) | Ging an den eigenen Berechtigungspfad des Hosts und lief |
| Eine Prüfung mit Exit-Code ungleich null (`sh check.sh` → exit 1) | Als `error` festgehalten: ein Bash-Exit ungleich null erreicht den Mod als `isError` |
| Nachweis-Klammer | Vorher-/Nachher-Ablesungen festgehalten, Abdeckung `git-hybrid` |
| Zwei gleichzeitige Sitzungen | Beide Sitzungsdatensätze geschrieben; der Aufgaben-Datensatz blieb |
| Restprozesse nach dem Beenden | Keine |
| Kosten der Baum-Ablesung | ~90 ms mit 500 geänderten/unverfolgten Dateien; ~75 ms in einem sauberen Repository mit 974 Dateien |
| 5-h-Fenster nach einem Modell-Zug (V7) | `1% (resets …)` vom Host gelesen, mit seiner Quelle und seinem Alter |
| Hintergrundprüfung (V5, Hintergrundhälfte) | Vom Task-Hinweis des Hosts geschlossen (`<task-id>`, `<status>`) als `error` — kein Polling nötig. `TaskGet` ist das Todo-Listen-Werkzeug; `GetTask` liest Hintergrundaufgaben |
| Subagenten-Werkzeugaufrufe (V4) | Der `danger-cmd` eines Subagenten wurde von derselben Regel verweigert |
| `ask` unter `-p` (V3, nur `-p`) | Mit einer Probe-Kopie, die `ask` beantwortet, führte keine der getesteten Headless-Konfigurationen (mit und ohne Allow-Regel für Bash) den Befehl auf 2.1.288 aus — das `ask` der Probe wurde nicht automatisch genehmigt |
| `/agentctl stop` unter `-p`-Stream-Eingabe (V6) | Die Eingabe wurde verarbeitet, nachdem der Zug geendet hatte, `immediate` greift dort also nicht; die Antwort sagte, es wurde kein laufender Zug beobachtet — nie „gestoppt“ |
| MCP-Werkzeugaufrufe (V4) | Ein Probe-MCP-Werkzeug wurde als unklassifiziert verweigert, bis die Aufgabe es benannte, dann lief es |
| Interaktives Terminal in tmux (V10) | Das Band rendert CJK-Zieltext korrekt bei 80 und 50 Spalten und bricht auf zwei bzw. drei Zeilen um |
| `/agentctl stop` während eines laufenden Vordergrund-Werkzeugs, interaktiv (V6) | Lief sofort (`immediate`); der Zug wurde abgebrochen; der Host verschob den laufenden Befehl in den Hintergrund, wo er weiterlief — die Antwort listete ihn als laufend und sagte nie „gestoppt“; als er fertig wurde, schloss der Hinweis des Hosts seinen Nachweis |
| `ask` im interaktiven Terminal im manuellen Modus (V3) | Mit einer Probe-Kopie, die `ask` beantwortet, zeigte der Host seinen eigenen Genehmigungsdialog mit dem Grund des Mods (Yes / No, kein „don't ask again“); Ablehnen unterbrach den Aufruf; erneuter Lauf mit dem ausgelieferten Code (manuell: Dialog; `dontAsk`: vom Mod verweigert) und mit einer Probe-Kopie unter `acceptEdits` und `auto` (Dialog) und `dontAsk` (verweigert). Die Strings, die der Host sendet, wurden aus einem schlichten klassischen `UserPromptSubmit`-Hook gelesen (2.1.289): `default`, `acceptEdits`, `auto`, `plan` und `dontAsk` kommen jeweils unverändert an; bei einem Modell ohne Auto-Modus (Haiku) fällt `--permission-mode auto` auf `default` zurück |
| Interaktiver Start (live gefunden) | `session.start` und das erste Rendern des Bands kommen zusammen an; zwei gleichzeitige Kontext-Aufbauten ließen das Band auf einem verwaisten Kontext zurück (`gates missing`). Behoben: ein gemeinsamer Aufbau |
| Installieren, deaktivieren, deinstallieren (Signal 12) | Aus einem lokalen Marketplace installiert, lief, deaktiviert (`/agentctl` verschwunden), deinstalliert: kein Mod-Prozess übrig, die `permissions`-Einstellungen byte-identisch. Der Host selbst ließ einen leeren `extraKnownMarketplaces`-Schlüssel, ein Plugin-Cache-Verzeichnis und eine leere `installed_plugins.json` zurück; der Mod hinterlässt nur seine eigene Speicherdatei. Alles wurde danach wiederhergestellt und byte-identisch verifiziert |

Entfernen: `--plugin-dir` installiert nichts und ändert keine Einstellung. Die eigenen Daten des Mods bleiben in
`~/.claude/plugins/store/agentctl_*.json` (Sitzungen, Aufgaben, Checkpoints) und entworfene Vorschläge in
`~/.claude/agentctl/proposals/`; lösche sie, um ihn zu entfernen.

## Live verifiziert, 0.2.x (2026-10-05, Scratch-Klon mit einem Scratch-Bare-Remote, 2.1.289, Haiku)

| Prüfung | Ergebnis |
|---|---|
| Direktes `git push` ohne gebundene Aufgabe (`-p`) | Vor dem Ausführen `remote-git-write` verweigert; das Remote blieb leer |
| Unklassifiziertes `python3 -c …` und ein Skript, das pusht (`/bin/bash -p push.sh`, `-p`) | Beide an den Host weitergegeben und ausgeführt; der Push des Skripts erreichte git (vom Scratch-Remote selbst abgelehnt, nicht vom Mod) — die offengelegte Skript-Blindheit |
| Von `agentctl-setup.js propose` geschriebener Vorschlag, interaktiver Start | Die Vorschau wurde bei Sitzungsbeginn mit dem Digest des Helfers protokolliert, und das Band benannte den wartenden Vorschlag |
| `/agentctl accept <digest>` am Prompt getippt | Band den in der Vorschau gezeigten Umfang als neue Aufgabe; ohne `base` gab der Helfer keinen Digest aus, der Mod füllte die gebundene Aufgabe ein und sein eigener Digest wurde akzeptiert |
| Eine deklarierte Prüfung, ein unklassifizierter Aufruf, eine Änderung außerhalb der Wurzeln, ein direkter Push (gebundene Aufgabe) | Prüfung als `current`-Nachweis festgehalten; `python3` delegiert und von `/agentctl events` als solches gelistet; die Änderung verweigerte `edit outside the allowed roots`; der Push verweigerte `remote-git-write` |
| Eine unverfolgte Datei, von außerhalb hinzugefügt | Die Prüfung las innerhalb von 32 s `stale (tree changed since)` |
| `/agentctl handoff`, Wiederöffnen, `/agentctl`, `/agentctl last` | Die Übergabe nennt, wann der Baum gelesen wurde, und listet die veraltete Prüfung unter „Nicht verifiziert“; beim Wiederöffnen zeigt das Transkript sie, das bloße `/agentctl` gibt eine Zeile mit Verweis aus, `/agentctl last` das Ganze |
| Live gefunden und in 0.2.1 behoben | Eine akzeptierte Vorschlagsdatei wurde von der nächsten Sitzung erneut als veralteter Entwurf gelesen (jetzt pro Worktree gemerkt); die eingebaute Verweigerung sagte „den Umfang der Aufgabe“, woraufhin Claude vorschlug, die Aufgabe zu erweitern (jetzt: „eine eingebaute Klasse, die keine Aufgabe aufheben kann“); Transkriptzeilen lauteten `agentctl: agentctl:` |
| Kosten der beiden `-p`-Proben | je 2–3 Züge, ≈ 0,06 $ je auf Haiku; die eigenen Antworten, Vorschauen und das Band des Mods rufen kein Modell auf |
| Unabhängiger adversariler Test (Codex, 2026-10-05), in 0.2.2 behoben | Ein absoluter oder großgeschriebener Programmpfad (`/usr/bin/git push`, `GIT push`) rutschte an den eingebauten Klassen vorbei; eine Änderungswurzel wie `../other` erlaubte Schreibzugriffe außerhalb des Worktrees; die Vorschlags-Obergrenze zählte Zeichen, nicht UTF-8-Bytes; ohne gebundene Aufgabe wurden delegierte Aufrufe nicht in `/agentctl events` festgehalten. Digest-Übereinstimmung, Prototyp-Schlüssel, Verweigerung fremder Worktrees, Nachweis-Partitionierung und Teilabdeckung hielten |

## Live verifiziert, 0.3.0 (2026-10-07, Scratch-Klon mit einem Scratch-Remote, interaktives tmux, Haiku)

Signal 13, auf 2.1.289 durchlaufen (Schritte 1–3) und erneut von Anfang an auf 2.1.292:

| Schritt | Ergebnis |
|---|---|
| `/agentctl 幫 …/README 加一行測試說明` | Die Anfrage füllte das leere Feld auf Traditional Chinese mit dem Helferpfad aus `$.plugin.root`; nichts wurde gesendet oder gebunden |
| Enter | Claude führte das `--help` des Helfers aus, las das Projekt, fand die Datei nicht und **fragte**, statt Umfang zu erfinden; nach der Antwort schrieb es den Vorschlag über den Helfer |
| Vorschau | Am Ende des Zugs gezeigt, mit seinem Digest und „bindet nur den Umfang; startet keine Arbeit“; das Band benannte den wartenden Vorschlag |
| Tab + Enter | Aus dem Vorschlag akzeptiert; die Antwort nannte den nächsten Schritt |
| „starte die Arbeit“ | Die Änderung innerhalb der akzeptierten Wurzel ging an den eigenen Berechtigungsdialog des Hosts; die deklarierte Prüfung wurde als aktueller Nachweis festgehalten |
| `/agentctl`, `handoff`, Wiederöffnen, `last` | Der Status führte mit dem nächsten Schritt; die Übergabe listete die Prüfung als verifiziert mit ihrer Lesezeit; das Wiederöffnen verwies darauf, `last` gab sie aus |
| Ein zweites Ziel mit gebundener Aufgabe | Der Helfer lieferte unter der gebundenen Aufgabe; die Vorschau sagte „Ersetzt: Aufgabe …“; Tab + Enter ersetzte sie |

Beim Durchlauf gefunden und behoben: auf 2.1.292 übernahm der eigene Vorschlag des Hosts für den nächsten Prompt („Bestätigen“) das Feld, sodass
Tab + Enter dieses Wort an Claude geschickt hätte — der Mod ersetzt nun den Vorschlag des Hosts durch die
Accept-Zeile, solange ein Vorschlag wartet, und bietet sie am Ende jedes Zugs erneut an; die letzte Zeile der Accept-Antwort blieb
Englisch in einer chinesischen Sitzung; mit gebundener Aufgabe sagte die Füll-Antwort „nothing is bound“. Festgehaltene
Zögern: Claude versuchte einmal, die eigenen Dateien des Mods außerhalb des Worktrees zu lesen (am Host-
Prompt abgelehnt); die Sprache der Kopie setzt sich mit jeder neuen Sitzung zurück.

## Unbegleiteter Lauf, 0.3.0 (2026-10-07, Codex als Erstnutzer, interaktives tmux, ein Wegwerf-Klon)

Der Tester erhielt nur `/agentctl <what you are doing>` und las weder `docs/` noch den
Code dieses Mods. Beschreiben → Enter → Vorschau (≈ 72 s, Umfang nur README, drei Prüfungen) → Tab + Enter → „starte die
Arbeit“ → `/agentctl` → `/agentctl handoff` war in sechs Schritten ohne fremde Hilfe fertig. In 0.3.1
behoben, was dabei auffiel:

| Gefunden | 0.3.1 |
|---|---|
| Die Übergabe las „Edits observed: 0“ neben einem geänderten README (Claude hatte über Bash editiert) | Die Zeile zählt Edit-Tool-Aufrufe und sagt, dass Bash-Änderungen in der Baum-Zeile stehen |
| Claude führte die Tests durch `grep` gepipet aus; die Übergabe nannte die Prüfung veraltet, während Claude sie für bestanden erklärte | Die Accept-Antwort nennt die auszuführenden Prüfungen wörtlich; `/agentctl` fragt erneut namentlich nach ihnen |
| Mit erledigter Arbeit sagte `/agentctl` noch immer „ bitte Claude, die Arbeit zu starten“ | Der nächste Schritt folgt den deklarierten Prüfungen: arbeite und führe sie aus, wiederhole, was nicht aktuell ist, oder übergib |
| Ein Write außerhalb der Wurzeln wurde verweigert, dann dieselbe Datei mit einem Bash-Heredoc geschrieben | Die Verweigerung sagt Claude, das Ergebnis nicht auf einem anderen Weg zu erreichen; dieser Abschnitt und § Was es tut halten fest, dass Wurzeln nur die Edit-Werkzeuge binden |
| Claude stellte eine Frage und schrieb im selben Zug einen Vorschlag | Die Anfrage zum Entwurf sagt, man solle auf die Antwort warten, bevor man schreibt |

Unverändert geblieben: Der Lauf dauerte Minuten, weil das eigene `CLAUDE.md` des Klons für eine Doku-Änderung zwei Review-Runden verlangt,
nicht wegen des Mods.

## Nicht verifiziert

V3 auf Desktop, VS Code und mobil sowie unter `plan` und `bypassPermissions` (die Warnung des
Bypass-Modus zu akzeptieren ist die Entscheidung des Betreibers, sie wurde daher nicht ausprobiert): `needsUser` bleibt
dort verweigert. Das Band wurde in tmux geprüft, nicht über SSH.

## Quelle und Lizenz

- Originalautor: sd0xdev
- Originalrepository: https://github.com/sd0xdev/sd0x-harness
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
