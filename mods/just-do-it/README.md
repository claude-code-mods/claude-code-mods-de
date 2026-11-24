# Just Do It

Ein optional aktivierbares Fortsetzungs-Plugin. Nativer Python-Befehls-Hook unterhält einen Sitzungs-Cache; das Modul zeigt diesen Cache und bietet Pause, Fortsetzen, Wartung und eine beratende Prüfung. Linear bleibt das Arbeitsprotokoll. Dieser Cache verleiht nie eine Berechtigung.

## Nachweise und Auslieferung

Für Handlungsanfragen deklariere Ergebnisse mit DoD, Verantwortlichem und einer echten Issue-Kennung. Erfolgreiche Belege, ausdrückliche Prüfung und typisierte Zeiger auf Transkript/Datei bilden einen Nachweisindex. Metadaten-Belege können kein Ergebnis beweisen. Abhängigkeitsprüfungen sind transitiv. Geänderte Dateien, Nachweise oder Generation erfordern erneute Prüfung.

`deliver` hält den exakt vorgeschlagenen Endtext und die Ergebnis-IDs fest. Stop vergleicht dessen Hash mit der tatsächlichen letzten Assistant-Nachricht und prüft jedes auslieferungsrelevante Ergebnis. Fehlende, leere, abweichende oder unvollständige Auslieferung bleibt offen. Passende Nachweise und Auslieferung ergeben `delivered; semantic review pending`.

**Kein aktueller Weg bescheinigt eine unabhängige semantische Fertigstellung.** `audit-record` kann vom ausführenden Agenten aufgerufen werden, sein Urteil, Herkunftsfelder und selbst ein mit `ADEQUAAT` beginnender Text können therefore keine Unabhängigkeit belegen. Der Befehl `/just-do-it audit` ruft das dokumentierte `model.fork` des Hosts einmal auf und zeichnet nur beratende Telemetrie auf. HIATEN, ONZEKER, leere/fehlerhafte und positive beratende Antworten lassen die semantische Prüfung alle ausstehend. Hashes binden Bytes, sie belegen keine Richtigkeit. Der aktuelle Fertigstellungsweg vergibt kein Etikett wie akzeptiert oder verifiziert.

Bridge-Befehle verwenden `python3 -I <plugin>/hooks/bridge.py ACTION --session SESSION_ID`. JSON-Aktionen lesen stdin; verwende die aktuelle Generation. Lasse revision weg, es sei denn, du willst bewusst optimistische Nebenläufigkeit nutzen.

