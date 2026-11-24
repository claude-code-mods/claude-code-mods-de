# Token Optimizer Desktop

Eine Statusleiste für die Claude-Desktop-App. Sie erscheint über deinem Prompt und zeigt die Qualität der Sitzung, die Kontextauslastung, den Cache-Countdown sowie deine 5-Stunden- und Wochenlimits – Clawd stellt dabei anschaulich dar, was die Sitzung gerade tut.

## Install

Sie ist im Plugin Token Optimizer enthalten (`hooks/hooks.json` nennt `hooks/register.tsx` dieses Ordners unter `modules`), es gibt also nichts Zusätzliches zu installieren. Dieser Ordner hat nur deshalb sein eigenes Manifest, damit seine Tests einzeln mit `claude plugin test` laufen. `npm run typecheck` und `npm test` decken die reinen Module ab (CI); `npm run typecheck:engine` prüft `hooks/` und `tests/engine/` anhand der Plugin-API-Deklarationen von Claude Code, die ausschließlich die CLI `claude` schreibt, deshalb läuft das lokal.

Erforderlich sind Claude Code 2.1.287 oder neuer und die Mods-Funktion von Anthropic. Anthropic kann Mods aus der Ferne abschalten; dann funktioniert alles andere unverändert, nur die Leiste erscheint nicht. Im Terminal bleibt die bestehende Statuszeile erhalten. VS Code wird nicht unterstützt.

Um zu prüfen, ob sie aktiv ist, öffne eine Claude-Desktop-Sitzung mit aktiviertem Plugin Token Optimizer. Achte auf die Token-Optimizer-Leiste über dem Prompt, mit Clawd und dem Cache-Countdown. Fehlt sie, prüfe, ob das Plugin aktiviert ist, Mods verfügbar sind und `TOKEN_OPTIMIZER_STATUS_BAR` nicht `0` ist; starte die Sitzung danach neu. Die `hooks/hooks.json` des Plugins registriert `desktop/token-optimizer-desktop/hooks/register.tsx`.

Um die Buchung zu prüfen, ohne deine Sitzung zu benutzen, führe `python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action --selftest` aus. Das Programm gibt `PASS` oder `FAIL` aus und verwendet ein temporäres Datenverzeichnis. Diagnosen fehlgeschlagener Aktionen werden im Datenverzeichnis von Token Optimizer als `mod-actions.log` gespeichert.

## Was du erhältst

- Ein Satz über die dringendste Sache, mit höchstens einer Schaltfläche.
- Füf Anzeigen mit Hover-Karten: Qualitätsnote, Kontextauslastung, Cache-Countdown, 5-Stunden-Limit und Wochenlimit.
- Der **Pfeil neben Clawd** klappt eine weitere Zeile auf: Branch, Sitzungsdauer, Werkzeugaufrufe, Kompaktierungen (falls vorhanden), wann der letzte Checkpoint gespeichert wurde (irgendeine Art oder ein relevanter aus einer früheren Sitzung) sowie die Tokens, die Token Optimizer dir in den letzten 30 Tagen gespart hat – dieselbe Gesamtsumme wie im Dashboard.
- Schaltflächen: **Clean up** (kompaktiert mit den Hinweisen von Token Optimizer), **Start fresh** (ein zweiter Klick speichert einen Checkpoint, leert den Kontext und übergibt ihn deiner ersten Nachricht), **Keep warm** (manuelle Cache-Auffrischung mit einem Klick, nur solange der Cache warm ist, nie automatisch, verbraucht eine kleine Menge Nutzung).
- **Vollständiges Dashboard**: ein reiner Textlink am Ende der aufgeklappten Zeile, in beiden Leistengrößen (die eingeklappte Leiste zeigt ihn nicht). Ein Klick führt `measure.py dashboard` aus, derselbe Befehl wie beim Skill `token-dashboard`: Er erzeugt die Dashboard-Seite neu und öffnet sie in deinem Standardbrowser (`open` unter macOS, `xdg-open` unter Linux, die Dateizuordnung unter Windows). Während des Laufs meldet die Leiste „Opening the Dashboard.“; bei einem Fehler heißt es einige Sekunden lang „Could not open the Dashboard.“, und sonst passiert nichts. Ein zweiter Klick während des Laufs wird ignoriert. Der Link ist eine Schaltfläche im Stil `plain` (ihre Eigenschaft steht auf der Button-Allowlist der Engine in Claude Code 2.1.287, 2.1.294 und 2.1.296, gelesen aus den Zeichenfolgen der jeweiligen Builds; ausgeführt wurde das auf 2.1.294 bis 2.1.296). Der Klick führt `measure.py dashboard --user` aus: `--user` markiert ihn als Klick einer Person, damit das 20-Sekunden-Hook-Budget einen umfangreichen Neuaufbau nicht abbricht (etwa 80 Sekunden kalt bei einer echten, umfangreichen Historie); die Leiste wartet dafür bis zu 5 Minuten. Nur dieser Link wartet so lange: Clean up und Start fresh geben weiterhin nach 2 Minuten auf.

