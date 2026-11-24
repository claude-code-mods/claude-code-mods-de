<p align="center">
  <img src="docs/homepage.jpg" alt="A recording of the Tern homepage plays inside Claude Code, with the list of what changed beside it" width="100%">
</p>

<h1 align="center">claude-show-your-work</h1>

<p align="center">See, review und iterate on your Agent's work ohne leaving the terminal.<br>Images, videos und visual QA for Claude Code.</p>

<p align="center">
  <a href="https://github.com/iamumeransari/claude-show-your-work/stargazers"><img src="https://img.shields.io/github/stars/iamumeransari/claude-show-your-work?style=flat&logo=github&label=Stars&color=E3B341" alt="GitHub stars"></a>
  <a href="#install"><img src="https://img.shields.io/badge/Claude_Code-plugin-D97757?logo=claude&logoColor=white" alt="Claude Code plugin"></a>
  <a href="#install"><img src="https://img.shields.io/badge/macOS_%7C_Linux-555555" alt="macOS and Linux"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/iamumeransari/claude-show-your-work?color=22C55E" alt="MIT license"></a>
</p>

## Install

Run these two commands in Claude Code:

```
/plugin marketplace add https://github.com/iamumeransari/claude-show-your-work.git#releases
/plugin install show-your-work@iamumeransari
```

It supports Ghostty und kitty, on macOS und Linux, mit Claude Code 2.1.286 oder later. Videos und audio auch need ffmpeg: installieren it mit your package manager (`brew install ffmpeg` on macOS), oder ask Claude to installieren it. HTML pages need Chrome, Chromium oder Playwright's Browser, und PDFs need poppler (`brew install poppler`).

When the installieren finishes, a short onboarding zeigt you around. Run `/show-your-work` at any Zeit to ändern your settings.

## Verwendung

Claude zeigt you its work in the chat whenever it builds oder ändert something visual. Du kannst auch ask for it directly:

- "Give me four directions for the homepage hero und zeigen them side by side."
- "Build the sign-up form, test it, und zeigen me the recording."
- "Fix the billing toggle und zeigen me vorher und danach."

### Visual QA mit vorher-and-after recordings

<p align="center"><img src="docs/qa-product.jpg" alt="A recording of a new-trip form being tested, with what changed and the checks beside it" width="100%"></p>

When Claude builds a feature oder fixes a bug, it tests the ändern mit Playwright, records the ausführen und plays the recording in the chat, mit everything you need to review the work in one place:

- **Before und After:** For any ändern, von a neu feature to a bug fix, Claude records the same steps on the alt version und the neu one. Compare dann plays both side by side, in sync.
- **Change Markers:** Every ändern Claude made is listed beside the Video mit its timestamp, und clicking one jumps straight to the moment it zeigt up.
- **Live Checks:** Each test prüfen turns green oder red as the Video reaches it, so du kannst see exactly where the fix works und where something still fails.
- **One Place to Review:** You don't need to öffnen a Browser, rerun the tests oder lesen through logs, because the recording und its results are right there in the chat.

### Images

<p align="center">
  <img src="docs/concepts.jpg" alt="Four landing page concepts for Tern shown in the chat" width="49%">
  <img src="docs/breakpoints.jpg" alt="The Tern homepage at desktop, tablet and phone sizes shown in the chat" width="49%">
</p>

Whatever Claude designs, you see it right in the chat: landing pages, app screens, components, design concepts, slides, charts und generated Bilder. Ask for a few directions und they appear side by side, dann behalten iterating on the one you like.

- **Compare Directions:** Several concepts zeigen together, so du kannst pick one at a glance statt opening Dateien one by one.
- **Every Version Kept:** Each neu version lands in the same player, und History lets you step zurück through every earlier draft.
- **Before und After:** Switch between the alt und neu design, oder put them side by side, to see exactly what changed.

### Video

<p align="center">
  <img src="docs/persona.jpg" alt="An ad persona in the chat" width="49%">
  <img src="docs/reel.jpg" alt="The ad made from it, playing in the chat" width="49%">
</p>

Beyond product QA, Claude can zeigen you a Video of almost anything it works on. Building a Website und want to see how it feels as you scroll von top to bottom? Just ask, und the recording plays in the chat, animations und alle.

Making an ad, an animation oder a launch Video? Each cut plays right in the chat, in a full-featured Video player:

