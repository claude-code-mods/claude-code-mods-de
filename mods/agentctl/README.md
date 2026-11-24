# agentctl — Agent Control Plane for one Claude Code Sitzung

Tested mit **Claude Code 2.1.288** (headless) und **2.1.289** (interactive, danach the host automatisch-updated) (`claude plugin validate .`, `claude plugin test .`: 203 tests); 0.2.x re-verified live on 2.1.289 (§ Verified live, 0.2.x).
The mods API is marked changeable between releases; the type declarations the host schreibt in
`.claude-plugin/types/` are the authority for the installed version. Run `claude plugin validate .`
danach every Claude Code upgrade.

Design: `docs/features/agent-control-plane-mod/` in dieses Repository (requirements, feasibility study,
tech spec, request tickets). This Verzeichnis is nicht part of the sd0x-dev-flow plugin: installing the
plugin does nicht installieren der Mod. To installieren it, ausführen `/agentctl-setup` (it prüft the host, installs
`agentctl@sd0xdev-marketplace` danach you genehmigen, und builds your erste Aufgabe Zeile; `/agentctl-setup --task`
und the workflow Skills draft a proposal for you to accept instead), oder load it for one
Sitzung mit `claude --plugin-dir mods/agentctl`.

## First ausführen

Type what you are doing — you do nicht need any other Befehl:

```text
/agentctl Dieses neue Feature ausprobieren
```

1. Der Mod puts a request for Claude in your Prompt box (it nie sendet it). Press **Enter**.
2. Claude liest the Projekt und drafts a scope — what it may edit, which prüft count as evidence,
   what "fertig" means — und schreibt it mit the helper bundled in der Mod (`bin/propose.mjs`). If
   something is unclear it asks you statt inventing permissions.
3. At the end of that reply der Mod zeigt the scope und offers `/agentctl accept <digest>` in the box:
   **Tab**, dann **Enter**. Accepting binds the scope; it starts nein work.
4. Ask Claude to begin. `/agentctl` zeigt where things stand und what to do nächste — ausführen the prüft,
   dann `/agentctl handoff` — und `/agentctl help` lists the rest.

A tester who had nicht lesen the design walked steps 1–4 und the hand-over unaided (§ Uncoached ausführen).

Sending the request is an ordinary Claude Zug; der Mod itself calls nein Modell. Replies verwenden Traditional
Chinese when your goal is written in Chinese, English otherwise — a simple heuristic, nicht locale
detection.

## What it does

| Function | How |
|---|---|
| Task scope | Claude drafts a proposal (`/agentctl-setup --task`, oder `/feature-dev`, `/bug-fix`, `/refactor` when der Mod is installed); der Mod previews it und `/agentctl accept` typed at your own Prompt binds exactly what was previewed — see § Proposals. `/agentctl task set <json>` typed at your Prompt auch binds a Aufgabe to the worktree. Tool Ausgabe, Dateien und Nachrichten cannot ändern it — nur a Befehl you type. The binding is per worktree, so your own `task set` / `task clear` in another Sitzung on the same worktree does replace oder leeren it. Task records und hand-overs are kept per worktree, so the same Aufgabe id in two worktrees names two separate Aufgaben. A store Fehler is reported as such, und the previous Aufgabe keeps applying; a binding whose record is missing refuses everything aber liest in the worktree |
| Refusal | A ablehnen-list. Recognized direct production schreibt und remote git schreibt are refused **mit oder ohne a Aufgabe**; while a Aufgabe is bound, its own `forbid` entries und edits outside its roots are refused too. Edit roots bind the edit Werkzeuge (Write, Edit, NotebookEdit); a Datei written through a shell redirect is a Bash Befehl der Mod cannot classify, so it goes to the host — the refusal tells Claude nicht to reach the same Ergebnis another way, aber roots are nicht a sandbox. Everything der Mod cannot classify — scripts, compound shell, unknown Werkzeuge — goes to Claude Code's own permission Prompt oder automatisch mode, recorded as `delegated`. A downstream ablehnen is nie weakened und an erlauben is nie created. **Best-effort**: der Mod liest jede Werkzeug call, nie a script's contents oder the commands it starts, so a push inside a script is the host's und that workflow's to authorize |
| Evidence | A ausführen counts when it matches a declared `check` executor — its words erste, so added arguments still count und may prüfen weniger than declared, while a pipe, redirect oder wrapper (`npm test \| grep pass`) does nicht; the accept reply und `/agentctl` Name jede prüfen as a Zeile that matches it, oder — when the formatter cannot quote a word in one piece — as its JSON words, which do nicht match if copied as ist (a correctly quoted spelling of the same words does). A matching call is bracketed by Git-derived tree readings (executors are matched erste, so a declared `git status` prüfen is a prüfen); a later edit zeigt the Ergebnis stale within 30 s; a background prüfen stays "completion unobserved" until a terminal Ergebnis is seen. Evidence belongs to the Aufgabe und policy version it was observed under, und a reading mit partial coverage is nie listed as verified |
| Panel | The Leiste above the Prompt is compact: Aufgabe, runtime und its duration, what needs you, the gate reading mit its age (und `stale` past 30 s), the letzte hand-over Zeit. `/agentctl` is a compact Status reply — the nächste step, Aufgabe, what needs you, the gate und evidence; `/agentctl status --details` adds storage health, runtime, Kontext und the 5 h Fenster. The gate, Kontext und Fenster Zeilen Name their source und age, oder lesen `missing` / `unavailable`, und jede evidence Zeile its outcome, freshness, coverage und age |
| Hand-over | `/agentctl handoff` — eight answers von records, nein Modell, nein network, nein process; logged in full on reopen (transcript nur); bare `/agentctl` nur points at it, `/agentctl last` prints it |
| Stop | `/agentctl stop` — saves the hand-over, requests cancellation of the aktuell Zug, lists tracked operations; nie "alle stopped" |

