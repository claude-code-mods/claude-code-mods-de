# prismantis

Ein Mod für Claude Code, das Claudes Antworten farbig neu zeichnet: Tabellen, Überschriften, Listen, Zitate, hervorgehobener Code, Zahlen, Pfade und Links, Mermaid-Diagramme und Charts sowie Werkzeugzeilen – in 17 Themes, mit Kopier-Schaltflächen. Führe `/prismantis setup` aus, um ein Aussehen zu wählen, oder `/prismantis demo`, um alles zu sehen, was es zeichnet.

Screenshots, alle Optionen und der Änderungsverlauf stehen in der [vollständigen README](https://github.com/NahumLitvin/prismantis#readme).

## Was es ausführt, liest und ändert

Prismantis tätigt keine Netzwerkaufrufe. Alles Folgende bleibt auf deinem Rechner.

- **Programme.** Ein Klick auf `⧉ html` oder `▣ png` führt das Zwischenablage-Hilfsprogramm mit der kopierten Tabelle, dem Diagramm oder der Abbildung auf der Standardeingabe aus: `osascript` unter macOS, `powershell.exe` unter Windows (es liest `SystemRoot`, um es zu finden) oder `copyq` unter Linux. Mit aktiviertem `latex` führt es `ratex-render` aus deinem `PATH` aus, mit den Formeln der Antwort auf der Standardeingabe. Sonst führt es nichts aus.
- **Dateien.** Es liest ein lokales PNG, das in einer Antwort als Markdown-Bild verlinkt ist, bis zu 2 MB, um es in kitty oder Ghostty zu zeichnen. Es liest die PNGs zurück, die `ratex-render` nach `$TMPDIR/prismantis-latex-<session>-<id>` schreibt. Selbst schreibt es keine Dateien.
- **Einstellungen.** `/prismantis setup` und `/prismantis theme` speichern deine Auswahl über `/config`, ausschließlich in den eigenen Optionen von prismantis (`prismantis.theme`, `prismantis.tableStyle` und den übrigen Setup-Schritten). Andere Einstellungen werden nicht verändert.
- **Farben der Desktop-App.** Nur solange `desktopColors` auf `match` steht: Bei Sitzungsbeginn und bei `/prismantis theme` setzt es die Farben der Desktop-App für die Sitzung über `$.theme.set`, aus der aktuellen Palette. Wird `desktopColors` wieder auf `off` gesetzt, ruft es einmal `$.theme.clear()` auf. Bei Sitzungsbeginn oder einem Reload löscht es nie.
- **Hooks.** Es zeichnet über `ui.render`, beantwortet den Befehl `/prismantis` über `command.run`, überwacht seine eigene `desktopColors`-Zeile in `config.set`, ergänzt den nur für das Modell bestimmten Hinweis [diagram hints](https://github.com/NahumLitvin/prismantis#diagram-hints) und bei aktivem `keyPointHint` den Hinweis auf Kernpunkte in `prompt.submit` und stellt `$.prismantis.markdown` für [andere Mods](https://github.com/NahumLitvin/prismantis#other-mods) in `engine.create` bereit. `prismantis.markdown` ist das eigene Ereignis dieses Aufrufs.

## Lizenz

[MIT](LICENSE), von Nahum Litvin. Gebündelter Code und Paletten von Dritten sind in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) genannt.

## Quelle und Lizenz

- Originalautor: NahumLitvin
- Originalrepository: https://github.com/NahumLitvin/prismantis
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