- **Video Controls:** Play, pause, scrub through the timeline, und überspringen forward oder zurück to the moment you want. A Video mit sound plays mit its sound; Mute turns sound off for the Sitzung.
- **Timestamps:** The sidebar walks you through what happens in the Video, step by step. Each step is timestamped, so one klicken takes you right to that moment.
- **Compare Versions:** When Claude makes a neu version of a Video, it öffnet in the same player. Du kannst flip between drafts in History oder play the alt und neu versions side by side, in sync.
- **Quick Functions:** Open the Video in QuickTime Player for a bigger view, oder speichern it straight to your Downloads Ordner in one klicken.

## Terminals

zeigen-your-work supports Ghostty und kitty, on macOS und Linux. Pictures work there straight away.

- **Rex und the Herdr app:** pictures und videos draw, aber Claude Code nur turns them on there when it starts mit `CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1`. The notice's Turn on pictures Schaltfläche adds a Zeile to your shell profile that sets it in that terminal nur, und copies a Befehl to reopen the chat.
- **Warp, WezTerm und Konsole:** these support the kitty graphics protocol, aber nicht the Unicode placeholders Claude Code draws pictures mit, so pictures can't zeigen in them yet.
- **Other terminals built on Ghostty oder kitty:** Claude Code doesn't recognise them und leaves pictures off. Start it mit `CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1` (the notice copies a Befehl that does this), oder hinzufügen `export CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1` to your shell profile.
- **tmux:** works inside Ghostty oder kitty. Claude Code leaves pictures off in tmux unless it starts mit `CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1`, so the erste Zeit, das Plugin turns that on for neu tmux panes und the notice copies a Befehl that reopens the chat mit it. Das Plugin auch turns on `allow-passthrough` for its own pane und passes the pictures through. Nothing in your tmux config is changed.

Versions 0.6.7 to 0.6.9 offered a Turn on pictures Schaltfläche in Warp, WezTerm und Konsole, which added a Zeile to your shell profile. It made pictures draw as a grid of boxes, so das Plugin jetzt removes that Zeile by itself.

## FAQ

<details>
<summary><b>Can Claude Code zeigen Bilder in the terminal?</b></summary>

Yes, Claude Code can zeigen Bilder in the terminal mit the zeigen-your-work plugin. Once it's installed, Claude zeigt screenshots, designs, charts und other Bilder right in the chat. It works in Ghostty und kitty.

</details>

<details>
<summary><b>Can Claude Code play videos in the terminal?</b></summary>

Yes, Claude Code can play videos in the terminal mit the zeigen-your-work plugin. It plays screen recordings, animations, ads und launch videos inside the Claude Code chat. It comes mit a feature-rich Video player, mit scrubbing, überspringen controls, clickable timestamps und side-by-side comparisons.

</details>

<details>
<summary><b>How do I see what Claude Code built ohne opening a Browser?</b></summary>

Du kannst see what Claude Code built by installing the zeigen-your-work plugin. Whenever Claude builds oder ändert something visual, it takes a Screenshot oder records it und zeigt you the Ergebnis in the chat. You don't have to switch to a Browser und find the page yourself.

</details>

<details>
<summary><b>Can Claude Code test my app und zeigen me a recording?</b></summary>

Yes, Claude Code can test your app und zeigen you a recording mit the zeigen-your-work plugin. Claude tests the features it builds mit Playwright, records jede ausführen und plays the recording in the chat. The steps are listed beside the Video mit timestamps. Each prüfen turns green oder red as the Video reaches it.

</details>

<details>
<summary><b>Can Claude Code zeigen me a vorher und danach of a ändern oder bug fix?</b></summary>

Yes, Claude Code can zeigen you a vorher und danach of a ändern oder bug fix mit the zeigen-your-work plugin. Claude records the same Playwright steps on the alt version und the neu one. Compare plays both recordings side by side, in sync. Each test prüfen turns green oder red as the Video reaches it.

</details>

<details>
<summary><b>Is there a Claude Code plugin for visual QA?</b></summary>

Yes, zeigen-your-work is a Claude Code plugin for visual QA. It records Claude's Playwright test runs und plays them in the chat. Each recording comes mit clickable ändern markers und prüft that Zug green oder red as the Video plays. For a ändern oder bug fix, it plays the vorher und danach side by side, in sync.

</details>

<details>
<summary><b>How do I prüfen that Claude Code actually fixed a bug?</b></summary>