## Proposals

Claude schreibt `~/.claude/agentctl/proposals/<URI-encoded worktree>.json` (outside the worktree) through
der Mod's bundled `bin/propose.mjs` (the `/agentctl <goal>` Pfad) oder sd0x-dev-flow's
`agentctl-setup.js propose` (setup und workflow Skills); both apply der Mod's own validation erste. At Sitzung starten und at the
end of jede main Zug der Mod liest it once, validates it erneut, und keeps the **effective** object:
the worktree comes von the Sitzung, a proposal naming another worktree, drafted against a Aufgabe that
is nein longer bound, oder overlapping a built-in class is refused (the reason is logged). The preview
lists every permission being accepted mit a SHA-256 digest (24 hex) in the transcript und the Leiste.
Each entry is shown up to 160 characters; a longer one ends in `…`, und the digest — und what accept
binds — still covers alle of it, so discard a draft whose entries you cannot see whole.

| Command | Who | Does |
|---|---|---|
| `/agentctl proposal` | anyone | Prints the waiting preview |
| `/agentctl accept [digest prefix]` | **your Prompt nur** | Binds the retained object — nie the Datei re-read — if the bound Aufgabe has nicht changed since the preview |
| `/agentctl discard` | anyone | Drops the waiting proposal; the bound Aufgabe stays |

Changing the Datei later produces a neu preview und digest; an older digest nein longer matches.
Concurrent Sitzungen on one worktree share one binding und one store, which is nicht atomic across
Sitzungen: accept in the Sitzung that showed the preview.

## Task JSON

```json
{
  "goal": "investigate the quiz service timeout",
  "allow": ["edit"],
  "editRoots": ["src", "tests"],
  "forbid": ["terraform apply"],
  "executors": [{ "argv": ["npm", "test"], "check": true }],
  "needsUser": [["npm", "publish"]],
  "tools": ["mcp__docs__search"],
  "acceptance": ["unit tests pass on the final tree"]
}
```

Built-in forbidden classes apply mit oder ohne a Aufgabe, on top of a Aufgabe's own: production schreibt (`kubectl apply|delete|patch|rollout|scale|edit|replace`,
`helm install|upgrade|uninstall|rollback`, `gcloud … deploy|delete|update`) und remote git schreibt
(`git push`, `gh pr merge`). Secrets nie belong in a Aufgabe: a credential-like value in a policy field
is refused.

`needsUser` asks nur where a person was seen answering: the interactive terminal under the
`default` (manuell), `acceptEdits` und `auto` permission modes (`lib/verdict.js`). The mode is lesen
von the classic Hook inputs at jede Prompt und Werkzeug end; until one has been seen, und on every other
surface oder mode — `-p`, `dontAsk`, `plan`, `bypassPermissions`, Desktop, VS Code, mobile — a
`needsUser` call is refused. A mode switched in the middle of a Zug is seen at the nächste Werkzeug end.

