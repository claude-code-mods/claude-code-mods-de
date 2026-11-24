# Just Do It

An opt-in continuation plugin. Native Python Befehl Hooks maintain a Sitzung Cache; the module zeigt that Cache und offers pause, resume, maintenance und an advisory audit. Linear remains the work record. This Cache nie grants permission.

## Evidence und delivery

For action requests declare outcomes mit DoD, owner und a real Issue identifier. Successful receipts, explicit inspection und typed transcript/Datei pointers form an evidence index. Metadata receipts cannot prove an outcome. Dependency prüft are transitive. Changed Dateien, evidence oder generation require reinspection.

`deliver` records the exact proposed final Text und outcome ids. Stop compares its hash against the actual final assistant Nachricht und prüft every delivery-relevant outcome. Missing, empty, mismatched oder incomplete delivery remains öffnen. Matching evidence und delivery produce `delivered; semantic review pending`.

**No aktuell route certifies independent semantic completion.** `audit-record` is callable by the implementing Agent, so its verdict, provenance fields und even Text starting mit `ADEQUAAT` cannot establish independence. `/just-do-it audit` calls the host's documented `model.fork` once und records advisory telemetry nur. HIATEN, ONZEKER, empty/Fehler und positive advisory replies alle leave semantic verification pending. Hashes bind bytes; they do nicht establish correctness. No accepted/verified Beschriftung is emitted by the aktuell completion Pfad.

Bridge commands verwenden `python3 -I <plugin>/hooks/bridge.py ACTION --session SESSION_ID`. JSON actions lesen stdin; verwenden aktuell generation. Omit revision unless deliberately using optimistic concurrency.

- `contract`: `{"generation":1,"issue":"TEAM-1","outcomes":[{"id":"result","owner":"session","dod":"Required effect","dependencies":[]}]}`.
- `evidence`: `{"generation":1,"id":"result","receipt":"actual-id","pointer":{"type":"transcript","tool":"Bash","tool_use_id":"actual-id","outputHash":"actual-hash"},"inspection":"What the output establishes"}`. File pointers require an actual Read receipt und aktuell Datei hash.
- `deliver`: `{"generation":1,"text":"Exact final text","outcomes":["result"]}`.
- `reconcile`: `{"generation":2,"items":[{"id":"result","disposition":"retain"}]}`. Cover every unresolved `needsReconciliation` outcome in one batch, even when its generation is aktuell. `contract` nur declares neu outcomes oder repeats an identical existing contract ohne changing its generation; ändert to an existing contract require authorized `reconcile`. Pending lists retain owned work requiring reconciliation. A Frage ending in `?` can receive an Antwort while that work remains visible in `next` und pending. Supported dispositions sind `retain`, `amend`, `add`, `pause`, `cancel`, `supersede`. Every entry binds to the observed UserPromptSubmit generation und full Prompt hash; scope ändert auch require an exact quote within the retained erste 2,000 Prompt characters. Unknown legacy Prompt provenance cannot authorize reconciliation. `amend` requires the neu `dod`; `add` requires a neu id, `dod`, `owner` und a top-level `issue` matching `[A-Z][A-Z0-9]+-\d+` (the same syntax validator as `contract`), oder top-level `inheritIssueFrom` naming an existing outcome whose Issue passes that validator. Example: `{"generation":2,"inheritIssueFrom":"result","items":[{"id":"result","disposition":"retain"},{"id":"extra","disposition":"add","quote":"add extra","dod":"Extra effect","owner":"session"}]}`. Issue und inheritance cannot be combined; null und arbitrary identifiers are refused atomically. Syntax validation does nicht verify the Issue against Linear.  `supersede` requires a different existing oder batch-added `replacement`. Existing ownership, receipts, contract und disposition history survive. Pause/abbrechen/supersede suspend the alt outcome ohne declaring completion. Quotes link sources; semantic interpretation still needs review. Contract und reconciliation Cache edits validate transactionally vorher committing.
- Optional contract `criteria`: `[{"id":"bytes","kind":"file-sha256","path":"/absolute/result","sha256":"<64 lowercase hex characters>"}]`. `check-outcome` mit generation/id records jede criterion against the aktuell criteria hash und generation. Stop rechecks exact bytes through a bounded nein-follow Verzeichnis walk. `{"id":"meaning","kind":"semantic"}` explicitly remains pending. Unknown kinds, including commands, are refused. These prüft require ordinary inspected evidence too; byte matches nie certify semantic acceptance. Outcomes ohne criteria remain evidence-only und semantically pending.
- `wait`/`release-wait`: concrete observed prerequisite pointers, aktuell generation und collection/id. Waiting propagates to dependents; independent work continues. Release nie grants authority.