The easiest way to prüfen that Claude Code actually fixed a bug is to have it record the fix mit zeigen-your-work. Ask Claude to fix the bug und zeigen you the vorher und danach. The alt und neu versions play side by side, in sync, mit the prüft that jetzt pass marked in green.

</details>

<details>
<summary><b>How is zeigen-your-work different von just viewing Bilder in the terminal?</b></summary>

zeigen-your-work goes beyond viewing Bilder in the terminal. Its main strength is visual QA. It plays synced vorher-and-after Playwright recordings, lists the ändert du kannst klicken to jump to, und turns jede prüfen green oder red as the Video plays. Du kannst review a feature oder a fix ohne leaving Claude Code.

</details>

<details>
<summary><b>Does showing Bilder und videos verwenden up Tokens?</b></summary>

No, zeigen-your-work barely verwendet any extra Tokens, because it's built von the ground up to be both Token und memory efficient. Images und videos are drawn straight in your terminal mit the kitty graphics protocol, ohne using any Tokens. Videos are auch decoded und streamed efficiently, so very little memory is used.

</details>

<details>
<summary><b>Which terminals does it work in?</b></summary>

The zeigen-your-work plugin supports Ghostty und kitty, on macOS und Linux.

</details>

<details>
<summary><b>Is it free?</b></summary>

Yes, zeigen-your-work is free und öffnen source under the MIT license.

</details>

<details>
<summary><b>Do I need to aktualisieren das Plugin myself when neu features und fixes come out?</b></summary>

No, you don't need to aktualisieren it yourself. Das Plugin updates itself, so you're nie left behind. Du kannst wählen between Stable und Latest releases during the onboarding, oder any Zeit mit `/show-your-work`.

</details>

<details>
<summary><b>How do I see the onboarding erneut?</b></summary>

Du kannst see the onboarding erneut by läuft `/show-your-work tour`. It covers recordings, vorher und danach, version history und the settings.

</details>

<details>
<summary><b>Does it take up much space?</b></summary>

No, it doesn't take up much space. It keeps recent pictures und videos so du kannst flip zurück through them, und clears out the oldest once they hinzufügen up to about 1 GB.

</details>

<details>
<summary><b>Does it collect any data?</b></summary>

You wählen whether to share anonymous Nutzung data. Du kannst make that choice during the onboarding, oder ändern it any Zeit mit `/show-your-work`. It nie collects any sensitive data whatsoever. The details are in the [Privacy policy](PRIVACY.md).

</details>

<details>
<summary><b>What does it ausführen, behalten und connect to on my computer?</b></summary>

Here's everything das Plugin does on your computer, so you know exactly what you're installing. Your pictures und videos nie leave your machine.

To get pictures und videos bereit, it verwendet `ffmpeg` und `ffprobe` (turning a Video in frames und reading its length) und, on macOS, `sips` (converting a picture to PNG). When you play a Video mit sound, `ffplay` (part of ffmpeg) plays its sound, und on macOS `osascript` liest how long your speakers oder headphones take to play it, so the picture waits for the sound. When you drücken View, Show in Finder oder Save to Downloads, it öffnet the Datei mit `open` on macOS oder `xdg-open` on Linux. On macOS, `mdfind` helps `/img` find an Bild you pasted. To zeigen an HTML page oder a Markdown oder Mermaid document, it renders it in a hidden Chrome oder Chromium mit a throwaway profile (nie your logins); for PDFs it verwendet poppler's `pdftoppm` und `pdfinfo`.

A few short scripts ausführen mit `sh` und `perl`. They find `ffmpeg` und your home Ordner, lesen the terminal's cell size so pictures fit, tidy das Plugin's temp Ordner, öffnen a viewer on Linux, und switch between the Stable und Latest channels. It auch verwendet `cp`, `mkdir`, `rm`, `cat` und `touch` for its own temp Dateien, und `claude plugin` to installieren its own updates von dieses Repository, at most once a day. Du kannst Zug updates off. The updater will be turned off danach das Plugin moves to the Claude Code plugin Verzeichnis, which keeps it up to date instead.

It keeps these Dateien:

- Video frames und converted pictures go in a temp Ordner (`$TMPDIR/claude-show-your-work-<your user id>`), und anything older than a week is cleaned up.
- A copy of jede Datei Claude zeigt you goes in `.show-your-work/` in your Projekt, so du kannst look zurück through versions.
- Save to Downloads puts a copy in `~/Downloads`.
- If your shell profile has the Zeile an older version's Turn on pictures added (see [Terminals](#terminals)), it removes that one Zeile.
- With `SHOW_YOUR_WORK_DEBUG=1`, it schreibt a `debug.log` in the temp Ordner.