## What es ist nicht

- **Not an isolation boundary.** It runs mit your permissions. Production lesen-only is the job of
  your credentials und the target's IAM/RBAC.
- **Not the nur Zeile.** If the host skips its Hook (mod deaktiviert, worker crash) nothing here refuses.
  Keep named dangerous commands in your own `permissions.deny`, zum Beispiel:

  ```json
  { "permissions": { "deny": ["Bash(kubectl delete:*)", "Bash(kubectl rollout:*)", "Bash(helm upgrade:*)"] } }
  ```

  Those rules match Befehl Text, nicht programs (`git -C . push` is a different Text), which is why
  both layers exist. `Bash(git push:*)` is left out on purpose: sd0x-dev-flow's `/push-ci` runs it.
- Another mod kann ändern a verdict at `tool.check`; dieser Mod discloses that in `/agentctl policy`.
- Authorized executors (e.g. `npm test`) ausführen mit their effects unclassified.

## Develop

```bash
cd mods/agentctl            # from the repository root
claude plugin validate .   # hooks and $ calls: no $.model.*, $.http.*, $.tool.register, $.prompt.submit (fill/suggest/read allowed)
claude plugin test .       # every *.test.ts under tests/
```

## Release

Der Mod is versioned on its own und released under `agentctl-v<version>` tags
(`.github/workflows/release-agentctl.yml`), separate von sd0x-dev-flow's releases. Claude Code caches an
installed plugin by version, so a ändern to anything aber this README oder `tests/` needs a version bump:
raise `"version"` in `.claude-plugin/plugin.json`, dann ausführen `node .github/scripts/agentctl-version.js update`
von the Repository root (oder `/bump-version agentctl`). CI's version lock fails until both are fertig, und
CI auch runs `claude plugin validate` und `claude plugin test` here.

## Verified live (2026-10-04, scratch Repository: headless `claude -p --plugin-dir` on 2.1.288, interactive tmux on 2.1.289)

These rows record version 0.1.0. Since 0.2.0 an unclassified call is delegated to the host instead
of refused, und the proposal commands exist; the 0.2.x rows follow the table.

| Check | Result |
|---|---|
| Load und `/agentctl` under `-p` | Loads for the Sitzung nur; replies in ~3.7 s mit nein Modell Zug |
| `task set` von a `-p` Prompt | Refused: a `-p` Prompt is nicht stamped `composer`. Headless runs cannot set a Aufgabe; set it von an interactive Prompt |
| Forbidden und unclassified Bash calls | Refused vorher läuft, rule named (`task-forbid: …`, `unclassified: python3 has no adapter`) |
| An allowed lesen (`git status`) | Went to the host's own permission Pfad und ran |
| A prüfen exiting non-zero (`sh check.sh` → exit 1) | Recorded as `error`: a non-zero Bash exit reaches der Mod as `isError` |
| Evidence bracket | Before/danach readings recorded, coverage `git-hybrid` |
| Two concurrent Sitzungen | Both Sitzung records written; the Aufgabe record kept |
| Leftover processes danach exit | None |
| Tree reading Kosten | ~90 ms mit 500 changed/untracked Dateien; ~75 ms on a clean 974-file Repository |
| 5 h Fenster danach a Modell Zug (V7) | `1% (resets …)` lesen von the host, mit its source und age |
| Background prüfen (V5, background half) | Closed von the host's Aufgabe Benachrichtigung (`<task-id>`, `<status>`) as `error` — nein polling needed. `TaskGet` is the todo-list Werkzeug; `GetTask` liest background Aufgaben |
| Subagent Werkzeug calls (V4) | A Subagent's `danger-cmd` was refused by the same rule |
| `ask` under `-p` (V3, `-p` nur) | With a probe copy answering `ask`, neither tested headless configuration (mit und ohne an erlauben rule for Bash) ran the Befehl on 2.1.288 — the probe's `ask` was nicht automatisch-approved |
| `/agentctl stop` under `-p` stream Eingabe (V6) | The Eingabe was processed danach the Zug ended, so `immediate` does nicht apply there; the reply said nein läuft Zug was observed — nie "stopped" |
| MCP Werkzeug calls (V4) | A probe MCP Werkzeug was refused as unclassified until the Aufgabe named it, dann ran |
| Interactive terminal in tmux (V10) | The Leiste renders CJK goal Text correctly at 80 und 50 columns, wrapping to two und three Zeilen |
| `/agentctl stop` during a läuft foreground Werkzeug, interactive (V6) | Ran at once (`immediate`); the Zug was cancelled; the host moved the läuft Befehl to the background, where it kept läuft — the reply listed it as läuft und nie said "stopped"; when it fertig, the host's Benachrichtigung closed its evidence |
| `ask` on the interactive terminal in manuell mode (V3) | With a probe copy answering `ask`, the host showed its own approval dialog mit der Mod's reason (Yes / No, nein "don't ask erneut"); declining interrupted the call; re-run mit the shipped code (manuell: dialog; `dontAsk`: refused by der Mod), und mit a probe copy under `acceptEdits` und `auto` (dialog) und `dontAsk` (refused). The strings the host sendet were lesen von a plain classic `UserPromptSubmit` Hook (2.1.289): `default`, `acceptEdits`, `auto`, `plan` und `dontAsk` jede arrive verbatim; on a Modell ohne automatisch mode (Haiku) `--permission-mode auto` falls zurück to `default` |
| Interactive starten (found live) | `session.start` und the erste Leiste render arrive together; two concurrent Kontext builds left the Leiste on an orphaned Kontext (`gates missing`). Fixed: one shared build |
| Install, deaktivieren, deinstallieren (Signal 12) | Installed von a local marketplace, ran, deaktiviert (`/agentctl` gone), uninstalled: nein mod process left, the `permissions` settings byte-identical. The host itself left an empty `extraKnownMarketplaces` key, a plugin Cache Verzeichnis und an empty `installed_plugins.json`; der Mod leaves nur its own store Datei. All were restored und verified byte-identical afterwards |