- `contract`: `{"generation":1,"issue":"TEAM-1","outcomes":[{"id":"result","owner":"session","dod":"Required effect","dependencies":[]}]}`
- `evidence`: `{"generation":1,"id":"result","receipt":"actual-id","pointer":{"type":"transcript","tool":"Bash","tool_use_id":"actual-id","outputHash":"actual-hash"},"inspection":"What the output establishes"}`. Dateizeiger benötigen einen echten Read-Beleg und den aktuellen Datei-Hash.
- `deliver`: `{"generation":1,"text":"Exact final text","outcomes":["result"]}`.
- `reconcile`: `{"generation":2,"items":[{"id":"result","disposition":"retain"}]}`. Decke jedes ungelöste `needsReconciliation`-Ergebnis in einer Charge ab, auch wenn seine Generation aktuell ist. `contract` deklariert nur neue Ergebnisse oder wiederholt einen identischen bestehenden Vertrag ohne dessen Generation zu ändern; Änderungen an einem bestehenden Vertrag erfordern autorisiertes `reconcile`. Pending-Listen behalten eigene Arbeiten, die der Abgleich braucht. Eine Frage, die mit `?` endet, kann eine Antwort erhalten, während diese Arbeit in `next` und pending sichtbar bleibt. Unterstützte Dispositionen sind `retain`, `amend`, `add`, `pause`, `cancel`, `supersede`. Jeder Eintrag bindet an die beobachtete UserPromptSubmit-Generation und den vollständigen Prompt-Hash; Bereichsänderungen benötigen zusätzlich ein exaktes Zitat innerhalb der gespeicherten ersten 2.000 Prompt-Zeichen. Unbekannte alte Prompt-Herkunft kann keinen Abgleich autorisieren. `amend` verlangt das neue `dod`; `add` verlangt eine neue id, `dod`, `owner` und ein übergeordnetes `issue`, das `[A-Z][A-Z0-9]+-\d+` entspricht (derselbe Syntaxprüfer wie bei `contract`), oder übergeordnetes `inheritIssueFrom`, das ein bestehendes Ergebnis mit einem dieses Muster erfüllenden Issue benennt. Beispiel: `{"generation":2,"inheritIssueFrom":"result","items":[{"id":"result","disposition":"retain"},{"id":"extra","disposition":"add","quote":"add extra","dod":"Extra effect","owner":"session"}]}`. Issue und Vererbung lassen sich nicht kombinieren; null und beliebige Kennungen werden atomar abgelehnt. Die Syntaxprüfung verifiziert das Issue nicht gegen Linear. `supersede` verlangt einen anderen bestehenden oder in derselben Charge hinzugefügten `replacement`. Bestehende Zuständigkeit, Belege, Vertrag und Dispositionshistorie bleiben erhalten. Pause/Abbrechen/Supersede setzen das alte Ergebnis aus, ohne Fertigstellung zu erklären. Zitate verknüpfen Quellen; die semantische Auslegung braucht weiterhin Prüfung. Vertrags- und Abgleich-Cache-Änderungen werden transaktional validiert, bevor sie geschrieben werden.
- Optionales Vertrags-`criteria`: `[{"id":"bytes","kind":"file-sha256","path":"/absolute/result","sha256":"<64 lowercase hex characters>"}]`. `check-outcome` mit generation/id hält jedes Kriterium gegen den aktuellen Kriterien-Hash und die Generation fest. Stop prüft exakte Bytes erneut durch einen begrenzten no-follow-Verzeichnisdurchlauf. `{"id":"meaning","kind":"semantic"}` bleibt ausdrücklich ausstehend. Unbekannte Arten, einschließlich Befehlen, werden abgelehnt. Diese Prüfungen benötigen auch gewöhnlich geprüfte Nachweise; Byte-Übereinstimmungen bescheinigen nie semantische Annahme. Ergebnisse ohne Kriterien bleiben nur nachweisbasiert und semantisch ausstehend.
- `wait`/`release-wait`: konkrete beobachtete Voraussetzungszeiger, aktuelle Generation und Sammlung/id. Warten pflanzt sich auf Abhängige fort; unabhängige Arbeit läuft weiter. Freigabe verleiht nie Berechtigung.

Pause, Unterbrechung, Ablehnung einer Freigabe und native Schleifen-Obergrenzen gewinnen. Wiederholte unveränderte Arbeitsanfragen verlangen Diagnose und eine echte an das Transkript gebundene unvollständige Übergabe. Es wird kein rekursiver Claude-Prozess, Timer, Daemon oder Cron erzeugt. Einfache Fragen brauchen keinen künstlichen Vertrag. Ausgesetzte Ergebnisse bleiben ungelöst statt stillschweigend fertig.

## Herkunft nativer Prompts

Die lokalen Typen 2.1.312 beschreiben das native Umschlagformat als BaseHookInput plus `hook_event_name: UserPromptSubmit`, `prompt: string`, optional `source: user|sdk|system|loop_wakeup|schedule_wakeup|poll_event` und optional `session_title`. Sie bezeichnen `source=user` als den interaktiven Eingabebereich. Dieses serialisierte Feld authentifiziert keinen beliebigen Bridge-CLI-Aufruf. Alle serialisierten Prompt-Callbacks bewahren jetzt Absicht, Generation, Nachweise und Wartezustände, einschließlich Callbacks, die `source=user`, `origin=composer` oder `authenticated=true` behaupten. `lastPromptSource.authenticated` ist immer false. `reconcile` lehnt selbst alte zwischengespeicherte Nutzer-Herkunft ab, da kein geschützter Autoritätstransport vom Modul zu Python besteht.