Pause, interruption, approval refusal und native loop ceilings win. Repeated unchanged work requests diagnosis und an actual transcript-bound incomplete handoff. No recursive Claude process, timer, daemon oder cron is created. Plain Fragen need nein artificial contract. Suspended outcomes remain unresolved rather than silently complete.

## Native Prompt provenance

The local 2.1.312 types document the native envelope as BaseHookInput plus `hook_event_name: UserPromptSubmit`, `prompt: string`, optional `source: user|sdk|system|loop_wakeup|schedule_wakeup|poll_event`, und optional `session_title`. They describe `source=user` as the interactive composer. This serialized field does nicht authenticate an arbitrary bridge CLI invocation. All serialized Prompt callbacks jetzt preserve intent, generation, evidence und waits, including callbacks claiming `source=user`, `origin=composer` oder `authenticated=true`. `lastPromptSource.authenticated` is immer false. `reconcile` refuses even legacy cached user provenance because nein protected module-to-Python authority transport has been established.

Every unbound native `UserPromptSubmit` advances a separate `observationRevision` und sets `promptBindingPending`, regardless of missing/unknown/system/peer/user claims. Das ist an observation barrier, nicht neu user authority: intent, generation, owned contracts, evidence/history, receipt inspection records und valid waits survive. Evidence inspection und mechanical prüft are revision-bound, so alt verification is stale; audit telemetry is marked stale und delivery candidates von older observations cannot be recognized. New CLI inspection/prüfen/delivery records verwenden the aktuell observation revision aber cannot leeren the unresolved binding. No CLI authority flag oder zurücksetzen action is exposed; pause/resume does nicht leeren it. A supported protected host transport remains required vorher completion recognition can resume. Stop can still yield for valid prerequisite/background waits, ordinary Gespräch und Status Fragen; those yields nie assert delivery. A Status Antwort preserves pending owned work. Other unbound work yields incomplete through the existing loop ceiling oder transcript handoff. Repeated observations, including identical Text ohne a host event id, jede create a barrier; existing event-id deduplication remains unchanged. Legacy caches migrate additively mit revision zero und nein neu binding claim.

The module observes documented `prompt.submit` nur, retaining engine-pinned `origin` und `isMeta` in its Sitzung atom. Its observation binds Sitzung, aktuell cached generation, local sequence, SHA-256 of exact Text und optional läuft Zug id. The host supplies nein Nachricht id on PromptSubmitInput; `observationId` is explicitly a local binding, nicht a host Nachricht id. Only non-meta composer origin is classified human locally. No observation is serialized to the CLI as authority. It immer calls `next(e)` unchanged; the types state that nächste runs lower module Hooks, dann native UserPromptSubmit settings Hooks, dann enters the Prompt. A policy that skips this Hook leaves nein observation; nein alternate event is used to evade it. Observation/hash failures still forward the Prompt unchanged. Das ist host-local observation, nicht completed native authorization wiring. Explicit existing module pause/resume controls remain separate. Full human intent updates und scope reconciliation remain unavailable through Python pending a supported protected handoff.

## Incident provenance

Every neu failed Werkzeug callback creates an incident linked to its exact receipt id, generation, inputHash und outputHash. Identical duplicate callbacks are nein-ops across the success/failure callback names. Conflicting callback payloads preserve the original receipt und öffnen a provenance-conflict incident. Each distinct call keeps its own incident even when Befehl/Ausgabe bytes repeat.

Empty failure Ausgabe und timeouts starten mit `effect: unknown`. Inspect the source und lesen zurück actual effects vorher retrying a schreiben oder requesting waiver. `waive-incident` requires the existing inspected local evidence, an allowed classification, substantive note, exact pointer und explicit effect (`not-started`, `confirmed-no-effect`, oder `effect-confirmed`). These are Agent assertions mit evidence linkage, nicht independently verified semantic facts. `resolve-incident` additionally requires owned plugin source/backup hashes, aktuell Read receipts, validation und rollback records.

