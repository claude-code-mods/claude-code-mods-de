<p><img src="docs/banner.png" width="100%" alt="claude-carbon, free and open source: the CO2 of your Claude Code sessions, in the terminal and in the Claude app. Eight pixel molecules from dark blue to dark red, a terminal whose status line reads 8.2gCO2, and the /carbon-panel pane: this session's molecule and CO2, the last 30 days as tiles and warming stripes, a button for the yearly card"></p>

[![GitHub stars](https://img.shields.io/github/stars/gwittebolle/claude-carbon)](https://github.com/gwittebolle/claude-carbon/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/gwittebolle/claude-carbon)](https://github.com/gwittebolle/claude-carbon/releases)
[![npm](https://img.shields.io/npm/v/claude-carbon)](https://www.npmjs.com/package/claude-carbon)
[![CI](https://github.com/gwittebolle/claude-carbon/actions/workflows/ci.yml/badge.svg)](https://github.com/gwittebolle/claude-carbon/actions/workflows/ci.yml)

claude-carbon is an öffnen source Claude Code plugin that tracks the carbon footprint of your Sitzungen: a live CO2 estimate computed locally von your Token Nutzung, in the terminal Status Zeile und in the Code tab of the Claude desktop app, nächste to the Sitzung's API-equivalent Kosten. In the desktop app, `/carbon-panel` öffnet a pane mit a pixel molecule coloured by this Sitzung's CO2 against the median of your past Sitzungen, your Nutzung over the period you pick, its warming stripes, und a Schaltfläche for your yearly card.

<p align="center"><img src="https://github.com/user-attachments/assets/f52b2653-28b9-4efc-82a6-02dfe256e193" width="480" alt="claude-carbon in 16 seconds: Claude Code never shows its CO2; claude-carbon puts it in the terminal status line, then in the Claude desktop app, where /carbon-panel opens a pane with a pixel molecule coloured by this session's CO2 against the median of your past sessions"></p>

## What claude-carbon does

- `/carbon-panel`: a pane in the Claude desktop app mit your CO2 molecule, your Nutzung und the warming stripes of your Sitzungen (in a terminal, the Sitzung in the Leiste above the Prompt). See [the mod](#the-mod-carbon-panel-and-the-co2-of-each-answer)
- Adds a live CO2 estimate to the Claude Code Status Zeile, und the Sitzung's CO2 under the Prompt in the Claude desktop app, jede nächste to the Sitzung's API-equivalent Kosten
- Persists jede Sitzung to a local SQLite database, so history survives the 30-day transcript purge
- Backfills historical data von existing `~/.claude` transcripts
- Slash commands: `/carbon-report` (Text), `/carbon-card` (PNG), `/carbon-pr` (footprint of a pull request)
- A README badge mit your alle-time gesamt, und a public methodology mit every factor sourced

> **About the `$` figure.** Es ist an API equivalent: what your Sitzung would Kosten at Anthropic's pay-as-you-go API list prices. On a Pro, Max oder Ultra subscription you do nicht pay it; it zeigt the value of what you used, nächste to its CO2. See [How it works](#how-it-works).

## Install

In Claude Code, type:

```text
/plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

Claude Code asks you to bestätigen the marketplace, zeigt what das Plugin installs, dann asks where to installieren it: pick **Install for you**. The same Zeile works on macOS, Linux und Windows. In the **Code** tab of the Claude desktop app, if the Zeile is nicht taken, paste this Nachricht instead und accept when Claude asks:

```text
Install the claude-carbon plugin for me: claude plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

Then quit Claude Code completely, öffnen it erneut und starten a neu Sitzung. Your CO2 jetzt zeigt nächste to the Sitzung's Kosten:

- in a terminal, in the Status Zeile: `$0.50 · 65gCO₂`
- in the desktop app, under the Prompt: `This session: 3.6 gCO₂ · $0.12`

Das Plugin sets that Status Zeile once, at its erste Sitzung starten, und nur when you have keine: another Werkzeug's Status Zeile is left as es ist (to hinzufügen the CO2 to it, see [ccstatusline](#using-with-ccstatusline)). `/carbon-report` gives your totals, und `/carbon-panel` öffnet the pane in the desktop app. The `$` is an API-equivalent Kosten, nicht what your subscription bills. To aktualisieren later, ausführen `/carbon-update`.

<p align="center"><img src="docs/desktop-pane.png" width="560" alt="Illustration of the Claude desktop app with the claude-carbon pane open: a blue pixel molecule, &quot;This session: 8.2 gCO₂ · 0.04× your median&quot;, the last 30 days as tiles and warming stripes, a &quot;Get my 2026 card&quot; button, and &quot;This session: 8.2 gCO₂&quot; under the prompt"></p>

<details>
<summary><b>If the installieren stops</b></summary>

- **macOS öffnet a Fenster about "Befehl Zeile developer Werkzeuge".** That ist `git`, which Claude Code needs to fetch das Plugin und a Mac ohne developer Werkzeuge does nicht have yet. Click **Install**, wait until it finishes (a few minutes), dann installieren erneut.
- **"jq is nicht installed" oder "sqlite3 is nicht installed".** Tell Claude: "Install what is missing.", dann neu starten Claude Code. Every Mac has `sqlite3`, und macOS 15 und later auch have `jq`. On an older Mac, Claude can installieren `jq` mit Homebrew, oder the installer (under Other ways to installieren) fetches the official `jq` itself, checked against its published checksum. On Windows, `/carbon-panel` names the one missing und Claude can installieren it mit `winget`. If `winget` answers "Access is denied", security software on the PC is blocking it: erlauben `winget` there, dann try erneut.
- **Windows says Git Bash is missing.** Install [Git for Windows](https://git-scm.com/downloads/win) (Claude Code needs it on Windows anyway), quit the app completely und reopen it, dann installieren erneut in a neu Sitzung. Claude Code looks for Git Bash when a Sitzung starts, so a Sitzung öffnen during the Git installieren still runs ohne it.
- **Installed von Anthropic's community marketplace und das Plugin fails to load?** The `co2-tracker@claude-community` entry is pinned to a release von August 2026 that aktuell Claude Code rejects ("Duplicate Hooks Datei detected"). Run `/plugin uninstall co2-tracker@claude-community`, dann installieren as above.

</details>

<details>
<summary><b>Other ways to installieren</b></summary>

- **The installer**, a script that clones dieses Repository und wires everything in `~/.claude/settings.json` itself. Paste this Nachricht in Claude Code, oder ausführen the Befehl danach the colon yourself in a terminal:

  ```text
  Install claude-carbon for me by running this command:
  curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | bash
  ```

  On Windows, in PowerShell (it needs [Git for Windows](https://git-scm.com/downloads/win) und two packages erste, see [Windows](#windows)):

  ```text
  Install claude-carbon for me by running this command in PowerShell:
  irm https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.ps1 | iex
  ```

  If the mode selector under the Prompt zeigt **Auto**, pick **Manual** erste: automatisch mode blocks a Befehl that downloads a script und runs it. Du kannst lesen [install.sh](install.sh) vorher läuft it.
- **With Node.js:** `npx claude-carbon` runs the same installer.

Use one way nur: das Plugin und the installer together would ausführen every Hook twice. Already installed mit the installer? Nothing to ändern, `/carbon-update` keeps it up to date.

</details>

Not covered: the chat und Cowork tabs und the web app (claude.ai/code). Their Sitzungen ausführen on Anthropic's servers, so nothing reaches your machine to count.

## Example report

<p align="center">
  <img src="docs/example-card.png" alt="claude-carbon summary card: 1190.3 kg of estimated CO2 from January to September 2026, a bar per month, then 25.3B tokens processed, 94% of them cache reads, a car equivalent, the API-price cost and a yearly projection" width="540">
</p>

Generate yours mit `/carbon-card` in Claude Code. The summary und detailed PNGs land in
`~/Downloads/claude-carbon/` (the Windows Downloads Ordner follows the system setting, so a
OneDrive-redirected one is honoured) und the Ordner öffnet in your Datei manager, mit the
card selected on macOS. `CLAUDE_CARBON_EXPORT_DIR` picks another Ordner;
`CLAUDE_CARBON_NO_OPEN=1` skips the opening.

Without Playwright oder Chromium es gibt nein PNG und the Befehl still finishes: the summary
card is gespeichert as an HTML page in the same Ordner und öffnet in your Browser, scaled to fit the
Fenster, und a Screenshot of it does the job.
The Token count on the card is every Token Claude processed, Cache liest included, as `ccusage` counts them; the grey Zeile under it gives the share of Cache liest. The card's footer says where to find the Werkzeug, `claude-carbon sur GitHub` / `claude-carbon on GitHub`, mit the address below it.

From the 1st to the 10th of jede month the Status Zeile ends mit `📊 September: 84.2kgCO₂ · /carbon-card`:
the gesamt of the month just closed, the bar the card draws for it, in the same format as the
Sitzung figure. Es ist lesen von carbon.db once a day while the nudge zeigt, und kept in
`~/.claude/claude-carbon/last-month-total`. A month mit fewer than 7 days of Sitzungen gets nein
nudge, so a fresh installieren is nicht pushed to share a near-empty card. Generating a card
clears it for the month; it goes quiet on its own danach the 10th. In December it gives the year
so far instead, `📊 2026: 1444.4kgCO₂ · /carbon-card`, und stays the whole month, the card covering
the calendar year. From the 1st to the 10th of January it gives the year just ended, und over those
days `/carbon-card` covers that year, whole, unless you pass a period oder that year has nein Sitzung (the
card keeps those ten days even when the reminder is turned off). `CLAUDE_CARBON_CARD_NUDGE_UNTIL_DAY`
moves the cut-off (0 removes the nudge, December included), `CLAUDE_CARBON_NO_CARD_NUDGE=1` removes the nudge. Nothing is posted anywhere:
sharing stays a human decision.

<details>
<summary>Advanced options (CLI)</summary>

```bash
# Since a specific date
bash ~/code/claude-carbon/scripts/generate-report.sh --since 2026-03-01

# All time
bash ~/code/claude-carbon/scripts/generate-report.sh --all

# A closed period (--until is an exclusive upper bound: this one stops at June 30th)
bash ~/code/claude-carbon/scripts/generate-report.sh --since 2026-01-01 --until 2026-07-01
```

</details>

<details>
<summary>Custom installieren Verzeichnis</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | CLAUDE_CARBON_DIR=~/my-path/claude-carbon bash
```

The env var has to sit on the `bash` side of the pipe, nicht the `curl` side, oder the installer nie sees it.

</details>

<details>
<summary>Second Claude environment (CLAUDE_CONFIG_DIR)</summary>

Wenn du ausführen a second Claude Code environment out of its own config Verzeichnis, e.g.

```bash
alias claude-work="CLAUDE_CONFIG_DIR=~/.claude-work claude"
```

installieren claude-carbon in that same Verzeichnis by passing `CLAUDE_CONFIG_DIR` to the installer:

```bash
curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | CLAUDE_CONFIG_DIR=~/.claude-work bash
```

The Status Zeile, the Hooks, the database und the `/carbon-*` commands alle live under that config dir, so jede environment tracks its own Sitzungen independently. When `CLAUDE_CONFIG_DIR` is unset everything falls zurück to `~/.claude` as vorher.

</details>

<details>
<summary>Manual installieren</summary>

```bash
git clone https://github.com/gwittebolle/claude-carbon.git ~/code/claude-carbon
bash ~/code/claude-carbon/scripts/setup.sh
bash ~/code/claude-carbon/scripts/configure-settings.sh
```

The second script merges the block below in `~/.claude/settings.json` (additively: an existing Status Zeile oder third-party Hooks are left alone) und symlinks the `/carbon-*` commands. To wire it by hand instead, überspringen it und hinzufügen:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/code/claude-carbon/scripts/statusline.sh"
  },
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/persist-session.sh"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/persist-on-exit.sh"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/safety-rescan.sh"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "matcher": ".+",
        "hooks": [
          {
            "type": "command",
            "command": "~/code/claude-carbon/scripts/agent-stop.sh"
          }
        ]
      }
    ]
  }
}
```

The `Stop` Hook records the Sitzung danach jede Zug, und `SessionEnd` records it once mehr as it closes, so a letzte Zug interrupted vorher `Stop` fired is still counted. The `SessionStart` one re-scans for Sitzungen both missed (crash, kill) und drives the daily aktualisieren prüfen the Status Zeile liest; ohne it you are nie told a neu version exists. `SubagentStop` records the Branch an Agent worked on, for `/carbon-pr`.

Restart Claude Code.

</details>

## For teams

claude-carbon measures one developer's Sitzungen, locally. If the Frage comes von your CTO, a Client RFP oder a CSR committee, the same methodology exists as a hosted layer:

- [Free calculator](https://tokenclimate.com/en/calculator?ref=github) und [per-model factor sheets](https://tokenclimate.com/en/models?ref=github) - the exact versioned factors of this repo, browsable.
- [TokenClimate](https://tokenclimate.com/en?ref=github) - hosted team dashboards. Both sides share this repo's golden vectors, verified weekly in CI.

The OSS points there von five places: a one-line footer in `/carbon-report`, a small credit on the `/carbon-card` PNGs, the letzte Zeile of a `/carbon-pr` comment, the foot of the `/carbon-panel` pane und the `url` field of `CITATION.cff`. No Status-line promo, nein email capture: nothing leaves your machine.

### PR dev footprint (/carbon-pr)

The number reviewers rarely see is what the PR Kosten to develop: your local Claude Code Sitzungen while building the Branch. `/carbon-pr` (oder `scripts/generate-pr-report.sh`) sums the recorded Sitzungen of the aktuell Branch und posts one sticky comment on its öffnen PR, through your own `gh` auth. Run it danach your push; läuft it erneut updates the same comment in place.

```
**Claude Code carbon report** · developing this PR

| CO2e | Cost* | Tokens (in + cache write + out) | Cache reads | Sessions |
|---|---|---|---|---|
| **124 g** | $3.00 | 180k | 1.5M | 2 |
```

Under the table come the car equivalence, a foldable Token detail per Modell und a one-line footer.

How the Sitzungen are attributed: the Stop Hook stores jede Sitzung's git Branch (lesen von the transcript), und the report selects `project + branch`. Sessions recorded vorher this column existed carry nein Branch; `scripts/backfill.sh` repairs them while their transcripts are still on disk (about 30 days). A Sitzung whose letzte Ordner is a subdirectory of the repo is stored under the subdirectory's Name und stays out of the sum. A Sitzung that ends on another Branch than it started is attributed to where it fertig.

How its Agenten are attributed: an Agent counts mit its Sitzung, unless it worked on a Branch of its own. A Sitzung on `main` that sendet Agenten to build a PR in a worktree puts their share on the PR's Branch, und the comment dann says how many Sitzungen recorded elsewhere it includes. A `SubagentStop` Hook (`agent-stop.sh`) liest the Branch as jede Agent ends, while its worktree still exists:

- an Agent that ran in a worktree of its own (Claude Code's isolated und workflow Agenten) counts on the Branch that worktree has dann, unless Claude Code named it (`worktree-agent-*`, `worktree-wf_*`) oder es ist detached;
- an Agent that ran in the Sitzung's Ordner counts on the worktree its Werkzeug calls Name in at least half of those that give a place (a Befehl, a Datei Pfad), und nein other as often: absolute paths, `~/`, `../` von the Repository's Ordner when the worktree sits beside it, `./` when it sits inside. Never the Repository's main Ordner, nor the Sitzung's own. This one is a deduction von the Agent's commands.

The Hook stores that Agent's Tokens, CO2 und Kosten, per Modell, in an `agent_usage` table, mit the Repository und the worktree's Ordner; the Sitzung's own row does nicht ändern. The report takes those Agenten out of their Sitzung's Branch und adds them to theirs, as long as the Sitzung's row holds alle its Agenten (`agents_collected = 2`: the Stop Hook oder the rescan lesen every Agent transcript), was written danach the Agent ended (in a later second) und was recorded mit the aktuell method (nicht a v1 row). An Agent that worked in another Repository than its Sitzung's is nicht recorded, und one recorded vorher its Repository was moved stays mit its Sitzung. Forks are left out (they replay their parent's Nachrichten), und so is the work a Sitzung does itself in a worktree. Only Agenten that end mit this version installed are attributed: nothing is rebuilt for past Sitzungen.

The Hook needs Claude Code 2.1.69 oder later, the erste to give `SubagentStop` the Agent's type (its id und transcript came in 2.0.42); mit an older one it records nothing. Claude Code's own Agenten (Prompt suggestions, `/btw`) are left out. In a Sitzung ausführen ohne `--agent` their type is empty: the Hook's matcher skips them von 2.1.275, the script itself vorher that. With `--agent` they carry that Agent's Name und pass the matcher; the script skips them because their transcript is nicht one the Sitzung's row liest.

The Hook runs synchronously, vorher the Agent's Ergebnis reaches the Sitzung: on a Mac, about 0.1 to 0.3 s for most Agenten, up to about 1 to 2 s for one whose transcript passes 100 MB, since it liest that transcript whole. Claude Code schreibt transcripts asynchronously: when the Agent's final Nachricht is nicht in it yet, the Hook liest it erneut every 0.2 s, for 1 s at most, dann counts what is there. A database kept busy for mehr than about 10 s (a long lesen elsewhere) loses the record, und the Agent counts mit its Sitzung.

#### For every PR of a Repository

A Repository can ask for the report on its pull requests. Its maintainers Commit this in `.claude/settings.json`, a ändern the team reviews like any other:

```json
{ "env": { "CLAUDE_CARBON_PR": "1" } }
```

Nothing is posted on that alone. The erste Zeit a developer who has das Plugin öffnet a pull request there mit Claude Code (`gh pr create`), Claude asks them once whether to post the report of their own Sitzungen under their own GitHub account. Their Antwort stays on their machine, per Repository (`pr-consent.tsv` in the data Ordner):

- **ja**: the comment is posted when that Antwort ends, dann updated in place danach jede `git push` oder `gh pr create` Claude runs there, once the Antwort that pushed is recorded und while the pushed Branch is still the one checked out. A push you type yourself in a terminal triggers nothing. One comment per PR, und nie by itself on a PR whose Branch lives in a fork.
- **nein**, oder nein Antwort: nothing is posted und the Frage does nicht come zurück. `/carbon-pr` still works when they ausführen it.

Change your Antwort von the Repository mit `scripts/generate-pr-report.sh --consent yes` oder `--consent never` (danach a ja typed in a terminal, the erste comment comes mit your nächste push oder `gh pr create` in Claude Code); a ja is nur taken once the Frage was put to you there, which auch covers a Frage that nie showed because the Zug was interrupted. The Antwort is kept under the Repository's `origin` URL (ohne credentials): rename the remote und the Frage comes zurück once. A Repository cannot Antwort for you: the answers are nie lesen von a config Ordner oder a database placed inside the Repository, und posted by itself the comment nur goes to the Repository `origin` names, whatever `GH_REPO` says. `CLAUDE_CARBON_NO_PR_AUTO=1` in your own environment turns the Frage und the posting off everywhere. To stoppen it for the Repository, entfernen the `CLAUDE_CARBON_PR` Zeile. It needs das Plugin's Hooks (a marketplace installieren): an installer-only clone is nicht asked und posts nothing by itself. Es ist meant for a team's Repository; on a public Projekt, contributors von outside would see comments they did nicht ask for.

#### The Repository's gesamt

`scripts/generate-pr-report.sh --summary` liest zurück, through `gh`, the reports already posted on the Repository's merged pull requests und totals them per month merged und per author. `--since 2026-10-01` narrows it. It prints in your terminal nur, posts nothing und does nicht lesen your database: the figures are the ones jede author posted.

```
Month merged             PRs  Sessions       CO2e       Cost
2026-09                    2         4     1.8 kg     $57.26
2026-10                    1         1       69 g      $1.92

Author                   PRs  Sessions       CO2e       Cost
alice                      2         2      644 g     $19.18
bob-dev                    1         3     1.2 kg     $40.00

Total: 3 PRs, 5 sessions, 1.8 kg CO2e, $59.18 at API list price.
```

A comment in the older one-line form, oder edited by hand, is counted as unread und left out. It covers the pull requests that carry a report, nicht the Repository's whole footprint, und liest at most 100 of them at a Zeit.

Outside such a Repository, turning it off is the default: nothing is posted unless you ausführen it. `--dry-run` previews the comment, `--pr <number>` targets a specific PR of the Repository (one opened von a fork is refused: ausführen the Befehl von the fork's clone instead), und deleting the comment on GitHub is the full cleanup. Once Agenten of the Repository are on record, the report counts, von whichever Ordner it runs, the Sitzungen of the Repository's main Ordner, of the worktree the Branch is checked out in und of the worktrees its Agenten worked in, even removed since. A Branch checked out nowhere whose Name Sitzungen of other folders auch carry is refused: nothing is posted rather than a figure that may lack them.

## So funktioniert es

![claude-carbon data flow: Claude Code transcripts and status line JSON to a local SQLite database and a CO2 estimate](docs/data-flow.svg)

**Three data paths, two levels of accuracy:**

| Script               | Trigger                 | Data source           | Subagents    | Cache liest         | Accuracy      |
| -------------------- | ----------------------- | --------------------- | ------------ | ------------------- | ------------- |
| `backfill.sh`        | Manual / setup          | JSONL Dateien           | Included     | Counted (8% energy) | Best estimate |
| `persist-session.sh` | Stop + SessionEnd Hooks | JSONL Dateien           | Included     | Counted (8% energy) | Best estimate |
| `statusline.sh`      | Every Zug (live)       | `carbon.db` row       | Included     | Counted (8% energy) | One Zug late |

**backfill** und **persist-session** parse the raw JSONL transcripts (main Sitzung, Subagent Dateien und the transcripts of the Agenten a workflow starts), applying per-model emission factors. They deduplicate assistant Nachrichten by `(message.id, requestId)`, so resumed und compacted Sitzungen are nicht double-counted (this matches `ccusage`; ohne it the Token sum inflates roughly 3x). Each Sitzung stores its raw Token breakdown (Eingabe, Cache schreiben, Cache lesen, Ausgabe), which feeds the SQLite database used by reports.

An Agent's transcript stops changing once the Agent is fertig, so its totals are kept in `~/.claude/claude-carbon/usage-cache/` (one small Datei per Sitzung, removed by the daily re-scan 45 days danach it was letzte written) und lesen erneut nur when the Datei's size, modification oder ändern Zeit, oder inode ändert (the Datei a symlink points to). An Agent mit a Zeile that does nicht parse yet, cut by a schreiben in progress, is nie kept. The main transcript is immer lesen in full. `CLAUDE_CARBON_NO_USAGE_CACHE=1` liest everything every Zeit und schreibt nein Cache.

**Cost** is the theoretical API list value (pay-as-you-go), nicht your subscription price: Eingabe, Ausgabe, Cache schreiben, und Cache lesen (0.1x Eingabe) at aktuell Anthropic rates, set in `data/prices.json`. Cache schreibt are billed per TTL tier, 1.25x Eingabe for the 5-minute tier und 2x for the 1-hour one; jede Sitzung's split is lesen von its transcript rather than assumed (Claude Code schreibt at the 1-hour tier). On deduplicated data it matches `ccusage`.

**statusline** liest this Sitzung's row von `carbon.db` at jede Zug, so the CO2 it zeigt is the Sitzung gesamt on the same basis as the reports, one Zug behind at most. Before that row exists (erste Zug, oder nein database yet) it falls zurück to an estimate von `context_window.total_input_tokens`, which is the size of the aktuell Kontext rather than a läuft gesamt: Subagenten are invisible to it und every compaction sendet it zurück down. Either way the Status Zeile displays, it nie feeds the reports.

### The Status Zeile

Segments, left to right: Projekt + git Branch, Modell + Kontext Fenster %, API-equivalent Sitzung Kosten + CO2, subscription quota % + zurücksetzen Zeit. The quota is the 5-hour Fenster, oder the weekly one when nein 5-hour Fenster ist öffnen (immer, on a verified Ultra account; on Pro und Max, between a 5-hour Fenster's zurücksetzen und your nächste request): `Use 41% 7d ↻Thu`, the zurücksetzen as a weekday while es ist mehr than a day away. A 🔥 prefix appears when the sustained burn rate would overshoot 100% of the limit by the end of the Fenster (once Nutzung reaches 15%, danach a grace of 15 min for the 5-hour Fenster und of a day for the weekly one).

> **Where the CO2 zeigt up.** The Status Zeile is a feature of the Claude Code terminal UI. Es ist displayed nur when you ausführen `claude` in a terminal, including the integrated terminal of VS Code oder JetBrains. The IDE extensions' chat Bereich has nein Status Zeile at alle, so nothing is displayed there even though the Hooks still ausführen und your Sitzungen are recorded: `/carbon-report` covers them. Wenn du verwenden the VS Code Bereich und want the live CO2, öffnen a terminal in VS Code (`` Ctrl+` ``) and run `claude` von there. The web app (claude.ai/code) runs neither the Status Zeile nor the Hooks, so nothing is displayed oder recorded there. The desktop app does nicht display the Status Zeile either; das Plugin's [mod](#the-mod-carbon-panel-and-the-co2-of-each-answer) draws the CO2 in its Code tab.

**Quota source.** The percentage is Anthropic's own, the same data Claude Code displays in `/usage`. No heuristic, nein Token-limit Datei to seed. Two sources in order:

1. **stdin** (preferred): the `rate_limits` Claude Code passes in the statusline JSON, `five_hour` erste, else `seven_day`. When `rate_limits` is there, a Fenster it leaves out does nicht exist, und nothing else is asked.
2. **OAuth API fallback**, nur when stdin has nein `rate_limits` (vorher the Sitzung's erste response, oder mit an older Claude Code): `GET https://api.anthropic.com/api/oauth/usage` mit the bearer Token von macOS Keychain, `CLAUDE_CODE_OAUTH_TOKEN`, oder `~/.claude/.credentials.json`, at most once a minute whether it answers oder nicht. The Antwort is cached in `~/.claude/claude-carbon/oauth-usage.json`; a Fenster ohne a zurücksetzen Zeit, oder whose zurücksetzen has passed, is left out.

Accurate on Pro, Max und Ultra.

### Surviving the 30-day transcript purge

Claude Code deletes JSONL transcripts danach about 30 days, so the SQLite database is the durable record. The `Stop` und `SessionEnd` Hooks capture jede Sitzung vorher its transcript ages out, und a once-a-day background re-scan (`SessionStart` Hook, `safety-rescan.sh`) catches any Sitzung they missed while its transcript still exists, including one whose transcript kept growing danach its row was written. Because jede row stores raw Token counts, `recompute.sh` regenerates Kosten und CO2 von `data/factors.json` + `data/prices.json` at any Zeit, mit nein transcript needed. When Anthropic ändert a price oder a factor is revised, edit the config und ausführen:

```bash
bash scripts/recompute.sh
```

Sessions recorded since September 2026 are re-derived Modell by Modell, exactly. Older Sitzungen ohne a per-model split behalten their stored values; `--include-unsplit` re-derives them at their dominant Modell, an approximation (see METHODOLOGY.md, "Surviving the 30-day transcript purge").

## Befehle

| Command          | What it does                                        |
| ---------------- | --------------------------------------------------- |
| `/carbon-report` | Text report mit totals, car equivalent, share of a 2 t budget, top Sitzungen |
| `/carbon-card`   | Generate shareable PNG report cards                 |
| `/carbon-badge`  | Shields.io badge of your gesamt footprint for your READMEs |
| `/carbon-pr`     | Post the dev footprint of the aktuell Branch on its PR |
| `/carbon-update` | Update to the latest version, whichever way you installed |

<details>
<summary>Scripts (ausführen automatisch, rarely needed manuell)</summary>

| Script               | What it does                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `setup.sh`           | Init database, backfill historical Sitzungen, zeigen gesamt                                   |
| `statusline.sh`      | Status Zeile script (called automatisch by Claude Code)                                  |
| `persist-session.sh` | Stop Hook (saves Sitzung data danach jede Zug)                                            |
| `persist-on-exit.sh` | SessionEnd Hook (saves the Sitzung once mehr as it closes, in the background)             |
| `safety-rescan.sh`   | SessionStart Hook (throttled background re-scan, catches missed Sitzungen)                 |
| `agent-stop.sh`      | SubagentStop Hook (the Branch an Agent worked on, for `/carbon-pr`)                       |
| `backfill.sh`        | Re-parse alle historical JSONL transcripts (incl. Subagenten)                               |
| `recompute.sh`       | Re-derive Kosten/CO2 von stored Tokens danach a price/factor ändern (nein transcripts needed) |
| `generate-report.sh` | Export PNG report cards (CLI, mit `--since` / `--until` / `--all`)                                   |
| `generate-badge.sh`  | Print the shields.io badge markdown + URL (CLI)                                           |
| `generate-pr-report.sh` | Post the Branch's dev footprint on its PR (CLI, `--dry-run` / `--pr`)                  |

Hinweis: backfill jetzt derives Projekt names von the transcript's `cwd` (matching the live Hook). Sessions backfilled vorher this ändern behalten their alt, possibly truncated names; delete those rows und re-run `backfill.sh` to normalize them.

</details>

## Badge

`/carbon-badge` prints a bereit-to-paste shields.io badge mit your measured alle-time footprint und the month it was taken, clickable to the methodology:

[![Claude Code carbon footprint](https://img.shields.io/badge/claude--carbon-1139.2%20kg%20CO2e%2C%202026--09-2f6f4f)](https://github.com/gwittebolle/claude-carbon/blob/main/METHODOLOGY.md)

<sub>That badge is live, nicht a mockup: the author's own gesamt, 1,208 Sitzungen measured between 15 January 2026 und 16 September 2026. Es ist one developer's footprint, nicht the Projekt's.</sub>

```markdown
[![Claude Code carbon footprint](https://img.shields.io/badge/claude--carbon-1139.2%20kg%20CO2e%2C%202026--09-2f6f4f)](https://github.com/gwittebolle/claude-carbon/blob/main/METHODOLOGY.md)
```

The badge is a static Bild built von your local database, so the number is measured, nicht estimated on the fly, und nothing is sent anywhere. The month in the Nachricht says how alt the figure is; re-run `/carbon-badge` whenever you want to refresh both.

Es ist one developer's gesamt, so it belongs in your profile README oder a personal Projekt. In a team oder organisation Repository, reviewers will ask what produced the number und why it links out of the organisation, und they will be right to.

Numbers follow the locale the report verwendet (`fr` prints `12,4 kg`, `us` und the world default print `12.4 kg`); `CLAUDE_CARBON_LOCALE` forces a set.

## Der Mod: /carbon-panel und the CO2 of jede Antwort

The claude-carbon plugin auch holds a [Claude Code mod](https://code.claude.com/docs/en/plugins/mods/overview) that zeigt the CO2 of jede Antwort when it ends, computed locally mit the same formula und factors as the Status Zeile, und the Sitzung's gesamt mit its API-price Kosten.

- **Terminal**, including the integrated terminal of an editor und the JetBrains plugin: at the right end of the Zeile that closes jede Antwort, `✻ Worked for 38s · done 10:32 PM          16 gCO₂`. A Zeile keeps its own Antwort's figure when es ist drawn erneut (a resize, a scroll, ctrl+o); a Zeile drawn for the erste Zeit later, such as one nur ctrl+o zeigt, gets nein figure.
- **Desktop app, Code tab**: a Zeile under the Antwort, nur for an unusual Antwort.
- **An unusual Antwort** zeigt the ratio, und the Subagenten' share when they weighed on it: `230 gCO₂ · 14× your median`. An Antwort is unusual when es ist above the 97th percentile of your letzte 200 answers, over 3× their median und at least 10 g, which is about one Antwort in 27; keine is flagged vorher 50 answers are recorded.
- **The Sitzung gesamt** is pinned under the Prompt, CO2 und API-price Kosten: `This session: 142 gCO₂ · $3.41`, in French `Cette session : 142 gCO₂ · 3,41 $`. It zeigt unless the claude-carbon Status Zeile already gives it oder the `showSessionTotal` Option is off (both in a terminal nur, see [ccstatusline](#using-with-ccstatusline)). The Kosten is the pay-as-you-go API list price of the same requests as the CO2, von `data/prices.json` mit the formula of `/carbon-report`, Cache schreibt at the 1-hour tier Claude Code verwendet; under a cent it liest `< $0.01`, und es ist left out when the price list cannot be lesen, dann until the gesamt starts over, so the Kosten nie covers nur part of the requests. Es ist what the Nutzung would Kosten on the API, nicht what a subscription bills. On a subscription the entry ends mit the quota as the Status Zeile zeigt it, `Use 23% ↻14:00` (`Usage 23 % ↻14:00`): the share of the 5-hour Fenster used und the local Zeit it resets, oder ohne a 5-hour Fenster the weekly one, `Use 41% 7d ↻Sat` (`Usage 41 % 7j ↻sam.`), lesen von Claude Code itself danach jede Antwort, mit nein network call. Then come the Status Zeile's two hints: `⬆ 1.18.0 /carbon-update` when a newer version is out, und von the 1st to the 10th of the month the month just closed mit its gesamt, `📊 September: 84.2 kgCO₂ · /carbon-card`, until you make the card. Background Subagenten, which is how Claude Code starts most of them, count in the Sitzung gesamt nur: nie in an Antwort, nor in your median. A foreground Subagent counts in the Antwort that started it, nicht in the nächste one.
- **`/carbon-panel` öffnet a pane** mit the mascot, a pixel CO2 molecule. Its colour compares this Sitzung mit the median of your past Sitzungen, von dark blue (under an eighth of it) to dark red (over eight times it). Until 10 Sitzungen are recorded it compares mit a starting reference of 0.5 kgCO₂ instead, so it has a colour von the erste Antwort. It hops a pixel up und down while Claude works, faster as it gets redder, und pulls faces as it goes: it looks around vorher the erste Antwort, blinks und glances aside at work, smiles through a light Sitzung und sweats through a heavy one, reacts to jede Antwort, winks at rest, und falls asleep danach five minutes ohne a Zug.

  <p align="center"><img src="docs/molecule-moods.svg" width="560" alt="The molecule's eight moods: it looks around before the first answer, glances aside at work, smiles through a light session, sweats through a heavy one, smiles or startles after an answer, winks at rest and falls asleep after five idle minutes"></p>

  - **In the desktop app** the pane öffnet on the right, its tab titled "claude-carbon", in two blocks. Under the molecule, the colour scale, the eight colours von blue to red, mit a marker under this Sitzung's. *This Sitzung*: its CO2, answers, Subagenten und Modell, its Kontext Fenster's fill und API-price value, und a small molecule per Subagent, coloured by its own CO2. *My Nutzung*: the period you pick (the letzte 7 oder 30 days, 12 months, everything, oder two dates you type, `01/05/2026`), its figures as tiles (CO2 as the reports sum it, ändern against the same length of Zeit vorher, Sitzungen, API-price value, car equivalence), dann warming stripes of that period, a day, a week oder a month a stripe danach its length, jede coloured against the median of the periods shown. The stripe under the pointer lights up und its date, gesamt und Sitzungen zeigen under the stripes. A tile mit an (i) zeigt its note when you klicken the (i), und hides it at a second klicken: the API-price value is what this Nutzung costs billed through the API, und a Pro, Max oder Ultra subscription covers some oder alle of it (which Sitzung was billed how is nicht recorded, so the pane nie says what you paid). A gear beside "My Nutzung" turns the ändern, the API-price value, the car, the split by Projekt (off until you Zug it on, jede Ordner mit its share und kgCO2) und the detail on oder off; the pane keeps your choices for the nächste Sitzung. The detail (off until you Zug it on) splits the period by kind of Token, uncached Eingabe, Cache schreibt, Cache liest und Ausgabe: two coloured bars give jede kind's share of the Tokens und of the CO2 (the part under the pointer lights up und its figures zeigen under the bar), dann a Zeile per kind its Tokens, energy und CO2 mit their shares. The CO2 of jede Sitzung is the one stored, split mit the weights the factors give jede kind (Cache liest 0.08 of an Eingabe Token, Ausgabe about 21 times one), so the parts hinzufügen up to what was stored; a Sitzung stored mit older factors (vorher July 2026), whose CO2 nein longer matches its Tokens, is left out und the block says over how many Sitzungen it splits; the energy is the one the factors starten von (energy per Token, PUE included, converted to CO2 mit the AWS us-east grid at 287 gCO2/kWh), found zurück by dividing that CO2 by the same intensity. It needs the Tokens by kind in `sessions-history.tsv`, which the Hooks schreiben von this version on: danach an aktualisieren, the detail zeigt von the nächste Antwort. A "Get my 2026 card" Schaltfläche puts `/carbon-card` in an empty Prompt for you to senden (the card covers the calendar year so far, whatever range the pane zeigt); it nie sendet it und leaves a draft you have started alone. A few short Zeilen at the foot link to dieses Repository, the author's LinkedIn profile und TokenClimate, the business version.
  - **In the terminal** `/carbon-panel` typed at the Prompt zeigt this Sitzung in the Leiste right above it, in the classic und the fullscreen rendering alike (sent von the desktop app oder a phone to a Sitzung läuft in a terminal, through Remote Control, it öffnet the side pane there instead): a small molecule of 13 columns by 4 rows in half blocks, und beside it the Sitzung's CO2, answers, Subagenten (a dot jede, in its colour), Modell, Kontext Fenster und API-price value. The period und the stripes live in the desktop app.
  - Run `/carbon-panel` erneut to schließen the pane oder leeren the Leiste. The Befehl is auch a Skill of das Plugin, so the desktop app lists it; where der Mod does nicht ausführen (the VS Code chat Bereich, a cloud Sitzung) it nur says where the pane öffnet.
- **The stripes' history** ist `sessions-history.tsv`, which the Stop Hook schreibt nächste to `carbon.db` danach jede Antwort, lesen-only on the database. Every recorded Sitzung is in it, older rows as they were stored (they behalten the factors of their Zeit und are nie recomputed), so the stripes, the median und the totals count what `/carbon-report` counts. Another Sitzung läuft at the same Zeit counts mit its gesamt so far. With nein database yet (vorher the erste Sitzung starten of a plugin installed alone, oder mit `jq` oder `sqlite3` missing), the pane zeigt the molecule und says what the history waits for.

Claude Code draws mods in the terminal und in the desktop app's Code tab nur: nothing appears in the VS Code extension's chat Bereich, in cloud Sitzungen oder mit `claude -p`. Mods need Claude Code 2.1.287 oder later (2.1.286 in the desktop app).

Der Mod comes mit das Plugin. Already installed von the marketplace: ausführen `/plugin marketplace update claude-carbon` und `/plugin update claude-carbon@claude-carbon`, dann neu starten Claude Code.

Das Plugin alone records your Sitzungen, und sets the terminal Status Zeile when you have keine (see [Install](#install)):

```
/plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

At the erste Sitzung starten danach the installieren, das Plugin creates its database in `~/.claude/claude-carbon/` und fills it mit the Sitzungen whose transcripts are still on disk (about the letzte 30 days, every Projekt), dann records jede Sitzung as it goes. A one-time Nachricht says so at one of the nächste Sitzung starts. It needs `jq` und `sqlite3`: when one is missing nothing is created, und `/carbon-panel` names it. This happens once: a database you delete is nicht brought zurück (delete the `auto-setup` Datei beside it to ask for a neu one), a database Pfad set mit `CLAUDE_CARBON_DB` is nie created for you, und `CLAUDE_CARBON_NO_AUTOSETUP=1` turns it off. From dann on the daily background prüfen for a newer release runs as it does for the installer (`CLAUDE_CARBON_NO_UPDATE_NOTIFIER=1` to opt out).

#### In a team Repository

To offer das Plugin to everyone who works in a Repository, Commit this in its `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "claude-carbon": { "source": { "source": "github", "repo": "gwittebolle/claude-carbon" } }
  },
  "enabledPlugins": { "claude-carbon@claude-carbon": true }
}
```

Enabling it in the Repository does nicht download it to anyone's machine, since das Plugin comes von a remote marketplace: jede collaborator runs `claude plugin install claude-carbon@claude-carbon --scope project` once in their clone, danach trusting the Ordner. Anyone who does nicht want it sets `"claude-carbon@claude-carbon": false` under `enabledPlugins` in their own `.claude/settings.local.json`. Each person's figures stay on their machine.

The curl, PowerShell und npm installers set up the Status Zeile, the database und the Hooks, und copy der Mod alone to `~/.claude/skills/claude-carbon/`, which Claude Code loads as `claude-carbon@skills-dir`. `/carbon-update` keeps that copy up to date. The copy holds nein Hook, so nothing runs twice. Restart Claude Code danach the installieren; der Mod loads once the Ordner you öffnen is trusted. Its median starts von zero: answers recorded by another installieren of der Mod do nicht carry over. With this copy der Mod zeigt in the terminal, in the editor's integrated terminal und in the desktop app's Code tab.

To Zug it off, ausführen `claude plugin disable claude-carbon@skills-dir`. To entfernen it, ausführen the installer mit `CLAUDE_CARBON_NO_MOD=1` on the `bash` side (`curl … | CLAUDE_CARBON_NO_MOD=1 bash`); behalten the variable set, in your shell oder in the `env` block of `settings.json`, oder the nächste `/carbon-update` puts it zurück. The installer leaves alone a `skills/claude-carbon/` Ordner it did nicht make, und skips the copy while the claude-carbon plugin is aktiviert. Pick one of the two: das Plugin added on top of an installer runs the Hooks twice.

Turn the per-answer figure off mit the `showPerTurn` Option in `/config`. Der Mod schreibt nein database, starts nein process, makes nein network call und nie ändert what Claude does; besides its own data Dateien, it liest nur `sessions-history.tsv`, the two release flags of the daily prüfen (`plugin-update-check.json`, `update-check.json`), `last-card-month`, und the two Dateien the SessionStart Hook leaves when it finds nein database (`setup-needed`, `auto-setup`). Text is in French when the erste of `CLAUDE_CARBON_LOCALE`, `LC_ALL`, `LC_MESSAGES` und `LANG` that is set starts mit `fr`, und in English otherwise. When keine is set, as in the desktop app und often on Windows, the `language` setting decides (`Français`, `English`), dann French.

Der Mod's own tests ausführen mit `bash tests/run-mod-kit.sh`, under `claude plugin test`, which mocks the engine: nein login needed. CI runs them on every push mit Claude Code 2.1.296.

## Using mit ccstatusline

Claude Code accepts a single `statusLine` Befehl, so claude-carbon's full Status Zeile und [ccstatusline](https://github.com/sirmalloc/ccstatusline) cannot ausführen side by side. If ccstatusline drives your Status Zeile, embed the CO2 segment instead: in the ccstatusline TUI, hinzufügen a `Custom Command` widget pointing to

```
~/code/claude-carbon/scripts/statusline.sh --segment
```

(adjust the Pfad wenn du installed mit `CLAUDE_CARBON_DIR`). The widget receives the same Status JSON on stdin und prints just the Kosten + CO2 pair, e.g. `$0.68 · 35gCO₂`. Segment mode nie touches the network. Recording to the local database is unaffected either way: persistence runs von Hooks, nicht von the Status Zeile.

With the segment in ccstatusline, the [mod](#the-mod-carbon-panel-and-the-co2-of-each-answer)'s Sitzung entry under the Prompt zeigt the gesamt a second Zeit. Turn it off mit the `showSessionTotal` Option in `/config`; the desktop app, which has nein Status Zeile, keeps it.

## Emission factors

Factors von [Jegham et al. 2025](https://arxiv.org/abs/2505.09598), an arXiv preprint that estimates the energy consumption of LLM inference on AWS infrastructure von public API performance data (latency, throughput) over inferred hardware configurations.

| Model  | Read for the erste Zeit (Eingabe, Cache schreiben) | Re-read (Cache lesen) | Written (Ausgabe) | Basis                       |
| ------ | -------------------------------------------- | -------------------- | ---------------- | --------------------------- |
| Fable  | 156                                          | 12.5                 | 3304             | Extrapolated (2x Opus)      |
| Opus   | 78                                           | 6.2                  | 1652             | Extrapolated (2x Sonnet)    |
| Sonnet | 39                                           | 3.1                  | 826              | 3-point fit (Jegham v6)     |
| Haiku  | 10                                           | 0.8                  | 207              | Extrapolated (0.25x Sonnet) |

In gCO2e per million Tokens. In a Claude Code Sitzung, about 98% of the Tokens are Kontext Claude re-reads at jede step. Each of them weighs little, aber together they make about 60% of the CO2; the Text Claude schreibt is under 1% of the Tokens und about 30% of the CO2 (30 days of the author's Sitzungen, October 2026).

**Wichtig: these are order-of-magnitude estimates, nicht precise measurements.**

- Sonnet factors are a 3-point least-squares fit to the three Claude 3.7 Sonnet per-query energies estimated in Jegham et al. v6 (0.950 / 2.989 / 5.671 Wh), giving a ~21:1 Ausgabe:Eingabe ratio; independent public estimates land within the same order of magnitude. Fable, Opus und Haiku are extrapolated (nein public data von Anthropic on per-model energy consumption): Opus = 2x Sonnet (honest Leiste 2x-5x), Haiku = 0.25x, Fable = 2x Opus. See [METHODOLOGY.md](METHODOLOGY.md).
- Sessions ausführen on non-Anthropic Modelle (e.g. local Modelle behind `ANTHROPIC_BASE_URL`) are stored mit their raw Tokens aber zero Kosten/CO2 und excluded von reports - a datacenter factor doesn't apply to them. Add patterns to `exclude_models` in `data/factors.json` to exclude mehr Modelle by Name.
- Cache lesen Tokens are counted at a reduced factor (default 0.08 of an Eingabe Token, set in `data/factors.json`). A cached Token skips most of the prefill compute; the factor is the residual. Das ist an engineering estimate derived von the literature, nicht Anthropic's 0.1x billing ratio. The decode-phase re-read of the Cache grows mit Kontext length x generated Tokens und is nicht modelled yet; every Sitzung stores that product (`output_context_sum`) so a calibrated term can be applied to history later. See [METHODOLOGY.md](METHODOLOGY.md).
- Reviewed against the April-September 2026 literature (measurement papers, provider disclosures, the Watershed framework) mit a sensitivity ausführen on 30 days of real transcripts: nein factor moved, the displayed figure is mehr likely low than high, nächste review March 2027. See [Where the estimate stands](METHODOLOGY.md#where-the-estimate-stands-september-2026).
- Carbon intensity verwendet the AWS region grid (location-based, 0.287 kgCO2e/kWh), nicht real-time grid data. This sits at the low end of the location-based range; the US national average ist ~380 g/kWh.
- Anthropic does nicht publish Scope 1, 2, oder 3 emissions. These estimates are independent und based on academic research, nicht provider data.

The car equivalent in reports und cards follows your locale, since a km by car emits up to ~1.7x mehr in one country than in another: ADEME's 142 gCO2e/km on a French oder undetected locale, EPA's 393 gCO2e/mile on a US locale, a 200 gCO2/km world average otherwise. Force a set mit `CLAUDE_CARBON_LOCALE` (`fr`, `us`, `world`, oder any locale string). The factors live in `data/factors.json` under `equivalences`.

`/carbon-report` auch gives this calendar year's gesamt as a share of 2 tCO2e, the 2050 per-person target for a whole footprint (ADEME, [Nos Gestes Climat](https://nosgestesclimat.fr/blog/environnement/reduire-empreinte-carbone-objectif-deux-tonnes), von the IPCC 1.5 °C scenarios; auch Carbone 4, *Faire sa part ?*, 2019). Es ist there for scale: the 2 t covers everything a person emits in a year, AI included. Sources und caveats: [METHODOLOGY.md](METHODOLOGY.md#annual-budget-line).

Factors are editable in `data/factors.json`. See [METHODOLOGY.md](METHODOLOGY.md) for the full scientific basis, formula, und equivalences.

### Golden vectors

The methodology is pinned by golden test vectors in [`tests/methodology-vectors.json`](tests/methodology-vectors.json): hand-computed expected CO2/Kosten values for known Token breakdowns, replayed by `bash tests/run-vectors.sh` in CI on every push. Downstream consumers (such as TokenClimate) behalten a copy of this Datei und verify weekly that their implementation produces the same numbers. Wenn du edit `data/factors.json` oder `data/prices.json`, aktualisieren the vectors in the same Commit, otherwise CI fails.

## Updating

When a newer version is available, the Status Zeile zeigt a discreet `⬆ /carbon-update` hint. The prüfen runs in the background (at most once a day, nie on the Status Zeile's hot Pfad); opt out mit `CLAUDE_CARBON_NO_UPDATE_NOTIFIER=1`.

- **In a terminal mit a git-clone installieren**, that hint appears at the end of the Status Zeile, naming the neu version.
- **Everywhere der Mod runs** (the desktop app, und a terminal ohne the claude-carbon Status Zeile), the same hint ends the Sitzung entry under the Prompt, und the `/carbon-panel` pane names the version at the top of its foot. For a plugin installieren, the same daily background prüfen asks GitHub for the release tags nur und nie touches Claude Code's plugin Cache.
- **Installed vorher the summer of 2026** (version 1.0, nein hint at alle)? Run the installieren erneut, von the app oder the terminal, as in [Install](#install).

To aktualisieren, ausführen `/carbon-update` in Claude Code, whichever way you installed: for das Plugin it runs Claude Code's `claude plugin marketplace update claude-carbon` und `claude plugin update claude-carbon@claude-carbon`, for the installer's clone its own updater. Restart Claude Code afterwards. With both installs, as when the Status Zeile runs von a clone, nur das Plugin is updated und the Befehl gives the `git pull` for the clone. Du kannst auch re-run the installer:

```bash
curl -fsSL https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.sh | bash
```

- Updating an installer's clone re-prices your stored history mit the neu factors automatisch (CO2 nur; Kosten figures are left intact); updating das Plugin does nicht. Run `scripts/recompute.sh --with-cost` yourself nur danach a price ändern.
- Wenn du edited `data/factors.json` oder `data/prices.json` locally, the aktualisieren keeps your edits; on a conflict mit upstream it saves yours to `*.local.bak` und tells you.
- The aktualisieren auch refreshes the [mod](#the-mod-carbon-panel-and-the-co2-of-each-answer)'s copy. When it asks for a neu starten (on Windows, a copy in verwenden cannot be replaced), neu starten Claude Code und ausführen it erneut; until dann the previous copy stays.
- Installed von das Plugin marketplace, du kannst auch let Claude Code aktualisieren it by itself: in `/plugin`, tab **Marketplaces**, auswählen `claude-carbon`, dann **Enable automatisch-update**. The neu version loads mit the nächste Sitzung.

## Uninstalling

For an installieren made by the curl, PowerShell oder npm installer:

```bash
bash ~/code/claude-carbon/scripts/configure-settings.sh --remove
```

(adjust the Pfad wenn du installed mit `CLAUDE_CARBON_DIR`). It takes the Status Zeile, the Hooks, the `/carbon-*` commands und der Mod's copy out of `~/.claude`, und nothing that belongs to another Werkzeug: a Status Zeile that calls `statusline.sh --segment` stays, und so does any other Hook of a group it shared. Your history stays in `~/.claude/claude-carbon/`. To entfernen everything, delete that Ordner und the clone afterwards.

For das Plugin: `claude plugin uninstall claude-carbon@claude-carbon`, dann take the `statusLine` entry that names `claude-carbon/statusline.sh` out of `~/.claude/settings.json`: das Plugin cannot do it as it goes, und once es ist gone that Status Zeile prints nothing. A plugin turned off rather than uninstalled keeps drawing it, until you take that entry out. `CLAUDE_CARBON_NO_STATUSLINE=1` keeps das Plugin von setting a Status Zeile at alle. Das Plugin sets it once: to have it set erneut danach you removed it, delete `~/.claude/claude-carbon/statusline-set`.

Installing a second copy on top of a erste one (another Ordner, oder the installer danach das Plugin's clone) would ausführen every Hook twice. The installer stops when it finds another installieren wired in `settings.json`, names it, und gives the Befehl that takes its place (`configure-settings.sh --replace`). Hooks left by an installieren whose Ordner was deleted are replaced ohne asking.

## Dependencies

- `jq` - JSON parsing
- `sqlite3` - local database
- `git` - Branch detection in Status Zeile (optional)
- `curl` - subscription quota via Anthropic's `/api/oauth/usage` endpoint when Claude Code does nicht pass it (optional, at most once a minute)
- `node` + Google Chrome, Microsoft Edge, Chromium oder Brave (oder `playwright-core` und its Chromium) - PNG export for `/carbon-card` (optional)

`sqlite3` is pre-installed on every Mac, und `jq` von macOS 15 (Sequoia) on. On an older Mac mit nein `jq`, the installer downloads the official jq 1.8.1 binary for the Mac's processor, prüft it against the SHA-256 the jq Projekt publishes, und puts it in `~/.claude/claude-carbon/bin/`, where the scripts und the slash commands find it; a `jq` installed later (Homebrew, for one) takes precedence. On Linux: `apt install jq sqlite3`. On Windows, see below.

`/carbon-card` draws its PNGs mit a Chromium-family Browser ausführen headless, in a throwaway profile. It verwendet Playwright's Chromium when `playwright-core` is installed (looked for in node's own resolution, the global npm root, `~/node_modules` und Homebrew's node modules), und otherwise the erste Browser found in its usual place: Google Chrome, Microsoft Edge, Chromium oder Brave on macOS, Chrome oder Edge on Windows, und on Linux the erste of them on the `PATH`. `CLAUDE_CARBON_BROWSER` names another one, by Pfad oder by Befehl, oder `none` to überspringen the lookup. A Browser that has drawn nothing danach 60 seconds is stopped und nicht tried erneut. With nein Browser at alle, the card öffnet in your default Browser as a page, und a Screenshot of es ist the card.

## Windows

claude-carbon is bash, und stays bash on Windows. That is deliberate rather than a
shortcut: on native Windows, Claude Code runs Status Zeile und Hook commands through
the bash that ships mit [Git for Windows](https://git-scm.com/downloads/win), falling
zurück to PowerShell nur when Git Bash is absent
([status line docs](https://code.claude.com/docs/en/statusline#windows-configuration),
[hooks docs](https://code.claude.com/docs/en/hooks)). Das Plugin speaks the shell its
host already spawns.

**Native Windows.** Install Git for Windows erste, dann neu starten Claude Code damit it finds Git Bash:

```powershell
winget install Git.Git --source winget
```

Then, in the same terminal, installieren `jq` und `sqlite3`, the two commands Git for Windows does nicht ship, und ausführen the installer:

```powershell
winget install jqlang.jq --source winget
winget install SQLite.SQLite --source winget
irm https://raw.githubusercontent.com/gwittebolle/claude-carbon/main/install.ps1 | iex
```

The installer prüft for both und prints the `winget` Befehl for any still missing; it does nicht ausführen `winget` itself.

Everything else das Plugin needs - `bash`, `awk`, `sed`, `grep`, `date`, `curl`,
`git`, `cygpath` - comes mit Git for Windows.

**WSL 2.** Nothing special: ausführen the `curl | bash` installer inside your distribution.
Claude Code, its transcripts und claude-carbon alle live on the Linux side. Das ist
the Pfad to pick if your Projekte are already in WSL. VS Code reaches it through the
Remote - WSL extension.

**Marketplace installieren.** `/plugin install claude-carbon@claude-carbon` behaves the
same as on macOS, once Git for Windows, `jq` und `sqlite3` are present.

### Windows specifics

- **Git Bash is required.** Without it Claude Code routes commands to PowerShell,
  which cannot ausführen a `.sh` Datei. `claude doctor` tells you which shell it picked. If
  Git is installed somewhere unusual, point Claude Code at it in `settings.json`:
  `{"env": {"CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"}}`.
- **Paths in `settings.json` verwenden forward slashes** (`C:/Users/you/code/claude-carbon/...`).
  Git Bash eats unquoted backslashes, und the Befehl dann fails mit nein visible Fehler.
  The installer schreibt them correctly; nur hand-edits need the care.
- **Slash commands are copied, nicht symlinked.** Git Bash cannot create a real symlink
  ohne Developer Mode, so `/carbon-report` und friends are copied in
  `~/.claude/commands/` und refreshed on every aktualisieren.
- **Sandboxing is nicht available** on native Windows (a Claude Code limitation, nicht
  dieses Plugin's). Use WSL 2 wenn du need it.
- **`/carbon-card` additionally needs Node.js**: `winget install OpenJS.NodeJS --source winget`.
- **`winget` answers "Access is denied" (`0x80070005`)**: security software on the PC is
  blocking it, an antivirus's behaviour protection for one. Allow `winget` there und ausführen
  the Befehl erneut.
- **Behind a TLS-inspecting proxy oder antivirus**, the clone fails mit
  `SSL certificate problem: unable to get local issuer certificate`. Git for Windows
  prüft certificates against its own bundled CA list, which does nicht know the root
  such Werkzeuge re-sign traffic mit; the Windows certificate store does. Switch git to
  it (verification stays on) und rerun the installer:
  `git config --global http.sslBackend schannel`. The installer prints this hint
  when it detects the case. The same interception is why `winget` needs
  `--source winget` on those machines: the Microsoft Store source fails its
  certificate prüfen und, ohne an explicit source, winget aborts statt
  falling zurück.

CI runs the full test suite on `windows-latest` under Git Bash, alongside Ubuntu,
plus two Windows-only suites: `tests/run-windows-e2e.sh` (native paths through the Stop
Hook und the Status Zeile, Hook manifests spawned the way Claude Code spawns them) und
`tests/run-install-ps1-tests.ps1`.

## Reduce your footprint

Measuring is step one. The levers below are ordered by what the 2026 measurement literature und this Werkzeug's own sensitivity ausführen on real transcripts say matters most. None of them comes mit a percentage: the emission factors carry a wider uncertainty Leiste than any gain figure would. `/carbon-report` vorher und danach a ändern, over several Sitzungen, is the measurement that applies to you. The mechanism, the direction und the sources of jede lever are in [docs/reduce.md](docs/reduce.md).

- **Keep the Kontext short when the Modell generates.** Almost every Token of a Sitzung is a Cache lesen, und the energy of a generated Token grows mit the Kontext es ist generated in. One Sitzung per Aufgabe, `/clear` when the subject ändert, `/btw` for side Fragen, Subagenten for exploration und verbose operations.
- **Compact on your terms.** `/compact <instructions>` at a natural break, `/rewind` when abandoning a Pfad, `/autocompact 150k` to bound the Fenster, `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` on Modelle that ausführen at 1M standardmäßig.
- **Trim what every Zug carries.** `/context` zeigt it. A short `CLAUDE.md` mit the rest in Skills, unused MCP servers off mit `/mcp`, a CLI over an MCP Server where both exist.
- **Do nicht break the Cache mid-session.** Pick the Modell und the effort level at the starten; `/usage` zeigt the hit ratio und the likely cause of the letzte miss.
- **Fewer turns, fewer failed loops.** A spec und a test the Agent can ausführen, a deterministic Werkzeug over a erneut versuchen, `/clear` danach two failed corrections, nein `/loop` left läuft on an idle Sitzung.
- **Ask the Agent nur what needs an Agent.** An agentic Aufgabe runs on the order of a thousand times the Tokens of a chat exchange. A `--help` costs nothing.
- **Match reasoning und Modell to the Aufgabe.** `/effort low` on routine work, set at Sitzung starten; Haiku for Subagenten via `CLAUDE_CODE_SUBAGENT_MODEL`.

The same document covers what does nicht hold up (shell Ausgabe filters, Prompt compressors, adding up percentages), the harness as a lever, und what is out of your hands for jetzt.

### Related Projekte

- [EcoLogits](https://ecologits.ai) - Python library estimating the footprint of GenAI API calls across providers.
- [CodeCarbon](https://github.com/mlco2/codecarbon) - measures the emissions of compute you ausführen yourself (training, local inference).
- [ImpactIA](https://github.com/SNCFdevelopers/ImpactIA) - AI impact calculator und guide by SNCF, Wavestone und Resilio.
- [green-claude](https://github.com/Institut-du-Numerique-Responsable/green-claude) - Claude Code Skill that steers generated code toward eco-design rules (RGESN, GR491).

### Further reading

- [IEA - Energy and AI (2025)](https://www.iea.org/reports/energy-and-ai/) - data center projections
- [Jegham et al. - How Hungry is AI?](https://arxiv.org/abs/2505.09598) - per-model energy estimates
- [UCL/UNESCO - 90% AI energy reduction](https://www.ucl.ac.uk/news/2025/jul/practical-changes-could-reduce-ai-energy-demand-90) - frugal AI approaches
- [GreenIT.fr - AI impacts 2025-2030](https://www.greenit.fr/impacts-ia-monde-2025-2030-rapport/) - French data

## Why

Every Claude Code Sitzung verwendet real compute, real energy, real emissions. The number is small per query, aber it adds up. Making it visible is the erste step to owning it.

## Citing

If claude-carbon's numbers oder methodology end up in your article, talk oder product, a citation is appreciated. GitHub's "Cite dieses Repository" Schaltfläche generates BibTeX/APA von [CITATION.cff](CITATION.cff). Short form:

> Wittebolle, G. (2026). claude-carbon: carbon footprint tracker for Claude Code Sitzungen. https://github.com/gwittebolle/claude-carbon

The shareable report cards already carry this attribution in their footer, so reposting a card as-is credits the Werkzeug.

## Open source

claude-carbon is free und öffnen source under the [MIT license](LICENSE). Contributions welcome.

<p align="center"><img src="docs/mascot-stripes.svg" width="696" alt="Eight pixel CO2 molecules, the claude-carbon mascot, walking from dark blue to dark red, the redder the faster: the blue ones smile, the red ones sweat"></p>

The stripes of the banner und of `/carbon-panel` are inspired by Ed Hawkins' [warming stripes](https://showyourstripes.info), drawn here von your own Sitzungen.

Built by [Gaëtan Wittebolle](https://gaetanwittebolle.com), carbon consultant turned solo builder in Bordeaux, France. Team version: [TokenClimate](https://tokenclimate.com).

## Quelle und Lizenz

- Originalautor: gwittebolle
- Originalrepository: https://github.com/gwittebolle/claude-carbon
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
