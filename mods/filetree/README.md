<h1 align="center">Claude Code Filetree</h1>

<p align="center">
  An IDE-style Datei tree for Claude Code that zeigt what Claude is doing und where in Dateien
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-%E2%89%A5_2.1.306-D97757?logo=claude&logoColor=fff" alt="Claude Code 2.1.306 or newer">
  <img src="https://img.shields.io/badge/version-0.8.5-blue" alt="Version">
  <img src="https://img.shields.io/badge/type-mod-6f42c1" alt="Claude Code mod">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

<details open>
<summary><b>Claude Code CLI</b></summary>

<p align="center">
  <img src="media/filetree-shimmer.gif" alt="filetree shimmering the file Claude is editing" width="900">
</p>

</details>

<details>
<summary><b>Claude Code in Desktop App</b></summary>

<p align="center">
  <img src="media/0.8.2/desktop-light.png" alt="The file tree in the Desktop app in light mode, with the header buttons including the Clawd shimmer button, the branch row, search row and folders" width="600">
</p>

</details>

**Key features:**

* Show/nav alle Dateien in a Verzeichnis (mit support for Git Status, nvim bindings)
* Animations zeigen where Claude is reading/working
* Keyboard shortcuts:
   * Nav directories mit `z` (zoxide-like)
   * Search mit `s` oder `i` (in highlighted Ordner) oder `q` (in Datei contents)
   * Diff Dateien mit `d` oder alle changed Dateien in a Ordner
* Terminal-first features: File previews, Verzeichnis size treemap, und mehr

---

## Installation

The repo is its own plugin marketplace. Run this in the terminal:

```bash
claude plugin marketplace add data-goblin/claude-code-filetree
claude plugin install filetree@claude-code-filetree
```

Or inside a Claude Code Sitzung:

```text
/plugin marketplace add data-goblin/claude-code-filetree
/plugin install filetree@claude-code-filetree
```

An installieren fails mit `Unrecognized key: "options"` on Claude Code older than 2.1.287: ausführen `claude update`, dann installieren erneut.

## Funktionen

- File tree of the cwd oder a pinned Ordner, mit Git, size, Zeile count und date columns ([tree](docs/tree.md))
- Collapse alle, und expand alle up to three levels deep ([tree](docs/tree.md))
- Symlink arrows, a brain on Agent instruction Dateien, und Nerd Font, plain oder Text glyphs ([tree](docs/tree.md))
- Search by Name across unopened folders, by case oder regular expression, scoped to one Ordner ([search](docs/search.md))
- Search inside Dateien mit `git grep` oder `grep -r`, und öffnen a match at its Zeile ([search](docs/search.md))
- Jump to any Ordner zoxide style mit `z` ([search](docs/search.md))
- Git Status per Datei und Ordner, Zeile counts on changed Dateien, und the Branch mit ahead und behind ([git](docs/git.md))
- Git und GitHub commands Claude runs zeigen as a Status Zeile ([git](docs/git.md))
- Claude's liest, schreibt und commits shimmer in the tree, und automatisch-collapse closes the folders it opened ([activity](docs/activity.md))
- The Activity shimmer setting turns the shimmer off in every Sitzung; the Clawd Schaltfläche in the Desktop app header flips it ([activity](docs/activity.md))
- File references mit a Zeile in Claude's replies become links to that Zeile ([activity](docs/activity.md))
- Follow work moves the Sitzung to the repo Claude works in ([activity](docs/activity.md))
- IDE-style multi-select; the shaded rows go to Claude as Kontext: the selected row, oder up to 100 marked rows ([context](docs/context.md)):
  - klicken selects one row und clears the marks
  - mit rows marked, j / k move nur the cursor, und `v` marks oder unmarks the row under it
  - shift+klicken marks the range von the letzte klicken oder j / k move, in tree order
  - ctrl+klicken marks oder unmarks one row ohne opening it; alt+klicken on macOS
  - double-click oder Enter öffnet a Datei
  - the leeren selection Schaltfläche clears every marked und selected row
  - marked rows zeigen the selection background; `y`, `Y` und `u` copy the shaded rows
  - mit rows marked, the row under the cursor zeigt an accent tint in the Desktop app und the accent cursor mark in the terminal
- Split preview of code, Markdown, Bilder, Video frames, PDF und Word pages ([preview and treemap](docs/preview-treemap.md))
- Treemap of a Ordner by bytes oder Zeilen, mit Claude's activity lit ([preview and treemap](docs/preview-treemap.md))
- Diff of a Datei oder every changed Datei in a Ordner, in the pane oder your diff Werkzeug ([diff](docs/diff.md))
- Open Dateien in their default app, an editor in a tmux oder herdr pane, oder any Befehl ([open](docs/open.md))
- Guard Dateien und folders von Claude's edits, und see Dateien written outside the repo ([guards](docs/guards.md))
- Keyboard-driven: vim-style moves, a shortcuts overlay, und alt+l / alt+h in the terminal ([keys](docs/keys.md))
- `/filetree` commands und where the pane zeigt in the terminal und the Desktop app ([sidebar](docs/sidebar.md))

