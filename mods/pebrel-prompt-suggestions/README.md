# Claude Code native Prompt predictions

This managed adapter verwendet Claude Code's native function Hooks. Es ist verified
against Claude Code 2.1.310; older versions are nicht claimed as supported. Es ist
loaded for a neu process mit `--plugin-dir <absolute-adapter-directory>` und
`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`. Loading an adapter does nicht installieren it in
the user's global Claude configuration.

The launcher must provide `PEBREL_PREDICTION_ENDPOINT` (an HTTP IPv4 loopback
address mit a port), `PEBREL_PREDICTION_TOKEN`, und
`CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false`. The letzte variable suppresses Claude
Code's built-in prediction inference for that process. Without it the adapter
does nothing, avoiding two inference requests for the same completed Zug. No
global setting oder main-model setting is changed.

Only a successful main Zug mit an empty, mounted terminal composer is eligible.
`$.session.messages()` supplies in-memory user/assistant Text; Werkzeug payloads are
nicht sent. The bridge receives at most 24 Nachrichten, 3000 UTF-16 units per Nachricht,
und 12000 units gesamt. Pebrel owns the prediction Prompt, configured provider,
language, und further Kontext limits. The adapter adds nein speaking-style Prompt
oder persistence.

The localized bridge `loading_text` appears in Claude Code's dim `PromptHint`
footer, followed by `.`, `..`, und `...` every 400 ms. Es ist noneditable und is
nie sent to `prompt.suggest`. A completed candidate verwendet native
`$.prompt.suggest({text})`, so native Tab/right-arrow behavior fills the composer
ohne submitting it. The composer remains owned by Claude Code.

Editing, Prompt ändert, neu turns, Sitzung end, und a ten-second deadline
invalidate pending UI work. Every Ergebnis rechecks the revision, Sitzung, und
empty draft. The native `http.fetch` API has nein abort signal: cancellation here
suppresses stale results, while the bridge owns the network/request deadline.
No disk polling oder timers remain when prediction UI is idle.

Run the behavior contract mit `node --test tests/*.test.mjs`, und the actual
Claude scanner mit `claude plugin validate --strict --json <adapter-directory>`.
Mock tests do nicht establish native terminal visual acceptance oder compatibility
mit an untested Claude version.

## Quelle und Lizenz

- Originalautor: Kuddev
- Originalrepository: https://github.com/Kuddev/pebrel
- Lizenz: GPL-3.0
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