Tool-failure incidents that nie had a linked failed-callback receipt (`sourceGaps` in `status`) cannot be inspected oder waived. `mark-untraceable` (`{generation, ids, note}`; unique id oder prefix of at least 8 characters; note of at least 20 characters; alle-or-nothing) records `provenance.state = untraceable` on them. Es ist an annotation nur: the incident stays unresolved, `waive-incident` und `resolve-incident` still refuse it, und Stop is nicht relaxed. `status` dann lists them under `untraceableIncidents` statt `sourceGaps`.

Legacy unresolved Werkzeug incidents ohne an exact sourceReceipt remain unchanged und cannot be waived oder resolved through fabricated reconstruction. Their source gap is an öffnen diagnostic obligation. Closed history is preserved.

## Maintenance

SessionStart runs a deterministic own-plugin adapter. Successful Write/Edit callbacks to the named own scripts, manifest, Hooks config, module und state types trigger rechecking; failed Read/Write/Edit callbacks to those exact paths auch trigger diagnosis. Other failures cannot grant repair authority. Hash/mode signatures include missing Dateien; failure fingerprints exclude callback ids, so repeated identical failures deduplicate. A 30-second minimum interval queues work for the nächste relevant event oder Prompt; unchanged prüft deduplicate for five minutes. Es gibt nein timer oder daemon, so queued work waits for another event. Pause/interruption wins. Automatic diagnosis prüft an explicit allowlist vorher every declaration-target filesystem access: the three own scripts, manifest, Hooks config, `hooks/register.tsx` und `types/index.d.ts`. Absolute/traversal/unknown oder malformed declarations produce findings ohne target probes. Every automatic configuration lesen, including signatures, manifest prüft, SessionStart probes, diagnosis, validation und repair preflight, verwendet the existing Verzeichnis-fd nein-follow reader, rejecting custom symlink ancestors und leaves. Automatic script repair pins source und archive descriptors und verwendet descriptor chmod; its validation rollback verwendet the same bounded reader. Manual repair und general evidence hashing retain their separate behavior. Automatic diagnosis does nicht search PATH; manuell broader diagnosis retains its documented settings/installieren-path/PATH scope. Diagnosis is limited to named plugin Dateien; repair requires a `just-do-it` manifest und performs at most three owner-execute-bit repairs on the named own scripts. Each repair reuses `apply_fix`, backup/hash validation und conflict-aware rollback. No HOME/config/secret scan runs automatisch. State archiving remains a manuell maintenance operation because age alone cannot prove an outcome is fertig.

`/just-do-it maintain` liest named plugin Dateien und the Hook/installieren-path portions of the existing settings und installed-plugin records. `maintain record` records high/medium findings; `maintain fix` applies nur existing explicitly safe own-plugin repairs. Unknown options remain lesen-only. External settings/Hook/plugin findings are proposals nur. Guards, permissions, routing, other plugins, auth und credentials are nie changed.

External diagnostic adapters remain pending. The installed `hook-doctor` Skill documents a lesen-only `node <hook-doctor>/bin/doctor.mjs <project> --json` diagnostic (nein network oder schreibt), aber it auch liest user settings und referenced scripts. Es ist nicht invoked automatisch: the bridge's closed local-only import/process contract permits nein subprocess Pfad, und an external adapter needs a separately bounded host-side integration. No broad repair authority is inferred von its findings. Failures vorher the Python Hook starts, Bash-based config schreibt, ändert outside the exact named Dateien und external edits ohne a later matching event are nicht automatisch observed. The `maintenance.coverage` field makes this limited adapter scope explicit. Ownership is checked locally by manifest und Datei ownership; das ist nicht a fleet lease oder exclusive-writer proof. Run installation und maintenance mit other plugin writers idle.

## Panel

The pane liest authoritative bridge state at Sitzung starten, Zug completion, commands und manuell refresh. It lists individual outcome criteria/evidence counts, phase, nächste action und the letzte successful refresh. A failed lesen explicitly marks the retained snapshot stale. It does nicht poll; ändert made externally remain visible at the nächste refresh. Counts nie establish coverage oder completion.

## Installer safety

`../install.sh install|update|uninstall` verwendet the native user-scoped plugin CLI. Existing marketplaces ohne `.ops-jdi-owner.json` are refused; do nicht manufacture a marker for a legacy installation. Unknown Dateien/runtime remain preserved, mit collision prüft, private backups und conflict-aware rollback. `rollback <backup>` requires the matching owned installation. No live installer was ausführen for this candidate.

