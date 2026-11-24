# Inbox

Ich habe ADHS. Mit einem Agenten in einem Chat-Thread zu arbeiten, ist kognitiv sehr anstrengend. Die Anzahl der Dinge, die du im Kopf behalten musst, nimmt mit fortdauernder Sitzung immer weiter zu. Fragen, Fehler, Ideen und Aufgaben stapeln sich und vermischen sich, sodass schwer alles im Blick zu behalten ist.

Inbox schafft hier sofort Abhilfe, indem es deinem Agenten einen übersichtlichen, stabilen Ort gibt, an dem er alles auftaucht, was eine Entscheidung braucht. Inbox sorgt außerdem dafür, dass dein Agent bei jedem Eintrag stets eine proaktive, vorausschauende Reihe von Schnellaktionen anbietet, einschließlich einer empfohlenen Aktion.

Noch besser: Inbox gibt deinem Agenten einen Ort, um latente Probleme und Chancen sichtbar zu machen, die er sonst zugunsten der reinen Bearbeitung der aktuellen Aufgabe übersehen würde.

Inbox ist für Claude Code im Terminal und in der Desktop-App verfügbar, für Codex in der ChatGPT-Desktop-App und für omp im Terminal. In der Herdr-App kann es auch in einem Bereich neben dem Terminal geöffnet werden. Jede Variante ist speziell für ihre Plattform gestaltet, funktioniert aber überall nach demselben Grundprinzip.

## So funktioniert es
https://github.com/user-attachments/assets/a493119c-4d8b-46e0-a18a-bd0ecf041b6b


## Install

Wenn du so bist wie ich, füge einfach einen Link zu diesem GitHub-Repository in deinen Agenten ein und bitte ihn um die Installation.

Wenn du es auf die klassische Art machen willst, lies weiter...

### Claude Code

Gib in einer Claude-Code-Sitzung im Terminal ein:

```
/plugin install inbox --marketplace petekp/inbox
```

Antworte mit `y`, um den Marketplace hinzuzufügen, und wähle dann einen Geltungsbereich. In dieser Sitzung funktioniert es sofort. Eine Installation mit Benutzer-Geltungsbereich deckt auch Code-Sitzungen in der Claude-Desktop-App auf diesem Rechner ab.

Wenn du stattdessen aus der Claude-Desktop-App installieren willst, öffne eine Code-Sitzung:

1. Klicke auf **+** neben dem Eingabefeld, dann auf **Plugins** und dann auf **Manage plugins**.
2. Klicke auf der Plugins-Seite oben rechts auf **Add**, dann auf **Add marketplace** und dann auf **Add from a repository**.
3. Gib `petekp/inbox` ein, wähle in der Liste **inbox / petekp** und klicke auf **Sync**.
4. Klicke bei Inbox auf **Add to this computer**.
5. Gehe zurück zu deiner Sitzung und gib `/inbox` ein, um den Bereich zu öffnen.

Damit ist es für dein Benutzerkonto installiert und funktioniert auch im Terminal. `/plugin` läuft nicht in der Desktop-App, und das Inbox erreicht die Cloud-Sitzungen der App nicht.

Wenn deine Organisation Claude Code verwaltet, funktioniert ein selbst installiertes Inbox mit zwei Einschränkungen. Nach `/clear` oder einem Fortsetzen lädt es die Liste des Gesprächs bei deiner ersten Nachricht. Eine Berechtigungsabfrage erreicht das Inbox etwa eineinhalb Sekunden nach ihrem Auftauchen. Um alles zu erhalten, bitte einen Administrator, das Inbox in den verwalteten Einstellungen deiner Organisation aufzulisten.

Zum Aktualisieren führe dies aus und gib anschließend in jeder bereits geöffneten Sitzung `/reload-plugins` ein:

```sh
claude plugin marketplace update inbox
claude plugin update inbox
```

