# Native Prompt-Vorhersagen für Claude Code

Dieser verwaltete Adapter nutzt die nativen Function Hooks von Claude Code. Er ist mit Claude Code 2.1.310 geprüft; für ältere Versionen wird keine Unterstützung zugesagt. Er wird für einen neuen Prozess mit `--plugin-dir <absolute-adapter-directory>` und `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` geladen. Das Laden eines Adapters installiert ihn nicht in die globale Claude-Konfiguration des Benutzers.

Der Starter muss `PEBREL_PREDICTION_ENDPOINT` (eine HTTP-IPv4-Loopback-Adresse mit Port), `PEBREL_PREDICTION_TOKEN` und `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false` bereitstellen. Die letzte Variable unterdrückt die eingebaute Vorhersage-Inferenz von Claude Code für diesen Prozess. Ohne sie tut der Adapter nichts, sodass für dieselbe abgeschlossene Runde keine zwei Inferenzanfragen entstehen. Globale Einstellungen oder Einstellungen des Hauptmodells werden nicht geändert.

Infrage kommt nur eine erfolgreiche Hauptrunde mit einem leeren, eingebundenen Terminal-Eingabefeld. `$.session.messages()` liefert Texte von Benutzer und Assistent aus dem Speicher; Werkzeug-Payloads werden nicht gesendet. Die Bridge erhält höchstens 24 Nachrichten, 3000 UTF-16-Einheiten pro Nachricht und 12.000 Einheiten insgesamt. Pebrel verwaltet den Vorhersage-Prompt, den konfigurierten Anbieter, die Sprache und weitere Kontextlimits. Der Adapter fügt weder einen Stil-Prompt noch Speicherung hinzu.

Der lokalisierte `loading_text` der Bridge erscheint im gedimmten `PromptHint`-Fußbereich von Claude Code, gefolgt von `.`, `..` und `...` im Abstand von 400 ms. Er ist nicht bearbeitbar und wird nie an `prompt.suggest` gesendet. Ein fertiger Kandidat nutzt das native `$.prompt.suggest({text})`, sodass das übliche Verhalten von Tab oder Pfeil nach rechts das Eingabefeld füllt, ohne die Nachricht abzusenden. Das Eingabefeld bleibt im Besitz von Claude Code.

Bearbeitungen, Prompt-Änderungen, neue Runden, das Ende der Sitzung und eine Zehn-Sekunden-Frist machen anstehende UI-Arbeit ungültig. Jedes Ergebnis prüft erneut Revision, Sitzung und leeren Entwurf. Die native `http.fetch`-API hat kein Abbruchsignal: Ein Abbruch unterdrückt hier veraltete Ergebnisse, während die Bridge die Netzwerk-/Anfragefrist verwaltet. Solange die Vorhersage-UI untätig ist, bleiben keine Dateiabfragen oder Timer zurück.

Führe den Verhaltensvertrag mit `node --test tests/*.test.mjs` aus und den eigentlichen Claude-Prüfer mit `claude plugin validate --strict --json <adapter-directory>`. Mock-Tests belegen weder die visuelle Abnahme im nativen Terminal noch die Kompatibilität mit einer ungeprüften Claude-Version.

## Quelle und Lizenz

- Originalautor: Kuddev
- Originalrepository: https://github.com/Kuddev/pebrel
- Lizenz: GPL-3.0
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
