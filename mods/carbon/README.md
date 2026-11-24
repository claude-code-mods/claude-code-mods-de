<p><img src="docs/banner.png" width="100%" alt="claude-carbon, frei und Open Source: die CO2 deiner Claude-Code-Sitzungen, im Terminal und in der Claude-App. Acht Pixel-Moleküle von Dunkelblau bis Dunkelrot, ein Terminal, dessen Statuszeile 8,2 gCO2 anzeigt, und der Bereich /carbon-panel: Molekül und CO2 dieser Sitzung, die letzten 30 Tage als Kacheln und Erwärmungsstreifen, eine Schaltfläche für die Jahreskarte"></p>

[![GitHub-Sterne](https://img.shields.io/github/stars/gwittebolle/claude-carbon)](https://github.com/gwittebolle/claude-carbon/stargazers)
[![Lizenz: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![GitHub-Release](https://img.shields.io/github/v/release/gwittebolle/claude-carbon)](https://github.com/gwittebolle/claude-carbon/releases)
[![npm](https://img.shields.io/npm/v/claude-carbon)](https://www.npmjs.com/package/claude-carbon)
[![CI](https://github.com/gwittebolle/claude-carbon/actions/workflows/ci.yml/badge.svg)](https://github.com/gwittebolle/claude-carbon/actions/workflows/ci.yml)

claude-carbon ist ein Open-Source-Claude-Code-Plugin, das den CO2-Fußabdruck deiner Sitzungen erfasst: eine lokal aus deinem Token-Verbrauch berechnete Live-CO2-Schätzung in der Statuszeile des Terminals und im Code-Tab der Claude-Desktop-App, neben den API-äquivalenten Kosten der Sitzung. In der Desktop-App öffnet `/carbon-panel` einen Bereich mit einem Pixel-Molekül, dessen Farbe den CO2 dieser Sitzung mit dem Median deiner bisherigen Sitzungen vergleicht, deinem Verbrauch im gewählten Zeitraum, dessen Erwärmungsstreifen und einer Schaltfläche für deine Jahreskarte.

<p align="center"><img src="https://github.com/user-attachments/assets/f52b2653-28b9-4efc-82a6-02dfe256e193" width="480" alt="claude-carbon in 16 Sekunden: Claude Code zeigt seinen CO2 nie; claude-carbon setzt ihn in die Terminal-Statuszeile, dann in die Claude-Desktop-App, wo /carbon-panel einen Bereich mit einem Pixel-Molekül öffnet, dessen Farbe den CO2 dieser Sitzung mit dem Median der bisherigen Sitzungen vergleicht"></p>

## Was claude-carbon tut

- `/carbon-panel`: ein Bereich in der Claude-Desktop-App mit deinem CO2-Molekül, deinem Verbrauch und den Erwärmungsstreifen deiner Sitzungen (im Terminal die Sitzung in der Leiste über der Eingabe). Siehe [den Mod](#der-mod-carbon-panel-und-der-co2-jeder-antwort)
- Ergänzt die Claude-Code-Statuszeile um eine Live-CO2-Schätzung und zeigt den CO2 der Sitzung in der Desktop-App unter der Eingabe, jeweils neben den API-äquivalenten Kosten der Sitzung
- Speichert jede Sitzung in einer lokalen SQLite-Datenbank, damit die Historie die 30-tägige Löschung der Transkripte überlebt
- Füllt historische Daten aus vorhandenen `~/.claude`-Transkripten nach
- Slash-Befehle: `/carbon-report` (Text), `/carbon-card` (PNG), `/carbon-pr` (Fußabdruck eines Pull Requests)
- Ein README-Badge mit deiner Gesamtsumme und eine öffentliche Methodik mit belegten Faktoren

> **Zur Zahl mit `$`.** Sie ist ein API-Äquivalent: Was deine Sitzung zu Anthropic pay-as-you-go-Listenpreisen kosten würde. Bei einem Pro-, Max- oder Ultra-Abo zahlst du sie nicht; sie zeigt den Wert des Genutzten neben dessen CO2. Siehe [So funktioniert es](#so-funktioniert-es).

## Install

Gib in Claude Code ein:

```text
/plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

Claude Code bittet dich, den Marketplace zu bestätigen, zeigt, was das Plugin installiert, und fragt dann, wo: Wähle **Install for you**. Dieselbe Zeile funktioniert unter macOS, Linux und Windows. Im **Code**-Tab der Claude-Desktop-App kannst du diese Zeile, falls sie belegt ist, durch folgende Nachricht ersetzen und die Installation bestätigen, wenn Claude fragt:

```text
Install the claude-carbon plugin for me: claude plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

Beende danach Claude Code vollständig, öffne es erneut und starte eine neue Sitzung. Dein CO2 erscheint jetzt neben den Kosten der Sitzung:

- im Terminal, in der Statuszeile: `$0.50 · 65gCO₂`
- in der Desktop-App, unter der Eingabe: `This session: 3.6 gCO₂ · $0.12`

Das Plugin setzt diese Statuszeile einmalig beim ersten Sitzungsstart und nur, wenn du keine hast; die Statuszeile eines anderen Werkzeugs bleibt unverändert (wie du den CO2 dort ergänzt, siehe [ccstatusline](#verwendung-mit-ccstatusline)). `/carbon-report` nennt deine Summen, und `/carbon-panel` öffnet den Bereich in der Desktop-App. Das `$` sind API-äquivalente Kosten, nicht das, was dein Abo in Rechnung stellt. Für eine spätere Aktualisierung führe `/carbon-update` aus.

<p align="center"><img src="docs/desktop-pane.png" width="560" alt="Darstellung der Claude-Desktop-App mit geöffnetem claude-carbon-Bereich: ein blaues Pixel-Molekül, &quot;Diese Sitzung: 8,2 gCO₂ · 0,04× dein Median&quot;, die letzten 30 Tage als Kacheln und Erwärmungsstreifen, eine Schaltfläche &quot;Get my 2026 card&quot; und &quot;Diese Sitzung: 8,2 gCO₂&quot; unter der Eingabe"></p>

<details>
<summary><b>Wenn die Installation stoppt</b></summary>

- **macOS oeffnet ein Fenster zu command line developer tools.** Das ist git, das Claude Code zum Laden des Plugins braucht und das ein Mac ohne Entwicklerwerkzeuge noch nicht hat. Klicke auf Install, warte bis zum Abschluss (einige Minuten) und installiere dann erneut.
- **jq is not installed oder sqlite3 is not installed.** Sage Claude: Install what is missing., dann starte Claude Code neu. Jeder Mac hat sqlite3, und macOS 15 oder neuer auch jq. Auf einem aelteren Mac kann Claude jq mit Homebrew installieren, oder das Installationsprogramm (unter Weitere Installationswege) holt sich das offizielle jq selbst und prueft es gegen die veroeffentlichte Pruefsumme. Unter Windows nennt /carbon-panel das fehlende Programm, und Claude kann es mit winget installieren. Antwortet winget mit Access is denied, blockiert Sicherheitssoftware auf dem PC den Zugriff: Erlaube winget dort und versuche es erneut.
- **Windows meldet, Git Bash fehle.** Installiere Git for Windows (https://git-scm.com/downloads/win) (Claude Code braucht es unter Windows ohnehin), beende die App vollstaendig, oeffne sie wieder und installiere dann in einer neuen Sitzung erneut. Claude Code sucht beim Sitzungsstart nach Git Bash, eine waehrend der Git-Installation geoeffnete Sitzung laeuft also ohne ihn.
- **Aus Anthonics Community-Marketplace installiert und das Plugin laedt nicht?** Der Eintrag co2-tracker@claude-community ist auf eine Version von August 2026 festgelegt, die aktuelles Claude Code ablehnt (Duplicate hooks file detected). Fuehre /plugin uninstall co2-tracker@claude-community aus und installiere wie oben beschrieben.

</details>

<details>
<summary><b>Weitere Installationswege</b></summary>

- **Das Installationsprogramm**, ein Skript, das dieses Repository klont und alles selbst in `~/.claude/settings.json` eintraegt. Fuege diese Nachricht in Claude Code ein oder fuehre den Befehl nach dem Doppelpunkt selbst in einem Terminal aus:

  ```text
  Install claude-carbon for me by running this command:
  curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | bash
  ```

  Unter Windows in PowerShell (dafuer sind [Git for Windows](https://git-scm.com/downloads/win) und zuerst zwei Pakete noetig, siehe [Windows](#windows)):

  ```text
  Install claude-carbon for me by running this command in PowerShell:
  irm https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.ps1 | iex
  ```

  Zeigt die Modus-Auswahl unter der Eingabe **Auto**, waehle zuerst **Manual**: Der automatische Modus blockiert einen Befehl, der ein Skript herunterlaedt und ausfuehrt. Du kannst [install.sh](install.sh) vor dem Ausfuehren lesen.
- **Mit Node.js:** `npx claude-carbon` fuehrt dasselbe Installationsprogramm aus.

Verwende nur einen Weg: Plugin und Installationsprogramm zusammen wuerden jeden Hook zweimal ausfuehren. Bereits mit dem Installationsprogramm installiert? Dann ist nichts zu aendern, `/carbon-update` haelt es aktuell.

</details>

Nicht erfasst: die Tabs Chat und Cowork sowie die Web-App (claude.ai/code). Deren Sitzungen laufen auf Anthonics Servern, es erreicht also nichts deinen Rechner, was gezaehlt werden koennte.

## Beispielbericht

<p align="center">
  <img src="docs/example-card.png" alt="claude-carbon-Zusammenfassungskarte: 1190,3 kg geschaetztes CO2 von Januar bis September 2026, ein Balken pro Monat, dann 25,3 Mrd. verarbeitete Tokens, 94 Prozent davon Cache-Lesezugriffe, ein Autovergleich, die API-Preiskosten und eine Jahresprojektion" width="540">
</p>

Erstelle deine Karte mit `/carbon-card` in Claude Code. Die Zusammenfassung und die detaillierten PNGs landen in
`~/Downloads/claude-carbon/` (der Windows-Downloads-Ordner folgt der Systemeinstellung, ein auf OneDrive umgeleiteter wird also beruecksichtigt), und der Ordner oeffnet sich in deinem Dateimanager, auf dem Mac mit ausgewaehlter Karte. `CLAUDE_CARBON_EXPORT_DIR` waehlt einen anderen Ordner;
`CLAUDE_CARBON_NO_OPEN=1` unterdrueckt das Oeffnen.

Ohne Playwright oder Chromium gibt es kein PNG, der Befehl schliesst aber trotzdem ab: Die
Zusammenfassungskarte wird als HTML-Seite im selben Ordner gespeichert und oeffnet sich in deinem Browser,
passend zum Fenster skaliert, und ein Screenshot davon tut denselben Dienst.
Die Token-Zahl auf der Karte ist jedes von Claude verarbeitete Token, einschliesslich Cache-Lesezugriffe, so wie `ccusage` sie zaehlt; die graue Zeile darunter nennt den Anteil der Cache-Lesezugriffe. Der Fuss der Karte sagt, wo man das Werkzeug findet, `claude-carbon sur GitHub` / `claude-carbon on GitHub`, mit der Adresse darunter.

Vom 1. bis zum 10. jedes Monats endet die Statuszeile mit `📊 September: 84.2kgCO₂ · /carbon-card`:
der Gesamtsumme des gerade abgelaufenen Monats, dem Balken, den die Karte dafuer zeichnet, im selben Format wie die Sitzungszahl. Sie wird einmal taeglich aus carbon.db gelesen, solange der Hinweis erscheint, und in
`~/.claude/claude-carbon/last-month-total` gespeichert. Ein Monat mit weniger als 7 Tagen mit Sitzungen erhaelt keinen Hinweis, damit eine frische Installation nicht gedraengt wird, eine fast leere Karte zu teilen. Das Erstellen einer Karte loescht den Hinweis fuer den Monat; nach dem 10. verstummt er von selbst. Im Dezember nennt er stattdessen das laufende Jahr, `📊 2026: 1444.4kgCO₂ · /carbon-card`, und bleibt den ganzen Monat, da sich die Karte auf das Kalenderjahr bezieht. Vom 1. bis zum 10. Januar nennt er das gerade beendete Jahr, und in diesen Tagen deckt `/carbon-card` dieses ganze Jahr ab, sofern du keinen Zeitraum uebergibst oder das Jahr keine Sitzung hatte (die Karte behaelte diese zehn Tage selbst bei abgeschaltetem Hinweis). `CLAUDE_CARBON_CARD_NUDGE_UNTIL_DAY`
verschiebt die Grenze (0 entfernt den Hinweis, Dezember eingeschlossen), `CLAUDE_CARBON_NO_CARD_NUDGE=1` entfernt ihn ganz. Nichts wird irgendwo veroeffentlicht:
Das Teilen bleibt eine menschliche Entscheidung.

<details>
<summary>Erweiterte Optionen (CLI)</summary>

```bash
# Ab einem bestimmten Datum
bash ~/code/claude-carbon/scripts/generate-report.sh --since 2026-03-01

# Gesamte Zeit
bash ~/code/claude-carbon/scripts/generate-report.sh --all

# Ein abgeschlossener Zeitraum (--until ist eine exklusive obere Grenze: dieser endet am 30. Juni)
bash ~/code/claude-carbon/scripts/generate-report.sh --since 2026-01-01 --until 2026-07-01
```

</details>

<details>
<summary>Eigenes Installationsverzeichnis</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | CLAUDE_CARBON_DIR=~/my-path/claude-carbon bash
```

Die Umgebungsvariable muss auf der `bash`-Seite der Pipeline stehen, nicht auf der `curl`-Seite, sonst sieht das Installationsprogramm sie nie.

</details>

<details>
<summary>Zweite Claude-Umgebung (CLAUDE_CONFIG_DIR)</summary>

Wenn du eine zweite Claude-Code-Umgebung mit eigenem Konfigurationsverzeichnis betreibst, zum Beispiel

```bash
alias claude-work="CLAUDE_CONFIG_DIR=~/.claude-work claude"
```

installiere claude-carbon in dasselbe Verzeichnis, indem du `CLAUDE_CONFIG_DIR` an das Installationsprogramm uebergibst:

```bash
curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | CLAUDE_CONFIG_DIR=~/.claude-work bash
```

Statuszeile, Hooks, Datenbank und die `/carbon-*`-Befehle liegen alle unter diesem Konfigurationsverzeichnis, sodass jede Umgebung ihre Sitzungen unabhaengig erfasst. Ist `CLAUDE_CONFIG_DIR` nicht gesetzt, faellt alles wie zuvor auf `~/.claude` zurueck.

</details>

<details>
<summary>Manuelle Installation</summary>

```bash
git clone https://github.com/gwittebolle/claude-carbon.git ~/code/claude-carbon
bash ~/code/claude-carbon/scripts/setup.sh
bash ~/code/claude-carbon/scripts/configure-settings.sh
```

Das zweite Skript fuegt den Block unten in `~/.claude/settings.json` ein (zustaetzlich: eine vorhandene Statuszeile oder Hooks von Drittanbietern bleiben unberuehrt) und verknuepft die `/carbon-*`-Befehle. Wenn du es von Hand eintragen willst, ueberspringe das Skript und ergaenze:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/code/claude-carbon/scripts/statusline.sh"
  },
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/persist-session.sh"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/persist-on-exit.sh"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/safety-rescan.sh"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "matcher": ".+",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/agent-stop.sh"
          }
        ]
      }
    ]
  }
}
```

Der `Stop`-Hook speichert die Sitzung nach jeder Runde, und `SessionEnd` speichert sie beim Schliessen noch einmal, damit auch eine letzte, vor `Stop` unterbrochene Runde gezaehlt wird. Der `SessionStart`-Hook sucht nach verpassten Sitzungen (Absturz, Kill) und treibt die taegliche Aktualisierungspruefung an, die die Statuszeile liest; ohne ihn erfaehrst du nie, dass es eine neuere Version gibt. `SubagentStop` speichert den Branch, auf dem ein Agent gearbeitet hat, fuer `/carbon-pr`.

Starte Claude Code neu.

</details>

## Fuer Teams

claude-carbon misst die Sitzungen eines Entwicklers, lokal. Kommt die Frage von deinem CTO, einer Kundenausschreibung oder einem CSR-Gremium, gibt es dieselbe Methodik auch als gehostete Ebene:

- [Kostenloser Rechner](https://tokenclimate.com/en/calculator?ref=github) und [Faktentabellen pro Modell](https://tokenclimate.com/en/models?ref=github) – die exakten versionierten Faktoren dieses Repositories, zum Nachschlagen.
- [TokenClimate](https://tokenclimate.com/en?ref=github) – gehostete Team-Dashboards. Beide Seiten nutzen die Golden Vectors dieses Repositories, die woechtentlich in CI geprueft werden.

Das OSS verweist an fuenf Stellen darauf: eine einzeilige Fusszeile in `/carbon-report`, ein kleiner Hinweis auf den `/carbon-card`-PNGs, die letzte Zeile eines `/carbon-pr`-Kommentars, der Fuss des `/carbon-panel`-Bereichs und das `url`-Feld in `CITATION.cff`. Keine Werbung in der Statuszeile, keine E-Mail-Erfassung: nichts verlaesst deinen Rechner.

### PR-Entwicklungsfussabdruck (/carbon-pr)

Die Zahl, die Reviewer selten sehen, ist, was der PR an Entwicklung gekostet hat: deine lokalen Claude-Code-Sitzungen waehrend der Arbeit am Branch. `/carbon-pr` (oder `scripts/generate-pr-report.sh`) summiert die gespeicherten Sitzungen des aktuellen Branches und postet einen haftenden Kommentar im offenen PR – ueber deine eigene `gh`-Anmeldung. Fuehre es nach deinem Push aus; ein erneuter Aufruf aktualisiert denselben Kommentar.

```
**Claude Code carbon report** · developing this PR

| CO2e | Cost* | Tokens (in + cache write + out) | Cache reads | Sessions |
|---|---|---|---|---|
| **124 g** | $3.00 | 180k | 1.5M | 2 |
```

Unter der Tabelle folgen der Autovergleich, ein aufklappbares Token-Detail pro Modell und eine einzeilige Fusszeile.

Wie die Sitzungen zugeordnet werden: Der Stop-Hook speichert den git-Branch jeder Sitzung (aus dem Transkript gelesen), und der Bericht waehlt `project + branch`. Sitzungen, die vor dieser Spalte gespeichert wurden, haben keinen Branch; `scripts/backfill.sh` repariert sie, solange ihre Transkripte noch auf der Platte liegen (etwa 30 Tage). Eine Sitzung, deren letzter Ordner ein Unterordner des Repositories ist, wird unter dem Namen des Unterordners gespeichert und bleibt aus der Summe draussen. Eine Sitzung, die auf einem anderen Branch endet als sie begann, wird dorthin gezaehlt, wo sie fertig wurde.

Wie ihre Agenten zugeordnet werden: Ein Agent zaehlt mit seiner Sitzung, sofern er nicht auf einem eigenen Branch gearbeitet hat. Eine Sitzung auf `main`, die Agenten in einem Worktree an einem PR bauen laesst, schreibt deren Anteil auf den Branch des PRs, und der Kommentar sagt dann, wie viele anderswo gespeicherte Sitzungen er einschliesst. Ein `SubagentStop`-Hook (`agent-stop.sh`) liest den Branch, wenn jeder Agent endet, solange sein Worktree noch existiert:

- Ein Agent, der in einem eigenen Worktree lief (Claude Codes isolierte und Workflow-Agenten), zaehlt auf dem Branch, den dieser Worktree dann hat, es sei denn, Claude Code hat ihn benannt (`worktree-agent-*`, `worktree-wf_*`) oder er ist detached;
- ein Agent, der im Ordner der Sitzung lief, zaehlt auf den Worktree, den seine Werkzeugaufrufe in mindestens der Haelfte der Aufrufe mit Ortsangabe nennen (ein Befehl, ein Dateipfad), und auf keinen anderen ebenso oft: absolute Pfade, `~/`, `../` vom Repository-Ordner, wenn der Worktree daneben liegt, `./`, wenn er darin liegt. Nie der Hauptordner des Repositories oder der der Sitzung. Dies ist eine Ableitung aus den Befehlen des Agenten.

Der Hook speichert die Tokens, den CO2 und die Kosten dieses Agenten, pro Modell, in einer `agent_usage`-Tabelle, zusammen mit dem Repository und dem Ordner des Worktrees; die eigene Zeile der Sitzung bleibt unveraendert. Der Bericht nimmt diese Agenten aus dem Branch ihrer Sitzung heraus und schreibt sie ihrem eigenen zu, sofern die Zeile der Sitzung alle ihre Agenten enthaelt (`agents_collected = 2`: der Stop-Hook oder die Neusuche hat jedes Agenten-Transkript gelesen), der Eintrag nach dem Ende des Agenten geschrieben wurde (in einer spaeteren Sekunde) und mit der aktuellen Methode gespeichert wurde (keine v1-Zeile). Ein Agent, der in einem anderen Repository als seine Sitzung arbeitete, wird nicht gespeichert, und einer, der vor dem Umzug seines Repositories gespeichert wurde, bleibt bei seiner Sitzung. Forks bleiben draussen (sie wiederholen die Nachrichten ihres Elternteils), ebenso die Arbeit, die eine Sitzung selbst in einem Worktree verrichtet. Nur Agenten, die mit dieser Version installiert enden, werden zugeordnet: fuer vergangene Sitzungen wird nichts nachgebaut.

Der Hook braucht Claude Code 2.1.69 oder neuer, als erste Version, die `SubagentStop` den Typ des Agenten gibt (seine ID und sein Transkript kamen in 2.0.42); mit einer aelteren wird nichts gespeichert. Claude Codes eigene Agenten (Prompt-Vorschlaege, `/btw`) bleiben draussen. In einer Sitzung ohne `--agent` ist ihr Typ leer: Der Matcher des Hooks ueberspringt sie ab 2.1.275, das Skript selbst schon vorher. Mit `--agent` tragen sie den Namen dieses Agenten und bestehen den Matcher; das Skript ueberspringt sie, weil ihr Transkript nicht eines ist, das die Zeile der Sitzung liest.

Der Hook laeuft synchron, bevor das Ergebnis des Agenten die Sitzung erreicht: auf einem Mac etwa 0,1 bis 0,3 Sekunden fuer die meisten Agenten, bis zu 1 bis 2 Sekunden fuer einen, dessen Transkript 100 MB uebersteigt, da er es vollstaendig liest. Claude Code schreibt Transkripte asynchron: Ist die letzte Nachricht des Agenten noch nicht darin, liest der Hook es alle 0,2 Sekunden erneut, hoechstens eine Sekunde lang, und zaehlt dann, was da ist. Eine Datenbank, die laenger als etwa 10 Sekunden beschaeftigt bleibt (ein langer Lesezugriff anderswo), verliert den Eintrag, und der Agent zaehlt mit seiner Sitzung.

#### Fuer jeden PR eines Repositories

Ein Repository kann den Bericht fuer seine Pull Requests anfordern. Seine Maintainers committen dazu dies in `.claude/settings.json`, eine Aenderung, die das Team wie jede andere prueft:

```json
{ "env": { "CLAUDE_CARBON_PR": "1" } }
```

Allein wird dadurch nichts gepostet. Beim ersten Mal, dass ein Entwickler mit dem Plugin dort mit Claude Code einen Pull Request oeffnet (`gh pr create`), fragt Claude ihn einmal, ob er den Bericht seiner eigenen Sitzungen unter seinem eigenen GitHub-Konto veröffentlichen will. Seine Antwort bleibt auf seinem Rechner, pro Repository (`pr-consent.tsv` im Datenordner):

- **ja**: Der Kommentar wird nach dieser Antwort gepostet, danach bei jedem `git push` oder `gh pr create`, den Claude dort ausfuehrt, aktualisiert – sobald die Antwort, die gepusht hat, gespeichert ist und solange der gepushte Branch noch ausgecheckt ist. Ein Push, den du selbst im Terminal eingibst, loest nichts aus. Ein Kommentar pro PR und nie von selbst bei einem PR, dessen Branch in einem Fork liegt.
- **nein** oder keine Antwort: Es wird nichts gepostet und die Frage kommt nicht zurueck. `/carbon-pr` funktioniert weiter, wenn er es selbst ausfuehrt.

Aendere deine Antwort fuer das Repository mit `scripts/generate-pr-report.sh --consent yes` oder `--consent never` (nach einem im Terminal eingegebenen Ja kommt der erste Kommentar mit deinem naechsten Push oder `gh pr create` in Claude Code); ein Ja gilt erst, wenn die Frage dir dort gestellt wurde – dazu zaehlt auch eine Frage, die wegen einer unterbrochenen Runde nie erschien. Die Antwort wird unter der `origin`-URL des Repositories gespeichert (ohne Zugangsdaten): Benenne den Remote um, und die Frage kommt einmal zurueck. Ein Repository kann nicht fuer dich antworten: Die Antworten werden nie aus einem Konfigurationsordner oder einer Datenbank im Repository gelesen, und der Kommentar geht von selbst nur an die von `origin` genannten Repositories, egal was `GH_REPO` sagt. `CLAUDE_CARBON_NO_PR_AUTO=1` in deiner eigenen Umgebung schaltet Frage und Posting ueberall ab. Um es fuer das Repository zu beenden, entferne die `CLAUDE_CARBON_PR`-Zeile. Dafuer sind die Hooks des Plugins noetig (eine Marketplace-Installation): Ein reiner Installer-Klon wird nicht gefragt und postet nichts von selbst. Die Funktion ist fuer ein Team-Repository gedacht; in einem oeffentlichen Projekt wuerden externe Mitwirkende Kommentare sehen, die sie nicht angefordert haben.

#### Die Gesamtsumme des Repositories

`scripts/generate-pr-report.sh --summary` liest ueber `gh` die bereits geposteten Berichte der gemergten Pull Requests des Repositories zurueck und summiert sie pro Merge-Monat und pro Autor. `--since 2026-10-01` engt ein. Es gibt nur in deinem Terminal aus, postet nichts und liest deine Datenbank nicht: Die Zahlen sind die, die jeder Autor gepostet hat.

```
Month merged             PRs  Sessions       CO2e       Cost
2026-09                    2         4     1.8 kg     $57.26
2026-10                    1         1       69 g      $1.92

Author                   PRs  Sessions       CO2e       Cost
alice                      2         2      644 g     $19.18
bob-dev                    1         3     1.2 kg     $40.00

Total: 3 PRs, 5 sessions, 1.8 kg CO2e, $59.18 at API list price.
```

Ein Kommentar in der alten einzeiligen Form oder einer von Hand bearbeiteter gilt als unlesbar und bleibt aussen vor. Es deckt die Pull Requests mit einem Bericht ab, nicht den gesamten Fussabdruck des Repositories, und liest hoechstens 100 davon gleichzeitig.

Ausserhalb eines solchen Repositories ist Abschalten der Standard: nichts wird gepostet, solange du es nicht selbst ausfuehrst. `--dry-run` zeigt eine Vorschau des Kommentars, `--pr <number>` zielt auf einen bestimmten PR des Repositories (einer aus einem Fork wird abgelehnt: fuehre den Befehl im Klon des Forks aus), und das Loeschen des Kommentars auf GitHub ist die vollstaendige Bereinigung. Sobald Agenten des Repositories erfasst sind, zaehlt der Bericht – von jedem Ordner aus, in dem er laeuft – die Sitzungen des Hauptordners des Repositories, des Worktrees, in dem der Branch ausgecheckt ist, und der Worktrees, in denen seine Agenten arbeiteten, selbst wenn sie inzwischen entfernt wurden. Ein Branch, der nirgends ausgecheckt ist und dessen Namen auch Sitzungen anderer Ordner tragen, wird abgelehnt: Es wird nichts gepostet statt einer Zahl, die diese Sitzungen vermissen koennte.

## So funktioniert es

![claude-carbon-Datenfluss: Claude-Code-Transkripte und Statuszeilen-JSON in eine lokale SQLite-Datenbank und eine CO2-Schaetzung](docs/data-flow.svg)

**Drei Datenwege, zwei Genauigkeitsstufen:**

| Skript | Ausloeser | Datenquelle | Subagenten | Cache-Lesezugriffe | Genauigkeit |
| --- | --- | --- | --- | --- | --- |
| `backfill.sh` | Manuell / Setup | JSONL-Dateien | Enthalten | Gezaehlt (8 % Energie) | Beste Schaetzung |
| `persist-session.sh` | Stop + SessionEnd Hooks | JSONL-Dateien | Enthalten | Gezaehlt (8 % Energie) | Beste Schaetzung |
| `statusline.sh` | Jede Runde (live) | `carbon.db`-Zeile | Enthalten | Gezaehlt (8 % Energie) | Eine Runde spaeter |

**backfill** und **persist-session** parsen die rohen JSONL-Transkripte (Hauptsitzung, Subagenten-Dateien und die Transkripte der von einem Workflow gestarteten Agenten) und wenden emissionsfaktoren pro Modell an. Sie entfernen doppelte Assistant-Nachrichten anhand von `(message.id, requestId)`, damit fortgesetzte und kompaktierte Sitzungen nicht doppelt gezaehlt werden (das entspricht `ccusage`; ohne die Entfernung waere die Tokensumme etwa dreifach zu hoch). Jede Sitzung speichert ihre rohe Token-Aufteilung (Eingabe, Cache-Schreiben, Cache-Lesen, Ausgabe), die in die SQLite-Datenbank fuer die Berichte fliesst.

Das Transkript eines Agenten aendert sich nicht mehr, sobald er fertig ist, deshalb werden seine Summen in `~/.claude/claude-carbon/usage-cache/` gespeichert (eine kleine Datei pro Sitzung, die bei der taeglichen Neusuche 45 Tage nach dem letzten Schreiben entfernt wird) und nur erneut gelesen, wenn Groesse, Aenderungszeit oder Inode der Datei sich aendern (der Datei, auf die ein Symlink zeigt). Ein Agent mit einer Zeile, die noch nicht parsebar ist, weil ein Schreiben laeuft, wird nie gespeichert. Das Haupttranskript wird immer vollstaendig gelesen. `CLAUDE_CARBON_NO_USAGE_CACHE=1` liest jedes Mal alles und schreibt keinen Cache.

**Kosten** ist der theoretische API-Listenwert (pay-as-you-go), nicht dein Abo-Preis: Eingabe, Ausgabe, Cache-Schreiben und Cache-Lesen (0,1-fache Eingabe) zu aktuellen Anthropic-Tarifen, festgelegt in `data/prices.json`. Cache-Schreiben werden pro TTL-Stufe berechnet, das 1,25-Fache der Eingabe fuer die 5-Minuten- und das 2-Fache fuer die 1-Stunden-Stufe; die Aufteilung jeder Sitzung wird aus ihrem Transkript gelesen statt angenommen (Claude Code schreibt auf der 1-Stunden-Stufe). Auf entdoppelten Daten entspricht es `ccusage`.

**statusline** liest bei jeder Runde die Zeile dieser Sitzung aus `carbon.db`, der angezeigte CO2 ist also die Sitzungssumme auf derselben Grundlage wie in den Berichten, hoechstens eine Runde zurueck. Bevor die Zeile existiert (erste Runde oder noch keine Datenbank), greift sie auf eine Schaetzung aus `context_window.total_input_tokens` zurueck, also die Groesse des aktuellen Kontexts statt einer laufenden Summe: Subagenten sind unsichtbar, und jede Kompaktierung setzt den Wert zurueck. Wie auch immer die Statuszeile anzeigt, sie fliesst nie in die Berichte ein.

### Die Statuszeile

Segmente von links nach rechts: Projekt + git-Branch, Modell + Kontextfenster-Prozent, API-äquivalente Sitzungskosten + CO2, Abo-Kontingent-Prozent + Zurücksetzungszeit. Das Kontingent ist das 5-Stunden-Fenster oder das Wochenfenster, wenn kein 5-Stunden-Fenster offen ist (immer auf einem verifizierten Ultra-Konto; bei Pro und Max zwischen der Zurücksetzung eines 5-Stunden-Fensters und deiner nächsten Anfrage): `Use 41% 7d ↻Thu`, die Rücksetzung als Wochentag, solange sie mehr als einen Tag entfernt ist. Ein 🔥-Praefix erscheint, wenn die anhaltende Verbrauchsrate das Limit bis zum Fensterende ueberschreiten wuerde (sobald der Verbrauch 15 % erreicht, nach einer Karenz von 15 Minuten beim 5-Stunden- und einem Tag beim Wochenfenster).

> **Wo der CO2 erscheint.** Die Statuszeile ist eine Funktion der Claude-Code-Terminal-Oberflaeche. Sie wird nur angezeigt, wenn du `claude` in einem Terminal ausfuehrst, einschliesslich des integrierten Terminals von VS Code oder JetBrains. Der Chat-Bereich der IDE-Erweiterungen hat gar keine Statuszeile, dort erscheint also nichts, obwohl die Hooks weiterlaufen und deine Sitzungen gespeichert werden: `/carbon-report` deckt sie ab. Wenn du den VS-Code-Bereich nutzt und den Live-CO2 willst, oeffne in VS Code ein Terminal (`` Ctrl+` ``) und starte `claude` dort. Die Web-App (claude.ai/code) fuehrt weder Statuszeile noch Hooks aus, dort wird nichts angezeigt oder gespeichert. Auch die Desktop-App zeigt die Statuszeile nicht; der [Mod](#der-mod-carbon-panel-und-der-co2-jeder-antwort) des Plugins zeichnet den CO2 in seinem Code-Tab.

**Kontingentquelle.** Der Prozentsatz stammt von Anthropic selbst, denselben Daten, die Claude Code in `/usage` zeigt. Keine Heuristik, keine Token-Limit-Datei als Startwert. Zwei Quellen in dieser Reihenfolge:

1. **stdin** (bevorzugt): die `rate_limits`, die Claude Code im Statuszeilen-JSON uebergibt, `five_hour` zuerst, sonst `seven_day`. Sind `rate_limits` vorhanden, gibt es ein nicht enthaltenes Fenster nicht, und es wird nichts anderes abgefragt.
2. **OAuth-API-Ersatz**, nur wenn stdin keine `rate_limits` hat (vor der ersten Antwort der Sitzung oder mit aelterem Claude Code): `GET https://api.anthropic.com/api/oauth/usage` mit dem Bearer-Token aus macOS Keychain, `CLAUDE_CODE_OAUTH_TOKEN` oder `~/.claude/.credentials.json`, hoechstens einmal pro Minute, unabhaengig davon, ob es antwortet. Die Antwort wird in `~/.claude/claude-carbon/oauth-usage.json` zwischengespeichert; ein Fenster ohne Ruecksetzungszeit oder dessen Ruecksetzung vergangen ist, bleibt aussen vor.

Genau bei Pro, Max und Ultra.

### Die 30-Tage-Loeschung der Transkripte ueberleben

Claude Code loescht JSONL-Transkripte nach etwa 30 Tagen, die SQLite-Datenbank ist also die dauerhafte Aufzeichnung. Die `Stop`- und `SessionEnd`-Hooks erfassen jede Sitzung, bevor ihr Transkript zu alt wird, und eine taegliche Hintergrund-Neusuche (`SessionStart`-Hook, `safety-rescan.sh`) findet Sitzungen, die sie verpasst haben, solange das Transkript noch existiert – auch solche, deren Transkript nach dem Schreiben ihrer Zeile weitergewachsen ist. Da jede Zeile rohe Token-Zahlen speichert, kann `recompute.sh` Kosten und CO2 jederzeit aus `data/factors.json` + `data/prices.json` neu erzeugen, ohne Transkript. Wenn Anthropic einen Preis aendert oder ein Faktor ueberarbeitet wird, bearbeite die Konfiguration und fuehre aus:

```bash
bash scripts/recompute.sh
```

Seit September 2026 gespeicherte Sitzungen werden modellweise exakt neu hergeleitet. Aeltere Sitzungen ohne Aufteilung pro Modell behalten ihre gespeicherten Werte; `--include-unsplit` leitet sie mit dem dominierenden Modell neu her, eine Naeherung (siehe METHODOLOGY.md).

## Befehle

| Befehl | Was er tut |
| --- | --- |
| `/carbon-report` | Textbericht mit Summen, Autovergleich, Anteil an einem 2-t-Budget, Top-Sitzungen |
| `/carbon-card` | Teilbare PNG-Berichtskarten erzeugen |
| `/carbon-badge` | Shields.io-Badge deines gesamten Fussabdrucks fuer deine READMEs |
| `/carbon-pr` | Entwicklungsfussabdruck des aktuellen Branches in seinem PR posten |
| `/carbon-update` | Auf die neueste Version aktualisieren, unabhaengig von der Installationsart |

<details>
<summary>Skripte (laufen automatisch, selten von Hand noetig)</summary>

| Skript | Was es tut |
| --- | --- |
| `setup.sh` | Datenbank initialisieren, historische Sitzungen nachfuellen, Summe zeigen |
| `statusline.sh` | Statuszeilen-Skript (von Claude Code automatisch aufgerufen) |
| `persist-session.sh` | Stop-Hook (speichert Sitzungsdaten nach jeder Runde) |
| `persist-on-exit.sh` | SessionEnd-Hook (speichert die Sitzung beim Schliessen noch einmal, im Hintergrund) |
| `safety-rescan.sh` | SessionStart-Hook (gedrosselte Hintergrund-Neusuche, findet verpasste Sitzungen) |
| `agent-stop.sh` | SubagentStop-Hook (der Branch, auf dem ein Agent arbeitete, fuer `/carbon-pr`) |
| `backfill.sh` | Alle historischen JSONL-Transkripte erneut parsen (inkl. Subagenten) |
| `recompute.sh` | Kosten/CO2 aus gespeicherten Tokens nach Preis-/Faktoraenderung neu herleiten (keine Transkripte noetig) |
| `generate-report.sh` | PNG-Berichtskarten exportieren (CLI, mit `--since` / `--until` / `--all`) |
| `generate-badge.sh` | shields.io-Badge-Markdown + URL ausgeben (CLI) |
| `generate-pr-report.sh` | Entwicklungsfussabdruck des Branches in seinem PR posten (CLI, `--dry-run` / `--pr`) |

Hinweis: backfill leitet Projekt Namen jetzt aus dem `cwd` des Transkripts ab (passend zum Live-Hook). Sitzungen, die vor dieser Aenderung nachgefuellt wurden, behalten ihre alten, moeglicherweise gekuerzten Namen; loesche diese Zeilen und fuehre `backfill.sh` erneut aus, um sie zu vereinheitlichen.

</details>

## Badge

`/carbon-badge` gibt ein einfuegbares shields.io-Badge mit deinem gemessenen Gesamtfussabdruck und dem Monat der Messung aus, anklickbar zur Methodik:

[![Claude Code carbon footprint](https://img.shields.io/badge/claude--carbon-1139.2%20kg%20CO2e%2C%202026--09-2f6f4f)](https://github.com/gwittebolle/claude-carbon/blob/main/METHODOLOGY.md)

<sub>Dieses Badge ist echt, kein Entwurf: der eigene Gesamtwert des Autors, 1.208 Sitzungen zwischen dem 15. Januar 2026 und dem 16. September 2026. Es ist der Fussabdruck eines Entwicklers, nicht der des Projekts.</sub>

```markdown
[![Claude Code carbon footprint](https://img.shields.io/badge/claude--carbon-1139.2%20kg%20CO2e%2C%202026--09-2f6f4f)](https://github.com/gwittebolle/claude-carbon/blob/main/METHODOLOGY.md)
```

Das Badge ist ein statisches Bild aus deiner lokalen Datenbank, die Zahl ist also gemessen, nicht unterwegs geschaetzt, und nichts wird irgendwohin gesendet. Der Monat in der Aufschrift sagt, wie alt die Zahl ist; fuehre `/carbon-badge` erneut aus, wenn du beide aktualisieren willst.

Es ist der Gesamtwert eines Entwicklers und gehoert daher in deine Profil-README oder ein persoenliches Projekt. In einem Team- oder Organisations-Repository werden Reviewer fragen, was die Zahl erzeugt hat und warum sie aus der Organisation heraus verlinkt – und sie haben recht damit.

Zahlen folgen der Spracheinstellung des Berichts (`fr` gibt `12,4 kg` aus, `us` und die Weltvorgabe `12.4 kg`); `CLAUDE_CARBON_LOCALE` erzwingt eine Einstellung.

## Der Mod: /carbon-panel und der CO2 jeder Antwort

Das claude-carbon-Plugin enthaelt auch einen [Claude-Code-Mod](https://code.claude.com/docs/en/plugins/mods/overview), der den CO2 jeder Antwort zeigt, sobald sie endet – lokal mit derselben Formel und denselben Faktoren berechnet wie in der Statuszeile – sowie die Gesamtsumme der Sitzung mit ihren API-Preiskosten.

- **Terminal**, einschliesslich des integrierten Terminals eines Editors und des JetBrains-Plugins: am rechten Ende der Zeile, die jede Antwort abschliesst, `✻ Worked for 38s · done 10:32 PM          16 gCO₂`. Eine Zeile behaelt die Zahl ihrer eigenen Antwort, wenn sie neu gezeichnet wird (Groessenänderung, Scrollen, Strg+O); eine Zeile, die erst spaeter zum ersten Mal gezeichnet wird, etwa nur durch Strg+O, erhaelt keine Zahl.
- **Desktop-App, Code-Tab**: eine Zeile unter der Antwort, nur bei einer ungewöhnlichen Antwort.
- **Eine ungewöhnliche Antwort** zeigt das Verhaeltnis und den Anteil der Subagenten, wenn sie ins Gewicht gefallen sind: `230 gCO₂ · 14× your median`. Eine Antwort ist ungewöhnlich, wenn sie ueber dem 97. Perzentil deiner letzten 200 Antworten liegt, mehr als das 3-Fache ihres Medians und mindestens 10 g beträgt – etwa eine Antwort von 27. Vor 50 gespeicherten Antworten wird keine markiert.
- **Die Sitzungssumme** ist unter der Eingabe angeheftet, CO2 und API-Preiskosten: `This session: 142 gCO₂ · $3.41`, auf Franzoesisch `Cette session : 142 gCO₂ · 3,41 $`. Sie erscheint, sofern die claude-carbon-Statuszeile sie nicht schon nennt oder die Option `showSessionTotal` aus ist (beides nur im Terminal, siehe [ccstatusline](#verwendung-mit-ccstatusline)). Die Kosten sind der pay-as-you-go-API-Listenpreis derselben Anfragen wie der CO2, aus `data/prices.json` mit der Formel von `/carbon-report`, Cache-Schreiben auf der 1-Stunden-Stufe, die Claude Code verwendet; unter einem Cent liest es `< $0.01`, und es bleibt weg, wenn die Preistabelle nicht gelesen werden kann – dann bis die Summe neu beginnt, damit die Kosten nie nur einen Teil der Anfragen abdecken. Es ist, was die Nutzung auf der API kosten wuerde, nicht was ein Abo in Rechnung stellt. Bei einem Abo endet der Eintrag mit dem Kontingent, wie es die Statuszeile zeigt, `Use 23% ↻14:00` (`Usage 23 % ↻14:00`): der Anteil des genutzten 5-Stunden-Fensters und die lokale Uhrzeit der Ruecksetzung, oder ohne 5-Stunden-Fenster das Wochenfenster, `Use 41% 7d ↻Sat` (`Usage 41 % 7j ↻sam.`), von Claude Code selbst nach jeder Antwort gelesen, ohne Netzwerkanruf. Danach kommen die beiden Hinweise der Statuszeile: `⬆ 1.18.0 /carbon-update`, wenn eine neuere Version da ist, und vom 1. bis zum 10. des Monats der gerade abgelaufene Monat mit seiner Summe, `📊 September: 84.2 kgCO₂ · /carbon-card`, bis du die Karte erstellst. Hintergrund-Subagenten, so startet Claude Code die meisten, zaehlen nur in die Sitzungssumme: nie in eine Antwort, noch in deinen Median. Ein Subagent im Vordergrund zaehlt in die Antwort, die ihn gestartet hat, nicht in die naechste.

- **`/carbon-panel` oeffnet einen Bereich** mit dem Maskottchen, einem Pixel-CO2-Molekül. Seine Farbe vergleicht diese Sitzung mit dem Median deiner bisherigen Sitzungen, von Dunkelblau (unter einem Achtel davon) bis Dunkelrot (über dem Achtfachen). Bis 10 Sitzungen gespeichert sind, vergleicht es stattdessen mit einem Startwert von 0,5 kgCO₂, damit es von der ersten Antwort an eine Farbe hat. Es hoppelt während Claudes Arbeit ein Pixel auf und ab, schneller, je roeter es wird, und zieht dabei Gesichter: Vor der ersten Antwort schaut es sich um, bei der Arbeit blinkt es und blickt zur Seite, in einer leichten Sitzung laechelt es und in einer schweren schwitzt es, es reagiert auf jede Antwort, zwinkert im Ruhezustand und schlaeft nach fuenf Minuten ohne Runde ein.

  <p align="center"><img src="docs/molecule-moods.svg" width="560" alt="Die acht Stimmungen des Moleküls: es schaut sich vor der ersten Antwort um, blickt bei der Arbeit zur Seite, laechelt in einer leichten Sitzung, schwitzt in einer schweren, laechelt oder erschrickt nach einer Antwort, zwinkert in Ruhe und schlaeft nach fuenf ruhigen Minuten ein"></p>

  <p align="center"><img src="docs/molecule-moods.svg" width="560" alt="Die acht Stimmungen des Moleküls: es schaut sich vor der ersten Antwort um, blickt bei der Arbeit zur Seite, laechelt in einer leichten Sitzung, schwitzt in einer schweren, laechelt oder erschrickt nach einer Antwort, zwinkert in Ruhe und schlaeft nach fuenf ruhigen Minuten ein"></p>

  - **In der Desktop-App** oeffnet sich der Bereich rechts, sein Tab heisst claude-carbon, in zwei Bloecken. Unter dem Molekül die Farbskala, die acht Farben von Blau bis Rot, mit einer Markierung unter der aktuellen Sitzung. Diese Sitzung: ihr CO2, Antworten, Subagenten und Modell, die Fuellung ihres Kontextfensters und der API-Preiswert, dazu ein kleines Molekül pro Subagent, gefaerbt nach dessen eigenem CO2. Mein Verbrauch: der gewaehlte Zeitraum (die letzten 7 oder 30 Tage, 12 Monate, alles oder zwei eingegebene Daten, `01/05/2026`), seine Zahlen als Kacheln (CO2, wie ihn die Berichte summieren, Veraenderung gegenueber gleicher Zeit vorher, Sitzungen, API-Preiswert, Autovergleich), dann Erwärmungsstreifen dieses Zeitraums - ein Tag, eine Woche oder ein Monat je nach Laenge ein Streifen, jeder gefaerbt im Vergleich zum Median der gezeigten Zeiträume. Der Streifen unter dem Zeiger leuchtet, Datum, Summe und Sitzungen erscheinen unter den Streifen. Eine Kachel mit einem (i) zeigt ihre Notiz, wenn du auf das (i) klickst, und verbirgt sie beim zweiten Klick: Der API-Preiswert ist, was dieser Verbrauch bei Abrechnung ueber die API kosten wuerde, und ein Pro-, Max- oder Ultra-Abo deckt einen Teil oder alles ab (welche Sitzung wie abgerechnet wurde, ist nicht gespeichert, der Bereich sagt also nie, was du gezahlt hast). Ein Zahnrad neben Mein Verbrauch schaltet Veraenderung, API-Preiswert, Auto, Aufteilung nach Projekt (aus, bis du sie einschaltest, jeder Ordner mit seinem Anteil und kgCO2) und Detail ein oder aus; der Bereich behaelt deine Auswahl fuer die naechste Sitzung.

Das Detail (aus, bis du es einschaltest) zerlegt den Zeitraum nach Token-Arten – ungecachte Eingabe, Cache-Schreiben, Cache-Lesen und Ausgabe: zwei farbige Balken zeigen den Anteil jeder Art an den Tokens und am CO2 (der Teil unter dem Zeiger leuchtet, die Zahlen erscheinen unter dem Balken), dann eine Zeile pro Art mit Tokens, Energie und CO2 samt Anteilen. Der CO2 jeder Sitzung ist der gespeicherte, aufgeteilt mit den Gewichten, die die Faktoren jeder Art geben (Cache-Lesezugriffe 0,08 eines Eingabe-Tokens, Ausgabe etwa das 21-Fache), damit die Teile zum Gespeicherten addieren; eine mit aelteren Faktoren (vor Juli 2026) gespeicherte Sitzung, deren CO2 nicht mehr zu ihren Tokens passt, bleibt ausser vor und der Block sagt, ueber wie viele Sitzungen er aufteilt; die Energie ist die, von der die Faktoren ausgehen (Energie pro Token, PUE eingeschlossen, mit dem AWS-us-east-Netz zu 287 gCO2/kWh in CO2 umgerechnet), zurueckgewonnen durch Division dieses CO2 durch dieselbe Intensitaet. Dafuer braucht es die Tokens pro Art in `sessions-history.tsv`, die die Hooks ab dieser Version schreiben: nach einer Aktualisierung erscheint das Detail ab der naechsten Antwort. Eine Schaltflaeche Get my 2026 card setzt `/carbon-card` in eine leere Eingabe, damit du es sendest (die Karte deckt das laufende Kalenderjahr ab, egal welchen Zeitraum der Bereich zeigt); sie sendet es nie und laesst einen von dir begonnenen Entwurf in Ruhe. Ein paar kurze Zeilen am Fuss verlinken dieses Repository, das LinkedIn-Profil des Autors und TokenClimate, die Geschaeftsversion.

  - **Im Terminal** zeigt `/carbon-panel`, an der Eingabe eingegeben, diese Sitzung in der Leiste direkt darueber – sowohl in der klassischen als auch in der Vollbild-Darstellung (von der Desktop-App oder einem Telefon ueber Remote Control an eine im Terminal laufende Sitzung gesandt, oeffnet es dort stattdessen den Seitenbereich): ein kleines Molekül aus 13 Spalten und 4 Zeilen in Halbblock-Zeichen, daneben CO2, Antworten, Subagenten (ein Punkt je, in seiner Farbe), Modell, Kontextfenster und API-Preiswert. Der Zeitraum und die Streifen bleiben der Desktop-App vorbehalten.
  - Fuehre `/carbon-panel` erneut aus, um den Bereich zu schliessen oder die Leiste zu leeren. Der Befehl ist auch ein Skill des Plugins, deshalb fuehrt ihn die Desktop-App auf; wo der Mod nicht laeuft (VS-Code-Chat-Bereich, Cloud-Sitzung), sagt er nur, wo der Bereich geoeffnet wird.
- **Die Historie der Streifen** ist `sessions-history.tsv`, die der Stop-Hook nach jeder Antwort neben `carbon.db` schreibt, schreibgeschuetzt gegenueber der Datenbank. Jede gespeicherte Sitzung steht darin, aeltere Zeilen so, wie sie gespeichert wurden (sie behalten die Faktoren ihrer Zeit und werden nie neu berechnet), damit Streifen, Median und Summen das zaehlen, was `/carbon-report` zaehlt. Eine gleichzeitig laufende andere Sitzung zaehlt mit ihrer bisherigen Summe. Ohne Datenbank noch (vor dem ersten Sitzungsstart eines allein installierten Plugins oder mit fehlendem `jq` oder `sqlite3`) zeigt der Bereich das Molekül und sagt, worauf die Historie wartet.

Claude Code zeichnet Mods nur im Terminal und im Code-Tab der Desktop-App: nichts erscheint im Chat-Bereich der VS-Code-Erweiterung, in Cloud-Sitzungen oder mit `claude -p`. Mods brauchen Claude Code 2.1.287 oder neuer (2.1.286 in der Desktop-App).

Der Mod gehoert zum Plugin. Bereits aus dem Marketplace installiert? Fuehre `/plugin marketplace update claude-carbon` und `/plugin update claude-carbon@claude-carbon` aus und starte Claude Code neu.

Das Plugin allein erfasst deine Sitzungen und setzt die Terminal-Statuszeile, wenn du keine hast (siehe [Install](#install)):

```
/plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

Beim ersten Sitzungsstart nach der Installation legt das Plugin seine Datenbank in `~/.claude/claude-carbon/` an und fuellt sie mit den Sitzungen, deren Transkripte noch auf der Platte liegen (etwa die letzten 30 Tage, jedes Projekt), danach erfasst es jede Sitzung laufend. Eine einmalige Nachricht sagt das bei einem der naechsten Sitzungsstarts. Es braucht `jq` und `sqlite3`: fehlt eines, wird nichts angelegt, und `/carbon-panel` nennt es. Das passiert einmal: eine geloeschte Datenbank wird nicht zurueckgeholt (loesche die `auto-setup`-Datei daneben, um eine neue anzufordern), ein mit `CLAUDE_CARBON_DB` gesetzter Datenbankpfad wird nie fuer dich angelegt, und `CLAUDE_CARBON_NO_AUTOSETUP=1` schaltet es ab. Von da an laeuft die taegliche Hintergrundpruefung auf eine neuere Version wie beim Installationsprogramm (`CLAUDE_CARBON_NO_UPDATE_NOTIFIER=1` zum Abmelden).

#### In einem Team-Repository

Um das Plugin allen bereitzustellen, die in einem Repository arbeiten, committe dies in dessen `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "claude-carbon": { "source": { "source": "github", "repo": "gwittebolle/claude-carbon" } }
  },
  "enabledPlugins": { "claude-carbon@claude-carbon": true }
}
```

Das Aktivieren im Repository laedt es auf niemandes Rechner herunter, da das Plugin aus einem entfernten Marketplace kommt: Jeder Mitwirkende fuehrt einmal `claude plugin install claude-carbon@claude-carbon --scope project` in seinem Klon aus, nachdem er dem Ordner vertraut hat. Wer es nicht will, setzt `"claude-carbon@claude-carbon": false` unter `enabledPlugins` in seiner eigenen `.claude/settings.local.json`. Die Zahlen bleiben bei jedem auf dem eigenen Rechner.

Die curl-, PowerShell- und npm-Installationsprogramme richten Statuszeile, Datenbank und Hooks ein und kopieren den Mod allein nach `~/.claude/skills/claude-carbon/`, wo Claude Code ihn als `claude-carbon@skills-dir` laedt. `/carbon-update` haelt diese Kopie aktuell. Die Kopie enthaelt keinen Hook, nichts laeuft also zweimal. Starte Claude Code nach der Installation neu; der Mod laedt, sobald dem geoeffneten Ordner vertraut wird. Sein Median beginnt bei null: von einer anderen Installation des Mods gespeicherte Antworten wandern nicht mit. Mit dieser Kopie zeigt der Mod sich im Terminal, im integrierten Terminal des Editors und im Code-Tab der Desktop-App.

Um ihn abzuschalten, fuehre `claude plugin disable claude-carbon@skills-dir` aus. Um ihn zu entfernen, fuehre das Installationsprogramm mit `CLAUDE_CARBON_NO_MOD=1` auf der `bash`-Seite aus (`curl … | CLAUDE_CARBON_NO_MOD=1 bash`); behalte die Variable in deiner Shell oder im `env`-Block von `settings.json`, sonst setzt der naechste `/carbon-update` sie zurueck. Einen `skills/claude-carbon/`-Ordner, den es nicht selbst erstellt hat, laesst das Installationsprogramm in Ruhe, und es ueberspringt die Kopie, solange das claude-carbon-Plugin aktiviert ist. Waehle eines von beidem: Das Plugin zusaetzlich zu einer Installer-Installation laeuft die Hooks zweimal.

Schalte die Zahl pro Antwort mit der Option `showPerTurn` in `/config` aus. Der Mod schreibt keine Datenbank, startet keinen Prozess, macht keinen Netzwerkanruf und aendert nie, was Claude tut; ausser seinen eigenen Datendateien liest er nur `sessions-history.tsv`, die beiden Release-Markierungen der taeglichen Pruefung (`plugin-update-check.json`, `update-check.json`), `last-card-month` und die zwei Dateien, die der SessionStart-Hook anlegt, wenn er keine Datenbank findet (`setup-needed`, `auto-setup`). Der Text ist auf Franzoesisch, wenn die erste der gesetzten Variablen `CLAUDE_CARBON_LOCALE`, `LC_ALL`, `LC_MESSAGES` und `LANG` mit `fr` beginnt, sonst auf Englisch. Wenn keine gesetzt ist, wie in der Desktop-App und oft unter Windows, entscheidet die Einstellung `language` (`Français`, `English`), dann Franzoesisch.

Die eigenen Tests des Mods laufen mit `bash tests/run-mod-kit.sh` unter `claude plugin test`, was die Engine nachbildet: keine Anmeldung noetig. CI fuehrt sie bei jedem Push mit Claude Code 2.1.296 aus.

## Verwendung mit ccstatusline

Claude Code akzeptiert nur einen `statusLine`-Befehl, die vollstaendige claude-carbon-Statuszeile und [ccstatusline](https://github.com/sirmalloc/ccstatusline) koennen also nicht nebeneinander laufen. Wenn ccstatusline deine Statuszeile steuert, bette stattdessen das CO2-Segment ein: Fuege in der ccstatusline-TUI ein `Custom Command`-Widget hinzu, das auf zeigt

```
~/code/claude-carbon/scripts/statusline.sh --segment
```

(passe den Pfad an, wenn du mit `CLAUDE_CARBON_DIR` installiert hast). Das Widget erhaelt dasselbe Status-JSON ueber stdin und gibt nur das Paar Kosten + CO2 aus, etwa `$0.68 · 35gCO₂`. Der Segment-Modus beruehrt nie das Netzwerk. Die Speicherung in der lokalen Datenbank bleibt davon unberuehrt: Sie laeuft ueber Hooks, nicht ueber die Statuszeile.

Mit dem Segment in ccstatusline zeigt der [Mod](#der-mod-carbon-panel-und-der-co2-jeder-antwort) die Sitzungssumme unter der Eingabe ein zweites Mal. Schalte sie mit der Option `showSessionTotal` in `/config` aus; die Desktop-App ohne Statuszeile behaelt sie.

## Emissionsfaktoren

Die Faktoren stammen von [Jegham et al. 2025](https://arxiv.org/abs/2505.09598), einem arXiv-Preprint, der den Energieverbrauch von LLM-Inferenz auf AWS-Infrastruktur aus oeffentlichen API-Leistungsdaten (Latenz, Durchsatz) ueber abgeleitete Hardwarekonfigurationen schaetzt.

| Modell | Erstes Lesen (Eingabe, Cache-Schreiben) | Erneutes Lesen (Cache-Lesen) | Geschrieben (Ausgabe) | Grundlage |
| --- | --- | --- | --- | --- |
| Fable | 156 | 12,5 | 3304 | Extrapoliert (2x Opus) |
| Opus | 78 | 6,2 | 1652 | Extrapoliert (2x Sonnet) |
| Sonnet | 39 | 3,1 | 826 | 3-Punkte-Anpassung (Jegham v6) |
| Haiku | 10 | 0,8 | 207 | Extrapoliert (0,25x Sonnet) |

In gCO2e pro Million Tokens. In einer Claude-Code-Sitzung sind etwa 98 % der Tokens Kontext, den Claude bei jedem Schritt erneut liest. Jedes davon wiegt wenig, zusammen machen sie aber etwa 60 % des CO2 aus; der Text, den Claude schreibt, sind unter 1 % der Tokens und etwa 30 % des CO2 (30 Tage der Sitzungen des Autors, Oktober 2026).

**Wichtig: Das sind Größenordnungs-Schaetzungen, keine praezisen Messungen.**

- Die Sonnet-Faktoren sind eine 3-Punkte-Mindestquadrat-Anpassung an die drei in Jegham et al. v6 geschaetzten Energiewerte pro Claude-3.7-Sonnet-Anfrage (0,950 / 2,989 / 5,671 Wh), was ein Verhaeltnis Ausgabe:Eingabe von etwa 21:1 ergibt; unabhaengige oeffentliche Schaetzungen liegen in derselben Groessenordnung. Fable, Opus und Haiku sind extrapoliert (keine oeffentlichen Daten von Anthropic zum Energieverbrauch pro Modell): Opus = 2x Sonnet (ehrliche Spanne 2x–5x), Haiku = 0,25x, Fable = 2x Opus. Siehe [METHODOLOGY.md](METHODOLOGY.md).
- Sitzungen mit Nicht-Anthropic-Modellen (etwa lokale Modelle hinter `ANTHROPIC_BASE_URL`) werden mit ihren rohen Tokens, aber null Kosten/CO2 gespeichert und aus den Berichten ausgeschlossen – ein Rechenzentrumsfaktor passt nicht auf sie. Ergänze Muster in `exclude_models` in `data/factors.json`, um weitere Modelle nach Namen auszuschliessen.
- Cache-Lese-Tokens werden mit einem reduzierten Faktor gezaehlt (standardmaessig 0,08 eines Eingabe-Tokens, festgelegt in `data/factors.json`). Ein gecachtes Token ueberspringt den Grossteil der Prefill-Berechnung; der Faktor ist der Rest. Das ist eine technische Schaetzung aus der Literatur, nicht Anthonics Abrechnungsverhaeltnis von 0,1x. Das erneute Lesen des Caches in der Dekodierphase waechst mit Kontextlaenge mal generierten Tokens und ist noch nicht modelliert; jede Sitzung speichert dieses Produkt (`output_context_sum`), damit spaeter ein kalibrierter Term auf die Historie angewendet werden kann. Siehe [METHODOLOGY.md](METHODOLOGY.md).

- Geprueft gegen die Literatur von April bis September 2026 (Messarbeiten, Anbieterangaben, das Watershed-Framework) mit einer Sensitivitaetslaeufen ueber 30 Tage echte Transkripte: kein Faktor wurde verschoben, der angezeigte Wert ist eher zu niedrig als zu hoch, naechste Pruefung Maerz 2027. Siehe [Where the estimate stands](METHODOLOGY.md#where-the-estimate-stands-september-2026).
- Die Kohlenstoffintensitaet nutzt das AWS-Regionsnetz (standortbasiert, 0,287 kgCO2e/kWh), keine Echtzeit-Netzdaten. Das liegt am unteren Ende der standortbasierten Spanne; der US-Landesdurchschnitt liegt bei etwa 380 g/kWh.
- Anthropic veroeffentlicht keine Emissionen nach Scope 1, 2 oder 3. Diese Schaetzungen sind unabhaengig und beruhen auf akademischer Forschung, nicht auf Anbieterdaten.

Der Autovergleich in Berichten und Karten folgt deiner Spracheinstellung, da ein Autokilometer in einem Land bis zu 1,7-mal mehr Emissionen verursacht als in einem anderen: ADEMEs 142 gCO2e/km bei franzoesischer oder unerkannter Einstellung, EPAs 393 gCO2e/Meile bei US-Einstellung, sonst ein Weltmittel von 200 gCO2/km. Erzwinge eine mit `CLAUDE_CARBON_LOCALE` (`fr`, `us`, `world` oder eine beliebige Locale-Zeichenkette). Die Faktoren liegen in `data/factors.json` unter `equivalences`.

`/carbon-report` nennt auch die Summe dieses Kalenderjahres als Anteil an 2 tCO2e, dem Pro-Kopf-Ziel 2050 fuer einen gesamten Fussabdruck (ADEME, [Nos Gestes Climat](https://nosgestesclimat.fr/blog/environnement/reduire-empreinte-carbone-objectif-deux-tonnes), aus den IPCC-1,5-°C-Szenarien; auch Carbone 4, *Faire sa part ?*, 2019). Das dient als Massstab: die 2 t umfassen alles, was ein Mensch in einem Jahr emittiert, KI eingeschlossen. Quellen und Vorbehalte: [METHODOLOGY.md](METHODOLOGY.md#annual-budget-line).

Faktoren sind in `data/factors.json` bearbeitbar. Die vollstaendige wissenschaftliche Grundlage, Formel und Vergleiche stehen in [METHODOLOGY.md](METHODOLOGY.md).

### Golden Vectors

Die Methodik ist durch goldene Testvektoren in [`tests/methodology-vectors.json`](tests/methodology-vectors.json) festgenagelt: handberechnete erwartete CO2-/Kostenwerte fuer bekannte Token-Aufteilungen, die bei jedem Push in CI durch `bash tests/run-vectors.sh` nachgespielt werden. Nachgelagerte Nutzer (wie TokenClimate) bewahren eine Kopie dieser Datei auf und pruefen woechtentlich, dass ihre Implementierung dieselben Zahlen liefert. Wenn du `data/factors.json` oder `data/prices.json` bearbeitest, aktualisiere die Vektoren im selben Commit, sonst scheitert CI.

## Aktualisieren

Wenn eine neuere Version verfuegbar ist, zeigt die Statuszeile einen dezenten Hinweis `⬆ /carbon-update`. Die Pruefung laeuft im Hintergrund (hoechstens einmal taeglich, nie auf dem Hot-Pfad der Statuszeile); mit `CLAUDE_CARBON_NO_UPDATE_NOTIFIER=1` kannst du sie abstellen.

- **Im Terminal mit einer git-Klon-Installation** erscheint der Hinweis am Ende der Statuszeile und nennt die neue Version.
- **Ueberall, wo der Mod laeuft** (Desktop-App und ein Terminal ohne die claude-carbon-Statuszeile), beendet derselbe Hinweis den Sitzungseintrag unter der Eingabe, und der `/carbon-panel`-Bereich nennt die Version oben im Fuss. Bei einer Plugin-Installation fragt dieselbe taegliche Hintergrundpruefung GitHub nur nach Release-Tags und beruehrt nie Claudes Plugin-Cache.
- **Vor dem Sommer 2026 installiert** (Version 1.0, gar kein Hinweis)? Fuehre die Installation erneut aus, in der App oder im Terminal, wie unter [Install](#install).

Fuehre zum Aktualisieren `/carbon-update` in Claude Code aus, unabhaengig von der Installationsart: beim Plugin laeuft es `claude plugin marketplace update claude-carbon` und `claude plugin update claude-carbon@claude-carbon`, beim Installer-Klon dessen eigener Updater. Starte Claude Code danach neu. Bei beiden Installationen – etwa wenn die Statuszeile aus einem Klon laeuft – wird nur das Plugin aktualisiert und der Befehl gibt das `git pull` fuer den Klon aus. Du kannst auch das Installationsprogramm erneut ausfuehren:

```bash
curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | bash
```

- Eine Aktualisierung eines Installer-Klons bewertet deine gespeicherte Historie automatisch mit den neuen Faktoren neu (nur CO2; Kostenwerte bleiben unberuehrt); eine Aktualisierung des Plugins tut das nicht. Fuehre `scripts/recompute.sh --with-cost` selbst erst nach einer Preisänderung aus.
- Wenn du `data/factors.json` oder `data/prices.json` lokal bearbeitet hast, behält die Aktualisierung deine Aenderungen; bei einem Konflikt mit upstream speichert sie deine Version als `*.local.bak` und sagt es dir.
- Die Aktualisierung erneuert auch die Kopie des [Mods](#der-mod-carbon-panel-und-der-co2-jeder-antwort). Wenn sie zu einem Neustart auffordert (unter Windows laesst sich eine benutzte Kopie nicht ersetzen), starte Claude Code neu und fuehre sie erneut aus; bis dahin bleibt die vorherige Kopie.
- Vom Plugin-Marketplace installiert, kannst du Claude Code die Aktualisierung auch selbst ueberlassen: In `/plugin`, Tab **Marketplaces**, `claude-carbon` auswaehlen und dann **Enable auto-update**. Die neue Version laedt mit der naechsten Sitzung.

## Deinstallieren

Bei einer Installation durch das curl-, PowerShell- oder npm-Installationsprogramm:

```bash
bash ~/code/claude-carbon/scripts/configure-settings.sh --remove
```

(passe den Pfad an, wenn du mit `CLAUDE_CARBON_DIR` installiert hast). Es entfernt die Statuszeile, die Hooks, die `/carbon-*`-Befehle und die Mod-Kopie aus `~/.claude`, aber nichts, was einem anderen Werkzeug gehoert: eine Statuszeile, die `statusline.sh --segment` aufruft, bleibt, und ebenso jeder andere Hook einer geteilten Gruppe. Deine Historie bleibt in `~/.claude/claude-carbon/`. Um alles zu entfernen, loesche danach diesen Ordner und den Klon.

Beim Plugin: `claude plugin uninstall claude-carbon@claude-carbon`, dann entferne den `statusLine`-Eintrag, der `claude-carbon/statusline.sh` nennt, aus `~/.claude/settings.json`: Das Plugin kann es beim Entfernen nicht selbst tun, und danach gibt die Statuszeile nichts mehr aus. Ein ausgeschaltetes statt deinstalliertes Plugin zeichnet sie weiter, bis du den Eintrag entfernt hast. `CLAUDE_CARBON_NO_STATUSLINE=1` verhindert, dass das Plugin ueberhaupt eine Statuszeile setzt. Das Plugin setzt sie einmalig: Wenn sie nach dem Entfernen wieder gesetzt werden soll, loesche `~/.claude/claude-carbon/statusline-set`.

Eine zweite Kopie ueber eine erste zu legen (ein anderer Ordner oder das Installationsprogramm nach dem Plugin-Klon) wuerde jeden Hook zweimal ausfuehren. Das Installationsprogramm stoppt, wenn es eine andereInstallation in `settings.json` findet, nennt sie und gibt den Befehl aus, der sie ersetzt (`configure-settings.sh --replace`). Von einer Installation zurueckgelassene Hooks, deren Ordner geloescht wurde, werden ohne Rueckfrage ersetzt.

## Abhaengigkeiten

- `jq` - JSON-Parsing
- `sqlite3` - lokale Datenbank
- `git` - Branch-Erkennung in der Statuszeile (optional)
- `curl` - Abo-Kontingent ueber Anthonics `/api/oauth/usage`-Endpunkt, wenn Claude Code es nicht uebergibt (optional, hoechstens einmal pro Minute)
- `node` + Google Chrome, Microsoft Edge, Chromium oder Brave (oder `playwright-core` und sein Chromium) - PNG-Export fuer `/carbon-card` (optional)

`sqlite3` ist auf jedem Mac vorinstalliert, `jq` ab macOS 15 (Sequoia). Auf einem aelteren Mac ohne `jq` laedt das Installationsprogramm die offizielle jq-1.8.1-Binaerdatei fuer den Prozessor des Macs, prueft sie gegen die vom jq-Projekt veroeffentlichte SHA-256 und legt sie in `~/.claude/claude-carbon/bin/` ab, wo die Skripte und Slash-Befehle sie finden; ein spaeter installiertes `jq` (etwa Homebrew) hat Vorrang. Unter Linux: `apt install jq sqlite3`. Unter Windows siehe unten.

`/carbon-card` zeichnet seine PNGs mit einem Chromium-Browser im Headless-Modus und einem temporaeren Profil. Es nutzt Playwrights Chromium, wenn `playwright-core` installiert ist (gesucht in Nodes eigener Modulauflösung, im globalen npm-Root, in `~/node_modules` und in Homebrews Node-Modulen), sonst den ersten Browser am ueblichen Ort: Google Chrome, Microsoft Edge, Chromium oder Brave unter macOS, Chrome oder Edge unter Windows und unter Linux den ersten davon auf dem `PATH`. `CLAUDE_CARBON_BROWSER` nennt einen anderen, nach Pfad oder Befehl, oder `none`, um die Suche zu ueberspringen. Ein Browser, der nach 60 Sekunden nichts gezeichnet hat, wird gestoppt und nicht erneut versucht. Ohne Browser oeffnet sich die Karte als Seite im Standardbrowser, und ein Screenshot davon ist die Karte.

## Windows

claude-carbon ist bash und bleibt auch unter Windows bash. Das ist Absicht, keine Abkuerzung: Auf nativem Windows fuehrt Claude Code Statuszeilen- und Hook-Befehle ueber das bash aus, das mit [Git for Windows](https://git-scm.com/downloads/win) kommt, und greift nur auf PowerShell zurueck, wenn Git Bash fehlt

([Statuszeilen-Doku](https://code.claude.com/docs/en/statusline#windows-configuration),

[Hook-Doku](https://code.claude.com/docs/en/hooks)). Das Plugin spricht die Shell, die sein Host ohnehin startet.

**Natives Windows.** Installiere zuerst Git for Windows, dann starte Claude Code neu, damit es Git Bash findet:

```powershell
winget install Git.Git --source winget
```

Installiere danach im selben Terminal `jq` und `sqlite3`, die zwei Befehle, die Git for Windows nicht mitbringt, und fuehre das Installationsprogramm aus:

```powershell
winget install jqlang.jq --source winget
winget install SQLite.SQLite --source winget
irm https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.ps1 | iex
```

Das Installationsprogramm prueft beide und gibt fuer fehlende den `winget`-Befehl aus; es fuehrt `winget` selbst nicht aus.

Alles andere, was das Plugin braucht – `bash`, `awk`, `sed`, `grep`, `date`, `curl`,

`git`, `cygpath` – kommt mit Git for Windows.

**WSL 2.** Nichts Besonderes: Fuehre das `curl | bash`-Installationsprogramm innerhalb deiner Distribution aus.

Claude Code, seine Transkripte und claude-carbon liegen alle auf der Linux-Seite. Das ist der richtige Weg, wenn deine Projekte schon in WSL liegen. VS Code erreicht es ueber die Erweiterung Remote - WSL.

**Marketplace-Installation.** `/plugin install claude-carbon@claude-carbon` verhaelt sich wie unter macOS, sobald Git for Windows, `jq` und `sqlite3` vorhanden sind.

### Windows-Besonderheiten

- **Git Bash ist erforderlich.** Ohne ihn leitet Claude Code Befehle an PowerShell, die keine `.sh`-Datei ausfuehren kann. `claude doctor` sagt dir, welche Shell gewaehlt wurde. Falls Git ungewoehnlich installiert ist, zeige Claude Code den Pfad in `settings.json`:
  `{"env": {"CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"}}`.
- **Pfade in `settings.json` verwenden Schraegstriche** (`C:/Users/you/code/claude-carbon/...`).
  Git Bash verschluckt unmaskierte Rueckwaertsschraegstriche, und der Befehl scheitert ohne sichtbaren Fehler.
  Das Installationsprogramm schreibt sie richtig; nur von Hand bearbeitete Dateien brauchen Sorgfalt.
- **Slash-Befehle werden kopiert, nicht verknuepft.** Git Bash kann ohne Entwicklermodus keinen echten Symlink erstellen, deshalb werden `/carbon-report` und Genossen nach
  `~/.claude/commands/` kopiert und bei jeder Aktualisierung erneuert.
- **Sandboxing ist auf nativem Windows nicht verfuegbar** (eine Einschraenkung von Claude Code, nicht dieses Plugins). Nutze WSL 2, wenn du es brauchst.
- **`/carbon-card` braucht zusaetzlich Node.js**: `winget install OpenJS.NodeJS --source winget`.
- **`winget` antwortet "Access is denied" (`0x80070005`)**: Sicherheitssoftware auf dem PC blockiert es, etwa das Verhaltensschutz eines Antivirenprogramms. Erlaube `winget` dort und fuehre
  den Befehl erneut aus.
- **Hinter einem TLS-pruefenden Proxy oder Antivirenprogramm** scheitert der Klon mit
  `SSL certificate problem: unable to get local issuer certificate`. Git for Windows
  prueft Zertifikate gegen seine eigene CA-Liste, die die Wurzel solcher Werkzeuge nicht kennt, die den Datenverkehr neu signieren; der Windows-Zertifikatsspeicher schon. Stelle git darauf um
  (die Pruefung bleibt aktiv) und fuehre das Installationsprogramm erneut aus:
  `git config --global http.sslBackend schannel`. Das Installationsprogramm gibt diesen Hinweis
  aus, wenn es den Fall erkennt. Dieselbe Abfangtechnik ist der Grund, warum `winget` auf solchen Maschinen
  `--source winget` braucht: Die Microsoft-Store-Quelle besteht die Zertifikatspruefung nicht, und ohne explizite Quelle bricht winget ab, statt
  zurueckzufallen.

claude-carbon ist kostenlos und Open Source unter der [MIT-Lizenz](LICENSE). Beitraege willkommen.

<p align="center"><img src="docs/mascot-stripes.svg" width="696" alt="Acht Pixel-CO2-Moleküle, das Maskottchen von claude-carbon, von Dunkelblau nach Dunkelrot laufend, je roeter desto schneller: die blauen laecheln, die roten schwitzen"></p>

Die Streifen des Banners und von `/carbon-panel` sind von Ed Hawkins' [Erwärmungsstreifen](https://showyourstripes.info) inspiriert und hier aus deinen eigenen Sitzungen gezeichnet.

Erstellt von [Gaëtan Wittebolle](https://gaetanwittebolle.com), Kohlenstoffberater, der in Bordeaux, Frankreich, als Solo-Entwickler arbeitet. Team-Version: [TokenClimate](https://tokenclimate.com).

## Quelle und Lizenz

- Originalautor: gwittebolle
- Originalrepository: https://github.com/gwittebolle/claude-carbon
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
