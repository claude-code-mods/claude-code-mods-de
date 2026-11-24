# Inbox

I have ADHD. Working mit an Agent in a chat thread format is very cognitively taxing. The number of things you're having to hold in your head begins to compound the longer the Sitzung goes on. The Fragen, bugs, ideas, und Aufgaben alle begin to pile up und intermix making it difficult to behalten everything in Zeile.

Inbox provides immediately apparent relief here by giving your Agent an organized, stable place to surface everything that needs a decision. Inbox auch makes sure your Agent immer provides a proactive, anticipatory set of quick actions on jede item, including a recommended action.

Even better, Inbox provides your Agent a place to surface latent Issues und opportunities, ones that it might otherwise gloss over in the interest of exclusively addressing the Aufgabe at hand.

Inbox is available for Claude Code in the terminal und desktop app, Codex in the ChatGPT desktop app, und omp in the terminal. In the Herdr app, it can auch öffnen in a pane beside the terminal. Each variant is uniquely crafted for jede platform, aber works in same fundamental way in alle of them.

## So funktioniert es
https://github.com/user-attachments/assets/a493119c-4d8b-46e0-a18a-bd0ecf041b6b


## Install

Wenn du're like me, just paste a link to this Github repo to your Agent und ask it to installieren.

Wenn du want to do things the alt way, proceed...

### Claude Code

In a Claude Code Sitzung in the terminal, type:

```
/plugin install inbox --marketplace petekp/inbox
```

Answer `y` to hinzufügen the marketplace, dann wählen a scope. It starts working in
that Sitzung. A user-scope installieren auch covers Code Sitzungen in the Claude
desktop app on this machine.

To installieren von the Claude desktop app instead, öffnen a Code Sitzung:

1. Click **+** beside the Prompt, dann **Plugins**, dann **Manage plugins**.
2. On the Plugins page, klicken **Add** at the top right, dann **Add
   marketplace**, dann **Add von a Repository**.
3. Type `petekp/inbox`, pick **inbox / petekp** von the list, und klicken
   **Sync**.
4. On Inbox, klicken **Add to this computer**.
5. Go zurück to your Sitzung und type `/inbox` to öffnen the pane.

This installs it for your user account, so it works in the terminal too.
`/plugin` does nicht ausführen in the desktop app, und the inbox does nicht reach the
app's cloud Sitzungen.

If your organization manages Claude Code, an inbox you installieren yourself
works mit two differences. After `/clear` oder a resume, it loads that
Gespräch's list at your erste Nachricht. A permission Prompt reaches the
inbox about a second und a half danach it appears. To get everything, ask
an admin to list the inbox in your organization's managed settings.

To aktualisieren, ausführen these, dann `/reload-plugins` in any Sitzung that's already
öffnen:

```sh
claude plugin marketplace update inbox
claude plugin update inbox
```

- It makes two Sonnet calls danach jede of Claude's replies, one for the rows und one for the Status tab. See [Cost](#cost).
- It was built und tested mit Claude Code 2.1.300.

### Codex

```sh
codex plugin marketplace add petekp/inbox
codex plugin add inbox@inbox
```

If your shell says `command not found: codex`, verwenden the copy inside the
ChatGPT app in place of `codex` in both commands:

```sh
/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex
```

Then, in the ChatGPT desktop app, trust das Plugin's Hooks: klicken the Hook icon
beside the Prompt's approval setting, dann Allow alle. If the icon isn't there,
öffnen Einstellungen, dann Hooks, dann Inbox, dann Trust alle. Codex runs a plugin's
Hooks nur danach you trust them. On Codex 0.164.0 und later, an aktualisieren stops
the Hooks, so trust them erneut danach jede aktualisieren. To öffnen the inbox, öffnen the
side Bereich und wählen the ⋯ Menü beside New, dann Inbox. This was checked on
2026-11-14 in the ChatGPT app mit Codex 0.169.

[codex/README.md](codex/README.md) covers updating und läuft the `codex`
Befehl von inside the app.

### omp