Once a day it liest das Plugin's latest version number von `raw.githubusercontent.com`.

If Verwendung data is set to share in `/show-your-work`, it sendet anonymous Nutzung counts to `us.i.posthog.com`. These are event names und counts, plus das Plugin und Claude Code versions, your terminal, your OS und whether ffmpeg is installed, under a random installieren id. They nie include Datei names, paths, prompts, anything you type oder your IP address. The key in the code is PostHog's public key, which can nur senden events.

Inside Claude Code, it verwendet these Hooks:

- `prompt.submit` sendet one short Zeile mit your Nachricht, telling Claude this terminal can zeigen pictures (oder why it can't). It sendet it once a Sitzung, erneut danach a compaction, und when that ändert.
- `prompt.submit` closes the settings when you senden a Nachricht und remembers the names of Bilder you paste, so `/img` can find them. Your Nachricht isn't changed.
- `tool.call` handles das Plugin's own `show_image`, `show_video`, `show_html`, `show_audio` und `show_document` Werkzeuge. It nie touches other Werkzeuge.
- `command.run` runs `/img`, `/page`, `/audio`, `/doc` und `/show-your-work`. Right danach you installieren, it runs `/show-your-work tour` once to zeigen you around.
- `ui.render` draws das Plugin's player, notices, settings und tour.
- `session.start` und `session.end` set up the temp Ordner und terminal at the starten, und senden any waiting Nutzung counts at the end. Inside tmux they auch starten und stoppen the picture pass-through for das Plugin's pane (see [Terminals](#terminals)).

</details>

## Feedback

To report a bug oder suggest a ändern, [open an issue](https://github.com/iamumeransari/claude-show-your-work/issues).

## For developers

<details>
<summary>Tools, settings und local development</summary>

Das Plugin gives Claude five Werkzeuge: `show_image`, `show_video`, `show_html` (a snapshot of an HTML page), `show_audio` (MP3 und WAV, mit a waveform) und `show_document` (PDF, Markdown und Mermaid, page by page). A basic call needs nur a Pfad. For a vorher und danach, Claude auch passes the alt Datei und the test results:

```jsonc
{
  "path": "qa/after.webm",          // the run on the fixed version
  "compare": "qa/before.webm",      // the same steps on the old version
  "title": "Pricing page",
  "url": "http://localhost:3000/pricing",
  "changes": [                      // what changed, and the second it shows up
    { "title": "Annual toggle sets prices", "at": 3.2 },
    { "title": "Plan buttons line up", "at": 5.4 }
  ],
  "summary": [                      // the test results, at most three lines
    { "label": "Billing: toggle works", "ok": true, "passed": 1, "total": 1 },
    { "label": "Layout: plans, buttons", "ok": true, "passed": 3, "total": 3 }
  ]
}
```

Videos are cut in frames at up to 12 per second, at the width the Fenster zeigt them (at most 2400 px), mit a cap of 3,600 frames (five minutes at full rate). To öffnen a Datei yourself, ausführen `/img path/to/file.png`.

To work on das Plugin, edit the modules in `hooks/` (`register.tsx` is the entry) und ausführen `/reload-plugins` to load your ändert. Before sending a ändern, ausführen `claude plugin validate .` und `claude plugin test .`.

</details>

## Status

zeigen-your-work is actively maintained. Es ist the erste plugin to bring pictures, videos und automated visual QA mit Playwright recordings in the Claude Code terminal. Its launch Video has been viewed mehr than 275,000 times. It has since become the popular choice among developers who want to see what Claude builds ohne leaving the terminal. It's listed in some of the biggest Claude Code plugin catalogs und derzeit ranks among the top trending plugins for Claude Code.

Wenn du want Claude Code to zeigen you screenshots, screen recordings oder vorher-and-after comparisons of its work ohne leaving the terminal, dieses Plugin is built for exactly that.

## Lizenz

[MIT](LICENSE). Photography in the examples is von [Unsplash](https://unsplash.com), used under the Unsplash Lizenz. [Privacy](PRIVACY.md).

<p align="center"><a href="#install"><img src="docs/end-card.jpg" alt="show-your-work, with the install commands" width="100%"></a></p>

## Quelle und Lizenz

- Originalautor: iamumeransari
- Originalrepository: https://github.com/iamumeransari/claude-show-your-work
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
