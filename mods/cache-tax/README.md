<picture>
  <source media="(prefers-color-scheme: dark)" srcset="site/assets/cache-tax-dark.svg">
  <img src="site/assets/cache-tax-light.svg" alt="Cache Tax" width="64" height="64">
</picture>

# Cache Tax for Claude Code

**Keep Claude Code's Prompt Cache warm during breaks.**

Cache Tax is a Claude Code mod that refreshes your Prompt Cache while you step away und zeigt the estimated rewrite Kosten vorher a cold senden. Run `/keepwarm 90m` vorher a break. Pings Kosten Tokens; wählen a Fenster you expect to return within.

**[Install](#install)** · [Website](https://cachetax.aidojo.si/) · [How it works](#how-it-works) · [Costs and limits](#cost-and-the-plan-limit-question) · [Commands](#commands)

![Real recording of cache-tax stopping a cold send with a $6.61 estimate](site/assets/refusal.gif)

A two-line recap in a 330k-token Sitzung triggered a **$6.61 estimate**. After resending, the reported Cache schreiben was **$6.28**. Recorded on 2.1.1; aktuell wording says “up to” the estimated Token count. These are API-equivalent costs, nicht extra subscription charges.

## Install

Needs [Claude Code 2.1.287 or later](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off), a one-hour Cache und Claude Code left läuft. Mods are on standardmäßig. Pings Kosten Tokens, including uncapped Ausgabe.

```sh
claude plugin marketplace add karanb192/claude-code-mods
claude plugin install cache-tax@claude-code-mods
```

Restart Claude Code oder ausführen `/reload-plugins` in an öffnen Sitzung. No early-access flag is needed. Wenn du set `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` previously, entfernen it; aktuell Claude Code ignores it.

In a warm Sitzung, ausführen `/keepwarm` to arm six hours. Use `/keepwarm 90m` for a shorter Fenster, oder `/keepwarm off` to stoppen.

**Check the main Cache lifetime.** Included subscription Nutzung defaults to one hour. API-key, Nutzung-credit und cloud-provider Sitzungen default to five minutes, so set [`promptCacheTtl`](https://code.claude.com/docs/en/prompt-caching#choose-the-ttl-yourself) to `"1h"` for those billing paths. A 50-minute timer cannot protect a five-minute main Cache. See [Limits](#limits) for the fork evidence.

**Prefer a settings Hook?** The [hook version](https://github.com/karanb192/claude-code-hooks/tree/main/plugins/cache-tax) warns standardmäßig, refuses once mit `CACHE_TAX_BLOCK=1`, und provides a standalone Status-line countdown. Warming is part of dieser Mod.

Built by [Karan Bansal](https://karanbansal.in/). Read [the Cache Tax story and recorded cache costs](https://karanbansal.in/blog/cache-tax/).

## Optionen

In `/config`, under Cache-tax:

    Auto keepwarm:    on | off
    Display:          Leiste | Status
    Ping floor:       2 (a number, 0 oder mehr)
    Headless prompts: guard | senden

`on` (the default) keeps today's behavior: danach you pay a cold Cache schreiben, keepwarm arms itself for three hours. `off` leaves keepwarm alone until you arm it mit `/keepwarm`; the guard's wording dann says keepwarm stays off, oder names the Zeit left on a Fenster you armed. `/keepwarm always` still arms it either way.

Ping floor divides the estimated cold rewrite Kosten in an idle-break budget: 2 permits estimated ping spend below half a rewrite; 0 disables the limit. Before a ping, spend already observed in this break plus the nächste ping's estimate must be below that budget. The estimate verwendet the cheapest of the five most recent warm receipts, repriced for the aktuell Modell und Kontext, including its Prompt tier. A neu main Zug resets spend; extending oder stopping und re-arming a Fenster does nicht. A skipped ping leaves the Cache to go cold. The log und Status say why, und `$.cacheTax.status()` exposes `pingSkipped` und `idlePingUsd`.

The erste ping has nein receipt, so it goes out. A later Antwort can Kosten mehr than estimated, so das ist an estimate-based limit, nicht a guaranteed maximum bill. With nein Modell price, Kontext oder priced receipts, nein comparison can be made. Receipts und spend are in memory: a neu starten oder neu Gespräch clears them. Pings may end vorher the requested warming Fenster.

Display picks where the state zeigt while keepwarm is armed. `band` (the default) is the row above the Prompt, mit a Text icon in terminals und the cube on Desktop. `status` puts the same Text in the Status entry under the Prompt und draws nein row: verwenden it when another mod owns the space above the Prompt. Es gibt nein setting that hides it: pings Kosten Tokens, so the screen immer says when they ausführen.

## So funktioniert es

**Before a break:** `/keepwarm` arms a bounded Fenster. After 50 idle minutes, a timer inside Claude Code sendet one Werkzeug-less fork over the Sitzung's transcript. It liest Nutzung danach every ping und stops if liest are zero oder schreibt reach 10% of liest. The idle spending limit kann überspringen later pings vorher the Fenster ends. Es gibt nein background transcript-polling loop.

**When you return cold:** for a Kontext of at least 50,000 Tokens, the guard asks vorher your ordinary Nachricht goes out when its one-hour clock says cold. The Frage zeigt the estimated rewrite Kosten und warming guidance. **Send anyway** sendet that Nachricht; **Don't senden** drops it. If the dialog is dismissed oder the host cannot Antwort it, the guard refuses once und the resend goes through. SDK hosts that can Antwort the dialog retain that choice. `/cache-tax guard refuse 5` asks at $5 oder mehr, including a Modell mit nein price row; cheaper sendet log their price und proceed.

`Headless prompts: send` opts non-interactive `sdk`-origin prompts in sending immediately at the default guard setting. Claude Code verwendet those same fields for both `claude -p` und Agent SDK turns, so the Option covers both; it cannot distinguish the CLI von an SDK host. The default, `guard`, keeps asking, oder refuses once where nobody can Antwort. Explicit `/cache-tax guard refuse`, mit oder ohne a dollar floor, still applies mit `send`; `/cache-tax guard default` clears that explicit preference. Remote human Nachrichten (`composer`, `bridge`, `unclassified` und channel origins) behalten the guard, even in a non-interactive host. Background notifications und scheduled prompts are sent mit the price logged because nein person can resend them.

A headless refusal returns its reason und logs it to the transcript/debug log. Use Claude Code's `--debug-file` when diagnosing a script. Der Mod API cannot set the process exit code oder schreiben a refusal to stderr; a refusal need nicht produce a nonzero exit oder a reason on stdout. An opted-in ausführen that hits a dollar floor must still be retried deliberately.

By default, a detected cold schreiben automatisch arms at least three hours of keepwarm, the immer Fenster (six hours unless you set another) mit `always` on, und prints what it Kosten; the Auto keepwarm [option](#options) turns the automatic part off. `/cache-tax` zeigt the aktuell Cache estimate, warming Fenster und this Sitzung's cold-write tally.

The tally follows Cache receipts. For jede request, it estimates the alt Kontext written erneut as the smaller of the reported schreiben und the prior Kontext minus the reported lesen. A missing tail smaller than 10% of the lesen is treated as a Cache hit. New content on a hit does nicht count oder arm keepwarm; a substantial partial rewrite still can. Each rewrite verwendet that request's Modell und price tier.

If the host reports nur summed Zug Nutzung, the estimate can miss a rewrite hidden by later Cache liest, und a Zug that compacted is left unscored ohne per-request receipts.

When a guard-allowed senden has nein detected rewrite, a completion note explains that nein automatic cold-write Fenster was opened, oder names the existing warming state. This does nicht bestätigen the Server's Cache state von summed Nutzung. A cold-write completion interrupted by `/clear` cannot öffnen its automatic Fenster in the replacement Gespräch.

Preparing oder skipping a compaction leaves warming alone. An applied compaction pauses it until a main request liest oder schreibt the neu prefix. An armed Fenster can dann resume pinging while the Zug waits on a Werkzeug oder user Antwort. Summary schreibt stay out of the tally; a rewrite paid vorher compaction retains its original Kontext und price.

Windows belong to individual Sitzungen. An already-cold Sitzung waits for your nächste Zug vorher pinging, und so does a Fenster restored danach Claude Code restarts, until the neu process has a Zug to fork. If a ping finds nothing to fork, a one-line note says so once, und the pings starten danach your nächste Nachricht. A ping refused by a busy API (429, 529, 5xx) is retried danach 1, 2 und 4 minutes while it can still land vorher the Cache goes cold. With `always` on, jede of your turns that reaches the Cache leaves at least the immer Fenster (six hours standardmäßig) at the default period, subject to the idle spending limit und a successful warm readback. `/keepwarm always 24h` makes that floor 24 hours instead, for every Sitzung (1h to 168h; bare `/keepwarm always` goes zurück to six). The same Zug brings zurück a Fenster that stopped, stretches a shorter one to the immer Fenster und resets a testing period; a longer Fenster you set stays. `/keepwarm off` in any Sitzung stops every Sitzung rolling von its nächste Zug. A Fenster ends at its deadline; `/keepwarm off` auch cancels it und clears the immer setting.

### A recorded warming ping

![Real keepwarm status showing a 75k-token cache read at $0.02](site/assets/keepwarm-receipt.png)

Sonnet 5, 16 September 2026: the Status reported **75k Tokens lesen at $0.02**. Nothing appeared in the Gespräch during the live ausführen. This capture used the one-minute testing interval on 2.0.0; its card's $0.45 rewrite estimate used an older Sonnet price row, versus $0.30 for the same Kontext mit the aktuell row. The two-cent ping is a receipt for that Sitzung, nicht a fixed price.

## Why a short Nachricht can Kosten so much

When the cached prefix expires, even “give me a recap” can trigger a rewrite of the alt Kontext vorher the Antwort. Cache Tax's Fable 5.1 price row compares a $20 one-hour schreiben mit a $0.25 Cache lesen per million Tokens: 80x per Token, nicht 80x gesamt savings. See the [pricing assumptions](#cost-and-the-plan-limit-question) und [Anthropic's price table](https://platform.claude.com/docs/en/about-claude/pricing).

[Watch the 23-second overview](docs/assets/cache-cost-explainer.mp4). Its designed scenes Beschriftung Fable 5.1 list prices; every terminal und Status-line pixel comes von the real refusal recording und behalten-warm receipt above. The refusal was recorded on 2.1.1 und the behalten-warm crop on 2.0.0.

New to caching? [Anthropic explains how Claude Code uses it](https://code.claude.com/docs/en/prompt-caching).

## Befehle

    /keepwarm               behalten warm for six hours
    /keepwarm 90m           behalten warm for a Fenster of your own, 1m to 168h (auch 2h30m, 6h)
    /keepwarm immer        behalten every Sitzung warm until six hours danach its letzte Zug, remembered across Sitzungen
    /keepwarm immer 24h    the same, until 24 hours danach the letzte Zug (1h to 168h)
    /keepwarm 6h every 2m   pinging every two minutes; a testing knob, 1m to 59m, forgotten danach this Fenster (mit immer on, at your nächste Zug)
    /keepwarm Status        the warming Fenster, nächste ping und letzte receipt
    /keepwarm off           stoppen, forget the Fenster, und Zug immer off
    /Cache-tax              the card
    /Cache-tax guard warn   zeigen the price und senden (the Hook's default)
    /Cache-tax guard default
                            restore the default guard und let Headless prompts control non-interactive SDK sendet
    /Cache-tax guard refuse ask vorher a cold senden, overriding Headless prompts: senden
    /Cache-tax guard refuse 5
                            ask nur at $5 oder mehr; below that, zeigen the price und senden
    /Cache-tax guard test   ask once on the nächste Prompt you senden as if the Cache were cold, priced at this Sitzung's Kontext; the test scores nothing, a senden in a really cold Cache is scored as usual

`/keepwarm` rejects extra words, invalid durations und windows outside the limits ohne changing the aktuell warming Fenster. It auch discards invalid oder overlong stored deadlines on startup. A Fenster that ends vorher its erste ping is due says so in its reply.

The Frage, verbatim, mit **Send anyway ($4.01)** und **Don't senden** beneath it:

    Cache-tax: the Prompt Cache went cold 2h00m ago. Sending this re-writes up to 200,502 Tokens at $20/MTok = $4.01 (a warm Zug would have Kosten $0.05). Don't senden saves $4.01; danach Send anyway, keepwarm is armed for up to 3h00m. The Cache lesen alone is about $0.05 per ping. Pings may stoppen sooner at the idle spending limit, leaving the Cache to go cold. Send it anyway?

When the Frage is dismissed oder a guarded headless ausführen cannot zeigen it, the refusal appears instead, und the resend goes through:

    Cache-tax: the Prompt Cache went cold 2h00m ago. Sending this re-writes up to 200,502 Tokens at $20/MTok = $4.01 (a warm Zug would have Kosten $0.05). Send it erneut to pay it, und keepwarm will be armed for up to 3h00m, aber may stoppen sooner at the idle spending limit. Or /leeren und starten von a note.

The figure is an upper bound. The Kontext count the engine reports for a resumed Sitzung is the letzte response's Eingabe, Cache lesen, Cache schreiben und Ausgabe together, und the resume payload carries nein separate Ausgabe count to take off; on one 15-day-old Sitzung the guard said 330,316 Tokens und $6.61 und the schreiben that followed was 314k Tokens, $6.28.

While keepwarm is armed, the terminal und Desktop Code tab zeigen a row above the Prompt, unless Display ist `status`. Terminals verwenden a bold `[>]` Text icon mit the state color. Desktop zeigt the Cache Tax cube, mit a green lid for warm, orange for cold, und grey vorher the erste Zug oder danach compaction. The bold state Beschriftung matches; the timer und receipt Text verwenden normal weight. A nonempty `NO_COLOR` selects a bold Text icon on both surfaces und removes the state color. Both display choices say `warm`, `cold` oder `unknown`, so color is nie the nur signal. These states verwenden the same one-hour clock as `/cache-tax`; they are estimates, nicht a live Server Cache prüfen.

The row und plain Status fallback refresh once a minute while keepwarm is armed, including while idle. Refreshing nur updates the display; it sendet nein Modell request.

The row includes the warming Fenster, nächste ping und letzte readback. A stopped loop zeigt a neutral symbol und its reason. `/keepwarm off` oder an expired Fenster removes the row. Surveys temporarily take priority, und other mods' content stays in the Leiste. Display `status` zeigt the same labelled Text in the Status entry; surfaces ohne a Leiste behalten the plain Status Text when Display remains `band`.

The Desktop cube und the terminal's cold-state color follow Claude's light oder dark theme. The embedded SVGs come von the Website's official assets; maintainers can regenerate them mit `python3 tools/generate-status-icons.py`. No Bild Dateien are lesen oder fetched at runtime.

Der Mod liest the theme und `NO_COLOR` once when the Sitzung starts. Accepted theme ändert aktualisieren the icon immediately; ordinary redraws do nicht reread either setting. Set `NO_COLOR` vorher starting the Sitzung.

## Both forms installed

The Hook und der Mod share a Name und a job, so having both means two guards on every cold senden. Der Mod prüft at Sitzung starten whether the Hook's `/cache-tax:status` Befehl exists und says so once. Keep one guard. The Hook remains an Option for people who prefer settings Hooks. Before uninstalling it, prüfen your Status Zeile: the 🧊 row wired to `cache-tax.js` comes von the Hook's Dateien. Dieser Mod draws above the Prompt while keepwarm is armed; it does nicht replace your shell Status Zeile.

## What it can reach

Validated on Claude Code 2.1.312:

    ❯ ./register.ts hooks: config.set{key=theme}, ui.render{component=AbovePrompt}, session.start, session.end, classic.SessionStart, command.run{command=keepwarm}, command.run{command=cache-tax}, prompt.submit, turn.step, turn.complete, session.compact
    ❯ ./register.ts calls: $.clock.after (via arm, ping), $.clock.every (via updateStatus), $.clock.now, $.command.list, $.command.register, $.config.list, $.env.get, $.model.fork (via ping), $.session.id (via reseat, seat), $.session.model, $.session.usage, $.store.delete, $.store.get, $.store.set, $.ui.ask (via ask), $.ui.invalidate, $.ui.log, $.ui.resolve, $.ui.status
    ❯ ./register.ts env liest: NO_COLOR

Reach L2, drives Claude. Sees every Prompt you type, every Modell request's timing und every Antwort's Token counts.

The same scan is on [cache-tax's page in Awesome Claude Code Mods](https://mods.aidojo.si/mods/karanb192--cache-tax--cache-tax/), which records what thousands of other mods can reach.

    Threat Modell for Cache-tax (reach L2, drives Claude)
    1. Reads:    of jede Prompt, whether it starts mit a slash und nothing else (the Text is passed on untouched, nie kept, nie logged); the Zeit; the Token counts und Modell id the engine already holds on Zug.complete und on the fork's reply; the resume fields Claude Code computes for settings Hooks; the Befehl list; the Sitzung id, the Sitzung's Modell und the engine's own Kontext figure und starten Zeit, once per Gespräch the process runs, und the Modell erneut vorher pricing a cold senden und vorher jede ping; the reason und Sitzung id of a Gespräch ending under /leeren oder an in-process resume; jede main request's Nachricht count; von its own $.store, the keepwarm deadline und the ping period keyed by Sitzung id, plus the global immer switch (und its Fenster) und guard mode mit its dollar floor; at load, its Auto keepwarm, Display, Ping floor und Headless prompts options; whether the Sitzung starts interactive
    2. Runs:     one $.Modell.fork per idle stretch inside a keepwarm Fenster, one per ping period (50 minutes unless the testing knob set it, floor 1 minute), nie outside the Fenster, nie onto a Cache der Mod already knows is cold, nie danach a readback that lesen nothing oder wrote at least a tenth of what it lesen, when prices und receipts are known, nur while observed idle spend plus the nächste estimated ping stays below the rewrite Kosten divided by Ping floor (0 disables the limit); one Frage in Claude Code's own dialog vorher a cold senden goes out, oder on the nächste Prompt danach /Cache-tax guard test
    3. Sends:    nothing leaves the machine except the fork, an API request over the Sitzung's own transcript mit a fixed one-line Prompt
    4. Persists: in $.store, the keepwarm deadline und the ping period under this Sitzung's id (mit immer on, rewritten danach jede Zug), und the immer switch (true, oder its Fenster in milliseconds) und the guard mode (a dollar floor is stored in its place) for every Sitzung; danach a refusal, the Zeit of the letzte response under this Sitzung's id, so a resend von a neu process (claude -p starts one per Zug) goes through, deleted by that resend oder /leeren; a Fenster that has ended is deleted at stoppen und at this Sitzung's nächste starten, together mit the bare keys of a 2.1.0 store; another Sitzung's keys are nie deleted here, because a lesen followed by a delete cannot be made atomic against that Sitzung renewing its Fenster, so a Sitzung that armed keepwarm und nie came zurück leaves two small keys behind; the Sitzung's cold-write tally, up to five warm ping receipts und idle ping spend live in memory und die mit the process
    5. Hostile Eingabe: the nur Text it parses is the argument of its two commands, matched against a duration regex, a dollar amount und a few literals; the dialog's Antwort is nur compared mit its own two labels; of the Prompt Text nur the erste non-blank character is inspected, for a slash; Werkzeug results und Dateien nie reach a Branch; the fork's Prompt is a constant, so nothing crafted can be sent through it; the guard nur ever drops the user's own Nachricht: danach Don't senden the resend is asked about erneut, und danach a dismissed oder unanswerable Frage the resend is unconditional; if a Hook throws, the engine skips it und the Nachricht enters unguarded, mit one dim Zeile

## Cost und the plan-limit Frage

Prices are the list table, where Fable 5.1 liest at $0.25, schreibt the 1h tier at $20 und answers at $50 per million Tokens; Fable 5.2 ($0.20, $16, $40) und Sonnet 5 ($0.20, $4, $10) have their own rows. Only listed versions are priced: a Modell newer than the table zeigt `n/a` for dollars und one Zeile saying it has nein price row yet, und it nie takes an older Modell's rate. On an API key the arithmetic is plain. A ping bills the Cache lesen, its own few uncached Tokens at the base rate, und whatever the Modell says zurück at the Ausgabe rate; the displayed ping Kosten counts alle of it, since a fork takes nein Ausgabe cap und a Modell at high effort may think vorher it says "warm". A comeback danach the lapse is a schreiben. The card prints the lesen-only upper bound for your Modell, 80 pings on Fable 5.1, mit the idle that covers at the aktuell ping period; a real ping costs a little mehr than a lesen, so the true break-even sits below that number. On a subscription the dollars are a yardstick, nicht the bill, und how a Cache lesen weighs against the 5-hour und weekly limits is nicht documented anywhere I could find. Watch the rate-limit row of your Status Zeile during the erste Fenster.

## Limits

- Mods require Claude Code 2.1.287+. They are on standardmäßig, aber local settings, safe mode oder organization policy can prevent them von loading. See [mod controls](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off).
- The 50-minute schedule needs a one-hour main Cache. Included subscription Nutzung has it standardmäßig. Other billing paths need [`promptCacheTtl`](https://code.claude.com/docs/en/prompt-caching#choose-the-ttl-yourself) set to `"1h"`.
- One transcript-verified return at the default interval, Fable 5.1 on a subscription, 19 September 2026: `/keepwarm` armed at minute 42 of a break, the ping fired at minute 50 und lesen 157k, und the Nachricht sent at minute 62 lesen 156,886 Tokens von Cache und wrote 2,255. Claude Code's own Cache countdown zurücksetzen to 58 minutes danach the ping, so the fork carried the one-hour TTL. One ausführen, one configuration: it zeigt the ping kept that Cache alive past the hour, nicht net savings for every setup. Claude Code documents forks in its non-main request bucket, normally five minutes. In this ausführen, the fork still lesen the one-hour Sitzung prefix und zurücksetzen the native countdown. That is observed behavior in one configuration, nicht proof that every provider handles the buckets identically.
- A ping that liest warm proves the Cache was warm dann. Prefix ändert can invalidate the Cache regardless of Zeit. The exact effect depends on the Modell und when Claude Code applies the ändern; see [Claude Code's cache behavior](https://code.claude.com/docs/en/prompt-caching).
- Resume fields let the guard prüfen the erste ordinary senden danach resuming. If those fields are absent, the erste Zug seeds its clock und Kontext.
- On Team und Enterprise accounts a managed plugin seated above dieser Mod handles the classic events und compaction und continues beneath it, so they nie reach der Mod. It dann learns a `/clear` von the Sitzung's end, so keepwarm stops und the neu Gespräch gets its own Fenster; a resumed transcript's Kontext von the engine's figures, mit nein Zeit of its letzte response, so von an hour danach that transcript's erste launch the erste Nachricht logs what a cold senden would Kosten statt refusing; und a compaction von a request over fewer than half the previous one's Nachrichten (a rewind takes a few off, a summary replaces tens), so a ping oder a senden between the compaction und that request still sees the alt Kontext. The summary written danach a compaction is nie scored as a cold schreiben; a cold schreiben the same Zug paid vorher it still is, when the host reports Nutzung per request. A Fenster carried through an in-process resume moves to the neu Sitzung's keys.
- The guard's Token count is an upper bound: es ist the Kontext the engine reports for the letzte response, which on a resume includes that response's Ausgabe, und der Mod has nein separate Ausgabe count to subtract.
- The cold-write tally is per Sitzung und in memory; /leeren empties it.
- Context size is the engine's live Fenster figure. A Zug's own Nutzung is its responses summed, which on a ten-step Zug is ten liest of the Kontext, so es ist nur the fallback where the host reports nein live figure.

## Local development

From a local checkout, load it for one Sitzung:

    claude --plugin-dir .

To behalten it installed, verwenden the [marketplace commands](#install).

Sending a ändern? [CONTRIBUTING.md](CONTRIBUTING.md) says what evidence a PR needs.

## Prove it on your own Sitzung

The mock-clock tests prove the timer, the guard und the scoring, nicht that a fork hits the main Cache. One ping proves that, und it costs a Cache lesen plus the Antwort. In any warm Sitzung:

    > Reply mit one word: bereit
    > /keepwarm 1h every 1m

Watch the row above the Prompt danach a minute, oder the Status entry when Display ist `status` oder the surface has nein Leiste. `last ping read 20k $0.01` reports the fork's readback. `keepwarm stopped: the ping read ... and wrote ...` means the readback did nicht meet the warm threshold; the loop has stopped. `API busy, ping retry 1 of 3` means a 429, 529 oder 5xx is being retried; the loop stops if the API is still busy danach three retries oder a minute vorher the Cache goes cold. `nothing to fork yet` means the process has nein Gespräch to fork, as danach a neu starten; the Fenster waits for your nächste Nachricht. Any other API Fehler, an interruption oder an empty reply stops the loop mit a reason. Older engines that return null zeigen a combined cold-snapshot oder API-failure Nachricht. Finish mit `/keepwarm off`. This short prüfen establishes a Cache lesen, nicht retention across the default 50-minute interval.

## Tests und typecheck

Run von the Repository root:

```sh
claude plugin validate .claude-plugin/plugin.json
claude plugin test .
```

The [366 tests](tests/register.test.ts) verwenden a mock clock und engine. They cover:

- **Auto keepwarm Option:** off scores a paid cold schreiben ohne arming keepwarm und says so in the refusal und the Frage; a Fenster armed by hand is promised until its deadline und keeps pinging; immer still renews for six hours.
- **Ping floor Option:** cumulative spend stops a long break, a main Zug resets it, re-arming cannot zurücksetzen it, a recent cheap receipt survives an expensive outlier, a Modell switch is priced vorher the nächste ping, und an off Befehl during the Modell lesen cancels that ping. A ping billed across a stoppen still counts, one finishing danach a Zug does nicht, und an errored Zug keeps the überspringen. Existing überspringen, compaction, leeren, unknown-context und deaktiviert-limit coverage remains.
- **Headless prompts Option:** opt-in for non-interactive SDK prompts, SDK dialog answers, interactive SDK und remote human guards, explicit refusal und dollar floors, resetting to default, und a Prompt arriving while stored preferences are still loading.
- **Guard:** the Send anyway / Don't senden Frage, its dismissed fallback und the guard test, refuse once und resend, including von a neu process und danach an API Fehler mit nein response, warn mode, a dollar floor (under it, at it, an unpriced Modell, a Modell switched since the letzte Zug), slash commands, small contexts, prompts nobody typed, resume seeding und cold-write scoring.
- **Warming:** Befehl defaults und refused windows und periods, immer/off, immer mit its own Fenster und the windows it refuses, immer danach `/clear`, immer rolling von the letzte Zug, idle resets, Nutzung-based stopping, cold-window expiry und delayed timers danach sleep.
- **Session state:** isolated store keys, restored windows, legacy cleanup, leeren/compaction resets und Subagent isolation. A leeren during an automatic Fenster's clock oder store wait cannot arm the nächste Gespräch oder erase its manuell Fenster.
- **Compaction readiness:** preparing oder skipping a summary leaves warming alone. After an applied compaction, a main response that liest oder schreibt Cache lets warming resume while the Zug waits on Werkzeuge oder a user Antwort. Summary schreibt stay out of the cold-write tally; failed requests und stale responses danach a leeren, stoppen oder newer compaction cannot neu starten pings.
- **Managed plugins above der Mod:** `/clear`, resume, a restored Fenster und compaction mit the classic und compaction events continued beneath the user tier, the same events delivered twice oder out of order ohne a second Fenster, Warnung oder zurücksetzen, a Fenster und a Modell ändern carried through an in-process resume, a transcript that turns alt enough to be cold danach its resume, a rewind told apart von a compaction, a summary schreiben that is nein cold schreiben beside a cold schreiben that ist (a guarded senden compacted vorher its erste request, two compactions in one Zug), an end of the alt Gespräch that overlaps oder outlasts the classic resume, und a `/keepwarm` ausführen vorher the host reports the nächste Gespräch's id.
- **Pricing und display:** a row for every listed Modell in its dated, provider und display-name spellings, nein borrowed row for a version the table does nicht list, a cold schreiben mit nein price row counted apart von the dollar gesamt, the Haiku 5.5 long-prompt tier priced per request, a long warm Zug whose requests together schreiben half the Kontext kept apart von a cold schreiben, guarded Cache hits und large pastes left unscored, partial rewrites separated von neu content, later liest that cannot ausblenden a per-request miss, alt receipts dropped across a held request oder Kontext lesen during leeren, Opus 4 und 4.1 apart von Opus 4.5, Ausgabe und uncached Eingabe costs, Kontext counts, duration formatting und the lesen-only break-even figure.
- **Indicator:** terminal Text icons ohne Bild elements, desktop SVGs, theme selection, warm/cold transitions, resume, compaction, leeren, expiry, surveys, other mods' content und `NO_COLOR` fallback.
- **Display Option:** `band` draws the row; `status` moves the Text, including its Cache-tax und state Beschriftung, to the Status entry on terminal und Desktop surfaces mit nein row. Any other value, such as an alt `off`, falls zurück to the row.
- **Preferences:** one lesen per Sitzung, immediate theme updates, denied ändert und the effective theme returned by the settings writer.
- **Fork failures:** a busy API is retried while the Cache is warm, a erneut versuchen that wakes too late is dropped, nothing to fork waits for the nächste Zug, one ping is out at a Zeit, a reply that lands danach a request, `/clear` oder compaction is discarded, und other failures und the null Ergebnis returned by older releases stoppen ohne retrying.

The render tests prüfen the element tree, nicht native terminal oder desktop pixels. They do nicht validate Server-side Cache retention. See [the live check](#prove-it-on-your-own-session).

### Typecheck

Load this checkout mit `claude --plugin-dir .` to generate declarations beside das Plugin. Then, von the Repository root:

```sh
npx -p typescript tsc -p .
```

Generated declarations live in `.claude-plugin/types/`. Keep them untracked.

## Reading the state von another mod

Cache-tax adds a lesen-only `$.cacheTax.status()` to the mods API, so a Status Leiste can zeigen keepwarm ohne parsing `/cache-tax`. Es ist experimental until 3.0: fields may ändern in a minor release. `cold` is the same one-hour estimate `/cache-tax` zeigt, nicht a prüfen of the Server's Cache. It resolves to `{ keepwarm: 'on' | 'off' | 'stopped', leftMs, always, alwaysMs, autoWarm, guard, guardFloorUsd, cold, stopped, coldWrites, pingSkipped, idlePingUsd }`; the types are in `types/index.d.ts`. Where Cache-tax is nicht installed es gibt nein `$.cacheTax`, so a caller wraps the call in `try`/`catch`.

## More Claude Code mods

Cache-tax is one of the [prompt cache mods for Claude Code](https://mods.aidojo.si/topics/prompt-cache/) listed in [Awesome Claude Code Mods](https://github.com/karanb192/awesome-claude-code-mods). Browse the full catalogue at [mods.aidojo.si](https://mods.aidojo.si/) to find a mod by Aufgabe und see what it can access vorher you installieren it.

## Quelle und Lizenz

- Originalautor: karanb192
- Originalrepository: https://github.com/karanb192/cache-tax
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