<img src="media/filetree-git.gif" alt="A committed file shimmers green and the footer shows the commit" width="800">

<img src="docs/media/preview-media.gif" alt="An image, a video, a PDF turned to page 2 and a Word document in the preview" width="800">

## Einstellungen

All settings are in `/config` under filetree, jede mit its own Beschreibung there.

```yaml
Claude activity:  reads and writes | writes | reads | none
Activity shimmer: on | off
Follow Claude:    on | off
Jump moves Claude: tree and Claude | tree
Right-click copies: relative | absolute
Follow work:      on | off
Open at start:    on | off
Focus on open:    on | off
Right column:     date | age | size | loc | files
Date format:      year-month-day | day-month | month-day
Clock:            24h | 12h
Long file:        500 | a line count | off
Remote branch:    off | on
Hints:            on | off
Search spacing:   on | off
Column headers:   on | off
Auto-collapse:    off | on
Shortcuts:        auto | always | off
Open with:        empty | editor | preview | a command with {path} and {dir}
Binary files:     Open with | default app
Edit with:        empty | a command with {path} and {line}
Diff with:        empty | a command such as "hunk diff --" or "lazygit -f"
Diff groups:      folder | kind | off
Terminal target:  auto | pane right | pane below | tab | workspace
Ignore:           names to hide, such as ".cache .tmp"
Preview pane:     bottom | top
Treemap:          auto | image | cells | off
Palette:          key=#hex pairs over the terminal colors
Glyphs:           auto | nerd | plain | text
```

In the terminal the accent colors folders, the root, the cursor, search matches und the top-level boxes of the cells treemap. Es ist the terminal's bright blue mit a dark Claude theme und its blue mit a light one. `accent=#hex` in Palette sets another color for alle of them.

Follow work is described in [Claude activity](docs/activity.md).

Open at starten applies to every neu Sitzung, `/clear` included. When you öffnen oder schließen the tree mit `/filetree`, that choice lasts until the nächste `/clear`. After `/clear`, the tree ist öffnen oder closed as Open at starten says.

## Voraussetzungen

```yaml
required:  Claude Code 2.1.306 or newer, git
optional:
  inotifywait:            live updates on Linux (inotify-tools)
  magick or ffmpeg:       images other than PNG, video frames
  pdftoppm or gs:         PDF pages
  soffice:                Word and office pages
  pandoc, pdftotext:      document text in tmux, herdr and other terminals
  tmux or herdr:          an editor or diff tool in a new pane
  Nerd Fonts 3.2+:        icons for Glyphs auto, which draws plain Unicode without one or with an older one
pictures:  Ghostty or kitty, outside tmux and herdr, on Linux and macOS
```

## Considerations

- The Desktop app has nein split preview oder treemap
- The Desktop app shimmers at most four rows at once; mehr lit rows zeigen in their color ohne the shimmer, while the terminal shimmers them alle. If the pane still floods, the Clawd Schaltfläche in the header oder the Activity shimmer setting turns the shimmer off
- The Desktop app draws at most 150 rows around the cursor, und fewer when rows are deep, have long paths oder zeigen git ändert; a note counts the rows it leaves out
- GIFs und videos zeigen one still frame
- Windows sizes folders through Datei listings, und the treemap draws one level
- Row clicks need herdr 0.9.1 oder later; ausführen `herdr update`

## Contributing

Open pull requests against a release Branch, nicht `main`:

- Fixes: the patch Branch, such as `release/0.8.2`
- Funktionen: the minor Branch, such as `release/0.9.0`

Keep the version of that Branch.

Turn on the git Hooks once per clone. The pre-commit Hook runs the fast prüft in seconds: grep rules, types, oxlint, und `claude plugin validate` when the manifests ändern. The pre-push Hook prüft the version against the release Branch und runs das Plugin tests:

```bash
git config core.hooksPath .githooks
```

The same prüft ausführen on macOS, Windows und Linux in CI on every push that touches das Plugin.

## Lizenz

[MIT](LICENSE). The treemap labels verwenden glyphs von [Terminus Font](https://terminus-font.sourceforge.net/) by Dimitar Zhekov (Lat2-Terminus16, SIL Open Font Lizenz 1.1).

*This Projekt is inspired by my Omarchy app [FileBlade](https://github.com/data-goblin/fileblade)*

## Quelle und Lizenz

- Originalautor: data-goblin
- Originalrepository: https://github.com/data-goblin/claude-code-filetree
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
