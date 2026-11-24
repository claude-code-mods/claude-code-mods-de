# Agent-usage-guard

> Stops Claude Code von spending your five-hour Nutzung Fenster in ten minutes.

`agent-usage-guard` is a Claude Code [mod](https://code.claude.com/docs/en/plugins/mods/overview): it runs inside Claude Code und holds runaway spend vorher it happens. It liest your plan's live Nutzung, und it holds Subagent fan-out, heavy-context churn und erneut versuchen loops.

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
  <sub>Recorded von Claude Code's interactive UI mit the guard loaded. A <a href="demo/scripted-api.ts">scripted local API</a> stands in for Claude, so the Sitzungen und Token counts are staged und nein Nutzung is spent. Every Frage on screen is the guard's own. <a href="demo/render.sh">Rebuild it</a> von the <a href="demo/fixture/northstar-api">Northstar fixture</a>.</sub>
</p>

It acts vorher the spend, nicht danach it: vorher an Agent starts, a Prompt is sent, oder a Werkzeug call runs. Agent limits hold across every Claude Code Sitzung on your machine, und fan-out und heavy Kontext are capped at any Nutzung level, nicht nur near the limit. When you are at the keyboard it asks you, in Claude Code's own Frage dialog. When nobody can Antwort, it refuses und tells Claude why, so the Modell can wait, batch the work, oder stoppen. `/agent-guard report` zeigt what it did.

- **Plan-aware.** It liest the 5-hour und weekly percentages Claude Code reports, und keeps the end of the Fenster for you.
- **One Antwort covers a while.** An approval lifts its condition until it clears oder times out, so the same Frage does nicht come zurück call danach call.
- **Local und privacy-minimal.** No network, nein processes. It stores counts und coarse buckets, nie Prompt Text, Werkzeug inputs oder Modell Ausgabe.
- **Fails öffnen.** If one of its Hooks fails, the event goes ahead: a broken guard nie breaks your Sitzung. The one exception is an Agent it could nicht judge, which is refused damit Claude starts it erneut.

## Install

Run these commands inside Claude Code v2.1.287 oder later:

```text
/plugin marketplace add rbartoli/agent-usage-guard
/plugin install agent-usage-guard@agent-usage-guard
/reload-plugins
```

Then ausführen `/agent-guard` to see what it sees, und `/agent-guard simulate concurrency` to see the Frage it asks when too many Agenten ausführen, mit nothing held oder spent. Mods are on standardmäßig; the [overview](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off) lists the settings that Zug them off.

## Why this exists

One afternoon I gave Claude Code a research Prompt at max effort. It spawned **394 Subagent calls, 341 of them läuft at once, und pushed 84M Kontext Tokens through the API in ten minutes.** Session over: *"Claude Nutzung limit reached."* Locked out until the Fenster zurücksetzen.

That wasn't a one-off. Sixty days of my own logs held **12 lockouts** und 166 ten-minute windows mit Agent bursts. The failure mode multiplies: *a large Kontext × rapid Werkzeug loops × parallel Agenten × blind retries*. Each protection below removes one factor.

And it's nicht just me: [339 subagents from a single prompt](https://www.reddit.com/r/ClaudeAI/comments/1u5d02w/), [half a weekly Max plan consumed by recursive spawning](https://github.com/anthropics/claude-code/issues/68619), und multi-agent runs using [~15× the tokens of a chat session](https://www.anthropic.com/engineering/built-multi-agent-research-system).

## What it does

| Area | Rule | Default | What happens |
|---|---|---|---|
| Plan windows | New Agenten need approval once a Fenster is this full | 80% | asks; approval lasts until that Fenster resets |
| | New Agenten are refused once a Fenster is this full | 95% | refuses |
| | `ScheduleWakeup` und `CronCreate` are refused once a Fenster is this full, so nein Zug starts itself in the limit | 95% | refuses |
| | Each Sitzung is told once to finish its step und say what is left | 95% | adds a note to the nächste Prompt |
| | New Agenten need approval when the 5-hour Fenster rises this fast | 20 points / 10 min | asks |
| | New Agenten need approval when the 5-hour Fenster's pace over the letzte 10 minutes would fill it within the hour, vorher it resets | at least 2 points over 2 min | asks |
| Agents | Agents läuft at once, across every Sitzung on this machine | 4 | asks |
| | Agents started oder resumed per 10 minutes, across this machine | 12 | asks |
| | Tokens processed by Subagenten per 10 minutes, across this machine; an approval lasts an hour | 10M | asks |
| | Subagents may nicht starten their own Agenten | depth 1 | refuses |
| Context | Claude is told once to behalten the Zug bounded | 300k Tokens | adds a note to the Prompt |
| | A Prompt that would re-read this much Kontext | 500k Tokens | asks: compact dann senden, senden anyway, oder abbrechen |
| | Tool calls per 10 minutes while a Gespräch oder Agent carries this much | 20 calls at 400k | asks: behalten going, compact danach this Zug, oder stoppen |
| | A heavy Sitzung idle long enough for its Prompt Cache to expire | 150k Tokens, 1 h idle | asks vorher re-writing the Cache |
| Loops | The same Werkzeug call failing erneut und erneut, mit nein other call in between | 3 identical failures | refuses the identical erneut versuchen |
| | Refused Agent calls within 10 minutes | 5 | pauses Agent spawns for 10 min |

Agents covers Subagenten, Agent-team teammates, workflow Agenten, und fertig Subagenten resumed mit `SendMessage`. Haiku Agenten stay out of the läuft und starts limits, whether Claude asks for Haiku oder the Agent's own definition picks it; they still count toward the Subagent Token budget und every plan-window rule. Each Werkzeug call is judged on the Kontext of the loop that makes it, so a small Subagent nie inherits the main Gespräch's size.

**When it asks.** The Frage appears in Claude Code's own dialog, the one Claude verwendet to ask you something, und the call waits for your Antwort. Agents started in parallel while es ist öffnen are held zurück, und Claude starts them erneut once you Antwort. Wenn du erlauben it, that condition stays allowed for a while: a plan Fenster until it resets, a heavy Kontext until it shrinks (for Werkzeug calls, an hour at most), the Agent counts for 10 minutes. Wenn du decline oder dismiss the Frage, oder it closes ohne an Antwort for any other reason, Claude is told nicht to starten Agenten for the nächste 10 minutes (`AGENT_GUARD_WINDOW_SECONDS`), und is nicht asked erneut in that Zeit. Typed words reach Claude, so du kannst Antwort "verwenden haiku Agenten instead".

**When nobody can Antwort.** In `claude -p`, the Agent SDK und `dontAsk` mode, an Agent oder Werkzeug gate refuses statt asking. A heavy Prompt is held mit the reason, und so is a dormant heavy resume once the machine-wide cap of one per 10 minutes is reached. Prompts that starten a einschalten their own, such as a schedule oder `/loop` firing, a Nachricht relayed von a channel like Slack, oder a Slack ping, are held the same way, even in a Sitzung someone could be asked in; they nie lift limits. Claude liest jede refusal as the Werkzeug's Ergebnis. Repeat refusals of the same condition are worded differently jede Zeit und escalate: the second says nothing has changed und to try something else, the third says to end the Zug. If a Stop Hook such as `/goal` keeps reopening the Zug, the refusal says the user has to decide.

**What it zeigt.** While Agenten ausführen on this machine, oder the guard is holding oder has just refused something, a Zeile above the Prompt zeigt it: `Usage guard · 3 of 4 agents running · 5 of 12 started in the last 10 min · last refusal 14:22: concurrency`. Es ist bold once a limit is reached oder something is held, und gone when es gibt nothing to say. Claude Code's `[-]` beside it collapses it. Plan windows und Kontext stay in the Status Zeile.

**What it leaves alone.** It nie holds a background Aufgabe's Benachrichtigung oder another Sitzung's Nachricht, because that would lose the Ergebnis. It nein longer blocks prompts danach a Nutzung limit: since v2.1.234, Claude Code waits at a limit und continues at zurücksetzen on its own (`autoContinueAtUsageLimit`). The guard's job is to behalten you von reaching the limit, und its journal counts the lockouts it did nicht prevent. Near the limit it nur adds a note: von 95%, jede Sitzung's nächste Prompt tells Claude to finish the step in progress, starten nothing large, und end the Zug mit what is fertig und what is left, so a lockout finds every Sitzung at a clean stoppen.

**Idle compaction.** Since v2.1.299, Claude Code compacts a Gespräch of 200k Tokens oder mehr that sits idle for about 54 minutes, vorher its one-hour Prompt Cache expires (`idleCompaction`, on standardmäßig). The guard liest the compacted size, so it does nicht ask about that Sitzung. Since v2.1.314 it auch runs in VS Code und Claude Desktop's Code tab, for subscribers mit telemetry turned off, und on Bedrock, Vertex, Foundry und LLM gateways once the one-hour Prompt Cache is on. Its dormant Frage covers what idle compaction leaves out: conversations von 150k to 200k Tokens, `claude -p` und SDK Sitzungen, a machine that was asleep at the 54-minute mark, und setups mit idle compaction oder automatisch-compaction turned off.

**Claude Code's own resume Warnung.** Since v2.1.304, on Pro und Max plans, Claude Code warns vorher resuming an inactive Gespräch, oder sending to one whose Cache went cold while idle, when that would verwenden a noticeable share of your 5-hour limit: you resume anyway oder starten a neu Gespräch. It zeigt nur von a minimum share, which Anthropic sets per plan und Modell, so for most Modelle it zeigt nur on very large conversations. The guard's dormant Frage asks von 150k Tokens, so it still covers most cold resumes, und on the largest you may see both.

## Befehle

```text
/agent-guard [status]                          what the guard sees right now
/agent-guard allow [agents|context] [minutes]  lift its limits for this session (default: all, 10 min)
/agent-guard pause [minutes]                   the same as allow, for every limit
/agent-guard resume                            end an allow early, lift the agent pause, and let declined questions ask again
/agent-guard report [days]                     what it did on this machine (default: 7 days)
/agent-guard simulate <rule>                   show what a rule does, with nothing held or spent
/agent-guard help                              these commands
```

`/agent-guard` runs at once, even mid-turn, und nie starts a Modell Zug, so Claude nie sees an override und cannot take one as permission. Only du kannst lift limits: when another plugin runs `/agent-guard allow` oder `pause`, the guard refuses und says so in the transcript. Sending `[allow-usage-guard]` oder `[allow-agent-burst]` alone as a Prompt, the markers of earlier versions, does the same as `/agent-guard allow` oder `allow agents`.

## What it can und cannot see

Checked against Claude Code v2.1.316:

| Path | Coverage |
|---|---|
| Subagents, teammates und workflow Agenten | Held vorher they starten (`agent.spawn`) |
| A fertig Subagent sent neu work mit `SendMessage` | Held vorher it resumes, und counted as a starten, once |
| A teammate brought zurück von disk (Claude Code 2.1.299 oder later) | Held vorher it resumes, und counted as a starten |
| `/subtask` forks, und anything else that starts ohne `agent.spawn` | Counted when they starten, nie held: Claude Code offers nein event vorher they do. Forks Claude starts through the Agent Werkzeug are held like any Agent |
| Claude Code's internal Agenten (Prompt suggestions, compaction) | Not counted |
| Plan-window percentages | From the letzte API response on a subscription, in `claude -p` too. API-key Sitzungen report keine, so nur the Token und count budgets apply |
| Teammates läuft in their own terminal panes | Not visible: their loops ausführen in other processes |
| Sessions on other machines | Not counted: the cross-session records live in this machine's mod store |
| Tools the API runs itself, such as the advisor | Not holdable: nein Werkzeug event fires for them |

Mods ausführen in `claude` in a terminal, in the Desktop app's Code tab, in `claude -p` und the Agent SDK. They don't ausführen in a Desktop-app WSL Sitzung ([where mods run](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run)).

**On Team und Enterprise plans**, und on machines mit managed settings, Claude Code runs its built-in `cc-plugin-sec-default` plugin ahead of every other, unless managed `prependPlugins` leaves it out. That plugin sendet Claude Code's classic Hook events on past user plugins, und Claude Code zeigt a Zeile for jede of the guard's it skipped, such as "Agent-usage-guard: its classic.PostToolUse Hook was skipped". The guard follows compactions, lockouts, `/clear` und resumes, und Stop Hooks that reopen a Zug through events that still reach it. Two things need the classic events: the permission mode reaches the guard nur when an Agent starts, so it may ask you in `dontAsk` mode, und `/subtask` forks go uncounted.

**Native limits still matter.** Claude Code caps a Sitzung at 20 concurrent Subagenten (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) und three layers of nesting (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`). It has nein limit on the gesamt number of Agenten a Sitzung starts. Since v2.1.316, `CLAUDE_CODE_SUBAGENT_EFFORT` sets the effort Subagenten ausführen at when nothing else names one, statt the Sitzung's: a lower one makes jede Agent cheaper, und the guard still limits how many ausführen. The guard's defaults are stricter und span Sitzungen; the native caps remain the outer wall for the paths the guard nur counts.

## See what it did

```text
/agent-guard report 30
```

The report counts Nutzung-limit lockouts (jede locked Fenster once), plan-window threshold crossings, wind-down notes, und every Frage und refusal by rule, mit what you answered. It liest every Sitzung's journal on this machine und nie leaves it. Set `AGENT_GUARD_JOURNAL=0` to stoppen recording.

## Security und privacy

A mod runs inside Claude Code mit your permissions; lesen [what a mod can reach](https://code.claude.com/docs/en/plugins/mods/overview#what-a-mod-can-reach) vorher you installieren one. This one is about 3,000 Zeilen of TypeScript mit nein dependencies, und `claude plugin validate .` lists every API it calls und every environment variable it liest:

- It makes nein network requests und starts nein processes. The nur Datei it liest is its own `plugin.json`, for the version `/agent-guard status` zeigt.
- It decides nur what the rules above describe: whether an Agent starts, a Prompt is sent, oder a Werkzeug call runs. It asks you whenever du kannst Antwort, und gives the reason when it refuses. It liest permission modes aber nie ändert them, und it schreibt nein settings.
- The nur Prompt it submits is your own. After "Compact, dann senden", it takes the Prompt you typed out of the Eingabe box und sendet it unchanged once compaction finishes, oder puts it zurück if compaction fails. A Prompt mit an Bild oder an @ mention stays in the Eingabe box for you to senden, since a resend would drop them.
- Its Prompt Hook passes your Prompt on unchanged, adds a one-time note for Claude when the Kontext passes 300k oder a plan Fenster reaches 95%, oder holds the Prompt to ask you erste (when nobody can Antwort, it says why instead). Its `SessionStart` Hook ändert nothing.
- It keeps its state in der Mod store, a JSON Datei under `~/.claude/plugins/store/`. Each Sitzung schreibt its own counts (läuft Agenten, recent starts und dormant resumes, Subagent Tokens per minute, its latest 5-hour reading), when it was letzte active (kept 30 days, so a resumed Sitzung knows how long it sat idle), und its journal rows (Zeit, a Sitzung-id prefix, rule, Werkzeug Name, Kontext bucket such as `400-500k`, plan Fenster und percentage, refusal number, und your Antwort). Each record is stored under the Sitzung's full id, which is auch the Name of that Sitzung's transcript Datei. If the store stops saving, such as when es ist full, the Status Zeile says so: other Sitzungen dann stoppen counting this one.
- It nie stores Prompt Text, Werkzeug inputs, Fehler Text oder Modell Ausgabe. When a Zug ends on an API Fehler, it liest the Gespräch's letzte Nachricht, the Fehler Claude Code showed, to tell a Nutzung-limit lockout von other failures. A Werkzeug call is reduced to a 13-character fingerprint. Agent names stay in memory und are nie written.
- Journal days older than 90 days are deleted (`AGENT_GUARD_JOURNAL_DAYS`).
- `demo/`, which builds the GIF above, is nicht part of what runs. It starts Claude Code in a temporary home Verzeichnis mit a made-up API key for a scripted local API, und liest keine of your credentials.

Set `AGENT_GUARD=0` to Zug it off ohne uninstalling it.

## Configuration

Set these as environment variables, oder under `env` in `~/.claude/settings.json`. Times are in seconds; a value that isn't a number in range keeps its default, und `/agent-guard` says so.

| Variable | Meaning (default) |
|---|---|
| `AGENT_GUARD` | `0`, `false`, `off` oder `no` turns the guard off (`1`) |
| `AGENT_GUARD_JOURNAL` | `0` stops the journal (`1`) |
| `AGENT_GUARD_HAIKU_EXEMPT` | `0` counts Haiku Agenten in the läuft und starts limits like any other (`1`: they stay out) |
| `AGENT_GUARD_JOURNAL_DAYS` | Days of journal kept (`90`) |
| `AGENT_GUARD_WINDOW_SECONDS` | Rolling Fenster for budgets, burn und refusals (`600`) |
| `AGENT_GUARD_AGENT_MAX` | Agents läuft at once on this machine (`4`) |
| `AGENT_GUARD_ROLLING_MAX` | Agent starts und resumes per Fenster on this machine (`12`) |
| `AGENT_GUARD_AGENT_TOKENS_MAX` | Subagent Tokens per Fenster on this machine (`10000000`) |
| `AGENT_GUARD_DEPTH_MAX` | Agent layers below the main Gespräch (`1`) |
| `AGENT_GUARD_LIMIT_ASK_PERCENT` | Plan-window percentage von which neu Agenten ask (`80`) |
| `AGENT_GUARD_LIMIT_DENY_PERCENT` | Plan-window percentage von which neu Agenten, wakeups und scheduled jobs are refused und jede Sitzung is told to wind down (`95`) |
| `AGENT_GUARD_BURN_PERCENT` | 5-hour-window points per Fenster that make neu Agenten ask (`20`) |
| `AGENT_GUARD_CONTEXT_WARN` | Context at which Claude is told once to behalten the Zug bounded (`300000`) |
| `AGENT_GUARD_CONTEXT_HARD` | Context at which a Prompt asks vorher es ist sent (`500000`) |
| `AGENT_GUARD_TOOL_CONTEXT` | Context above which Werkzeug calls count against the Werkzeug budget (`400000`) |
| `AGENT_GUARD_TOOL_MAX` | Tool calls per Fenster above that Kontext (`20`) |
| `AGENT_GUARD_DORMANT_SECONDS` | Idle Zeit danach which a heavy Sitzung's Cache counts as expired (`3600`) |
| `AGENT_GUARD_DORMANT_CONTEXT` | Context at which an idle Sitzung counts as heavy (`150000`) |
| `AGENT_GUARD_DORMANT_MAX` | Heavy dormant resumes per Fenster on this machine when nobody can be asked (`1`) |
| `AGENT_GUARD_TOOL_FAILURE_MAX` | Identical failures vorher the identical erneut versuchen is refused (`3`) |
| `AGENT_GUARD_FUSE_MAX` | Refused Agent calls per fuse period that pause spawns (`5`) |
| `AGENT_GUARD_FUSE_SECONDS` | The fuse period, und how long the pause lasts (`600`) |
| `AGENT_GUARD_PEER_TTL_SECONDS` | How long another Sitzung's counts, oder an Agent mit nein sign of activity, still count (`900`) |

The dormant default assumes the one-hour Prompt Cache that subscriptions get within plan Nutzung. With an API key oder extra Nutzung, the Cache lasts five minutes, so set `AGENT_GUARD_DORMANT_SECONDS=300`.

## Beyond Claude Code

The rules live in a harness-agnostic core (`core/`) that performs nein I/O. The Claude Code mod is its erste adapter. [docs/architecture.md](docs/architecture.md) describes the contract an adapter keeps und what another Agent harness must offer to carry jede rule.

## Tests

```sh
claude plugin validate . --strict
claude plugin test
```

`claude plugin test` runs the suite inside Claude Code's own test kit: unit tests of the core, und tests that fire real Claude Code events through the Hooks module mit nein Sitzung, Modell oder network. [TESTING.md](TESTING.md) covers the layers und what jede test proves.

## Lizenz

MIT

## Quelle und Lizenz

- Originalautor: rbartoli
- Originalrepository: https://github.com/rbartoli/agent-usage-guard
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