Jeder ungebundene native `UserPromptSubmit` erhöht eine eigene `observationRevision` und setzt `promptBindingPending`, unabhängig von fehlenden, unbekannten, System-, Peer- oder Nutzerangaben. Das ist eine Beobachtungsbarriere, keine neue Nutzerberechtigung: Absicht, Generation, eigene Verträge, Nachweise/Historie, Belegprüfprotokolle und gültige Wartezustände überleben. Nachweisprüfung und mechanische Prüfungen sind an die Revision gebunden, alte Verifikation ist daher veraltet; Prüfungs-Telemetrie als veraltet markiert, und Auslieferungskandidaten aus älteren Beobachtungen können nicht erkannt werden. Neue CLI-Prüf-/Kontroll-/Auslieferungseinträge verwenden die aktuelle Beobachtungsrevision, können aber die ungelöste Bindung nicht leeren. Kein CLI-Berechtigungsflag oder Zurücksetzen wird angeboten; pause/resume leert es nicht. Ein unterstützter geschützter Host-Transport bleibt nötig, bevor Fertigstellungserkennung wieder aufgenommen werden kann. Stop darf bei gültigen Voraussetzungs-/Hintergrundwartezuständen, gewöhnlichem Gespräch und Statusfragen weiterhin zurückgeben; diese Rückgaben behaupten nie Auslieferung. Eine Statusantwort bewahrt ausstehende eigene Arbeit. Andere ungebundene Arbeiten laufen über die bestehende Schleifen-Obergrenze oder Transkriptübergabe als unvollständig weiter. Wiederholte Beobachtungen, auch identischer Text ohne Host-Ereignis-ID, erzeugen jeweils eine Barriere; die bestehende Ereignis-ID-Deduplizierung bleibt unverändert. Alte Caches migrieren additiv mit Revision null und ohne neuen Bindungsanspruch.

Das Modul beobachtet nur dokumentiertes `prompt.submit` und behält engine-festes `origin` und `isMeta` in seinem Sitzungs-Atom. Seine Beobachtung bindet Sitzung, aktuelle gecachte Generation, lokale Reihenfolge, SHA-256 des exakten Textes und optional die laufende Zug-ID. Der Host liefert in PromptSubmitInput keine Nachrichten-ID; `observationId` ist ausdrücklich eine lokale Bindung, keine Host-Nachrichten-ID. Nur nicht-meta Composer-Ursprung wird lokal als menschlich klassifiziert. Keine Beobachtung wird als Berechtigung an die CLI serialisiert. Es ruft `next(e)` immer unverändert auf; die Typen besagen, dass `next` untere Modul-Hooks, dann native UserPromptSubmit-Settings-Hooks ausführt und anschließend den Prompt betritt. Eine Regel, die diesen Hook überspringt, hinterlässt keine Beobachtung; kein anderes Ereignis wird zu seiner Umgehung benutzt. Fehler bei Beobachtung/Hash leiten den Prompt trotzdem unverändert weiter. Das ist host-lokale Beobachtung, keine abgeschlossene native Autorisierungsverdrahtung. Die bestehenden expliziten Modul-Pause/Fortsetzen-Steuerungen bleiben getrennt. Vollständige Aktualisierungen menschlicher Absicht und Bereichsabgleich bleiben über Python ausstehend, bis ein unterstützter geschützter Übergabemechanismus existiert.

## Herkunft von Vorfällen

Jeder neue fehlgeschlagene Werkzeug-Callback erzeugt einen Vorfall, verknüpft mit seiner exakten Beleg-ID, Generation, inputHash und outputHash. Identische doppelte Callbacks sind über die Erfolgs-/Fehlschlag-Callback-Namen hinweg wirkungslos. Widersprüchliche Callback-Payloads bewahren den ursprünglichen Beleg und öffnen einen Herkunftskonflikt-Vorfall. Jeder unterschiedliche Aufruf behält seinen eigenen Vorfall, selbst wenn Befehls-/Ausgabe-Bytes wiederkehren.

Leere Fehlerausgabe und Zeitüberschreitungen beginnen mit `effect: unknown`. Prüfe die Quelle und lies tatsächliche Wirkungen zurück, bevor du einen Schreibvorgang wiederholst oder einen Erlass beantragst. `waive-incident` verlangt den vorhandenen geprüften lokalen Nachweis, eine erlaubte Klassifikation, eine substanzielle Notiz, einen exakten Zeiger und eine ausdrückliche Wirkung (`not-started`, `confirmed-no-effect` oder `effect-confirmed`). Das sind Agentenbehauptungen mit Nachweisverknüpfung, keine unabhängig verifizierten semantischen Fakten. `resolve-incident` verlangt zusätzlich eigene Plugin-Quell-/Sicherungs-Hashes, aktuelle Read-Belege, Validierung und Rollback-Protokolle.