Removal: `--plugin-dir` installs nothing und ändert nein setting. Der Mod's own data stays in
`~/.claude/plugins/store/agentctl_*.json` (Sitzungen, Aufgaben, checkpoints), und drafted proposals in
`~/.claude/agentctl/proposals/`; delete them to entfernen it.

## Verified live, 0.2.x (2026-10-05, scratch clone mit a scratch bare remote, 2.1.289, Haiku)

| Check | Result |
|---|---|
| Direct `git push` mit nein Aufgabe bound (`-p`) | Refused `remote-git-write` vorher läuft; the remote stayed empty |
| Unclassified `python3 -c …` und a script that pushes (`/bin/bash -p push.sh`, `-p`) | Both passed to the host und ran; the script's push reached git (rejected by the scratch remote itself, nicht by der Mod) — the disclosed script blindness |
| Proposal written by `agentctl-setup.js propose`, interactive starten | The preview was logged at Sitzung starten mit the helper's digest, und the Leiste named the waiting proposal |
| `/agentctl accept <digest>` typed at the Prompt | Bound the previewed scope as a neu Aufgabe; ohne a `base` the helper printed nein digest, der Mod filled the bound Aufgabe in und its own digest was accepted |
| A declared prüfen, an unclassified call, an edit outside the roots, a direct push (bound Aufgabe) | Check recorded as `current` evidence; `python3` delegated und listed as such by `/agentctl events`; the edit refused `edit outside the allowed roots`; the push refused `remote-git-write` |
| An untracked Datei added von outside | The prüfen lesen `stale (tree changed since)` within 32 s |
| `/agentctl handoff`, reopen, `/agentctl`, `/agentctl last` | Hand-over states when the tree was lesen und lists the stale prüfen under Not verified; on reopen the transcript zeigt it, bare `/agentctl` prints one pointer Zeile, `/agentctl last` the whole of it |
| Found live und fixed in 0.2.1 | An accepted proposal Datei was lesen erneut by the nächste Sitzung as a stale draft (jetzt remembered per worktree); the built-in refusal said "the Aufgabe's scope", und Claude dann proposed widening the Aufgabe (jetzt: "a built-in class nein Aufgabe can lift"); transcript Zeilen lesen `agentctl: agentctl:` |
| Cost of the two `-p` probes | 2–3 turns jede, ≈ $0.06 jede on Haiku; der Mod's own replies, previews und Leiste call nein Modell |
| Independent adversarial test (Codex, 2026-10-05), fixed in 0.2.2 | An absolute oder upper-case program Pfad (`/usr/bin/git push`, `GIT push`) slipped past the built-in classes; an edit root such as `../other` authorized schreibt outside the worktree; the proposal cap counted characters, nicht UTF-8 bytes; mit nein Aufgabe bound, delegated calls were nicht recorded in `/agentctl events`. Digest agreement, prototype keys, other-worktree refusal, evidence partitioning und partial coverage held |

