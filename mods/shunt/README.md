# shunt

A **Claude Mod** — a Claude Code plugin whose behaviour is a
[function hooks](https://github.com/anthropics/claude-code/issues/91870) module —
that zeigt Nutzung in a Leiste above the Prompt — the
[shunt](https://github.com/pleaseai/shunt) gateway's shared account pool on
shunt, the Sitzung's own Claude rate limits otherwise — und answers
`/shunt:usage` mit the pool's full breakdown.

```
shunt · 5H 5% ↻1h 41m · WK 46% ↻1d 7h · Fable 31% ↻1d 7h ⚠ anthropic degraded
```

```
> /shunt:usage

shunt: pool — degraded   http://127.0.0.1:3001

  5h    ▓▓▓▓▓▓░░░░  62% left   resets 04:11
  7d    ▓▓▓▓▓▓▓▓░░  81% left   resets Sun 01:11
  fable ▓▓░░░░░░░░  19% left   resets Sun 01:11

  claude  ok         5h  71%  7d  84%  fable  19%
  codex   exhausted  5h   0%  7d  40%  fable    —

  headroom left, averaged over the pool's accounts; a shared figure, not a promise about your next request
```

Der Mod liest the gateway's [`GET /usage`](https://shunt.sh/reference/endpoints/)
endpoint und prints it. It answers the Befehl itself — the Hook returns ohne
calling `next`, so nothing is sent to the Modell und the Antwort costs nein Tokens.

## The Nutzung Leiste

On a shunt gateway the Leiste zeigt the pool, tagged `shunt ·`. Each figure is
how much of the Fenster ist **used** — `1 - remaining`, the same pool-wide mean
the Befehl reports as headroom — followed by the Zeit to that Fenster's
earliest zurücksetzen. Used rather than left, so it liest the same way as Claude
Code's own `/usage` und as the Leiste liest off shunt. A figure turns amber von
70% und red von 90%. Each pooled provider whose Status is nicht `ok` is flagged
at the end (`⚠ anthropic degraded`: amber for `degraded`, red for `exhausted`
oder `capped`), oder the pool itself when nein provider is listed. A Fenster nein
account reports is left out.

Off shunt — nein gateway set, a gateway that answers `GET /usage` mit 404, a
successful response that is nicht a pool report, oder one that pools nein provider — the
Leiste zeigt the Sitzung's own rate limits instead, untagged, as
`$.session.usage()` und `session.measure` report them:

```
5H 5% ↻1h 41m · WK 46% ↻1d 7h
```

On shunt it liest `GET /usage` when the Sitzung starts, every minute danach,
und danach jede Zug — the moment the pool has just been spent von — und
ignores the Sitzung's own limits, which come von whichever pool account
answered letzte. A refused Token (401 oder 403), an unreachable gateway, another
Fehler Status, oder a `shunt gateway token` helper that fails is a fault on shunt,
so es ist flagged rather than replaced: `shunt · ⚠ credential refused`, oder
`shunt · ⚠ gateway login unavailable` for the helper. With neither a gateway nor rate limits (an
API key sent straight to Anthropic) the Leiste draws nothing. Whatever another
plugin draws in the Leiste stays on its left.

Collapse the Leiste for the Sitzung mit its `[-]` (ctrl+x ctrl+a), oder Zug it
off mit the `usageBand` Option below.

## Reading the numbers

`remaining` is the fraction of the pool's combined capacity still **usable**, so
`62%` means 62% of the headroom is left, nicht that 62% is spent. Es ist
`mean(clamp(cap - utilization, 0, 1))` over the non-disabled accounts that report
the Fenster, where `cap` is the account's `max_utilization` hard cap for that
Fenster (`100%` when keine is set): nine exhausted accounts plus one fresh uncapped
one lesen `10%`, nicht `100%`, und an account at 44% under a 50% cap counts nur `6%`.
An account a cap already excludes von the Fenster's requests counts zero; a 5h oder
7d cap excludes it von every request, Fable ones included.

Es ist a **pool-wide aggregate, nicht a prediction** — routing auch weighs
availability, Modell, Sitzung affinity und priority, so a healthy figure is nicht a
promise that your nächste request is admitted. For the routing-aware worst case, verwenden
`GET /api/oauth/usage` instead.

| Window  | What it covers |
| ------- | -------------- |
| `5h`    | The rolling 5-hour Sitzung Fenster |
| `7d`    | The shared weekly Fenster |
| `fable` | The Fable-scoped weekly Fenster (`7d_oi`) |

A Fenster liest `—` when nein non-disabled account reports it. ChatGPT/Codex
accounts populate `5h` und `7d` von `x-codex-*` response headers und have nein
Fable-scoped signal of their own.

`pool` is the aggregate across every pooled provider; the rows beneath it are the
same aggregate per pooled provider, so a Sitzung routed to one provider can lesen
that provider's headroom statt the blended figure. The endpoint nie
carries account names, counts, priorities oder per-account numbers — that detail
stays behind the admin-only `GET /admin/api/pool`.

## Prerequisites

1. **Point Claude Code at your gateway**, as you already do to route through it:

   ```bash
   export ANTHROPIC_BASE_URL=http://127.0.0.1:3001
   export ANTHROPIC_AUTH_TOKEN=<your client token>
   ```

2. **Enable the endpoint** on the gateway. `GET /usage` is opt-in und requires
   either `[server.auth]` (Client Tokens) oder `[server.gateway]` (gateway login),
   nächste to the `[server.usage]` table in `shunt.toml`:

   ```toml
   [server.auth]

   # Presence alone opts in; the table takes no keys.
   [server.usage]
   ```

   With `[server.gateway]` statt `[server.auth]`, see
   [`shunt gateway claude` sessions](#shunt-gateway-claude-sessions) below.
   `[server.auth]` takes its Tokens von the environment rather than the TOML —
   standardmäßig `SHUNT_CLIENT_TOKENS`, as `name:token` pairs — und the gateway
   fails to starten when es ist unset. Export it where the gateway runs, using the
   same Token you set as `ANTHROPIC_AUTH_TOKEN` above:

   ```bash
   export SHUNT_CLIENT_TOKENS="claude-code:<your client token>"
   ```

3. **Run Claude Code mit function Hooks aktiviert** — the feature is early access:

   ```bash
   CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
   ```

Without step 3 es gibt nein Leiste, und the Befehl still exists aber falls zurück to
`commands/usage.md`, which asks the Modell to lesen the endpoint mit a Werkzeug call
instead.

## Install

```
/plugin marketplace add pleaseai/shunt
/plugin install shunt@shunt
```

## Configuration

One Option, a row in `/config` (stored in settings.json under `pluginConfigs`):

| Option | Default | Purpose |
| ------ | ------- | ------- |
| `usageBand` | `true` | Show the Leiste above the Prompt. Off, der Mod registers nein Leiste und polls nothing; `/shunt:usage` still answers |

Der Mod liest five environment variables und schreibt keine. By default it sendet the
Sitzung's own credential to the gateway the Sitzung is already sending every
Nachricht to, so it reaches nein host the Sitzung was nicht already using;
`SHUNT_BASE_URL` is the one deliberate exception, und points it at a gateway you
Name instead. With nein base URL set at alle it asks nothing rather than sending the
credential to Anthropic's API.

| Variable | Purpose |
| -------- | ------- |
| `SHUNT_BASE_URL` | The gateway base URL; overrides `ANTHROPIC_BASE_URL` |
| `ANTHROPIC_BASE_URL` | The gateway this Sitzung already routes through |
| `SHUNT_TOKEN` | The Client Token; overrides both below, sent as `Authorization: Bearer` |
| `ANTHROPIC_AUTH_TOKEN` | Sent as `Authorization: Bearer`, as Claude Code sendet it |
| `ANTHROPIC_API_KEY` | Sent as `x-api-key`, as Claude Code sendet it |

`SHUNT_BASE_URL` is what lets you lesen one gateway's pool while routing traffic
through another.

### `shunt gateway claude` Sitzungen

`shunt gateway claude` scrubs `ANTHROPIC_AUTH_TOKEN` und `ANTHROPIC_API_KEY` von
the environment it hands Claude Code, und wires `apiKeyHelper` to `shunt gateway
Token` instead; Claude Code consumes the helper's Ausgabe itself und nie
re-exports it. When keine of the variables above holds a credential, der Mod
therefore liest the merged settings (`--settings` included) und, if
`apiKeyHelper` is shunt's own — `shunt gateway token`, by bare Name oder by Pfad,
as the launcher schreibt it — runs it directly, ohne a shell, und sendet the
gateway login Token it prints as `Authorization: Bearer`. Because es gibt nein
shell, a leading `~/` in an unquoted helper Pfad is expanded to the home
Verzeichnis (`HOME`, else `USERPROFILE`) by der Mod itself; a quoted `'~/…'` stays
literal, as in a shell. The login belongs to the gateway the Sitzung talks to
(`ANTHROPIC_BASE_URL`), so es ist sent nur when `SHUNT_BASE_URL` is unset oder
spells that same base URL — compared as a string danach trimming whitespace und
trailing slashes, so `localhost` und `127.0.0.1` count as different — und the
helper is nicht even ausführen otherwise; to lesen another gateway's pool, export
`SHUNT_TOKEN` for it. If that helper fails — a non-zero exit, nein Ausgabe, oder it
cannot be started — the Leiste flags `shunt · ⚠ gateway login unavailable` und
`/shunt:usage` says to ausführen `shunt gateway login`, rather than silently showing
the Sitzung's own limits.

The Token is reused for five minutes, so a poll every minute does nicht ausführen the
helper every minute. A reused Token the gateway refuses is dropped und the
helper asked once mehr, since a refresh may have rotated it. Any other
`apiKeyHelper` — a password manager, a script that prompts — is nie ausführen: the
mod would otherwise ausführen it every few minutes for a Nutzung figure. In such a
Sitzung export `SHUNT_TOKEN` mit a `[server.auth]` Client Token instead, oder the
Leiste falls zurück to the Sitzung's own rate limits.

The gateway has to accept a gateway login on `GET /usage`, which needs a shunt
build that authenticates `[server.gateway]` logins there; `[server.usage]` mit
nur `[server.gateway]` configured is enough.

## Why `/shunt:usage` und nicht `/usage`

`/usage` is Claude Code's own built-in, und the engine refuses to let a plugin
take a built-in's Name:

```
$.command.register: "/usage" refused: it is the built-in /usage
```

`$.command.register` takes a bare, global Name. A plugin's **markdown** Befehl
is namespaced by das Plugin instead, so `commands/usage.md` in a plugin named
`shunt` lists as `shunt:usage` und collides mit nothing. The Hooks module dann
intercepts `command.run` for that Name und answers it directly.

## Layout

| Path | What es ist |
| ---- | ---------- |
| `hooks/register.tsx` | The Hooks: `command.run` on `shunt:usage`, und the Leiste's `session.start`, `session.measure`, `turn.complete` und `ui.render` on `AbovePrompt` |
| `hooks/endpoint.ts` | Resolves the gateway URL und credential header |
| `hooks/report.ts` | Reads a `GET /usage` body, defensively |
| `hooks/reading.ts` | Turns one round trip in a report oder a problem, full und brief |
| `hooks/views.ts` | Renders the Befehl's bars, percentages und zurücksetzen times |
| `hooks/band.ts` | The Leiste's cells, alerts, levels und countdowns, von the pool oder the Sitzung's own limits |
| `hooks/names.ts` | The Befehl Name und the fixed texts |
| `types/index.d.ts` | The `$.state` contract: the pool snapshot, the Sitzung's limits und the clock the Leiste draws von |
| `commands/usage.md` | The Befehl, und the nein-function-hooks fallback |
| `tests/*.spec.ts` | Vitest suite over the pure modules |
| `tests/mod/*.test.tsx` | Engine suite over the Hooks, ausführen by `claude plugin test` |

## Development

```bash
# The static side-effect analysis: which events it hooks, which $ calls and
# environment variables it makes and reads.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude plugin validate plugins/shunt

# The pure modules' suite and typecheck (both CI gates).
cd plugins/shunt && npm ci && npm run typecheck && npm test

# The hooks against the engine itself: the band and the command, with the
# gateway, clock and environment mocked. Needs a Claude Code binary, so CI
# does not run it.
claude plugin test plugins/shunt

# Run it from source against a live gateway.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir plugins/shunt
```

`hooks/register.tsx` is the nur Hooks Datei that imports `claude-code`. Typechecking it
needs the engine's own `claude-code.d.ts`, which Claude Code schreibt in a plugin
author's Projekt via `/plugin-types`; the other modules import nothing von the
engine, which is why the suite covers them ohne it. For the same reason
`tsconfig.json` excludes `hooks/register.tsx` von `npm run typecheck`, along
mit `tests/mod`, the engine suite — that exclusion is deliberate, nicht an oversight, und typechecking that one Datei means
läuft `/plugin-types` erste.

> Function Hooks are early access. Hooks modules load nur where they are
> aktiviert, und the API dieser Mod is written against may ändern between Claude Code
> releases ohne notice.

## Lizenz

MIT OR Apache-2.0, matching the shunt Projekt.

## Quelle und Lizenz

- Originalautor: pleaseai
- Originalrepository: https://github.com/pleaseai/shunt
- Lizenz: Apache-2.0
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