Werkzeugfehler-Vorfälle, die nie einen verknüpften fehlgeschlagenen Callback-Beleg hatten (`sourceGaps` in `status`), können nicht geprüft oder erlassen werden. `mark-untraceable` (`{generation, ids, note}`; eindeutige ID oder Präfix von mindestens 8 Zeichen; Notiz von mindestens 20 Zeichen; alles oder nichts) vermerkt bei ihnen `provenance.state = untraceable`. Es ist nur eine Anmerkung: der Vorfall bleibt ungelöst, `waive-incident` und `resolve-incident` lehnen ihn weiterhin ab, und Stop wird nicht gelockert. `status` listet sie danach unter `untraceableIncidents` statt unter `sourceGaps`.

Alte ungelöste Werkzeug-Vorfälle ohne exakten sourceReceipt bleiben unverändert und können nicht durch erfundene Rekonstruktion erlassen oder gelöst werden. Ihre Quellenlücke ist eine offene Diagnoseverpflichtung. Abgeschlossene Historie bleibt erhalten.

## Wartung

SessionStart führt einen deterministischen Adapter für das eigene Plugin aus. Erfolgreiche Write/Edit-Callbacks auf die benannten eigenen Skripte, das Manifest, die Hook-Konfiguration, das Modul und die Zustandstypen lösen erneute Prüfung aus; fehlgeschlagene Read/Write/Edit-Callbacks auf genau diese Pfade lösen ebenfalls Diagnose aus. Andere Fehler können keine Reparaturautorität verleihen. Hash-/Modus-Signaturen schließen fehlende Dateien ein; Fehler-Fingerabdrücke schließen Callback-IDs aus, damit wiederholte identische Fehler deduplizieren. Ein Mindestintervall von 30 Sekunden stellt Arbeit für das nächste relevante Ereignis oder den nächsten Prompt in die Warteschlange; unveränderte Prüfungen deduplizieren fünf Minuten lang. Es gibt keinen Timer oder Daemon, wartende Arbeit wartet also auf ein weiteres Ereignis. Pause/Unterbrechung gewinnt. Die automatische Diagnose prüft vor jedem Dateisystemzugriff auf ein Deklarationsziel eine ausdrückliche Positivliste: die drei eigenen Skripte, das Manifest, die Hook-Konfiguration, `hooks/register.tsx` und `types/index.d.ts`. Absolute, traversierende, unbekannte oder fehlerhafte Deklarationen erzeugen Befunde ohne Zielabfragen. Jedes automatische Konfigurationslesen, einschließlich Signaturen, Manifestprüfung, SessionStart-Sonden, Diagnose, Validierung und Reparatur-Vorabprüfung, nutzt den vorhandenen no-follow-Reader über Verzeichnis-Deskriptoren und weist eigene Symlink-Vorfahren und -Blätter zurück. Automatische Skriptreparatur fixiert Quell- und Archiv-Deskriptoren und nutzt Descriptor-chmod; ihre Validierungs-Rollback nutzt denselben begrenzten Reader. Manuelle Reparatur und allgemeines Nachweis-Hashing behalten ihr eigenes Verhalten. Automatische Diagnose durchsucht nicht den PATH; die manuell erweiterte Diagnose behält ihren dokumentierten Umfang aus Einstellungen/Installationspfad/PATH. Diagnose beschränkt sich auf benannte Plugin-Dateien; Reparatur verlangt ein `just-do-it`-Manifest und führt höchstens drei Reparaturen des ausführbaren Eigentümer-Bits an den benannten eigenen Skripten durch. Jede Reparatur nutzt `apply_fix`, Backup/Hash-Validierung und konfliktbewusstes Rollback. Es läuft kein automatischer HOME-/Konfigurations-/Geheimnis-Scan. Zustandsarchivierung bleibt eine manuelle Wartungsoperation, denn Alter allein kann kein abgeschlossenes Ergebnis beweisen.

Der Befehl `/just-do-it maintain` liest benannte Plugin-Dateien sowie die Hook-/Installationspfad-Teile der bestehenden Einstellungen und installierten Plugin-Datensätze. `maintain record` hält Befunde mit hoher/mittlerer Stufe fest; `maintain fix` wendet nur bereits vorhandene ausdrücklich sichere Reparaturen am eigenen Plugin an. Unbekannte Optionen bleiben lesend. Externe Einstellungs-/Hook-/Plugin-Befunde sind nur Vorschläge. Wächter, Berechtigungen, Routing, andere Plugins, Authentifizierung und Zugangsdaten werden nie geändert.