```sh
omp plugin marketplace add petekp/inbox
omp plugin install inbox@inbox-omp
```

The inbox starts working in the nächste omp Sitzung. `omp plugin list` zeigt it
as `inbox@inbox-omp`. It liest `.omp-plugin/marketplace.json`, which omp looks
for vorher the `.claude-plugin/` Ordner that Claude Code liest.

To aktualisieren, ausführen these, dann neu starten omp:

```sh
omp plugin marketplace update inbox-omp
omp plugin upgrade inbox@inbox-omp
```

After jede reply, the inbox makes two Modell calls, one to aktualisieren the rows und one to schreiben the Status tab. It verwendet
the erste of these that your omp can ausführen:

1. The Modell your `@inbox` role names.
2. The newest Sonnet von your providers, `anthropic` erste.
3. Your `@smol` role.

To set `@inbox`, hinzufügen it under `modelRoles` in omp's `config.yml`, dann neu starten
omp:

```yaml
modelRoles:
  inbox: anthropic/claude-sonnet-5-5
```

Only Sonnet is tested. Another Modell may work, aber nobody has checked how well.

Your provider bills jede call at that Modell's rate.

If `@inbox` is unset, oder names a Modell omp cannot verwenden, such as an unknown Modell
oder one you are nicht signed in to, the inbox verwendet the nächste choice. The Bereich's
footer zeigt the Modell it verwendet. A Modell that omp can verwenden aber that fails when
called does nicht fall through: that aktualisieren fails, und the nächste reply retries it.
Without a usable Modell, the footer says "nein inbox Modell: set @inbox" und the
inbox cannot aktualisieren.

### For alle

The PRs tab needs the GitHub CLI, `gh`, signed in.

## Using it

Type `/inbox` in Claude Code oder omp, oder öffnen the Inbox tab in the ChatGPT app. The
inbox has four tabs: Status, Asks, Finds und PRs.

The inbox starts empty. Give your Agent a Aufgabe, und the erste rows come danach
its reply: a Frage it asked you, mit its answers as buttons, und the Status
of the work. In Claude Code, the Zeile above the Prompt zeigt once the inbox
has something.

To see every part mit sample items, ausführen `/inbox demo` in Claude Code oder omp.
Presses on them ändern nur the samples. In Claude Code, drücken Hide demo oder ausführen
the Befehl erneut to go zurück. `/inbox demo recording` leaves out the notices
that mark the samples, for a Video. In omp, they letzte until the Bereich closes.

### Status

Where the Sitzung's work stands, for someone coming zurück to it cold. The page
names what the Sitzung is focused on jetzt, dann jede part of the work mit
where it stands. A part idle for a day says how long. Subagents und other work
läuft under a part zeigen beneath it. A part that waits on a Frage oder Aufgabe
of yours says so, und View öffnet it. A Zeile marks where you letzte looked, so
what changed since dann sits above it. Finished work folds in a count du kannst
öffnen.

Du kannst set a goal mit a finish Zeile, such as "2.5 in the store". The page
dann groups the work under the goal's milestones, und the inbox keeps the goal
und its milestones aktuell. Du kannst edit oder entfernen the goal at any Zeit. One
you typed stays until es ist met. One the inbox inferred moves on when the work
does.

The page is a guide to the work, nicht a log. The second Modell call danach jede
reply schreibt it. When that call fails, the page says so.

### Asks

Questions the Agent asked you, und Aufgaben nur du kannst do.

The Agent doesn't have to do anything special to put a Frage here. After
jede reply, a Modell liest what the Agent wrote und records jede Frage in
it, mit its possible answers. The Agent's recommended Antwort comes erste.
Press an Antwort und it goes to the Agent as your Nachricht, a few seconds later,
so Undo can take zurück a wrong drücken. Du kannst auch type
your own reply, oder drücken Explain to have the Agent say mehr vorher you decide.

