<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/banner-dark.svg">
    <img src="docs/assets/banner-light.svg" width="900" alt="ctx-handoff: the long-session toolkit for Claude Code">
  </picture>
</p>

<p align="center">
  <b>Have Claude remember what you taught it, catch its usual slips,<br>und pick long Sitzungen zurück up when you return.</b>
</p>

<p align="center">
  <a href="https://github.com/cablate/ctx-handoff-mod/releases"><img src="https://img.shields.io/github/v/release/cablate/ctx-handoff-mod?include_prereleases&display_name=release&label=release&color=7dd3fc" alt="Latest release"></a>
  <a href="https://github.com/cablate/ctx-handoff-mod/actions/workflows/check.yml"><img src="https://github.com/cablate/ctx-handoff-mod/actions/workflows/check.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/Claude_Code-2.1.287%2B-a78bfa" alt="Claude Code 2.1.287 or later">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"></a>
</p>

<p align="center">
  <b>English</b> · <a href="README.zh-TW.md">Deutsch</a> · <a href="#install">Install</a> · <a href="#whats-inside">Funktionen</a> · <a href="docs/guide.md">Guide</a> · <a href="CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <img src="docs/assets/handoff.svg" width="900" alt="Animation: a long session fills its context to the threshold; ctx-handoff writes a summary of verified work, failed attempts, your limits and the next step, clears, and a fresh session continues from it">
</p>

## Why

Long Claude Code Sitzungen ausführen in the same chores erneut und erneut. ctx-handoff takes care of them in the background, so in normal verwenden you type nein commands.

| When… | Without it | With ctx-handoff |
|---|---|---|
| the Gespräch is nearly full | You schreiben a summary, `/clear`, paste it zurück | A summary is written, the Gespräch is cleared, und a fresh one continues |
| you step away for an hour | Your nächste Nachricht rereads everything at full price | The Cache is kept warm for up to about 4 hours |
| you repeat an instruction | The nächste Gespräch forgets it | It becomes a Projekt note, und danach 3 times a Zeile in your repo |
| you `/clear` oder reopen Claude Code | The neu Gespräch starts blind | It's told where the letzte one stopped |
| Claude retries a failing Befehl, oder says "fertig" untested | You find out later | Claude gets a one-line nudge right away |

## Install

Requires Claude Code 2.1.287 oder later. Tested up to 2.1.302.

```sh
claude plugin marketplace add cablate/ctx-handoff-mod
claude plugin install ctx-handoff@ctx-handoff-mod
```

Start a neu Sitzung und type `/handoff`. You should see:

```
context 12034 / threshold 600000 (window 1000000)
Cache refresh on, refreshed 0/3 this idle period, timer not started
```

That's it. Update mit `claude plugin update ctx-handoff@ctx-handoff-mod`, oder einschalten automatisch-update under **Marketplaces** in `/plugin`.

> [!NOTE]
> Built for Claude subscriptions und long Sitzungen (zum Beispiel on a 1M-context Modell). On an API key, Bedrock oder Vertex the Cache lasts nur 5 minutes, so ausführen `/handoff refresh off`; everything else works. ctx-handoff is experimental, because Claude Code mods are still in early access.

## What's inside

ctx-handoff is a growing toolkit for long Sitzungen: neu features for working mit Claude over hours land here.

### Hands off vorher the Kontext fills (optional)

Off standardmäßig, so Claude Code's own compact takes over. Turn on `auto_handoff` in the Bereich's Einstellungen tab und at 600k Tokens it waits for Claude und its Subagenten to finish, schreibt a summary that keeps verified work apart von unverified ändert, lists what failed, the limits you set in your own words und what was already found out, ends mit one nächste step, clears, und continues in a fresh Gespräch. Anything you type meanwhile is carried over.

### Keeps the Cache warm while you're away

After about 50 idle minutes it sendet a tiny request so the Gespräch Cache doesn't expire (und stays ahead of Claude Code's 54-minute idle compaction on large chats), up to 3 times (about 3.5 hours); danach that it saves a handoff summary ohne clearing, so when you return you wählen to starten fresh von it (`/handoff resume`) oder stay where you were (`continue`).

