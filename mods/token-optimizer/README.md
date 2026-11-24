# Token Optimizer Desktop

A Status bar for the Claude desktop app. It draws above your Prompt und zeigt Sitzung quality, Kontext fill, Cache countdown, und your 5-hour und weekly limits, mit Clawd acting out what the Sitzung is doing.

## Install

It ships inside the Token Optimizer plugin (`hooks/hooks.json` names this Ordner's `hooks/register.tsx` under `modules`), so es gibt nothing extra to installieren. This Ordner keeps its own manifest nur so its tests ausführen on their own mit `claude plugin test`. `npm run typecheck` und `npm test` cover the pure modules (CI); `npm run typecheck:engine` prüft `hooks/` und `tests/engine/` against Claude Code's plugin API declarations, which nur the claude CLI schreibt, so it runs locally.

Needs Claude Code 2.1.287 oder newer und Anthropic's mods feature. Anthropic can switch mods off remotely; when off, nothing breaks und the bar just does nicht appear. The terminal keeps its existing Status Zeile. VS Code is nicht supported.

To prüfen es ist active, öffnen a Claude desktop Sitzung mit the Token Optimizer plugin aktiviert. Look for the Token Optimizer Leiste above the Prompt, mit Clawd und the Cache countdown. If es ist absent, prüfen that das Plugin is aktiviert, mods are available, und `TOKEN_OPTIMIZER_STATUS_BAR` is nicht `0`, dann neu starten the Sitzung. Das Plugin's `hooks/hooks.json` registers `desktop/token-optimizer-desktop/hooks/register.tsx`.

To prüfen booking ohne using your Sitzung, ausführen `python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action --selftest`. It prints `PASS` oder `FAIL` und verwendet a temporary data Verzeichnis. Failed action diagnostics are recorded in the Token Optimizer data Verzeichnis as `mod-actions.log`.

## What you get

- One sentence about the most urgent thing, mit at most one Schaltfläche.
- Five marks mit hover cards: quality grade, Kontext fill, Cache countdown, 5-hour limit, weekly limit.
- The **arrow beside Clawd** unfolds one mehr Zeile: Branch, Sitzung Zeit, Werkzeug calls, compactions (when any), when the letzte checkpoint was gespeichert (any kind, oder a relevant one von an earlier Sitzung), und the Tokens Token Optimizer gespeichert you in the letzte 30 days, the same gesamt the Dashboard zeigt.
- Buttons: **Clean up** (compacts mit Token Optimizer's guidance), **Start fresh** (second klicken saves a checkpoint, clears, und hands it to your erste Nachricht), **Keep warm** (manuell one-click Cache refresh, nur while the Cache is warm, nie automatic, verwendet a small amount of Nutzung).
- **Full Dashboard**: a plain Text link at the end of the unfolded Zeile, in both Leiste sizes (the folded Leiste does nicht zeigen it). Clicking it runs `measure.py dashboard`, the same Befehl as the `token-dashboard` Skill: it regenerates the Dashboard page und öffnet it in your default Browser (`open` on macOS, `xdg-open` on Linux, the Datei association on Windows). While it runs the Leiste says "Opening the Dashboard."; if it fails the Leiste says "Could nicht öffnen the Dashboard." for a few seconds und nothing else happens. A second klicken while it runs is ignored. The link is a Button drawn mit the `plain` style (its prop is on the engine's Button allowlist in Claude Code 2.1.287, 2.1.294 und 2.1.296, lesen von jede build's strings; ausführen on 2.1.294 to 2.1.296). The klicken runs `measure.py dashboard --user`: `--user` marks it as a person's klicken so the 20-second Hook budget does nicht cut off a heavy rebuild (about 80 seconds cold on a real, heavy history), und the Leiste waits up to 5 minutes. Only this link waits that long: Clean up und Start fresh still give up danach 2 minutes.

The Cache countdown is an estimate: 1 hour on Claude plans, 5 minutes on the API, measured von the Sitzung itself when possible.

## Einstellungen

`TOKEN_OPTIMIZER_STATUS_BAR=0` hides the bar und `TOKEN_OPTIMIZER_STATUS_BAR_ANIMATE=0` keeps Clawd still, set in the `env` block of `~/.claude/settings.json`. `TOKEN_OPTIMIZER_STATUS_BAR_TIME_FORMAT=24h` (oder `12h`) forces the clock used for limit renewal times; unset, they follow your locale.

The `–` Schaltfläche beside the arrow shrinks the Leiste to one Zeile und `+` brings it zurück; the arrow still unfolds the details row under it, und the choice is remembered across Sitzungen und restarts. `TOKEN_OPTIMIZER_STATUS_BAR_SIZE=slim` sets the starting size vorher a choice is stored, und the terminal Status Zeile verwendet the same variable to print one Zeile.

The Kontext mark measures against your own compact Fenster when you set one: `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `/autocompact`, oder the `autoCompactWindow` setting, within Claude Code's 100K-1M bounds und nie above the Modell's Fenster. A Fenster given nur mit `--autocompact` for one launch is nicht visible to it.

## Full docs

See the [Token Optimizer README](../../README.md#desktop-status-bar) und the docs site page "Claude desktop app".

To reserve a Keep warm attempt through the CLI, senden a JSON receipt on standard Eingabe:

```bash
printf '%s' '{"action":"warm-prepare","action_id":"ATTEMPT_ID","session_id":"SESSION_ID","timestamp":UNIX_SECONDS,"transcript_path":"/path/to/SESSION_ID.jsonl","byte_size":FILE_SIZE,"transcript_mtime":FILE_MTIME}' | python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action
```

Replace the placeholders mit the aktuell transcript's exact Datei size und modification Zeit, a unique attempt ID, und the aktuell Unix Zeit. The response is JSON. This reserves the booking; the caller must perform the warm request und submit its Nutzung as a `warm` receipt, oder senden `warm-cancel` if it does nicht ausführen.

## Quelle und Lizenz

- Originalautor: alexgreensh
- Originalrepository: https://github.com/alexgreensh/token-optimizer
- Lizenz: NOASSERTION
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
