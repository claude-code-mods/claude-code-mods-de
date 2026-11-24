# agent-usage-guard

> Verhindert, dass Claude Code dein Fünf-Stunden-Nutzungsfenster in zehn Minuten verbraucht.

`agent-usage-guard` ist ein Claude-Code-[Mod](https://code.claude.com/docs/en/plugins/mods/overview): Es läuft innerhalb von Claude Code und bremst ausufernde Ausgaben, bevor sie entstehen. Es liest die aktuelle Nutzung deines Plans und deckelt Subagenten-Fan-out, das Hin- und Herschieben großer Kontexte und Wiederholungsschleifen.

<p align="center">
  <a href="https://www.producthunt.com/products/agent-usage-guard?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-agent-usage-guard" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1289693&amp;theme=dark">
      <img alt="agent-usage-guard on Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1289693&amp;theme=light">
    </picture>
  </a>
</p>

<p align="center">
  <img src="https://github.com/rbartoli/agent-usage-guard/releases/download/agent-usage-guard--v1.0.0/agent-usage-guard.gif" alt="Four scenes in Claude Code's interactive UI. The guard asks before a prompt re-writes the expired cache of a 486k-token session resumed after two hours, before a fifth parallel agent starts against a limit of four, before a twenty-first tool call at 433k context, and before a new agent once subagents have processed 10.9M tokens." width="900">
</p>

<p align="center">
  <sub>Aufgezeichnet aus der interaktiven Oberfläche von Claude Code mit geladenem Guard. Eine <a href="demo/scripted-api.ts">geskriptete lokale API</a> steht anstelle von Claude, die Sitzungen und Tokenzahlen sind also gestellt und es wird keine Nutzung verbraucht. Jede Frage auf dem Bildschirm stammt vom Guard selbst. <a href="demo/render.sh">Neu bauen</a> aus dem <a href="demo/fixture/northstar-api">Northstar-Fixture</a>.</sub>
</p>

Es greift vor den Ausgaben ein, nicht danach: bevor ein Agent startet, ein Prompt gesendet wird oder ein Werkzeugaufruf läuft. Agentenlimits gelten über jede Claude-Code-Sitzung auf deinem Rechner, und Fan-out sowie große Kontexte werden bei jeder Nutzungsstufe begrenzt, nicht nur kurz vor dem Limit. Wenn du an der Tastatur bist, fragt es dich im eigenen Frage-Dialog von Claude Code. Wenn niemand antworten kann, lehnt es ab und nennt Claude den Grund, damit das Modell warten, die Arbeit bündeln oder aufhören kann. `/agent-guard report` zeigt, was es getan hat.

- **Planbewusst.** Es liest die Prozentwerte für 5 Stunden und Woche, die Claude Code meldet, und hält das Ende des Fensters für dich frei.
- **Eine Antwort gilt für eine Weile.** Eine Freigabe hebt ihre Bedingung auf, bis sie verfällt oder eine Zeitüberschreitung eintritt, sodass dieselbe Frage nicht bei jedem Aufruf erneut auftaucht.
- **Lokal und sparsam mit Daten.** Kein Netzwerk, keine Prozesse. Es speichert Zähler und grobe Kategorien, niemals Prompt-Text, Werkzeugeingaben oder Modellausgaben.
- **Fehlertolerant nach außen.** Schlägt einer seiner Hooks fehl, läuft das Ereignis weiter: Ein defekter Guard zerstört nie deine Sitzung. Die einzige Ausnahme ist ein Agent, den es nicht beurteilen konnte; dieser wird abgelehnt, damit Claude ihn erneut startet.

## Install

Führe diese Befehle innerhalb von Claude Code v2.1.287 oder neuer aus:

```text
/plugin marketplace add rbartoli/agent-usage-guard
/plugin install agent-usage-guard@agent-usage-guard
/reload-plugins
```

Danach führe `/agent-guard` aus, um zu sehen, was es sieht, und `/agent-guard simulate concurrency`, um die Frage zu sehen, die es stellt, wenn zu viele Agenten laufen – ohne dass etwas gehalten oder verbraucht wird. Mods sind standardmäßig aktiv; die [Übersicht](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off) listet die Einstellungen, die sie abschalten.

## Warum es das gibt

Eines Nachmittags gab ich Claude Code einen Recherche-Prompt mit maximalem Aufwand. Es erzeugte **394 Subagenten-Aufrufe, 341 davon gleichzeitig, und schob in zehn Minuten 84 Mio. Kontext-Token durch die API.** Sitzung beendet: *„Claude usage limit reached.“* Ausgesperrt, bis das Fenster zurücksetzte.

Das war kein Einzelfall. Sechzig Tage meiner eigenen Protokolle enthielten **12 Sperren** und 166 Zehn-Minuten-Fenster mit Agenten-Ausbrüchen. Das Fehlermuster multipliziert sich: *großer Kontext × schnelle Werkzeugschleifen × parallele Agenten × blindes Wiederholen*. Jede der folgenden Absicherungen nimmt einen Faktor heraus.

Und es betrifft nicht nur mich: [339 Subagenten aus einem einzigen Prompt](https://www.reddit.com/r/ClaudeAI/comments/1u5d02w/), [eine halbe wöchentliche Max-Stufe durch rekursives Spawn verbraucht](https://github.com/anthropics/claude-code/issues/68619) und Multi-Agenten-Läufe mit [rund 15× der Token einer Chat-Sitzung](https://www.anthropic.com/engineering/built-multi-agent-research-system).

## Was es tut

| Bereich | Regel | Standard | Was passiert |
|---|---|---|---|
| Planfenster | Neue Agenten brauchen eine Freigabe, sobald ein Fenster so voll ist | 80% | fragt; die Freigabe gilt bis zum Zurücksetzen dieses Fensters |
| | Neue Agenten werden abgelehnt, sobald ein Fenster so voll ist | 95% | lehnt ab |
| | `ScheduleWakeup` und `CronCreate` werden abgelehnt, sobald ein Fenster so voll ist, damit kein Zug sich selbst ins Limit startet | 95% | lehnt ab |
| | Jede Sitzung wird einmal aufgefordert, ihren Schritt zu beenden und zu sagen, was übrig ist | 95% | ergänzt eine Notiz im nächsten Prompt |
| | Neue Agenten brauchen eine Freigabe, wenn das 5-Stunden-Fenster so schnell steigt | 20 Punkte / 10 Min. | fragt |
| | Neue Agenten brauchen eine Freigabe, wenn das Tempo des 5-Stunden-Fensters in den letzten 10 Minuten es innerhalb einer Stunde füllen würde, bevor es zurücksetzt | mindestens 2 Punkte in 2 Min. | fragt |
| Agenten | Gleichzeitig laufende Agenten, über alle Sitzungen auf diesem Rechner | 4 | fragt |
| | Gestartete oder fortgesetzte Agenten pro 10 Minuten, auf diesem Rechner | 12 | fragt |
| | Von Subagenten verarbeitete Token pro 10 Minuten, auf diesem Rechner; eine Freigabe gilt eine Stunde | 10 Mio. | fragt |
| | Subagenten dürfen keine eigenen Agenten starten | Tiefe 1 | lehnt ab |
| Kontext | Claude wird einmal darauf hingewiesen, den Zug begrenzt zu halten | 300k Token | ergänzt eine Notiz im Prompt |
| | Ein Prompt, der so viel Kontext erneut lesen würde | 500k Token | fragt: erst komprimieren, trotzdem senden oder abbrechen |
| | Werkzeugaufrufe pro 10 Minuten, während eine Unterhaltung oder ein Agent so viel trägt | 20 Aufrufe bei 400k | fragt: weitermachen, nach diesem Zug komprimieren oder aufhören |
| | Eine große Sitzung, die lange genug untätig ist, dass ihr Prompt-Cache abläuft | 150k Token, 1 Std. untätig | fragt, bevor der Cache neu geschrieben wird |
| Schleifen | Derselbe Werkzeugaufruf scheitert wieder und wieder, ohne anderen Aufruf dazwischen | 3 identische Fehlschläge | lehnt den identischen Wiederholungsversuch ab |
| | Abgelehnte Agenten-Aufrufe innerhalb von 10 Minuten | 5 | pausiert das Starten von Agenten für 10 Min. |

Agenten umfasst Subagenten, Agent-Team-Mitglieder, Workflow-Agenten und beendete Subagenten, die mit `SendMessage` fortgesetzt werden. Haiku-Agenten bleiben aus den Limits für laufende und gestartete Agenten heraus, egal ob Claude Haiku anfordert oder die Definition des Agenten es wählt; sie zählen weiterhin zum Subagenten-Token-Budget und zu jeder Planfenster-Regel. Jeder Werkzeugaufruf wird anhand des Kontexts der Schleife beurteilt, die ihn auslöst, sodass ein kleiner Subagent nie die Größe der Hauptunterhaltung erbt.

**Wann es fragt.** Die Frage erscheint im eigenen Dialog von Claude Code, dem, den Claude nutzt, um dich etwas zu fragen, und der Aufruf wartet auf deine Antwort. Parallel gestartete Agenten werden zurückgehalten, solange er offen ist, und Claude startet sie erneut, sobald du geantwortet hast. Wenn du es erlaubst, bleibt diese Bedingung für eine Weile erlaubt: ein Planfenster bis zum Zurücksetzen, ein großer Kontext, bis er schrumpft (bei Werkzeugaufrufen höchstens eine Stunde), die Agentenzähler für 10 Minuten. Wenn du ablehnst oder die Frage wegwischst oder sie aus einem anderen Grund ohne Antwort schließt, wird Claude gesagt, für die nächsten 10 Minuten keine Agenten zu starten (`AGENT_GUARD_WINDOW_SECONDS`), und es wird in dieser Zeit nicht erneut gefragt. Getippte Worte erreichen Claude, du kannst also antworten „nimm stattdessen Haiku-Agenten“.

**Wenn niemand antworten kann.** In `claude -p`, im Agent SDK und im `dontAsk`-Modus lehnt ein Agenten- oder Werkzeuggate ab, statt zu fragen. Ein großer Prompt wird mit Begründung gehalten, ebenso ein ruhender großer Fortsetzungsversuch, sobald das rechnerweite Limit von einem pro 10 Minuten erreicht ist. Prompts, die von sich aus einen Zug starten, etwa ein ausgelöster Zeitplan oder `/loop`, eine von einem Kanal wie Slack weitergeleitete Nachricht oder ein Slack-Ping, werden genauso gehalten, selbst in einer Sitzung, in der man jemanden fragen könnte; sie heben Limits nie auf. Claude liest jede Ablehnung als Ergebnis des Werkzeugs. Wiederholte Ablehnungen derselben Bedingung sind jedes Mal anders formuliert und eskalieren: Die zweite sagt, dass sich nichts geändert hat, und rate zu etwas anderem, die dritte sagt, der Zug solle beendet werden. Wenn ein Stop-Hook wie `/goal` den Zug immer wieder öffnet, sagt die Ablehnung, dass der Nutzer entscheiden muss.

**Was es anzeigt.** Während Agenten auf diesem Rechner laufen oder der Guard gerade etwas hält oder eben abgelehnt hat, zeigt eine Zeile über dem Prompt es an: `Usage guard · 3 of 4 agents running · 5 of 12 started in the last 10 min · last refusal 14:22: concurrency`. Sobald ein Limit erreicht ist oder etwas gehalten wird, ist sie fett, und sie verschwindet, wenn es nichts zu sagen gibt. Das `[-]` daneben in Claude Code klappt sie ein. Planfenster und Kontext bleiben in der Statuszeile.

**Was es in Ruhe lässt.** Es hält nie die Benachrichtigung einer Hintergrundaufgabe oder die Nachricht einer anderen Sitzung an, weil das das Ergebnis verlieren würde. Es blockiert seit v2.1.234 auch keine Prompts mehr nach einem Nutzungslimit: Claude Code wartet an einem Limit und setzt seitdem bei dessen Zurücksetzen von selbst fort (`autoContinueAtUsageLimit`). Die Aufgabe des Guards ist es, dich gar nicht erst an das Limit kommen zu lassen, und sein Journal zählt die Sperren, die es nicht verhindert hat. Nahe am Limit ergänzt es nur eine Notiz: ab 95% sagt der nächste Prompt jeder Sitzung Claude, den laufenden Schritt zu beenden, nichts Großes zu beginnen und den Zug mit dem zu beenden, was fertig und was übrig ist, damit eine Sperre jede Sitzung an einem sauberen Haltepunkt findet.

**Untätigkeits-Komprimierung.** Seit v2.1.299 komprimiert Claude Code eine Unterhaltung mit 200k Token oder mehr, die etwa 54 Minuten untätig ist, bevor ihr einstündiger Prompt-Cache abläuft (`idleCompaction`, standardmäßig an). Der Guard liest die komprimierte Größe und fragt deshalb nicht nach dieser Sitzung. Seit v2.1.314 läuft sie auch in VS Code und im Code-Tab von Claude Desktop, für Abonnenten mit ausgeschalteter Telemetrie, und auf Bedrock, Vertex, Foundry und LLM-Gateways, sobald der einstündige Prompt-Cache aktiv ist. Seine ruhende Frage deckt ab, was die Untätigkeits-Komprimierung auslässt: Unterhaltungen von 150k bis 200k Token, `claude -p`- und SDK-Sitzungen, ein Rechner, der bei 54 Minuten schlief, und Setups mit ausgeschalteter Untätigkeits- oder Auto-Komprimierung.

**Die eigene Fortsetzungswarnung von Claude Code.** Seit v2.1.304 warnt Claude Code in Pro- und Max-Plänen, bevor eine inaktive Unterhaltung fortgesetzt oder an eine gesendet wird, deren Cache während der Untätigkeit kalt wurde, wenn das einen spürbaren Anteil deines 5-Stunden-Limits verbrauchen würde: Du setzt trotzdem fort oder beginnst eine neue Unterhaltung. Es erscheint erst ab einem Mindestanteil, den Anthropic je Plan und Modell festlegt, für die meisten Modelle also nur bei sehr großen Unterhaltungen. Die ruhende Frage des Guards greift ab 150k Token, deckt also weiterhin die meisten kalten Fortsetzungen ab, und bei den größten siehst du möglicherweise beides.

## Befehle

```text
/agent-guard [status]                          was der Guard gerade sieht
/agent-guard allow [agents|context] [minutes]  hebt seine Limits für diese Sitzung auf (Standard: alle, 10 Min.)
/agent-guard pause [minutes]                   dasselbe wie allow, für jedes Limit
/agent-guard resume                            beendet eine allow-Freigabe vorzeitig, hebt die Agenten-Pause auf und lässt abgelehnte Fragen wieder fragen
/agent-guard report [days]                     was er auf diesem Rechner getan hat (Standard: 7 Tage)
/agent-guard simulate <rule>                   zeigt, was eine Regel tut, ohne dass etwas gehalten oder verbraucht wird
/agent-guard help                              diese Befehle
```

`/agent-guard` läuft sofort, auch mitten im Zug, und startet nie einen Modell-Zug, sodass Claude nie ein Override sieht und es nicht als Erlaubnis nehmen kann. Nur du kannst Limits aufheben: Wenn ein anderes Plugin `/agent-guard allow` oder `pause` ausführt, lehnt der Guard ab und sagt das im Transkript. `[allow-usage-guard]` oder `[allow-agent-burst]` allein als Prompt zu senden, die Marker früherer Versionen, bewirkt dasselbe wie `/agent-guard allow` oder `allow agents`.

## Was es sehen kann und was nicht

Geprüft gegen Claude Code v2.1.316:

| Pfad | Abdeckung |
|---|---|
| Subagenten, Teammitglieder und Workflow-Agenten | Gehalten, bevor sie starten (`agent.spawn`) |
| Ein beendeter Subagent, der mit `SendMessage` neue Arbeit erhält | Gehalten, bevor er fortsetzt, und einmal als Start gezählt |
| Ein von der Platte zurückgeholtes Teammitglied (Claude Code 2.1.299 oder neuer) | Gehalten, bevor es fortsetzt, und als Start gezählt |
| `/subtask`-Forks und alles andere, das ohne `agent.spawn` startet | Beim Start gezählt, nie gehalten: Claude Code bietet davor kein Ereignis. Von Claude über das Agent-Werkzeug gestartete Forks werden wie jeder Agent gehalten |
| Interne Agenten von Claude Code (Prompt-Vorschläge, Komprimierung) | Nicht gezählt |
| Prozentwerte des Planfensters | Aus der letzten API-Antwort bei einem Abo, auch in `claude -p`. API-Key-Sitzungen melden keine, daher gelten nur die Token- und Zähler-Budgets |
| Teammitglieder, die in eigenen Terminal-Panes laufen | Nicht sichtbar: ihre Schleifen laufen in anderen Prozessen |
| Sitzungen auf anderen Rechnern | Nicht gezählt: die sitzungsübergreifenden Datensätze liegen im Mod-Speicher dieses Rechners |
| Werkzeuge, die die API selbst ausführt, etwa der advisor | Nicht haltbar: dafür feuert kein Werkzeug-Ereignis |

Mods laufen in `claude` im Terminal, im Code-Tab der Desktop-App, in `claude -p` und im Agent SDK. Sie laufen nicht in einer WSL-Sitzung der Desktop-App ([wo Mods laufen](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run)).

**In Team- und Enterprise-Plänen** sowie auf Rechnern mit verwalteten Einstellungen führt Claude Code sein eingebautes Plugin `cc-plugin-sec-default` vor jedem anderen aus, sofern verwaltetes `prependPlugins` es nicht auslässt. Dieses Plugin sendet die klassischen Hook-Ereignisse von Claude Code weiter, vorbei an Nutzer-Plugins, und Claude Code zeigt für jedes übersprungene eine Zeile, etwa „agent-usage-guard: its classic.PostToolUse hook was skipped“. Der Guard verfolgt Komprimierungen, Sperren, `/clear` und Fortsetzungen sowie Stop-Hooks, die einen Zug erneut öffnen, über Ereignisse, die ihn noch erreichen. Zwei Dinge brauchen die klassischen Ereignisse: Der Berechtigungsmodus erreicht den Guard nur, wenn ein Agent startet, er kann dich also im `dontAsk`-Modus fragen, und `/subtask`-Forks bleiben unzählig.

**Native Limits bleiben wichtig.** Claude Code begrenzt eine Sitzung auf 20 gleichzeitige Subagenten (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) und drei Verschachtelungsebenen (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`). Die Gesamtzahl der Agenten, die eine Sitzung startet, ist unbegrenzt. Seit v2.1.316 legt `CLAUDE_CODE_SUBAGENT_EFFORT` den Aufwand fest, mit dem Subagenten laufen, wenn nichts anderes einen benennt, statt des Werts der Sitzung: ein niedrigerer macht jeden Agenten billiger, und der Guard begrenzt weiterhin, wie viele laufen. Die Standards des Guards sind strenger und reichen über Sitzungen; die nativen Limits bleiben die äußere Mauer für die Pfade, die der Guard nur zählt.

## Sieh, was es getan hat

```text
/agent-guard report 30
```

Der Bericht zählt Sperren durch Nutzungslimits (jedes gesperrte Fenster einmal), Überschreitungen der Planfenster-Schwellen, Hinweise zum Auslaufen sowie jede Frage und Ablehnung nach Regel, mit deiner Antwort. Er liest das Journal jeder Sitzung auf diesem Rechner und verlässt ihn nie. Setze `AGENT_GUARD_JOURNAL=0`, um die Aufzeichnung zu beenden.

## Sicherheit und Datenschutz

Ein Mod läuft innerhalb von Claude Code mit deinen Berechtigungen; lies [was ein Mod erreichen kann](https://code.claude.com/docs/en/plugins/mods/overview#what-a-mod-can-reach), bevor du eines installierst. Dieses hier ist etwa 3.000 Zeilen TypeScript ohne Abhängigkeiten, und `claude plugin validate .` listet jede API, die es aufruft, und jede Umgebungsvariable, die es liest:

- Es stellt keine Netzwerkanfragen und startet keine Prozesse. Die einzige Datei, die es liest, ist sein eigenes `plugin.json`, für die Version, die `/agent-guard status` anzeigt.
- Es entscheidet nur, was die obigen Regeln beschreiben: ob ein Agent startet, ein Prompt gesendet wird oder ein Werkzeugaufruf läuft. Es fragt dich, wann immer du antworten kannst, und nennt den Grund, wenn es ablehnt. Es liest Berechtigungsmodi, ändert sie aber nie und schreibt keine Einstellungen.
- Der einzige Prompt, den es einreicht, ist deiner. Nach „Compact, dann senden“ nimmt es den Prompt, den du getippt hast, aus dem Eingabefeld und sendet ihn unverändert, sobald die Komprimierung fertig ist, oder legt ihn zurück, wenn die Komprimierung fehlschlägt. Ein Prompt mit einem Bild oder einer @-Erwähnung bleibt im Eingabefeld, damit du ihn senden kannst, da ein erneutes Senden sie verwerfen würde.
- Sein Prompt-Hook reicht deinen Prompt unverändert weiter, ergänzt eine einmalige Notiz für Claude, wenn der Kontext 300k überschreitet oder ein Planfenster 95% erreicht, oder hält den Prompt an, um dich zuerst zu fragen (wenn niemand antworten kann, sagt er stattdessen, warum). Sein `SessionStart`-Hook ändert nichts.
- Es hält seinen Zustand im Mod-Speicher, einer JSON-Datei unter `~/.claude/plugins/store/`. Jede Sitzung schreibt ihre eigenen Zähler (laufende Agenten, kürzliche Starts und ruhende Fortsetzungen, Subagenten-Token pro Minute, ihr letzter 5-Stunden-Wert), wann sie zuletzt aktiv war (30 Tage aufbewahrt, damit eine fortgesetzte Sitzung weiß, wie lange sie untätig war) und ihre Journalzeilen (Zeit, ein Sitzungs-ID-Präfix, Regel, Werkzeugname, Kontextkategorie wie `400-500k`, Planfenster und Prozentwert, Ablehnungsnummer und deine Antwort). Jeder Datensatz wird unter der vollständigen ID der Sitzung gespeichert, die auch der Name der Transkriptdatei dieser Sitzung ist. Wenn der Speicher nicht mehr schreiben kann, etwa weil er voll ist, sagt es die Statuszeile: andere Sitzungen zählen diese dann nicht mehr mit.
- Es speichert nie Prompt-Text, Werkzeugeingaben, Fehlertext oder Modellausgaben. Wenn ein Zug mit einem API-Fehler endet, liest es die letzte Nachricht der Unterhaltung, den Fehler, den Claude Code gezeigt hat, um eine Sperre durch Nutzungslimit von anderen Fehlern zu unterscheiden. Ein Werkzeugaufruf wird auf einen 13-stelligen Fingerabdruck reduziert. Agentennamen bleiben im Speicher und werden nie geschrieben.
- Journaltage, die älter als 90 Tage sind, werden gelöscht (`AGENT_GUARD_JOURNAL_DAYS`).
- `demo/`, das das GIF oben baut, gehört nicht zu dem, was läuft. Es startet Claude Code in einem temporären Home-Verzeichnis mit einem erfundenen API-Key für eine geskriptete lokale API und liest keine deiner Zugangsdaten.

Setze `AGENT_GUARD=0`, um es abzuschalten, ohne es zu deinstallieren.

## Konfiguration

Setze diese als Umgebungsvariablen oder unter `env` in `~/.claude/settings.json`. Zeiten sind in Sekunden; ein Wert, der keine Zahl im gültigen Bereich ist, behält seinen Standard, und `/agent-guard` sagt das.

| Variable | Bedeutung (Standard) |
|---|---|
| `AGENT_GUARD` | `0`, `false`, `off` oder `no` schaltet den Guard ab (`1`) |
| `AGENT_GUARD_JOURNAL` | `0` stoppt das Journal (`1`) |
| `AGENT_GUARD_HAIKU_EXEMPT` | `0` zählt Haiku-Agenten in den Limits für laufende und Starts wie alle anderen (`1`: sie bleiben draußen) |
| `AGENT_GUARD_JOURNAL_DAYS` | Aufbewahrte Tage des Journals (`90`) |
| `AGENT_GUARD_WINDOW_SECONDS` | Gleitendes Fenster für Budgets, Verbrauch und Ablehnungen (`600`) |
| `AGENT_GUARD_AGENT_MAX` | Gleichzeitig laufende Agenten auf diesem Rechner (`4`) |
| `AGENT_GUARD_ROLLING_MAX` | Agenten-Starts und -Fortsetzungen pro Fenster auf diesem Rechner (`12`) |
| `AGENT_GUARD_AGENT_TOKENS_MAX` | Subagenten-Token pro Fenster auf diesem Rechner (`10000000`) |
| `AGENT_GUARD_DEPTH_MAX` | Agentenebenen unter der Hauptunterhaltung (`1`) |
| `AGENT_GUARD_LIMIT_ASK_PERCENT` | Planfenster-Prozent, ab dem neue Agenten fragen (`80`) |
| `AGENT_GUARD_LIMIT_DENY_PERCENT` | Planfenster-Prozent, ab dem neue Agenten, Weckrufe und geplante Jobs abgelehnt werden und jede Sitzung zum Auslaufen aufgefordert wird (`95`) |
| `AGENT_GUARD_BURN_PERCENT` | Punkte des 5-Stunden-Fensters pro Fenster, ab denen neue Agenten fragen (`20`) |
| `AGENT_GUARD_CONTEXT_WARN` | Kontext, ab dem Claude einmal gesagt wird, den Zug begrenzt zu halten (`300000`) |
| `AGENT_GUARD_CONTEXT_HARD` | Kontext, ab dem ein Prompt vor dem Senden fragt (`500000`) |
| `AGENT_GUARD_TOOL_CONTEXT` | Kontext, ab dem Werkzeugaufrufe gegen das Werkzeug-Budget zählen (`400000`) |
| `AGENT_GUARD_TOOL_MAX` | Werkzeugaufrufe pro Fenster oberhalb dieses Kontexts (`20`) |
| `AGENT_GUARD_DORMANT_SECONDS` | Untätigkeitszeit, nach der der Cache einer großen Sitzung als abgelaufen gilt (`3600`) |
| `AGENT_GUARD_DORMANT_CONTEXT` | Kontext, ab dem eine untätige Sitzung als groß gilt (`150000`) |
| `AGENT_GUARD_DORMANT_MAX` | Große ruhende Fortsetzungen pro Fenster auf diesem Rechner, wenn niemand gefragt werden kann (`1`) |
| `AGENT_GUARD_TOOL_FAILURE_MAX` | Identische Fehlschläge, bevor der identische Wiederholungsversuch abgelehnt wird (`3`) |
| `AGENT_GUARD_FUSE_MAX` | Abgelehnte Agenten-Aufrufe pro Sicherungsperiode, die Starts pausieren (`5`) |
| `AGENT_GUARD_FUSE_SECONDS` | Die Sicherungsperiode und wie lange die Pause dauert (`600`) |
| `AGENT_GUARD_PEER_TTL_SECONDS` | Wie lange die Zähler einer anderen Sitzung oder ein Agent ohne Aktivitätszeichen noch zählen (`900`) |

Der Standard für ruhende Sitzungen setzt den einstündigen Prompt-Cache voraus, den Abos im Rahmen der Plannutzung erhalten. Mit API-Key oder Zusatznutzung hält der Cache fünf Minuten, setze dann `AGENT_GUARD_DORMANT_SECONDS=300`.

## Jenseits von Claude Code

Die Regeln leben in einem harness-unabhängigen Kern (`core/`), der keine E/A ausführt. Der Claude-Code-Mod ist sein erster Adapter. [docs/architecture.md](docs/architecture.md) beschreibt den Vertrag, den ein Adapter einhält, und was ein anderer Agenten-Harness bieten muss, um jede Regel zu tragen.

## Tests

```sh
claude plugin validate . --strict
claude plugin test
```

`claude plugin test` führt die Suite im eigenen Test-Kit von Claude Code aus: Unit-Tests des Kerns und Tests, die echte Claude-Code-Ereignisse über das Hook-Modul feuern, ohne Sitzung, Modell oder Netzwerk. [TESTING.md](TESTING.md) beschreibt die Ebenen und was jeder Test beweist.

## Lizenz

MIT

## Quelle und Lizenz

- Originalautor: rbartoli
- Originalrepository: https://github.com/rbartoli/agent-usage-guard
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