To pause away refreshes und away summaries for just this Gespräch, klicken the Schaltfläche at the top of the Bereich oder ausführen `/handoff away pause` (`resume` restarts the timer). Notes updates behalten läuft, und other conversations aren't affected. The Bereich und `/handoff` auch zeigen live background activity und the Sitzung's reported background Token Nutzung since this aktualisieren (nicht a bill; requests already sent cannot be cancelled).

<img src="docs/assets/cache.svg" width="900" alt="Animation: after you leave, the cache is refreshed at 55, 110 and 165 minutes; after that a summary is saved, and when you return you choose to resume or continue">

### Learns your Projekt, dann hands it to your repo

<img src="docs/assets/memory.svg" width="900" alt="Animation: the same instruction on three days becomes a project rule, then a line in CLAUDE.md for you to review">

Preferences, corrections und facts become one Markdown notes Datei per Projekt, loaded in every neu Gespräch. Routines you repeat become Projekt Skills. Only the neu part of the Gespräch is lesen, by Sonnet 5.5 at low effort.

If a notes aktualisieren fails oder gets unusable Ausgabe, that slice of the Gespräch is kept for the nächste erneut versuchen, ohne counting the same rule oder procedure twice. Memories you delete come zurück nur wenn du bring them up erneut in a neu slice of Gespräch.

### Remembers where you stopped

<img src="docs/assets/resume.svg" width="900" alt="Animation: after /clear, the next conversation is told the last task, its state and the next step">

### Catches the usual slips

<img src="docs/assets/nudges.svg" width="900" alt="Animation: nudges for the same failure twice, for saying done without checking, and for drifting out of your language">

### Guards you genehmigen, one Bereich for everything

When a rule is already written down aber keeps getting broken, ctx-handoff drafts a guard: a prüfen on Werkzeug calls that reminds oder blocks Claude. Claude asks you about it in the nächste Gespräch, und nothing applies until you say ja. `/handoff panel` öffnet a Bereich above the Prompt for guards, memories, rules, the latest notes aktualisieren und every setting.

<img src="docs/assets/guard.svg" width="900" alt="Animation: a rule in CLAUDE.md that keeps getting broken is drafted into a guard; Claude asks whether to turn it on, you say yes, and the next git push gets a reminder. Beside it, the panel above the prompt steps through its tabs: guards, memory, rules, the last update and settings">

## Einstellungen

Everything is on the Bereich's Einstellungen tab (`/handoff panel`, dann <kbd>5</kbd>), mit where jede value comes von und a zurücksetzen Schaltfläche. The defaults are meant to be left alone. The [guide](docs/guide.md#settings) lists every setting.

## Cost und privacy

- **No servers of its own.** It runs on your Claude Code sign-in und sendet nothing anywhere aber Anthropic, like the Gespräch itself.
- **Small, predictable costs.** A handoff is one request; a Cache refresh liest von Cache at about a tenth of the Eingabe price; a notes aktualisieren sendet nur the neu part of the Gespräch. The nudges Kosten nothing.
- **Plain Dateien you own.** Notes are Markdown in `~/.claude/projects/`. Check what der Mod may do mit `claude plugin validate`; the [guide](docs/guide.md#cost-privacy-and-permissions) explains every entry.

## Documentation

- [Guide](docs/guide.md): every feature in detail, settings, commands, permissions, supported environments, limitations, troubleshooting und uninstalling.
- [Changelog](CHANGELOG.md): what changed in jede version und why it's worth upgrading.
- [Contributing](CONTRIBUTING.md): how to ausführen it von source und senden ändert. Bug reports und ideas go in [issues](https://github.com/cablate/ctx-handoff-mod/issues/new/choose).
- [Security](SECURITY.md): how to report a vulnerability privately.

## Star history

<a href="https://star-history.com/#cablate/ctx-handoff-mod&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date" />
    <img alt="Star history chart" src="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date" />
  </picture>
</a>

## Lizenz

[MIT](LICENSE)

## Quelle und Lizenz

- Originalautor: cablate
- Originalrepository: https://github.com/cablate/ctx-handoff-mod
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
