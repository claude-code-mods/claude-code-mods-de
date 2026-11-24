<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo.svg">
    <img src="docs/logo-light.svg" width="72" height="72" alt="tokendoctor">
  </picture>
</p>

<h1 align="center">tokendoctor</h1>

<p align="center">
  <strong>The same Claude Code for up to 38% weniger</strong>
  <br>
  Replays your own past Sitzungen to zeigen what jede ändern would have gespeichert, dann ändert nur what you pick.
</p>

<p align="center">
  <a href="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml"><img src="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/github/v/tag/localixai/tokendoctor?label=version" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#install">Install</a> &bull;
  <a href="https://tokendoctor.localix.ai/docs">Docs</a> &bull;
  <a href="https://tokendoctor.localix.ai">Website</a> &bull;
  <a href="CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <img src="docs/demo.gif" alt="tokendoctor in a real Claude Code session: /tokendoctor:sessions, then the daily trend" width="880">
</p>

**Your past Sitzungen decide, nicht anyone's benchmark.** What a setting saves depends on how you
work: how long your Sitzungen ausführen, which Modelle you verwenden, what the work is. A number von someone
else's Sitzungen, mine included, says little about yours. So tokendoctor starts by looking zurück at
your own.

**① Look zurück at your letzte 30 days.** `/tokendoctor:sessions` replays every Sitzung you had,
request by request, at compaction windows of 200K, 300K, 400K und 600K, und zeigt what jede would
have Kosten. It nur liest your transcripts, makes nein Modell calls und ändert nothing. The figure is
an upper bound: a replay can't see work the Modell would have redone danach a summary.

**② Change nur what your Sitzungen zeigen pays, und undo it.** `/tokendoctor:optimize` proposes
ändert von those numbers und prüft your settings against Claude Code's docs; it applies nur the
ones you pick, jede shown as a diff erste. `/tokendoctor undo` puts any of them zurück.

**③ Optional: slide statt summarize.** When Claude Code would stoppen to summarize the
Gespräch, tokendoctor drops alt Werkzeug Ausgabe instead und keeps every Nachricht. Es gibt nein Modell
call, so it takes milliseconds, nicht a minute.

## Install

```bash
claude plugin marketplace add localixai/tokendoctor
claude plugin install tokendoctor@tokendoctor
```

Restart Claude Code und ausführen `/tokendoctor:sessions` to see what your letzte 30 days would have Kosten
at jede Fenster. Nothing ändert until you pick it.

## What it found in mine

Every request sendet the whole Gespräch to the Modell. On Modelle mit a 1M Fenster, Claude Code
compacts nur near 967K Tokens, so the end of a long Sitzung is the expensive part. For me, two
thirds of main-thread Kosten went to requests mit mehr than 400K in Kontext.

So I set a 400K Fenster und Sonnet for Subagenten. Comparing the month vorher mit the week danach,
about 23K und 19K main-thread requests, Kontext per request went von 412K to 219K und Kosten per
request fell 38% at API list prices. That's one person's vorher und danach, nicht a controlled
experiment.

The catch is mehr summaries, und jede is a pause: 79 seconds on average in my Sitzungen. That's
what the slide is for. Your Sitzungen may zeigen something else entirely, which is the point of
looking at them erste.

## What the benchmark zeigt

On the [benchmark](bench/README.md), Claude Code builds a TypeScript Projekt against tests it
can't ändern, so a ausführen counts nur if the tests pass. Cost is per Aufgabe, on Haiku 5.5:

| Compared | Cost | Time |
| --- | --- | --- |
| Slide against a summary, a day of work | −19% | −33% |
| Slide against a summary, an eval harness | −35% | −28% |
| Slide against a summary, a short Aufgabe | +6% | −17% |
| The settings advice alone, against Claude Code as it ships | dearer in 3 of 4 runs | |
| The advice und the slide, a week of work | −11% to −21% | |

Every test passed in every ausführen. The advice alone didn't pay here because these Aufgaben rarely pass
400K, which is where the Fenster starts to matter. If your Sitzungen don't either, your replay will
zeigen it, und you should leave your Fenster alone. Every ausführen, the losing ones too, is in
[bench/HISTORY.md](bench/HISTORY.md).

<p align="center">
  <img src="docs/dashboard.png" alt="The author's tokendoctor dashboard: 57% of the spend was Claude re-reading the conversation" width="880"><br>
  <sub><code>/tokendoctor:Dashboard</code>: where every Token went, by day, Modell, Subagent und Projekt. One local Datei; this one is mine.</sub>
</p>

## Befehle

| Command | What it does |
| --- | --- |
| `/tokendoctor:sessions [days]` | Replays your past Sitzungen (30 days, oder `days`) at smaller windows: what jede would have gespeichert, dann where your Tokens went. Reads nur. |
| `/tokendoctor:audit` | Your settings, memory und CLAUDE.md checked against the docs, by severity. Reads nur. |
| `/tokendoctor:dashboard [days]` | Opens a local Dashboard of every Sitzung on this machine. |
| `/tokendoctor:optimize [focus]` | Proposes up to five ändert von your numbers und applies the ones you pick. |
| `/tokendoctor [name] [value]` | Shows, explains oder ändert a setting, mit nein Modell call. |
| `/tokendoctor undo [n]` | Lists every ändern tokendoctor made und puts one zurück. |

Nothing leaves your machine: the nur network call is to two public pages of Claude Code's docs,
once a day. It nie switches your Modelle on its own.

## Documentation

**[tokendoctor.localix.ai/docs](https://tokendoctor.localix.ai/docs)** has the rest: the
[38 checks](https://tokendoctor.localix.ai/docs/audit), every
[setting](https://tokendoctor.localix.ai/docs/settings),
[how the slide works](https://tokendoctor.localix.ai/docs/slide) (und Team und Enterprise
logins), the commands von a shell, the [measurements](https://tokendoctor.localix.ai/docs/proof)
und the [limits](https://tokendoctor.localix.ai/docs/limits). To work on tokendoctor itself, see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Lizenz

MIT

## Quelle und Lizenz

- Originalautor: localixai
- Originalrepository: https://github.com/localixai/tokendoctor
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