- Es führt nach jeder Antwort von Claude zwei Sonnet-Aufrufe aus, einen für die Zeilen und einen für den Status-Tab. Siehe [Kosten](#cost).
- Es wurde mit Claude Code 2.1.300 entwickelt und getestet.

### Codex

```sh
codex plugin marketplace add petekp/inbox
codex plugin add inbox@inbox
```

Wenn deine Shell `command not found: codex` meldet, verwende in beiden Befehlen die Kopie aus der ChatGPT-App anstelle von `codex`:

```sh
/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex
```

Vertraue anschließend in der ChatGPT-Desktop-App den Hooks des Plugins: Klicke auf das Hook-Symbol neben der Freigabeeinstellung des Eingabefelds und dann auf Allow all. Wenn das Symbol nicht da ist, öffne Settings, dann Hooks, dann Inbox und dann Trust all. Codex führt die Hooks eines Plugins erst aus, nachdem du ihnen vertraut hast. Bei Codex 0.164.0 und später stoppt ein Update die Hooks, sodass du ihnen nach jedem Update erneut vertrauen musst. Um das Inbox zu öffnen, öffne die Seitenleiste und wähle das ⋯-Menü neben New und dann Inbox. Dies wurde am 2026-11-14 in der ChatGPT-App mit Codex 0.169 geprüft.

In [codex/README.md](codex/README.md) steht, wie man aktualisiert und den Befehl `codex` aus der App heraus ausführt.

### omp

```sh
omp plugin marketplace add petekp/inbox
omp plugin install inbox@inbox-omp
```

Das Inbox funktioniert ab der nächsten omp-Sitzung. `omp plugin list` zeigt es als `inbox@inbox-omp`. Es liest `.omp-plugin/marketplace.json`, das omp vor dem Ordner `.claude-plugin/` sucht, den Claude Code liest.

Zum Aktualisieren führe dies aus und starte dann omp neu:

```sh
omp plugin marketplace update inbox-omp
omp plugin upgrade inbox@inbox-omp
```

Nach jeder Antwort führt das Inbox zwei Modellaufrufe aus: einen zum Aktualisieren der Zeilen und einen zum Schreiben des Status-Tabs. Es verwendet das erste der folgenden Modelle, das dein omp ausführen kann:

1. Das Modell, das deine Rolle `@inbox` angibt.
2. Das neueste Sonnet deiner Anbieter, `anthropic` zuerst.
3. Deine Rolle `@smol`.

Um `@inbox` festzulegen, füge es in omps `config.yml` unter `modelRoles` hinzu und starte omp neu:

```yaml
modelRoles:
  inbox: anthropic/claude-sonnet-5-5
```

Nur Sonnet ist getestet. Ein anderes Modell funktioniert möglicherweise, aber niemand hat geprüft, wie gut.

Dein Anbieter berechnet jeden Aufruf nach dem Preis dieses Modells.

Wenn `@inbox` nicht gesetzt ist oder ein Modell angibt, das omp nicht verwenden kann – etwa ein unbekanntes Modell oder eines, bei dem du nicht angemeldet bist –, verwendet das Inbox die nächste Wahl. Die Fußzeile des Bereichs zeigt das verwendete Modell. Ein Modell, das omp zwar verwenden kann, dessen Aufruf aber fehlschlägt, führt nicht zum nächsten Eintrag: Diese Aktualisierung schlägt fehl, und die nächste Antwort versucht es erneut. Ohne nutzbares Modell steht in der Fußzeile „kein Inbox-Modell: @inbox setzen", und das Inbox kann nicht aktualisieren.

### Für alle

Der PR-Tab benötigt das angemeldete GitHub-CLI `gh`.

## Verwendung

Gib `/inbox` in Claude Code oder omp ein, oder öffne den Tab Inbox in der ChatGPT-App. Das Inbox hat vier Tabs: Status, Asks, Finds und PRs.

Das Inbox startet leer. Gib deinem Agenten eine Aufgabe, und die ersten Zeilen erscheinen nach seiner Antwort: eine Frage, die er dir gestellt hat, mit seinen Antworten als Schaltflächen, sowie der Status der Arbeit. In Claude Code zeigt die Zeile über dem Eingabefeld an, dass das Inbox etwas enthält.

Um jeden Bereich mit Beispiel-Einträgen zu sehen, führe `/inbox demo` in Claude Code oder omp aus. Klicks darauf verändern nur die Beispiele. In Claude Code kannst du Hide demo drücken oder den Befehl erneut ausführen, um zurückzukehren. `/inbox demo recording` lässt die Hinweise weg, die die Beispiele kennzeichnen – für ein Video. In omp bleiben sie bis zum Schließen des Bereichs erhalten.

### Status

Wo die Arbeit der Sitzung steht – für jemanden, der sich kalt wieder einfindet. Die Seite nennt zuerst, worauf die Sitzung gerade fokussiert ist, dann jeden Teil der Arbeit mit seinem Stand. Ein Teil, der einen Tag lang untätig war, zeigt wie lange. Subagenten und andere Arbeiten unter einem Teil erscheinen darunter. Ein Teil, der auf eine Frage oder Aufgabe von dir wartet, sagt das, und View öffnet sie. Eine Zeile markiert, wo du zuletzt geschaut hast, sodass Änderungen seitdem darüber stehen. Abgeschlossene Arbeiten werden zu einer Zahl zusammengefasst, die du öffnen kannst.

Du kannst ein Ziel mit einer Ziellinie setzen, etwa „2.5 im Laden". Die Seite gruppiert die Arbeit dann unter den Meilensteinen des Ziels, und das Inbox hält Ziel und Meilensteine aktuell. Du kannst das Ziel jederzeit bearbeiten oder entfernen. Eines, das du selbst eingegeben hast, bleibt bis zur Erreichung. Eines, das das Inbox erschlossen hat, wandert weiter, wenn die Arbeit weitergeht.

Die Seite ist eine Anleitung zur Arbeit, kein Protokoll. Der zweite Modellaufruf nach jeder Antwort schreibt sie. Wenn dieser Aufruf fehlschlägt, sagt die Seite das.

### Asks

Fragen, die der Agent dir gestellt hat, und Aufgaben, die nur du erledigen kannst.

Der Agent muss nichts Besonderes tun, um eine Frage hierher zu bringen. Nach jeder Antwort liest ein Modell, was der Agent geschrieben hat, und erfasst jede Frage darin, mit ihren möglichen Antworten. Die empfohlene Antwort des Agenten steht zuerst. Drücke eine Antwort, und sie geht einige Sekunden später als deine Nachricht an den Agenten, damit Undo einen falschen Klick zurücknehmen kann. Du kannst auch deine eigene Antwort tippen oder Explain drücken, damit der Agent mehr sagt, bevor du entscheidest.

Wenn es sich bei einer Frage um eine Designentscheidung handelt – etwa zwei Layouts oder zwei Wege, eine Funktion zu bauen –, lässt Compare den Agenten jede Antwort an deinem Code ausprobieren und erstellt eine Seite, die sie nebeneinander zeigt; sie öffnet sich aus der Frage. Die Seite beginnt mit der Wahl des Agenten, und seine Antwort nennt die Wahl, den Grund und den Pfad der Seite. Wo der Agent einen Subagenten im Hintergrund starten kann, läuft der Vergleich dort, damit du weiterarbeiten kannst. Die Frage zeigt „Vergleiche…", bis der Agent zurückmeldet. Nach 30 Minuten ohne Meldung steht „Kein Vergleich zurückgekommen", und du kannst Compare erneut drücken.

Eine Aufgabe ist etwas wie das Anmelden oder das Hinzufügen eines API-Schlüssels. Sie kommt mit Schaltflächen für ihre Schritte, etwa um einen Befehl zu kopieren oder eine Datei zu öffnen. In Claude Code schließt das Ausführen des Befehls mit `!` die Aufgabe, sobald sie erfolgreich ist. Dismiss verwirft eine Aufgabe, die du nicht machen willst, ohne eine Nachricht an den Agenten.

### Finds

Fehler, Risiken und Ideen, die der Agent außerhalb seiner aktuellen Aufgabe bemerkt hat. Der Agent erfasst sie und arbeitet an seiner Aufgabe weiter; du entscheidest später, was du davon umsetzt. Fix bei einem Problem oder Do it bei einer Idee übergibt sie dem Agenten. File issue lässt den Agenten sie in deinem Issue-Tracker wie Linear oder GitHub erfassen oder verlinkt das Issue, das sie bereits abdeckt. Reply sendet deine eigenen Worte dazu. Explain lässt den Agenten sagen, warum es wichtig ist und was eine Behebung bedeuten würde, ohne zu handeln. Discuss bespricht es, und Dismiss verwirft es.

### PRs

Pull Requests aus dieser Sitzung und deinem aktuellen Branch. Jeder ist mit Blocked, Ready oder Waiting markiert und listet, was ihn blockiert: Review-Kommentare, die auf dich warten, fehlgeschlagene Prüfungen und Merge-Konflikte. Schaltflächen übergeben die Arbeit an den Agenten: einen Review-Kommentar oder alle bearbeiten, eine Antwort entwerfen, eine fehlgeschlagene Prüfung beheben, Konflikte lösen oder mergen. Fix und Resolve conflicts erscheinen nur, solange GitHub das Problem noch zeigt. Ein gemergter oder geschlossener PR verschwindet von selbst aus dem Tab; mit Undo bleibt er dort. Clear merged and closed oben im Tab entfernt alle verbleibenden, außer denen deines aktuellen Branches.

Dein Agent kann die PRs auch in eine Reihenfolge bringen, etwa welche zuerst gemergt werden sollen. Der Tab listet sie dann nummeriert zuerst, unter der Angabe, wofür die Reihenfolge gilt und warum. Wenn sich ein priorisierter PR ändert, sagt der Tab das und bietet Rank erneut an.

### Es hält sich selbst aktuell

Wenn du eine Frage in deiner eigenen Nachricht beantwortest, eine Aufgabe erledigt wird oder der Agent einen Fund behebt, schließt das Inbox den Eintrag. Geschlossene Einträge werden unter den offenen zusammengefaltet, jeder mit der Angabe, wie er endete. Bei einem, den du verworfen hast, bleibt Reopen für den Rest der Sitzung.

Der Agent liest das Inbox ebenfalls. Neben jeder deiner Eingaben sieht er, was noch offen ist und was du geantwortet hast – auch nach einem Compact des Gesprächs.

Jeder Klick zeigt sofort, was er bewirkt hat. Discuss zeigt „Diskutiere…", bis der Agent antwortet, dann „✓ Diskutiert".

### In den einzelnen Apps

Help listet die Tasten und die Bedeutung jeder Markierung.

- **Terminal:** Jede Aktion zeigt den Buchstaben, der sie ausführt. Die Zahlentasten wechseln die Tabs, und `j` und `k` bewegen nach oben und unten. Im Status bewegen sie zwischen den Zeilen mit einer Schaltfläche, und der Buchstabe neben einer Schaltfläche drückt sie. ctrl+x tab verschiebt den Fokus vom Eingabefeld auf die Zeile darüber, dann auf den Bereich und dann zurück zum Eingabefeld.
- **Claude-Desktop-App:** Du klickst. Gib `/inbox` ein, um den Bereich zu öffnen. Klicks im Bereich wurden auf Claude-Code-Engine 2.1.309 und später geprüft. Bei 2.1.295 konnte ein Klick nach einem Druck dem Bereich nur wieder den Fokus geben.
- **ChatGPT-App:** Du klickst oder drückst dieselben Tasten wie im Terminal. Der Tab zeigt keine Buchstaben.
- **Herdr-App:** Siehe [Herdr-App-Bereich](#herdr-app-pane).
- **omp:** `/inbox` öffnet das Panel über dem Gespräch, esc schließt es. Jede Aktion zeigt den Buchstaben, der sie ausführt; Reply ist `t`. Die Pfeiltasten bewegen zwischen Zeilen und zwischen den Schaltflächen einer Zeile, enter drückt die fokussierte Schaltfläche. Tab oder die Zahlentasten wechseln die Tabs. Im Status bewegen `j` und `k` zwischen den Zeilen mit einer Schaltfläche, und die Pfeile nach oben und unten scrollen die Seite.

In Claude Code zählt eine Zeile über deinem Eingabefeld, was dich braucht, und die wartenden Funde, mit einer Schaltfläche zum Öffnen des Paneels. Wenn Claude wegen eines Fehlers stoppt, sagt eine zweite Zeile warum, nach einem API-Fehler mit einer Resume-Schaltfläche. Die ChatGPT-App hat keine solche Zeile. omp hat eine Zeile mit denselben Zahlen. Sie sagt, dass `/inbox` das Panel öffnet, und hat keine Stopp-Zeile.

### Herdr-App-Bereich

In einem Herdr-App-Terminal kann das Inbox in einem Bereich neben dem Terminal geöffnet werden.

1. Starte Claude Code oder omp in einem Herdr-App-Terminal und gib `/inbox` ein. Beim ersten Mal öffnet sich das Inbox im Terminal und fragt: „Das Herdr-Mod des Inbox installieren?" Drücke Install. Die ChatGPT-App stellt dieselbe Frage in ihrem Inbox-Tab.
2. Gib `/inbox` erneut ein. Das Inbox öffnet sich in einem Bereich rechts neben dem Terminal. Claudes Open-inbox-Schaltfläche tut dasselbe. Wenn du Install in einer anderen Sitzung oder App gedrückt hast und das Inbox weiter im Terminal aufgeht, starte Claude Code neu.
3. Der Bereich zeigt das Inbox des Terminals, das du zuletzt in seinem Tab fokussiert hast. Er hat Asks, Finds und PRs, und du kannst jede Schaltfläche drücken. ← und → wechseln die Tabs, `j` und `k` bewegen zwischen Zeilen, und esc gibt die Tasten an das Terminal zurück. Help listet den Rest.

Don't install speichert deine Antwort. Führe `/inbox herdr` in Claude Code oder omp aus, um erneut gefragt zu werden.

Das Codex-CLI hat kein `/inbox`. Öffne den Bereich dafür mit
`herdr-app do pane.split '{"direction":"right","pane":"<pane id>","mod":"inbox"}'`,
wobei du die Bereichs-ID aus `herdr-app ls` nimmst.

Innerhalb eines Herdr-Bereichs melden Claude Code, omp und das Codex-CLI auch an Herdrs Seitenleiste, als Bereichs-Tokens:

| Token | Inhalt |
|---|---|
| `inbox` | Was auf dich wartet, in einer Zeile |
| `inbox-needs-you`, `inbox-findings`, `inbox-prs` | Nur die Anzahl des Tabs, etwa `2`. `inbox-needs-you` ist der des Asks-Tabs, `inbox-findings` der des Finds-Tabs. Leer, wenn im Tab nichts wartet. |
| `inbox-stop` | Warum der Agent gestoppt ist. Die Zähl-Tokens bleiben leer, bis der Stopp vorbei ist, damit die Seitenleiste Platz dafür hat. |
| `inbox-focus` | Worauf die Sitzung fokussiert ist, aus ihrem Status. Eine Sitzung, die diese als Herdr-Delegate gestartet hat, zeigt sie als Zeile des Delegaten. Keine Seitenleisten-Zeile braucht es. |

Um die Zahlen anhand der Farbe des jeweiligen Tabs zu unterscheiden, füge diese Zeile zu `rows` unter `[ui.sidebar.agents]` in Herdrs Konfiguration hinzu:

```toml
[
  { token = "$inbox-stop", fg = "#ffa3b0" },
  { token = "$inbox-needs-you", fg = "#ffae42" },
  { token = "$inbox-findings", fg = "#cab0ff" },
  { token = "$inbox-prs", fg = "#8cc8c0" },
],
```

Herdr setzt ` · ` zwischen die Tokens, die einen Wert haben, und lässt die Zeile ganz weg, wenn keines einen hat.

## Kosten

In Claude Code fügt das Inbox zwei Dinge hinzu:

| Was das Inbox hinzufügt | Tokens | Kosten zu API-Preisen |
|---|---|---|
| Ein Sonnet-Aufruf nach jeder Antwort von Claude, um das Inbox zu aktualisieren | 3–4k rein, etwa 2k davon im Cache. 100–250 raus. | Etwa 0,5 Cent pro Antwort, oder 1 Cent nach 5 Leerlaufminuten |
| Ein zweiter Sonnet-Aufruf, um den Status-Tab zu schreiben | Etwa 1,2k rein und 14–44 raus bei einem kurzen Austausch (drei Messläufe: 1.175–1.214 rein). Ein Aufholen über ein ganzes Gespräch liest mehr: 1.358 rein und 100 raus in dem einen Lauf. | Weniger als der erste Aufruf, der etwa 3k rein liest |
| Seine Anweisungen und Werkzeuge, die bei jeder Anfrage von Claude mitgesendet werden | Etwa 1.350, im Cache | Unter 0,1 Cent pro Anfrage |

In einem Claude-Plan zählen diese auf deine Nutzungsgrenzen an.

In Codex läuft die Aktualisierung nach jeder Antwort über die `codex`-Binary in der Desktop-App, mit deiner Codex-Anmeldung. Sie führt zwei Aufrufe pro Antwort aus. Jeder trägt etwa 12.000 Eingabe-Tokens an Grundanweisungen, die jeder `codex exec`-Aufruf enthält, plus den eigenen Prompt. Der frühere einzelne Aufruf kam auf etwa 16.000. Es zählt auf die Nutzung deines Plans an.

## Was es ausführt, sendet und ändert

Hier geht es um den Claude-Code-Mod. [codex/README.md](codex/README.md) beschreibt das Codex-Plugin. Die omp-Erweiterung führt dieselben `gh`-Abfragen aus. Ihre Aktualisierungsanfrage läuft über omps eigene Verbindung zum Anbieter des verwendeten Modells und enthält dieselben Dinge wie die Claude-Code-Anfrage.

**Was deinen Rechner verlässt.** Drei Dinge, sonst nichts:

- Nach jeder Antwort von Claude sendet das Inbox zwei Sonnet-Anfragen über Claudes eigene Modellverbindung an Anthropic. Beide enthalten deine letzte Eingabe, Claudes Antwort, die offenen Einträge des Inbox und eine Zeile für jedes Werkzeug, das Claude ausgeführt hat. Eine Werkzeugzeile liest sich wie `ran: npm test` oder `edited src/app.ts`. [Kosten](#cost) nennt die Größe der Anfrage.
- Wenn das Inbox eine Runde verpasst haben könnte, bittet es dasselbe Modell mit denselben zwei Aufrufen, sich aus dem gesamten Gespräch zu aktualisieren. Dafür forkt es das Gespräch oder liest nach einem Fortsetzen das Transkript.
- Um den PR-Tab zu füllen, führt es schreibgeschützte `gh`-Abfragen aus: `gh pr view` und `gh api graphql` für Review-Threads. Sie erreichen GitHub unter deiner eigenen `gh`-Anmeldung. Das Inbox liest nie dein GitHub-Token.

**Programme, die es startet.**

| Programm | Wann |
|---|---|
| `gh` | Um den PR-Tab zu füllen |
| `open` | Wenn du eine Schaltfläche drückst, die einen Link, eine Datei oder einen Ordner öffnet |
| `test -x` | Vor dem Öffnen einer Datei. Eine ausführbare Datei wird im Finder angezeigt, nicht ausgeführt. |
| `herdr pane report-metadata` | Nur innerhalb eines Herdr-Bereichs, um auf dich Wartendes und die Anzahl der Tabs in Herdrs Seitenleiste anzuzeigen |

**Nachrichten, die es in deinem Namen sendet.** Wenn du eine Antwort- oder Aktionsschaltfläche drückst, sendet das Inbox Claude eine Nachricht in deinem Namen. Die Nachricht ist die gewählte Antwort oder eine Anfrage zum Eintrag, etwa Claude zu bitten, einen Fund zu beheben. Resume sendet bei einer gestoppten Runde `Continue`. Jede Nachricht beginnt mit einem Klick. Wenn du eine Aufgabe als Done markierst, auf die Claude wartet, informiert das Inbox Claude einige Sekunden später oder nach Ende der laufenden Runde.

**Was es Claudes Kontext hinzufügt.**

- Seine Anweisungen, etwa 1.350 Tokens, bei jeder Anfrage.
- Ein Hinweis neben deiner Eingabe, wenn du eine der nummerierten Fragen von Claude beantwortest oder wenn sich das Inbox seit Claudes letztem Blick geändert hat.
- Seine offenen Einträge nach dem Compact des Gesprächs, damit Claude sie behält.

**Was seine Hooks sehen.**

- Werkzeugaufrufe. Das Inbox liest jeden Aufruf, um die obigen Werkzeugzeilen zu schreiben, eine Frage zu zeigen, während Claudes Fragedialog offen ist, und einen PR zu finden, den diese Sitzung mit `gh pr create` öffnet. Es lässt jeden Aufruf unverändert weiter, außer Aufrufen seiner eigenen zwei Werkzeuge. `record` speichert eine Frage, eine Aufgabe oder einen Fund, und `close` schließt einen Eintrag. Das Inbox antwortet darauf selbst, sodass sie ohne Berechtigungsabfrage laufen.
- Berechtigungsabfragen. Während Claude Code dich um Freigabe eines Werkzeugaufrufs bittet, zeigt das Inbox eine Zeile dafür und leitet die Anfrage unverändert weiter. Es genehmigt oder verweigert nie eine Berechtigungsabfrage.
- Werkzeugbeschreibungen. Es listet seine eigenen zwei Werkzeuge von Anfang an für Claude auf, statt sie hinter der Werkzeugsuche zu verstecken. Beschreibungen anderer Werkzeuge lässt es unangetastet.
- Shell-Befehle, die du mit `!` ausführst, und ihre Ausgabe. Ein Befehl, der ohne Ausgabe auf stderr läuft, schließt eine Aufgabe, die dich zu seiner Ausführung aufgefordert hat.
- Sitzungsstarts. Nach `/clear`, einem Fortsetzen oder einem Fork lädt das Inbox die Einträge des Gesprächs. Es leitet das Ereignis unverändert weiter.
- Deine Theme-Einstellung, um seine Farben anzupassen.

**Was es speichert.** Das Inbox speichert die Einträge jeder Sitzung und die verfolgten PRs im Plugin-Speicher von Claude Code auf diesem Rechner. Es behält die 40 neuesten Sitzungen und löscht ältere. Ein Eintrag kann einen Teil des Gesprächs zusammenfassen, daher kann er die darin genannten Personen nennen. Nichts geht an den Autor des Plugins.

Es fügt auch den Befehl `/inbox` hinzu.

## Entwicklung

[docs/developing.md](docs/developing.md) beschreibt, wie man das Inbox aus einem Clone ausführt und baut.

## Quelle und Lizenz

- Originalautor: petekp
- Originalrepository: https://github.com/petekp/inbox
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de

