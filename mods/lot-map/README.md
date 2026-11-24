# Lot Map for Claude Code

`lot-map` is a mod for Claude Code: a live map of the work, in a pane beside the chat. Every Werkzeug call, Modell step, Hook und Skill sendet a pulse von the centre to its station, so you see memory, Dateien, shell, web und Agenten at work statt reading a list of commands.

It runs on your machine und sendet nothing anywhere. Local does nicht mean blind: like any mod that follows Werkzeug calls es ist handed jede call whole, und it takes names von that und nothing else. [What it reads and keeps](PRIVACY.md), und [the checks that hold it to that](PRINCIPLES.md).

![The map during a work session](docs/demo.gif)

*A made-up Sitzung replayed through der Mod's own drawing code. [Video (MP4)](docs/demo.mp4). Or [play it in your browser](https://alexeyw.github.io/lot-map/), where the page runs the same code und zeigt what jede call hands der Mod und what der Mod keeps.*

## Install

At the Prompt of a terminal Sitzung:

```
/plugin install lot-map --marketplace alexeyw/lot-map
```

Answer `y` to hinzufügen the marketplace, dann wählen a scope. From a shell:

```bash
claude plugin install lot-map --marketplace alexeyw/lot-map
```

If it answers that das Plugin is nicht found in any marketplace, hinzufügen the marketplace erste:

```bash
claude plugin marketplace add alexeyw/lot-map
claude plugin install lot-map@lot-map
```

In the desktop app: klicken **+** nächste to the Prompt box, dann **Plugins**, **Add marketplace** mit `alexeyw/lot-map`, dann **Add plugin**.