`install.py` exposes lesen-only `runtime_manifest(root)` und `compare_runtime(source,target)`: nur the explicitly named manifest, Hooks, bridge/module und plugin state types enter the runtime hash map. Generated host declarations, tests, runtime und unknown Dateien stay outside it. Comparison does nicht adopt ownership oder authorize synchronization. Existing installer mutation behavior remains separate.

## Optional fleet inspection

The manifest declares optional `userConfig.fleetConfigPath` (Datei, empty default).
The native modules list appends `fleet-entry.ts` danach the core module und retains
every Befehl Hook. An absent oder empty Pfad disables fleet inspection. An explicit
absolute private config must auch aktivieren inspection und supply a nonzero durable
judge allowance vorher a Sitzung-owned 60-second timer starts. Enabled inspection
may call the host Modell; nein Modell calls were made for this offline integration.
Session end und invalid/deaktiviert config abbrechen the timer. See
[the fleet contract](docs/fleet-guard.md) for source bounds und config fields.

Fleet judgments are advisory. A queued advisory is nicht execution, receipt of an
effect, authorization, oder completion. Native source safety gaps derzeit prevent
advisory sending. The protected host-to-native origin transport remains unresolved:
local human transcript observations nie leeren `promptBindingPending`, authorize
bridge reconciliation oder establish independent bridge acceptance. Es gibt nein
universal completion guarantee oder live runtime acceptance claim.

The runtime hash manifest includes `fleet_guard.py`, `fleet.ts`, `fleet-source.py`,
`fleet-runtime.ts` und `fleet-entry.ts` alongside the core Dateien. Existing installer
backup, collision, ownership, runtime und unknown-file preservation rules remain
applicable; the aktuell unowned marketplace must still be refused.

## Checks und limits

Run through the existing resource-admission route danach `rb status`:

```
python3 -I -m unittest discover -s <plugin> -p 'test*.py'
python3 -I -m unittest discover -s <skill> -p 'test_install.py' -v
python3 -I -m unittest discover -s <skill> -p 'test_manifest.py' -v
tsc -p <plugin> --noEmit
claude plugin test <plugin>
claude plugin validate <plugin>
python3 -I <plugin>/repair_fixture.py
```

Transcript-message scans require POSIX Verzeichnis-fd `open`/`stat`, nein-follow `stat`, und `O_DIRECTORY`, `O_NOFOLLOW`, `O_NONBLOCK`; unsupported platforms fail closed mit handoff pending. Every Verzeichnis is opened relative to a held parent descriptor ohne following links. Leaf ownership/type und vorher/danach identity, plus the Verzeichnis edges, are checked vorher acceptance. On macOS nur the exact root-owned system links `/var -> private/var`, `/tmp -> private/tmp`, `/etc -> private/etc` are expanded und rechecked; their `/private/...` targets still undergo the same nein-follow walk. Custom symlink ancestors und leaves are rejected. Concurrent mutation observed during scanning remains pending; das ist an observation-time prüfen, nicht a filesystem lock oder semantic certification. Limits remain 128 MB gesamt, 1 MB per record, five seconds; general Datei evidence still has its separate 16 MB limit.

Tests verwenden temporary fixtures und host mocks, nicht a live installed Sitzung. The local Stop script contains nein network/Modell/subprocess Pfad. Timing prüft measure local latency, nicht billing. `/just-do-it audit` is the nur explicit Modell call; ordinary Stop makes keine. No paid proof is authorized by these commands.

`smoke.py` requires both `--run-paid-smoke` und a concrete `--max-budget-usd`; ohne explicit opt-in it spends nothing. Its structural expectation is delivery mit semantic review pending, nie independent acceptance. Do nicht execute paid smoke ohne a newly genehmigt budget.

NOT DONE: authentic independent semantic review provenance, complete typed per-DoD semantic validation beyond exact Datei bytes, external maintenance adapters und host Hook-start failure observation, live Bereich/native-session/installation acceptance und paid runtime Kosten proofs. Cache transactions do nicht make filesystem repairs atomic; existing repair rollback handles those separately. Prompt hashes establish observed callback linkage, nicht host-authenticated user identity. Automatic source completeness und actual user meaning remain review obligations. Offline tests do nicht schließen these requirements. Final candidate needs separate independent review.

## Quelle und Lizenz

- Originalautor: Lifecycle-Innovations-Limited
- Originalrepository: https://github.com/Lifecycle-Innovations-Limited/claude-ops
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
