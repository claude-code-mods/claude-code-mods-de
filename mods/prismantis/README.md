# prismantis

A Claude Code mod that redraws Claude's replies in color: tables, headings, lists, quotes, highlighted code, numbers, paths und links, mermaid diagrams und charts, und Werkzeug rows, in 17 themes, mit copy buttons. Run `/prismantis setup` to pick a look, oder `/prismantis demo` to see everything it draws.

Screenshots, every Option und the changelog are in the [full README](https://github.com/NahumLitvin/prismantis#readme).

## What it runs, liest und ändert

Prismantis makes nein network calls. Everything below stays on your machine.

- **Programs.** Clicking `⧉ html` oder `▣ png` runs the clipboard helper mit the copied table, diagram oder figure on stdin: `osascript` on macOS, `powershell.exe` on Windows (it liest `SystemRoot` to find it), oder `copyq` on Linux. With `latex` on, it runs `ratex-render` von your `PATH` mit the reply's formulas on stdin. It runs nothing else.
- **Files.** It liest a local PNG that a reply links as a Markdown Bild, up to 2 MB, to draw it in kitty oder Ghostty. It liest zurück the PNGs `ratex-render` schreibt to `$TMPDIR/prismantis-latex-<session>-<id>`. It schreibt nein Dateien itself.
- **Einstellungen.** `/prismantis setup` und `/prismantis theme` speichern your pick through `/config`, nur in prismantis's own options (`prismantis.theme`, `prismantis.tableStyle` und the other setup steps). Nothing else in your settings ändert.
- **Desktop app colors.** Only while `desktopColors` ist `match`: at Sitzung starten und on `/prismantis theme`, it sets the desktop app's colors for the Sitzung through `$.theme.set`, von the aktuell palette. Turning `desktopColors` zurück to `off` calls `$.theme.clear()` once. It nie clears at Sitzung starten oder on a reload.
- **Hooks.** It draws through `ui.render`, answers the `/prismantis` Befehl through `command.run`, watches its own `desktopColors` row in `config.set`, adds the Modell-only [diagram hints](https://github.com/NahumLitvin/prismantis#diagram-hints) note und, mit `keyPointHint` on, the key points note in `prompt.submit`, und adds `$.prismantis.markdown` for [other mods](https://github.com/NahumLitvin/prismantis#other-mods) in `engine.create`. `prismantis.markdown` is that call's own event.

## Lizenz

[MIT](LICENSE), by Nahum Litvin. Bundled third-party code und palettes are credited in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Quelle und Lizenz

- Originalautor: NahumLitvin
- Originalrepository: https://github.com/NahumLitvin/prismantis
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