Der Cache-Countdown ist eine Schätzung: 1 Stunde bei Claude-Abos, 5 Minuten bei der API, nach Möglichkeit aus der Sitzung selbst gemessen.

## Einstellungen

`TOKEN_OPTIMIZER_STATUS_BAR=0` blendet die Leiste aus, `TOKEN_OPTIMIZER_STATUS_BAR_ANIMATE=0` lässt Clawd stillstehen; beides wird im `env`-Block von `~/.claude/settings.json` gesetzt. `TOKEN_OPTIMIZER_STATUS_BAR_TIME_FORMAT=24h` (oder `12h`) erzwingt die Uhrzeitdarstellung für die Erneuerungszeiten der Limits; ohne Einstellung richtet sie sich nach deiner Locale.

Die Schaltfläche `–` neben dem Pfeil verkleinert die Leiste auf eine Zeile, `+` stellt sie wieder her; der Pfeil klappt weiterhin die Detailzeile darunter auf, und die Wahl wird über Sitzungen und Neustarts hinweg gemerkt. `TOKEN_OPTIMIZER_STATUS_BAR_SIZE=slim` legt die Startgröße fest, bevor eine Auswahl gespeichert wurde; die Statuszeile im Terminal nutzt dieselbe Variable, um eine Zeile auszugeben.

Die Kontextanzeige misst gegen dein eigenes Kompaktierungsfenster, sofern du eines gesetzt hast: `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `/autocompact` oder die Einstellung `autoCompactWindow`, innerhalb der Grenzen von 100K bis 1M in Claude Code und niemals über das Fenster des Modells hinaus. Ein Fenster, das nur mit `--autocompact` für einen einzelnen Start angegeben wurde, ist für sie nicht sichtbar.

## Vollständige Dokumentation

Siehe die [Token-Optimizer-README](../../README.md#desktop-status-bar) und die Dokumentationsseite „Claude desktop app“.

Um einen Keep-warm-Versuch über die CLI zu reservieren, sende einen JSON-Beleg über die Standardeingabe:

```bash
printf '%s' '{"action":"warm-prepare","action_id":"ATTEMPT_ID","session_id":"SESSION_ID","timestamp":UNIX_SECONDS,"transcript_path":"/path/to/SESSION_ID.jsonl","byte_size":FILE_SIZE,"transcript_mtime":FILE_MTIME}' | python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action
```

Ersetze die Platzhalter durch die exakte Dateigröße und Änderungszeit des aktuellen Transkripts, eine eindeutige Versuchs-ID und die aktuelle Unix-Zeit. Die Antwort ist JSON. Damit ist die Buchung reserviert; der Aufrufer muss die Warm-Anfrage ausführen und ihre Nutzung als `warm`-Beleg melden oder `warm-cancel` senden, falls er sie nicht ausführt.

## Quelle und Lizenz

- Originalautor: alexgreensh
- Originalrepository: https://github.com/alexgreensh/token-optimizer
- Lizenz: NOASSERTION
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