Externe Diagnose-Adapter bleiben ausstehend. Das installierte `hook-doctor`-Skill beschreibt eine lesende Diagnose `node <hook-doctor>/bin/doctor.mjs <project> --json` (kein Netzwerk, keine Schreibvorgänge), liest aber auch Nutzer-Einstellungen und referenzierte Skripte. Sie wird nicht automatisch aufgerufen: Der geschlossene lokale Import-/Prozessvertrag der Bridge erlaubt keinen Subprozess-Pfad, ein externer Adapter bräuchte eine separat begrenzte Integration auf Host-Seite. Aus seinen Befunden wird keine umfangreiche Reparaturautorität abgeleitet. Fehler bevor der Python-Hook startet, Bash-basierte Konfigurationsschreibvorgänge, Änderungen außerhalb der exakt benannten Dateien und externe Änderungen ohne später passendes Ereignis werden nicht automatisch beobachtet. Das Feld `maintenance.coverage` macht diesen begrenzten Adapterumfang ausdrücklich. Zuständigkeit wird lokal über Manifest und Dateieigentum geprüft; das ist weder ein Mietvertrag für eine Flotte noch ein Beweis eines exklusiven Schreibers. Führe Installation und Wartung durch, während andere Plugin-Schreiber ruhen.

## Bereich

Der Bereich liest bei Sitzungsbeginn, Zugsabschluss, Befehlen und manueller Aktualisierung den maßgeblichen Bridge-Zustand. Er listet einzelne Ergebnis-Kriterien/Nachweiszähler, Phase, nächste Aktion und die letzte erfolgreiche Aktualisierung. Ein fehlgeschlagener Lesevorgang markiert die behaltene Momentaufnahme ausdrücklich als veraltet. Er pollt nicht; extern vorgenommene Änderungen erscheinen bei der nächsten Aktualisierung. Zahlen belegen nie Abdeckung oder Fertigstellung.

## Sicherheit des Installers

`../install.sh install|update|uninstall` nutzt die native benutzerbezogene Plugin-CLI. Bestehende Marketplaces ohne `.ops-jdi-owner.json` werden abgelehnt; erfinde für eine alte Installation keine Markierung. Unbekannte Dateien/Laufzeit bleiben erhalten, mit Kollisionsprüfungen, privaten Sicherungen und konfliktbewusstem Rollback. `rollback <backup>` verlangt die passende eigene Installation. Für diesen Kandidaten wurde kein Live-Installer ausgeführt.

`install.py` bietet lesend `runtime_manifest(root)` und `compare_runtime(source,target)`: nur das ausdrücklich benannte Manifest, Hooks, Bridge/Modul und Plugin-Zustandstypen gehen in die Laufzeit-Hash-Map ein. Erzeugte Host-Deklarationen, Tests, Laufzeit und unbekannte Dateien bleiben draußen. Der Vergleich übernimmt keine Zuständigkeit und autorisiert keine Synchronisierung. Das bestehende Mutationsverhalten des Installers bleibt getrennt.

## Optionale Flottenprüfung

Das Manifest deklariert optional `userConfig.fleetConfigPath` (Datei, leer als Standard).
Die nativen Modullisten hängen `fleet-entry.ts` nach dem Kernmodul an und behalten
jeden Befehls-Hook. Ein fehlender oder leerer Pfad schaltet die Flottenprüfung ab. Eine
ausdrückliche absolute private Konfiguration muss die Prüfung zusätzlich aktivieren und ein
nichtnull dauerhaftes Prüfer-Budget bereitstellen, bevor ein sitzungseigener 60-Sekunden-Timer startet. Aktivierte Prüfung
darf das Host-Modell aufrufen; für diese Offline-Integration wurden keine Modellaufrufe getätigt.
Sitzungsende und ungültige/deaktivierte Konfiguration brechen den Timer ab. Siehe
[den Flottenvertrag](docs/fleet-guard.md) für Quellgrenzen und Konfigurationsfelder.

Flottenurteile sind beratend. Eine wartende Beratung ist keine Ausführung, kein Beleg einer
Wirkung, keine Autorisierung und keine Fertigstellung. Native Quellensicherheitslücken verhindern
derzeit das Senden von Beratungen. Der geschützte Host-zu-Native-Ursprungstransport bleibt ungelöst:
lokale menschliche Transkriptbeobachtungen leeren nie `promptBindingPending`, autorisieren
keinen Bridge-Abgleich und begründen keine unabhängige Bridge-Annahme. Es gibt keine
allgemeine Fertigstellungsgarantie und keine Behauptung einer akzeptierten Live-Laufzeit.