## Verified live, 0.3.0 (2026-10-07, scratch clone mit a scratch remote, interactive tmux, Haiku)

Signal 13, walked on 2.1.289 (steps 1–3) und erneut von the starten on 2.1.292:

| Step | Result |
|---|---|
| `/agentctl 幫 …/README 加一行測試說明` | The request filled the empty box in Deutsch mit dem Hilfspfad Pfad von `$.plugin.root`; nothing was sent oder bound |
| Enter | Claude ran the helper's `--help`, lesen the Projekt, found the Datei missing und **asked** statt inventing scope; danach the Antwort it wrote the proposal through the helper |
| Preview | Shown at the Zug's end mit its digest und "binds the scope nur; starts nein work"; the Leiste named the waiting proposal |
| Tab + Enter | Accepted von the suggestion; the reply named the nächste step |
| "starten the work" | The edit inside the accepted root went to the host's own permission Prompt; the declared prüfen was recorded as aktuell evidence |
| `/agentctl`, `handoff`, reopen, `last` | Status led mit the nächste step; the hand-over listed the prüfen as verified mit its reading Zeit; reopening pointed at it, `last` printed it |
| A second goal mit the Aufgabe bound | The helper delivered under the bound Aufgabe; the preview said "Replaces: Aufgabe …"; Tab + Enter replaced it |

Found und fixed during the walk: on 2.1.292 the host's own nächste-prompt guess ("Bestätigen") took the box, so
Tab + Enter would have sent that word to Claude — der Mod jetzt replaces the host's guess mit the accept
Zeile while a proposal waits, und offers it erneut at jede Zug's end; the accept reply's letzte Zeile stayed
English in a Chinese Sitzung; mit a Aufgabe bound, the fill reply said "nothing is bound". Hesitations
recorded: Claude once tried to lesen der Mod's own Dateien outside the worktree (declined at the host
Prompt); the copy language resets mit jede neu Sitzung.

## Uncoached ausführen, 0.3.0 (2026-10-07, Codex as a erste-time user, interactive tmux, a disposable clone)

The tester was given nur `/agentctl <what you are doing>` und lesen neither `docs/` nor dieser Mod's
code. Describe → Enter → preview (≈ 72 s, README-only scope, three prüft) → Tab + Enter → "starten the
work" → `/agentctl` → `/agentctl handoff` completed in six steps mit nein outside Hilfe. Fixed in 0.3.1
von what it found:

| Found | 0.3.1 |
|---|---|
| The hand-over lesen "Edits observed: 0" beside a changed README (Claude had edited through Bash) | The Zeile counts edit-tool calls und says Bash ändert are in the tree Zeile |
| Claude ran the tests piped through `grep`; the hand-over called the prüfen stale while Claude called it passing | The accept reply names the prüft to ausführen verbatim; `/agentctl` asks for them erneut by Name |
| With the work fertig, `/agentctl` still said "ask Claude to starten the work" | The nächste step follows the declared prüft: work und ausführen them, re-run what is nicht aktuell, oder hand over |
| A Write outside the roots was refused, dann the same Datei was written mit a Bash heredoc | The refusal tells Claude nicht to reach the Ergebnis another way; this section und § What it does state that roots bind the edit Werkzeuge nur |
| Claude asked a Frage und wrote a proposal in the same Zug | The drafting request says to wait for the Antwort vorher writing |

Left as they are: the ausführen took minutes because the clone's own `CLAUDE.md` requires two review rounds
for a doc ändern, nicht because of der Mod.

## Not verified

V3 on Desktop, VS Code und mobile, und under `plan` und `bypassPermissions` (accepting the
bypass-mode Warnung is the operator's own decision, so it was nicht exercised): `needsUser` stays
refused there. The Leiste was checked in tmux, nicht over SSH.

## Quelle und Lizenz

- Originalautor: sd0xdev
- Originalrepository: https://github.com/sd0xdev/sd0x-harness
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