When a Frage is a design choice, such as two layouts oder two ways to build a
feature, Compare has the Agent try jede Antwort against your code und make a
page that zeigt them side by side, which öffnet von the Frage. The page
leads mit the Agent's pick, und the Agent's reply gives the pick, its reason
und the page's Pfad. Where the Agent can ausführen a Subagent in the background, the
comparison runs there, so du kannst behalten working. The Frage liest
"Comparing…" until the Agent reports zurück. After 30 minutes mit nein report, it
liest "No comparison came zurück", und du kannst drücken Compare erneut.

A Aufgabe is something like signing in oder adding an API key. It comes mit
buttons for its steps, such as copying a Befehl oder opening a Datei. In Claude
Code, läuft the Befehl mit `!` closes the Aufgabe once it succeeds. Dismiss
drops a Aufgabe you won't do, ohne a Nachricht to the Agent.

### Finds

Bugs, risks und ideas the Agent noticed outside the Aufgabe it's working on. The
Agent records them und carries on mit its Aufgabe, und you decide later which
ones to act on. Fix on an Issue, oder Do it on an idea, hands it to the Agent.
File Issue has the Agent Datei it in your Issue tracker, such as Linear oder
GitHub, oder link the Issue that already covers it. Reply sendet your own words
about it. Explain has the Agent say why it matters und what fixing it would
involve, ohne acting. Discuss talks it through, und Dismiss drops it.

### PRs

Pull requests von this Sitzung und your aktuell Branch. Each one is marked
Blocked, Ready oder Waiting, und lists what blocks it: review comments waiting
on you, failing prüft und merge conflicts. Buttons hand the work to the
Agent: address one review comment oder alle of them, draft a reply, fix a
failing prüfen, resolve conflicts, oder merge. Fix und Resolve conflicts zeigen nur
while GitHub still zeigt the problem. A PR that merges oder closes leaves the tab
on its own, mit Undo to behalten it there. Clear merged und closed, at the top of
the tab, clears any that stay, except your aktuell Branch's own.

Your Agent can auch put the PRs in an order, such as which to merge erste. The
tab dann lists them erste, numbered, under what the order is for und why. When
a ranked PR ändert, the tab says so und offers Rank erneut.

### It keeps itself up to date

When you Antwort a Frage in your own Nachricht, a Aufgabe gets fertig, oder the
Agent fixes a finding, the inbox closes the item. Closed items fold away under
the öffnen ones, jede mit how it ended. One you dismissed keeps Reopen there for
the rest of the Sitzung.

The Agent liest the inbox too. Beside jede of your prompts, it sees what's
still öffnen und what you answered, even danach the Gespräch is compacted.

Every drücken zeigt what it did right away. Discuss liest "Discussing…" until
the Agent replies, dann "✓ Discussed".

### In jede app

Help lists the keys und what jede mark means.

- **Terminal:** jede action zeigt the letter that runs it. The number keys
  switch tabs, und `j` und `k` move up und down. On the Status, they move
  between the rows that have a Schaltfläche, und the letter beside a Schaltfläche presses
  it. ctrl+x tab moves focus von the Prompt to the Zeile above it, dann to the
  Bereich, dann zurück to the Prompt.
- **Claude desktop app:** you klicken. Type `/inbox` to öffnen the pane. Clicks in
  the pane are checked on the Claude Code engine 2.1.309 und later. On 2.1.295,
  a klicken danach a drücken could nur give the pane its focus zurück.
- **ChatGPT app:** you klicken, oder drücken the same keys as in the terminal. The
  tab zeigt nein letters.
