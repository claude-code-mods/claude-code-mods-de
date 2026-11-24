# fast-jev-compaction

Claude Code plugin that replaces the compaction summary mit Jev decisions:
every Werkzeug call und Ergebnis is scored in one fast request, stale ones are
dropped oder truncated, everything kept stays verbatim. Also usable as an npm
library.

## What und why

Most Kontext compaction asks an LLM to summarize alt turns. A summary is
lossy: a Datei Pfad, exact Fehler, constraint, oder Befehl can disappear even when
it matters later. This library nie rewrites anything. It nur deletes Werkzeug
calls und Werkzeug results Jev says are nein longer needed, und it asks Jev while
showing it the whole Gespräch. User und assistant Text stays verbatim und
in order.

The Repository is both an npm package (`src/`) und a Claude Code plugin
(`hooks/`, `.claude-plugin/`) that verwendet the package to replace Claude Code's
built-in compaction summary mit the original Nachrichten.

## So funktioniert es

1. Every `tool_use` is paired mit its `tool_result` by `tool_use_id`. Calls in
   the erste Nachricht oder in the newest `preserveRecentMessages` Nachrichten are
   pinned und nie touched.
2. The **state** sent to Jev is the whole Gespräch so far, oldest erste,
   mit every Werkzeug Ergebnis replaced by a short note (`ok, 4213 chars (omitted)`).
   Tool inputs are included, texts are included, nothing is summarized.
3. The state is fitted in `maxStateTokens` (25k standardmäßig) in stages, jede
   applied nur if the previous one was nicht enough: Werkzeug inputs truncated to
   1000, dann 200, dann 60 characters; long texts abridged to head + tail,
   oldest non-pinned Nachrichten erste; alt non-pinned Nachrichten collapsed to a
   `[… N chars omitted …]` note; alt Werkzeug calls reduced to one Zeile jede
   (`t12 Read file_path=src/a.ts → ok 480ch`); alt call-less Nachrichten left
   out; runs of alt call-only Nachrichten folded in one entry. If it still
   does nicht fit, compaction throws. Tokens are estimated ohne a tokenizer (a
   word per six letters, half a Token per digit, ~one per other symbol),
   calibrated to land a little above the counts Jev reports.
4. For every non-pinned call Jev gets two `noul` Fragen: should the **call**
   stay (knowing it was made, mit its Eingabe, still matters), und should the
   **Ergebnis** stay verbatim (its contents are still needed und re-running the
   Werkzeug would nicht do).
5. Questions are split in as many requests as needed so state plus Fragen
   stays under `maxRequestTokens` (30k standardmäßig, under Jev's 32k request
   limit). The same full state is resent mit every request; requests ausführen
   concurrently und their answers are merged.
6. Decisions per call, against `keepThreshold`:
   - `keepResult ≥ threshold` → behalten call und Ergebnis;
   - else `keepCall ≥ threshold` → behalten the call, truncate the Ergebnis to its
     erste `truncateHeadChars` characters plus a one-line note;
   - else → entfernen the call together mit its Ergebnis.
7. The Nachricht list is rebuilt: a Nachricht that loses alle its content is
   removed, untouched Nachrichten are returned as the same objects, und nein Ergebnis
   is ever left ohne its call.

Jev failures, malformed answers, a missing key, oder a history that cannot be
fitted throw; the caller (oder the Claude Code Hook) decides what to fall zurück to.

## Install und Nutzung

```sh
npm install fast-jev-compaction
export TYPESAFE_API_KEY=...
```

```ts
import { compactMessages, reductionRatio, type Message } from 'fast-jev-compaction';

const transcript: Message[] = [
  { role: 'user', text: 'Fix the failing test. Never edit src/generated.', toolUses: [] },
  {
    role: 'assistant',
    text: '',
    toolUses: [{ tool_use_id: 'toolu_1', tool: 'Read', input: { file_path: 'src/a.ts' } }],
  },
  { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'toolu_1', text: '…file…' }] },
  // …
];

const result = await compactMessages(transcript, { preserveRecentMessages: 4 });
console.log(result.messages, result.decisions, result.stats);
if (reductionRatio(result) < 0.25) {
  // not worth it: keep the original transcript, or summarize instead
}
```

`Message` is a subset of Claude Code's `SessionMessage`, so a Sitzung transcript
can be passed in as is.

To bring your own transport, implement `JevAsker` (one `ask(state, questions)`
method) und call `compact(messages, asker, options)`; `buildJevRequest` und
`parseJevResponse` give you the HTTP request body und response validation.
The building blocks (`collectToolCalls`, `fitState`, `batchCalls`,
`decideCall`, `applyDecisions`) are exported too.