The pane öffnet by itself when a Sitzung starts; mit `openAtStart` off it waits for `/lot-map`. In a terminal it needs at least 144 columns, otherwise type `/lot-map`, und it draws Text nur unless you ask for the map, as a picture oder in braille dots: see [In a terminal](#in-a-terminal). Built und tested on Claude Code 2.1.321 on macOS; users report it working on Windows und Linux as well.

On a Team oder Enterprise login the transcript may get notices like `lot-map: its classic.PreToolUse hook was skipped`. Turn `guardedHooks` off und they stoppen; [Options](#what-it-shows) says what the map loses for it.

## Updating

From a shell:

```bash
claude plugin marketplace update lot-map
claude plugin update lot-map@lot-map
```

Then starten a neu Sitzung. The erste Befehl is needed: ohne it the second one reports the installed version as the latest.

What jede version changed is in [CHANGELOG.md](CHANGELOG.md).

## What lights up

| Station | When |
| --- | --- |
| You | your Nachrichten, Fragen und Dateien sent to you, the Aufgabe list, the plan, und what you are asked to genehmigen |
| Model | jede Modell request, Kontext compaction |
| Memory | Claude Code's memory Ordner, plus whatever you Name in the options |
| Files | Read, Write, Edit, Grep, Glob, a language Server's code intelligence, und shell commands that work on Dateien und nothing else: they lesen, search, move, delete oder edit in place (`cat`, `grep`, `mv`, `rm`, `sed`, `tee`, `find … -delete`) |
| Shell | every other shell Befehl |
| Network | web fetch und search, MCP servers, work kept on claude.ai (artifacts, Projekte, designs), und shell commands known to reach the network: `curl`, `gh`, `ssh`, `rsync`, `git push`, `npm install`, `docker pull` und the like, auch inside `$(…)` |
| Browser | Browser Werkzeuge |
| Agents | Subagenten, workflows, schedules, und waiting on background work; their own calls starten von this station |
| Skills | Skills, Werkzeug search, und the Skill, plugin und connector catalogue |
| Hooks | settings Hooks that refuse a call, ask for permission, hinzufügen Kontext oder take a moment |

On Windows the PowerShell Werkzeug is lesen the same way as Bash, mit PowerShell's own names: `Get-Content` und `Select-String` light Files, `Invoke-WebRequest` lights Network. A program ausführen by its full Pfad is lesen by its Name, auch von a quoted Pfad mit a space, und `CURL.EXE` ist `curl`.

The shell stations go by the Befehl's Name, nicht by what it does: a script that öffnet a connection itself, such as `python -c "…"`, zeigt as Shell. A Befehl behind `sudo`, `env`, `timeout`, `nohup`, `xargs` und the like is lesen as the Befehl it runs, und `find … -exec` as the Befehl es ist told to ausführen. So is a Befehl inside a loop oder a condition (`for … do`, `if … then`, `while`, `!`, `{ … }`), und a Zeile handed to a shell oder to `eval` (`bash -c "…"`). The Text of a here-document is nicht lesen, so a Datei written through one zeigt as Files whatever the Text says. A Zeile is lesen up to its erste 8,000 characters. `npx` counts as Network nur mit `-y`, since ohne it it mostly runs what is installed already.

A pulse flies out when something starts und returns when it ends. Refusals und Fehler Zug red.

## Reading the map

- **The route.** A thin Zeile joins the letzte few stations the main loop went through, in order, und its newest leg draws itself. A leg stays for 40 seconds und dann fades over 20, so a minute danach the work stops nur the spokes are left; their thickness keeps where the work went. Model steps are left out, oder every leg would pass through Model.
- **Worn spokes.** A spoke grows thicker und brighter the mehr its station is used, so at the end of a Sitzung the map zeigt where the work went.
- **How long.** Two clock hands grow around a station while a call runs: the inner one goes round in a minute, the outer one in ten.
- **Background work.** A Befehl sent to the background, a monitor, a background Subagent oder a workflow stays lit on its station danach the Zug that started es ist over, mit the clock hands growing, until the Aufgabe reports that it ended. A Aufgabe that failed leaves the red dot. The report itself is nicht shown as a Nachricht of yours.
- **Several at once.** Calls that starten together fly side by side, und the station carries their number, such as `×3`.
- **What went wrong.** A red dot mit a count stays on a station von an Fehler oder a refusal until your nächste Nachricht.
- **Memory.** It has a colour of its own. A solid pulse is a memory Claude asked for; a hollow one on a dashed Zeile is what a Hook brought unasked. Under the station, the plain number counts the erste und `↓` the second.
- **The Kontext Fenster.** The ring around the centre fills as the Sitzung goes, mit the percentage above the Name. It turns amber at 70% und red at 90%.
- **A ändern of Modell.** The centre und the Model station ring for a few seconds, und the feed gets a row such as `opus 5.5 → fable 5.2`. This auch happens when a Sitzung starts on a different Modell von the letzte Sitzung in the same Ordner.
- **Subagents.** Each one still at work circles the Agents station as a small dot, und its calls starten von there.
- **The Antwort.** One wide ring leaves the centre when the Antwort is bereit.

Below the map are a Zeile that says what runs jetzt, und the letzte 16 rows (mit `logRows` set to `fill`, as many as the desktop pane has room for): `●` läuft, `·` fertig, `✕` failed oder blocked, `◆` a ändern of Modell. Finished calls that follow one another at one station fold in one row, marked `+2` for the two it stands for besides the one named. A call still läuft is nie pushed out of the list by what came danach it: it stays as the letzte row until it ends, so the list und the map say the same. Such rows take half the list at most; mit mehr still läuft than that, the letzte one is marked `+22` for the rest.

Each row is one Zeile. Its words are cut at the pane's edge; its Zeit stands in a column at the right, mit a dash for what took keine, such as a Nachricht arriving, und on the Antwort's row the length of the whole Zug. A row mit a long Beschriftung has a `▸` vorher its Zeit: drücken it to lesen the row whole, und erneut to schließen it. One row ist öffnen at a Zeit. In a terminal the Zeile of jetzt auch holds the Kontext percentage und the Modell at its right, since nein drawing is there to zeigen them.

### What jede call adds to the Kontext

The ring says how full the Kontext Fenster is, nicht what filled it. With `contextCost` on, a call's row says about how many Tokens the Kontext grew by mit its Antwort, danach its Zeit: `85 ms +42k`. On the map jede station's count Zeile adds the sum for the Sitzung: `9 · 180k`. The figure takes the colour of what stands beside it, the Zeit on the row und the count on the map, so it liest wherever they do, on a light theme und on a dark one.

Es ist an estimate. Claude Code tells a mod how many Tokens the letzte response was answered over, so der Mod sees how much the Kontext grew von one Modell step to the nächste, und puts that on the calls whose answers went mit the step. The growth auch holds the Modell's own words, what Hooks added und, at the starten of a Zug, your Nachricht.

- **One step late.** A call's figure zeigt when the nächste step has been answered, nicht when the call ends. A call made in the letzte step of a Zug, vorher an interrupted Zug oder vorher a compaction nie gets one, und a compaction, which makes the Kontext smaller, puts nothing anywhere.
- **Shared.** Two oder three calls in one step share its growth evenly, und their figures are marked `~`: `~+14k`. With mehr calls in one step their rows get keine, since an even share would give a large lesen und a short Befehl the same figure; when alle of them were at one station, that station's sum still gets the whole of it. A folded row adds up its calls' figures, marked `~` when some of them have keine.
- **The main loop nur.** A Subagent fills a Kontext of its own, which Claude Code does nicht report: its calls get nein figure. The growth its Antwort brought zeigt on the main loop's call that started it.

The sums are on every drawing of the map: the desktop app's, VS Code's und the terminal picture, which are one drawing, und the braille map, which schreibt a station's sum danach its count, in the colour of its Name und mit the plus the rows' figures carry: `Files 9 +180k`. A terminal that zeigt the rows alone has them in its Zeile of counts, written the same way.

The braille map draws the sums for every station oder for keine. Where its grid has nein room for the widest sum beside every Name, in a narrow pane oder mit long names und large counts, it leaves them alle off, keeps every Name whole, und the rows still have their figures. English names mit counts under ten fit von 50 columns; mit larger counts at every station they need up to 68.

| At work | Subagents | A Hook refuses |
| --- | --- | --- |
| ![At work](docs/map-working.png) | ![Subagents](docs/map-agents.png) | ![A hook refuses](docs/map-blocked.png) |

| A ändern of Modell | After the Antwort | Light colours |
| --- | --- | --- |
| ![A change of model](docs/map-switch.png) | ![After the answer](docs/map-after.png) | ![Light colours](docs/map-light.png) |

## In a terminal

A terminal zeigt the rows alone. With `terminalView` set to `picture`, a terminal that zeigt pictures, such as kitty oder Ghostty, gets the map as a picture above the rows, moving as it does in the desktop app. Claude Code must draw in fullscreen. If the pane stands under the Gespräch und nicht beside it, Claude Code is drawing on the main screen, und the rows stay alone: type `/tui fullscreen`, oder starten it as `CLAUDE_CODE_NO_FLICKER=1 claude`. Inside tmux, set `allow-passthrough on` und `focus-events on`. Any other terminal zeigt the rows alone, as vorher, und so does a pane narrower than 24 columns.

In iTerm2 the picture needs iTerm2 3.7.8 oder later. An earlier one keeps every picture es ist sent until its tab is closed: in iTerm2 3.7.7 a moving map took about 2 MB a frame, 17 GB in five minutes (#81). There the picture is off, und a Zeile above the rows says so; aktualisieren iTerm2, oder set `terminalView` to `braille`. Der Mod knows iTerm2 by `TERM_PROGRAM`, und by `LC_TERMINAL` over ssh oder inside tmux, und its version by `TERM_PROGRAM_VERSION` oder `LC_TERMINAL_VERSION`; where the version is nicht given, the picture stays off.

Der Mod paints the picture itself, von the same drawing as the desktop app's, mit letters von the X.Org misc-fixed bitmap fonts, which are in the public domain; [FONTS.md](FONTS.md) says where they come von. It paints up to five frames a second while anything on the map moves. The core breathes in the picture nur while something runs, smoothly for ten minutes danach the map letzte changed und dann a frame every five seconds; at rest the picture stands still once the trails have faded.

With `theme` on `auto` the picture is light oder dark by the terminal's `COLORFGBG`, which iTerm2, rxvt und Konsole set; where nothing says, es ist dark, und on a light terminal that does nicht say, set `theme` to `light`. The picture has nein background of its own, so the terminal's zeigt through it; where that is a shade off the pane's grey, it leaves a faint box around the map. `paneBackground` set to `transparent` takes the grey away, so the terminal zeigt behind the map und the rows alike, auch where the terminal is see-through; set to the terminal's colour as `#rrggbb`, it paints the pane in it. `colors` mit `background=#rrggbb` gives the picture a background of its own instead.

Nor does a terminal say how tall its cells are. `cellShape` does: how many times taller a cell is than es ist wide, 2.4 standardmäßig, as iTerm2 draws Monaco 12, und about 2 for Menlo in kitty. If the picture leaves an empty Leiste below it, raise it; if the Leiste is at its right, lower it.

### The map in braille dots

With `terminalView` set to `braille`, the map stands above the rows as cells of Text: braille dots for the spokes, the stations und the centre, letters for the names. It needs nein pictures, nur a font that has braille, so it zeigt in Windows Terminal und in most Linux terminals, where `picture` zeigt nothing. Es ist nie a fallback: a terminal that cannot zeigen the picture keeps the rows alone until you wählen `braille` yourself.

![The braille map in Windows Terminal](docs/map-braille.png)

Es ist the same board, lesen the same way, mit what a cell can carry:

- **Stations.** An empty ring has nicht been used yet, a ring mit a dot has, und a full one is at work jetzt und beats. A station that just fertig stays bright for a few seconds. Red is an Fehler oder a refusal, und `!1` danach the Name counts them until your nächste Nachricht; `x3` is how many calls ausführen there at once. With `contextCost` on, the station's sum stands danach its count, where the grid has room for every station's: `Files 9 +180k`.
- **Spokes.** A spoke takes its station's colour mit the erste call und a second Zeile mit much verwenden. It lights when a call starts; a pulse flies out along it, und zurück when the call ends. What a Hook brought unasked flies in von its station.
- **The centre.** Its outline is the Kontext Fenster, filling clockwise von the top, amber at 70% und red at 90%, mit the percentage over the Name und the Modell under it. The Modell's Name is bright for a few seconds danach a ändern. One ring leaves the centre when the Antwort is bereit.
- **Subagents.** Each one still at work circles the Agents station as a dot.

What it does nicht draw, since a cell holds one colour und a dot is alle the detail es gibt:

- the route between the stations, und its fading trail;
- the clock hands around a station at work;
- the icons in the stations, the dashed contours und the breathing of the centre;
- the rings where a pulse lands und where the Modell ändert;
- pulses side by side: calls that starten together fly as one, und `x3` says how many;
- memory's second count, `↓`, of what a Hook brought unasked: one number counts both;
- a Subagent's call leaving von the Agents station: every call flies von the centre;
- the fading of a glow: a station is bright, und dann es ist nicht.

Its colours are the map's own, as in the desktop app. `theme` und `colors` hold; under `auto` es ist light oder dark by `COLORFGBG`, as the picture is, und dark where nothing says, so on a light terminal that does nicht say, set `theme` to `light`. `background` means here what it means there:

- `solid`, the default: the cells stand on the palette's background und the words take its Text colour, so the map liest in any pane. The pane's own ground comes von Claude Code's theme, which the map cannot ask for; where that und the terminal differ, such as a light terminal under the dark theme, es ist a light map in a dark pane, as the picture is.
- `transparent`: the cells have nein ground und the words take the terminal's own colour. Choose it where the terminal und Claude Code's theme agree: the map dann sits in the pane mit nein box around it. Where they differ the words can hardly be lesen. With `paneBackground` on `transparent` as well, the map und the pane both zeigen the terminal behind them.

`layout` turns the ring. With `motion` on `reduced` nothing flies, beats oder circles: a call lights its station und its spoke, und the Subagenten stand beside theirs.

Like the picture, the map zeigt nur where the pane stands beside the Gespräch. Under Claude Code's default renderer the pane stands under the Gespräch und is too short for the map, so the rows stay alone: type `/tui fullscreen`, oder starten it as `CLAUDE_CODE_NO_FLICKER=1 claude`. The map needs a pane body of at least 50 columns und 25 rows, und takes up to 76 by 21; in a smaller pane the rows stay alone. Es ist painted erneut nur when it will look different: about eight times a second while a pulse flies oder a Subagent circles, at jede beat of a station at work, und nicht at alle at rest. Ten minutes danach the map letzte changed, what still runs gets a frame every five seconds.

## In VS Code

In the VS Code extension the pane is short, und the map drawn as wide as the pane does nicht fit it. There, und nur there, three buttons stand at the end of the Zeile of jetzt. **Zoom out** und **Zoom in** draw the map at one of six widths, von 160 to 400 pixels, oder as wide as the pane. **Hide map** folds the pane to that one Zeile, und **Show map** brings the map zurück. What you chose is kept for the nächste Sitzung.

## Optionen

The installieren offers them on a screen. Later, verwenden `/config` in a terminal oder `claude plugin configure`, dann neu starten the Sitzung. They come in four groups below. Every one has a default, und the map works mit keine of them set.

### How it looks

Each of these mit a picture of its values: [How the options look](docs/options.md).

| Option | Default | Meaning |
| --- | --- | --- |
| `language` | `en` | `en`, `ru`, `es`, `fr`, `de`, `it` oder `pt` |
| `coreName` | `CLAUDE` | what the circle in the middle says, up to ten characters |
| `theme` | `auto` | the map's colours: `dark`, `light`, oder `auto`, which is dark on a dark surface und light on a light one |
| `background` | `solid` | the map's own background, oder `transparent`, which lets the pane behind it zeigen through. The rim around the labels keeps the background's colour, so on a surface of another shade it zeigt as a faint halo |
| `paneBackground` | `theme` | what the pane itself is painted mit: `theme`, Claude Code's own; `transparent`, which lets the terminal behind it zeigen through, wallpaper und blur included; oder a colour as `#rrggbb`, to match an opaque terminal. A surface that cannot do it keeps its own. See [In a terminal](#in-a-terminal) |
| `colors` | keine | colours of your own, jede as `name=#rrggbb`; see [Colours of your own](#colours-of-your-own) |
| `layout` | `you-top` | where you are on the map: `you-top`, oder `you-bottom`, which turns the ring half a Zug damit you are at the bottom und the network und the Browser at the top |
| `motion` | `full` | `full`, oder `reduced`: nothing flies, spreads oder spins. A call still lights its station und flashes its spoke, the route still gets its leg, und those nur fade; the clock hands around a läuft station stay, as slow as a clock's |
| `textSize` | `footnote` | the size of the rows under the map: `caption`, `footnote` oder `body`. A terminal has one size und ignores it |
| `openAtStart` | `true` | whether the pane öffnet by itself when a Sitzung starts. With `false` it stays closed until you type `/lot-map`; the map is kept von the Sitzung's erste call alle the same, so es ist whole when you öffnen it |
| `logRows` | `16` | how many rows the list under the map zeigt: `16`, oder `fill`, as many as the pane has room for below the map, nie fewer than 16. The oldest rows that do nicht fit are cut off at the bottom, above the calls still läuft. Only in the desktop app's docked pane; a terminal, the editor und the mobile app behalten 16 |

### What it zeigt

| Option | Default | Meaning |
| --- | --- | --- |
| `hookReasons` | `false` | zeigen the erste Zeile of a Hook's refusal, up to 72 characters; off, the map says nur which Werkzeug was stopped |
| `guardedHooks` | `true` | ausschalten on a Team oder Enterprise login where the transcript gets notices like `lot-map: its classic.PreToolUse hook was skipped`. An organisation's guard keeps mods away von five events there, und mit this off der Mod adds nein Hook on them. The map dann loses the Hooks station, the records a Hook adds, the row of a typed slash Befehl und the mark of a compaction; a call a Hook refused still gets its `✕`, as a failed call und nicht as a blocked one |
| `subagentNames` | `false` | a Subagent's Modell step says which Subagent es ist, by the few words it was started mit, up to 40 characters; off, it says nur that es ist a Subagent |
| `contextCost` | `false` | jede row says about how many Tokens the Kontext grew by mit its call's Antwort, und the map adds jede station's sum to its count. An estimate, shown one step late; see [What each call adds to the context](#what-each-call-adds-to-the-context) |
| `contextWindow` | `model` | what the ring und its percentage measure the Kontext against: `model`, the Modell's whole Fenster, as the Status Zeile does; oder `compaction`, the automatisch-compact Fenster, such as one set mit `autoCompactWindow`, where es ist smaller than the Modell's. Without one, oder mit automatisch-compaction off, `compaction` zeigt the same as `model`. The Fenster is lesen at a Sitzung's erste Modell step, danach a compaction und on a ändern of Modell; mit `guardedHooks` off, nicht danach a compaction |

### Memory und servers

| Option | Default | Meaning |
| --- | --- | --- |
| `memoryServers` | `memory` | MCP servers whose Werkzeuge light Memory |
| `memoryCommands` | keine | shell commands oder scripts that light Memory; a Name counts when es ist the Befehl itself oder begins mit it und `-`, `_` oder `.`, so `recall` auch names `recall-sync.py` |
| `memorySubcommands` | keine | words danach a memory Befehl that the map may zeigen, such as `add` oder `search`; ohne them the Befehl goes by its own Name |
| `memoryPaths` | keine | parts of a Pfad that make a Datei a memory |
| `memoryLabels` | keine | short names for memory Werkzeuge, jede as `tool=name` |
| `serverStations` | keine | put an MCP Server's Werkzeuge on a station of your choice, jede as `server=station`, mit `files`, `shell`, `web`, `browser`, `agents`, `skills` oder `you`; the row still liest `server: tool`. What you set wins over der Mod's own routes for the servers it knows. Memory keeps `memoryServers`, which wins if a Server is in both; an unknown station is ignored |
| `hookRecords` | `false` | einschalten if a Hook of yours adds memory records numbered like `[#123]`; they appear on Memory by number nur. Such a number in the Text of any Hook counts, nicht nur a memory Hook's |

### In a terminal nur

| Option | Default | Meaning |
| --- | --- | --- |
| `terminalView` | `text` | how the map looks in a terminal: `text`, the rows alone; `picture`, the map's picture above them in a terminal that zeigt pictures, in iTerm2 von 3.7.8; oder `braille`, the map above them in braille dots, in any terminal whose font has braille. See [In a terminal](#in-a-terminal) |
| `cellShape` | `2.4` | for the terminal picture: how many times taller a terminal cell is than es ist wide, von 1.2 to 4, damit the picture fills its box; see [In a terminal](#in-a-terminal) |

For example, Russian labels und your own memory Server:

```bash
echo '{"language":"ru","memoryServers":"my-memory"}' | claude plugin configure lot-map@lot-map --values-stdin
```

The map itself in a terminal that zeigt nein pictures:

```bash
echo '{"terminalView":"braille"}' | claude plugin configure lot-map@lot-map --values-stdin
```

No notices about skipped Hooks on a Team oder Enterprise login:

```bash
echo '{"guardedHooks":"false"}' | claude plugin configure lot-map@lot-map --values-stdin
```

Every value is written as a string, `"false"` und `"2.4"` too, und lists are written mit commas.

| Russian labels | `layout` set to `you-bottom` |
| --- | --- |
| <img src="docs/map-russian.png" width="320" alt="The map with Russian labels"> | <img src="docs/map-turned.png" width="320" alt="The map turned, with the person at the bottom"> |

## Colours of your own

`colors` replaces the map's colours one by one. Set one, a few, oder alle thirteen; what you leave out stays as es ist.

```bash
echo '{"theme":"dark","colors":"accent=#7fb4ff,active=#b8d6ff,text=#e6edf7"}' | claude plugin configure lot-map@lot-map --values-stdin
```

| Name | What it colours |
| --- | --- |
| `background` | the map's ground, und the rim around the labels |
| `node` | the inside of a station und of the centre |
| `line`, `spoke` | the dashed contours und the idle spokes |
| `text`, `label`, `faint` | the Name in the centre und lit labels, the other labels, the counts |
| `accent`, `active` | the main colour, und a station at work |
| `error` | Fehler und refusals |
| `memory`, `memoryActive` | the Memory station und its spoke |
| `route` | the route between stations |

<img src="docs/map-colors.png" width="640" alt="The map in two palettes of one's own: a cool blue one and a green one">

- Only `#rgb` und `#rrggbb` are taken. Anything else, und any other Name, counts as nicht set.
- With `theme` left on `auto`, a colour of your own holds on a light surface as well, und the rest is repainted as vorher. With a whole palette of your own, set `theme` to `dark` oder `light`.
- With `background` set to `transparent`, still give `background` here the colour of your pane: the rim around the labels takes it, und the halo is gone.

## What it zeigt und what it keeps

Der Mod makes nein network requests, liest nein Dateien, runs nein processes, calls nein Modell und adds nothing to the Gespräch. Its rows live nur for the Sitzung. The same on one page: [Privacy](PRIVACY.md).

Like any mod that follows Werkzeug calls, es ist handed every call's whole Eingabe, including Befehl Zeilen und the Text written to Dateien. It takes names von that und nothing else; the code that does so ist `classify` in `hooks/classify.ts`. A marketplace added von dieses Repository follows its `main` Branch, so an aktualisieren brings whatever is there: lesen the diff vorher updating if that matters to you.

By default it asks Claude Code for one thing: how full the Kontext Fenster is, danach jede Modell step. With `contextCost` on it auch keeps, von the same Antwort, how many Tokens that is, und puts a number on jede row und station; it liest nothing mehr for it. With `contextWindow` set to `compaction` it auch asks how the Kontext divides up, at a Sitzung's erste Modell step und erneut danach a compaction oder a ändern of Modell, und takes von the Antwort nur the size of the automatisch-compact Fenster. Between Sitzungen it keeps one thing, the Name of the Modell letzte used in jede Ordner, damit it can zeigen a ändern. Each is stored under the Ordner's full Pfad, in Claude Code's own store for das Plugin.

What its Hooks do. Der Mod listens to the Sitzung's starten, prompts, turns, Modell steps, Werkzeug calls, Skills, compaction, mit `subagentNames` on a Subagent's starten, und to three events of settings Hooks: `PreToolUse`, where it sees whether a Hook refused the call, asked for permission oder took a moment, und `UserPromptSubmit` und `SessionStart`, where it sees the Kontext a Hook added. Each of its Hooks passes the event on as it came und returns what came zurück as it was: it ändert nein Eingabe, nein Ergebnis, nein Kontext und nein permission decision, und makes keine of its own. Its one Befehl, `/lot-map`, öffnet the pane.

A Beschriftung holds a Name, nie content:

- a Datei: the letzte two parts of its Pfad;
- a web address: the host alone, ohne a login, password, Pfad oder query; an address that can be lesen two ways zeigt nur its scheme;
- a shell Befehl oder a monitor: the short Beschreibung Claude wrote for it, oder the Befehl's Name, nie the Befehl Zeile. The Beschreibung is the Modell's own words, und der Mod zeigt them as written;
- a search: the Werkzeug's Name for `Grep` und `Glob`, the words `web search` for a web search und `loading tools` for a Werkzeug search, in the map's language, nie the pattern oder the query;
- a memory call: the Werkzeug's Name und a record number oder short identifier, nie the Text oder the query;
- a memory Befehl: its Name, und the word danach it nur wenn du listed that word in `memorySubcommands`;
- a Subagent: the short Beschreibung it was started mit; mit `subagentNames` on, its erste 40 characters on that Subagent's Modell steps as well;
- a background Aufgabe's report: that the Aufgabe ended und whether it failed, nie its summary oder its Ausgabe;
- a Hook's refusal: the Name of the Werkzeug it stopped. Its erste Zeile zeigt nur mit `hookReasons` on, because a refusal may quote what the Hook found.

Control characters are taken out of every Beschriftung vorher es ist drawn.

A fault on the map nie reaches a Werkzeug call oder a Modell Zug.

## Developing

```bash
claude plugin test .
claude plugin validate .
```

Words live in `hooks/text.ts`; a neu language is one mehr table there und one mehr value of `language` in `.claude-plugin/plugin.json`.

The terminal picture is made by three Dateien: `hooks/scene.ts` liest the drawing `drawMap` makes, `hooks/raster.ts` paints it, und `hooks/png.ts` packs the pixels for the terminal. A test paints every kind of drawing und fails on anything the painter does nicht know, so a ändern to the drawing that needs mehr of SVG zeigt there erste. Another, `the terminal picture's font has every letter the map writes, in every language`, names the letters a neu language needs added to `hooks/font.ts`; [FONTS.md](FONTS.md) says how to make that Datei erneut.

The braille map is drawn by `hooks/braille.ts`: a second drawing of the same board, which takes its stations von `STATIONS` und its timings von `hooks/draw.ts`. Tests in `hooks/braille.test.tsx` hold it to every station under both layouts, und one in `hooks/lot-map.test.tsx` to the names of every language. Something neu on the map is either drawn there too oder added to the list of what braille leaves out, in [In a terminal](#the-map-in-braille-dots): the `INVENTORY` in `hooks/braille.test.tsx` has a Zeile for jede thing the erste drawing zeigt, a test holds both drawings to it, und `scripts/check-surface.mjs` holds that list to the same Zeilen.

Before you senden a ändern, lesen [CONTRIBUTING.md](CONTRIBUTING.md). What der Mod holds to, und the prüfen behind jede point, is in [PRINCIPLES.md](PRINCIPLES.md).

## Lizenz

[MIT](LICENSE)

## Quelle und Lizenz

- Originalautor: alexeyw
- Originalrepository: https://github.com/alexeyw/lot-map
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