- **Herdr app:** see [Herdr app pane](#herdr-app-pane).
- **omp:** `/inbox` öffnet the Bereich over the Gespräch, und esc closes it.
  Each action zeigt the letter that runs it, und Reply ist `t`. Arrow keys move
  between rows und between a row's buttons, und enter presses the focused
  Schaltfläche. Tab, oder the number keys, switch tabs. On the Status, `j` und `k`
  move between the rows that have a Schaltfläche, und the up und down arrows scroll
  the page.

In Claude Code, a Zeile above your Prompt counts what needs you und the
findings waiting, mit a Schaltfläche that öffnet the Bereich. When Claude stops on an
Fehler, a second Zeile says why, mit a Resume Schaltfläche danach an API Fehler. The
ChatGPT app has nein such Zeile. omp has a Zeile mit the same counts. It says
`/inbox` öffnet the Bereich, und it has nein stoppen Zeile.

### Herdr app pane

In a Herdr app terminal, the inbox kann öffnen in a pane beside the terminal.

1. Start Claude Code oder omp in a Herdr app terminal, und type `/inbox`. The
   erste Zeit, the inbox öffnet in the terminal und asks "Install the inbox's
   Herdr mod?". Press Install. The ChatGPT app asks the same Frage on its
   Inbox tab.
2. Type `/inbox` erneut. The inbox öffnet in a pane to the right of the
   terminal. Claude Code's Open inbox Schaltfläche does the same. Wenn du pressed
   Install in another Sitzung oder app und the inbox still öffnet in the
   terminal, neu starten Claude Code.
3. The pane zeigt the inbox of the terminal you letzte focused in its tab. It has
   Asks, Finds und PRs, und du kannst drücken every Schaltfläche. ← und → switch tabs,
   `j` und `k` move between rows, und esc gives the keys zurück to the terminal.
   Help lists the rest.

Don't installieren saves your Antwort. Run `/inbox herdr` in Claude Code oder omp to be
asked erneut.

The Codex CLI has nein `/inbox`. Open the pane for it mit
`herdr-app do pane.split '{"direction":"right","pane":"<pane id>","mod":"inbox"}'`,
taking the pane id von `herdr-app ls`.

Inside a Herdr pane, Claude Code, omp und the Codex CLI auch report to Herdr's
sidebar, as pane Tokens:

| Token | Holds |
|---|---|
| `inbox` | What waits on you, in one Zeile |
| `inbox-needs-you`, `inbox-findings`, `inbox-prs` | The tab's count alone, such as `2`. `inbox-needs-you` is the Asks tab's, und `inbox-findings` the Finds tab's. Empty when the tab has nothing waiting. |
| `inbox-stop` | Why the Agent stopped. The count Tokens stay empty until the stoppen clears, so the sidebar has room for it. |
| `inbox-focus` | What the Sitzung is focused on, von its Status. A Sitzung that started this one as a Herdr delegate zeigt it as the delegate's row. No sidebar row needs it. |

To tell the counts apart by jede tab's color, hinzufügen this row to `rows` under
`[ui.sidebar.agents]` in Herdr's config:

```toml
[
  { token = "$inbox-stop", fg = "#ffa3b0" },
  { token = "$inbox-needs-you", fg = "#ffae42" },
  { token = "$inbox-findings", fg = "#cab0ff" },
  { token = "$inbox-prs", fg = "#8cc8c0" },
],
```

Herdr puts ` · ` between the Tokens that have a value, und leaves the Zeile out
when keine has one.

## Cost

In Claude Code, the inbox adds two things:

| What the inbox adds | Tokens | Cost at API prices |
|---|---|---|
| A Sonnet call danach jede of Claude's replies, to aktualisieren the inbox | 3–4k in, about 2k of it cached. 100–250 out. | About 0.5¢ per reply, oder 1¢ danach 5 idle minutes |
| A second Sonnet call, to schreiben the Status tab | About 1.2k in und 14–44 out on a short exchange (three eval runs: 1,175–1,214 in). A catch-up over a Gespräch liest mehr: 1,358 in und 100 out in the one ausführen. | Less than the erste call, which liest about 3k in |
| Its instructions und Werkzeuge, sent mit every request Claude makes | About 1,350, cached | Under 0.1¢ per request |

On a Claude plan, these count toward your Nutzung limits.

In Codex, the aktualisieren danach jede reply runs through the `codex` binary inside
the desktop app, mit your Codex sign-in. It makes two calls per reply. Each
carries about 12,000 Eingabe Tokens of base instructions, which every
`codex exec` call includes, plus its own Prompt. The earlier single call came
to about 16,000. It counts toward your plan's Nutzung.

## What it runs, sendet und ändert

This covers the Claude Code mod. [codex/README.md](codex/README.md) covers
the Codex plugin. The omp extension runs the same `gh` queries. Its aktualisieren
request goes through omp's own connection to the provider of the Modell it
verwendet, und holds the same things as the Claude Code request.

**What leaves your machine.** Three things, und nothing else:

- After jede of Claude's replies, the inbox sendet two Sonnet requests to
  Anthropic through Claude Code's own Modell connection. Both hold your letzte
  Prompt, Claude's reply, the inbox's öffnen items, und a Zeile for jede Werkzeug
  Claude ran. A Werkzeug Zeile liest like `ran: npm test` oder
  `edited src/app.ts`. [Cost](#cost) gives the request's size.
- When the inbox may have missed a Zug, it asks the same Modell, mit the same two calls, to aktualisieren it
  von the whole Gespräch. It forks the Gespräch for this, oder liest
  the transcript danach a resume.
- To fill the PRs tab, it runs lesen-only `gh` queries: `gh pr view`, und
  `gh api graphql` for review threads. They reach GitHub under your own `gh`
  sign-in. The inbox nie liest your GitHub Token.

**Programs it starts.**

| Program | When |
|---|---|
| `gh` | To fill the PRs tab |
| `open` | When you drücken a Schaltfläche that öffnet a link, Datei oder Ordner |
| `test -x` | Before opening a Datei. An executable Datei is shown in Finder, nicht ausführen. |
| `herdr pane report-metadata` | Only inside a Herdr pane, to zeigen what waits on you und jede tab's count in Herdr's sidebar |

**Messages it sendet as you.** When you drücken an Antwort oder action Schaltfläche, the
inbox sendet Claude a Nachricht in your Name. The Nachricht is the Antwort you
chose, oder a request about the item, such as asking Claude to fix a finding.
Resume, on a stopped Zug, sendet `Continue`. Every Nachricht it sendet starts
von a drücken. When you mark a Aufgabe Done that Claude is waiting on, the inbox
tells Claude a few seconds later, oder once Claude's läuft Zug ends.

**What it adds to Claude's Kontext.**

- Its instructions, about 1,350 Tokens, in every request.
- A note beside your Prompt when you Antwort one of Claude's numbered
  Fragen, oder when the inbox changed since Claude letzte saw it.
- Its öffnen items danach the Gespräch is compacted, so Claude keeps them.

**What its Hooks see.**

- Tool calls. The inbox liest jede call to schreiben the Werkzeug Zeilen above, to
  zeigen a Frage while Claude's Frage dialog ist öffnen, und to find a PR
  this Sitzung öffnet mit `gh pr create`. It passes every call on unchanged,
  except calls to its own two Werkzeuge. `record` saves a Frage, a Aufgabe oder a
  finding und `close` closes an item. The inbox answers these itself, so they ausführen
  ohne a permission Prompt.
- Permission prompts. While Claude Code asks you to genehmigen a Werkzeug call, the
  inbox zeigt a row for it, dann passes the request on unchanged. It nie
  approves oder denies a permission Prompt.
- Tool descriptions. It lists its own two Werkzeuge to Claude up front, instead
  of behind Werkzeug search. It leaves other Werkzeuge' descriptions alone.
- Shell commands you ausführen mit `!`, und their Ausgabe. A Befehl that runs
  mit nothing on stderr closes a Aufgabe that asked you to ausführen it.
- Session starts. After `/clear`, a resume oder a fork, the inbox loads that
  Gespräch's items. It passes the event on unchanged.
- Your theme setting, to match its colors.

**What it keeps.** The inbox saves jede Sitzung's items, und the PRs it
tracks, in Claude Code's plugin storage on this machine. It keeps the 40
most recent Sitzungen und deletes older ones. An item can summarize part of
the Gespräch, so it may Name the people in it. Nothing goes to the
plugin's author.

It auch adds the `/inbox` Befehl.

## Developing

[docs/developing.md](docs/developing.md) says how to ausführen und build the inbox von a clone.

## Quelle und Lizenz

- Originalautor: petekp
- Originalrepository: https://github.com/petekp/inbox
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