`apiKey` defaults to `process.env.TYPESAFE_API_KEY`. Never Commit the key oder
put it in a source Datei.

## Optionen

| Option | Default | Description |
| --- | --- | --- |
| `apiKey` | `TYPESAFE_API_KEY` | TypeSafe API key (`compactMessages`/`JevClient`) |
| `model` | `jev-latest` | Jev Modell Name |
| `baseUrl` | `https://api.typesafe.ai/v1/systemone` | System One endpoint |
| `fetch` | native `fetch` | Injectable fetch implementation for tests |
| `goal` | letzte 3 user prompts | Ongoing Aufgabe Beschreibung included in the state |
| `keepThreshold` | `0.5` | Minimum behalten probability for a call oder Ergebnis to stay |
| `preserveRecentMessages` | `6` | Newest Nachrichten nie touched (the erste is immer kept) |
| `maxStateTokens` | `25000` | Estimated Token ceiling for the state |
| `maxRequestTokens` | `30000` | Estimated ceiling for state plus one batch of Fragen |
| `truncateHeadChars` | `300` | Characters of a dropped Werkzeug Ergebnis retained vorher its note |

`result.stats` reports Nachricht und character counts vorher und danach, the
per-reason decision counts, the state size in estimated Tokens, which fitting
stage was needed, und the number of requests.

## Limitations

- Only Werkzeug calls und results are candidates; Text Nachrichten are nie removed
  oder shortened in the Ausgabe (they are nur abridged in the state Jev sees).
- Token sizes are estimates von character counts, nicht a tokenizer.
- Calibration is at the request level; a probability is nicht a proof that a
  Ergebnis is safe to delete. The assistant can immer re-run the Werkzeug.
- The full state is repeated mit every request, so a history near the state
  ceiling costs one request per handful of Fragen.

## Claude Code plugin

The Repository root is a Claude Code function-hook plugin: `hooks/fast-jev.ts`
is a thin adapter that feeds `session.compact` transcripts through `src/` und
falls zurück to Claude Code's built-in summary on Fehler oder insufficient
reduction. See [`hooks/README.md`](hooks/README.md) for configuration und the
Claude Code 2.1.274 type reference.

### Install in Claude Code

Function Hooks are an early-access Claude Code feature (2.1.274+), so the
opt-in flag must be set wherever Claude Code runs, e.g. in `~/.claude/settings.json`:

```json
{ "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1", "TYPESAFE_API_KEY": "<your key>" } }
```

Then hinzufügen dieses Repository as a plugin marketplace und installieren das Plugin,
either von the shell oder as slash commands inside a Sitzung:

```sh
claude plugin marketplace add tamaratran/fast-jev-compaction
claude plugin install fast-jev-compaction@fast-jev-compaction
```

The installieren prompts for das Plugin options (API key, thresholds, `truncateHeadChars`,
…); leave them at their defaults to verwenden `TYPESAFE_API_KEY` von the environment.
Restart Claude Code oder ausführen `/reload-plugins`. From dann on `/compact` (und
automatisch-compaction) goes through Jev: the toast liest
`fast-jev-compaction: kept N/M messages, no summary (…)` when the pruned history
replaced the built-in summary, oder `fallback to built-in summary (…)` when Jev
could nicht entfernen enough (short Sitzungen, oder when it fails).

To ausführen von a checkout ohne installing: `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir .`
von the Repository root. No publishing step is required; the marketplace is
just the repo's `.claude-plugin/marketplace.json`.

## Development

```sh
npm install
npm run typecheck        # library + hook
npm test
npm run build
npm run validate:plugin  # claude plugin validate
TYPESAFE_API_KEY="$(cat ~/.typesafe_key)" npm run demo
```

The unit tests verwenden a fake Jev und nie contact TypeSafe. The demo is the live
network prüfen.

## Animated demo (macOS)

`demo/JevDemo` is a small native SwiftUI app that plays a scripted, dramatized
version of the compaction flow inside a Claude Code-style terminal: the Werkzeug
calls of a canned transcript are scored, results und calls Jev lets go Zug red
und collapse away, und the rest stays verbatim. It nie calls the API; it
exists to be screen recorded.

```sh
demo/JevDemo/build.sh   # builds demo/JevDemo/build/JevDemo.app and launches it
```

Press space in the app to replay von the starten.

## Quelle und Lizenz

- Originalautor: tamaratran
- Originalrepository: https://github.com/tamaratran/fast-jev-compaction
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