Das Laufzeit-Hash-Manifest enthält `fleet_guard.py`, `fleet.ts`, `fleet-source.py`,
`fleet-runtime.ts` und `fleet-entry.ts` neben den Kerndateien. Bestehende Installer-
Regeln zu Sicherung, Kollision, Zuständigkeit, Laufzeit und Erhaltung unbekannter Dateien bleiben
anwendbar; der aktuell eigentumslose Marketplace muss weiterhin abgelehnt werden.

## Prüfungen und Grenzen

Führe nach `rb status` über die bestehende Ressourcen-Aufnahmeroute aus:

```
python3 -I -m unittest discover -s <plugin> -p 'test*.py'
python3 -I -m unittest discover -s <skill> -p 'test_install.py' -v
python3 -I -m unittest discover -s <skill> -p 'test_manifest.py' -v
tsc -p <plugin> --noEmit
claude plugin test <plugin>
claude plugin validate <plugin>
python3 -I <plugin>/repair_fixture.py
```

Transkript-Nachrichten-Scans verlangen POSIX-Verzeichnis-Deskriptor-`open`/`stat`, no-follow-`stat` sowie `O_DIRECTORY`, `O_NOFOLLOW`, `O_NONBLOCK`; nicht unterstützte Plattformen scheitern geschlossen, mit ausstehender Übergabe. Jedes Verzeichnis wird relativ zu einem gehaltenen Eltern-Deskriptor geöffnet, ohne Links zu folgen. Eigentum/Typ der Blätter sowie Identität vor/nach und die Verzeichnis-Kanten werden vor Annahme geprüft. Unter macOS werden nur die exakt im Eigentum von root stehenden System-Links `/var -> private/var`, `/tmp -> private/tmp`, `/etc -> private/etc` aufgelöst und erneut geprüft; ihre Ziele `/private/...` durchlaufen weiter denselben no-follow-Durchlauf. Eigene Symlink-Vorfahren und -Blätter werden abgelehnt. Während des Scans beobachtete gleichzeitige Änderungen bleiben ausstehend; das ist eine Prüfung zum Beobachtungszeitpunkt, kein Dateisystem-Lock und keine semantische Bescheinigung. Grenzen bleiben 128 MB gesamt, 1 MB pro Eintrag, fünf Sekunden; allgemeine Datei-Nachweise haben weiterhin ihre eigene 16-MB-Grenze.

Tests nutzen temporäre Fixtures und Host-Mocks, keine Live-Installation. Das lokale Stop-Skript enthält keinen Netzwerk-/Modell-/Subprozess-Pfad. Zeitmessungen messen lokale Latenz, keine Abrechnung. Der Befehl `/just-do-it audit` ist der einzige ausdrückliche Modellaufruf; ein gewöhnlicher Stop macht keinen. Diese Befehle autorisieren keinen kostenpflichtigen Beweis.

`smoke.py` verlangt sowohl `--run-paid-smoke` als auch ein konkretes `--max-budget-usd`; ohne ausdrückliche Zustimmung gibt es nichts aus. Seine strukturelle Erwartung ist Auslieferung mit ausstehender semantischer Prüfung, nie unabhängige Annahme. Führe keinen kostenpflichtigen Smoke-Test ohne neu genehmigtes Budget aus.

NICHT ERLEDIGT: echte unabhängige Herkunft semantischer Prüfung, vollständige typisierte semantische Validierung je DoD über exakte Datei-Bytes hinaus, externe Wartungsadapter und Beobachtung von Fehlern beim Host-Hook-Start, Akzeptanz von Live-Bereich/nativer Sitzung/Installation sowie kostenpflichtige Laufzeit-Kostenbelege. Cache-Transaktionen machen Dateisystem-Reparaturen nicht atomar; bestehendes Reparatur-Rollback regelt sie getrennt. Prompt-Hashes belegen beobachtete Callback-Verknüpfung, keine host-authentifizierte Nutzeridentität. Automatische Quellvollständigkeit und tatsächliche Nutzerabsicht bleiben Prüfverpflichtungen. Offline-Tests schließen diese Anforderungen nicht. Der endgültige Kandidat braucht eine gesonderte unabhängige Prüfung.

## Quelle und Lizenz

- Originalautor: Lifecycle-Innovations-Limited
- Originalrepository: https://github.com/Lifecycle-Innovations-Limited/claude-ops
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
