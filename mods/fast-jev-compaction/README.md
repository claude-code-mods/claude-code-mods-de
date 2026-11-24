# fast-jev-compaction

Ein Claude-Code-Plugin, das die Komprimierungs-Zusammenfassung durch Jev-Entscheidungen ersetzt:
Jeder Werkzeugaufruf und jedes Ergebnis wird in einer einzigen schnellen Anfrage bewertet, veraltete werden
entfernt oder gekürzt, und alles Behaltene bleibt wortgetreu. Auch als npm-Bibliothek nutzbar.

## Was es ist und warum

Die meisten Kontext-Komprimierungen bitten ein LLM, alte Züge zusammenzufassen. Eine Zusammenfassung ist
verlustbehaftet: Ein Dateipfad, ein genauer Fehler, eine Einschränkung oder ein Befehl kann verschwinden, auch wenn
er später wichtig ist. Diese Bibliothek schreibt nie etwas um. Sie löscht nur Werkzeugaufrufe und
Werkzeugergebnisse, die Jev als nicht mehr benötigt ansieht, und fragt Jev, während sie ihm die gesamte
Unterhaltung zeigt. User- und Assistant-Text bleibt wortgetreu und in der Reihenfolge erhalten.

Das Repository ist sowohl ein npm-Paket (`src/`) als auch ein Claude-Code-Plugin
(`hooks/`, `.claude-plugin/`), das das Paket nutzt, um die eingebaute Komprimierungs-Zusammenfassung von Claude Code
durch die ursprünglichen Nachrichten zu ersetzen.

## So funktioniert es

1. Jedes `tool_use` wird über `tool_use_id` mit seinem `tool_result` gepaart. Aufrufe in der
   ersten Nachricht oder in den neuesten `preserveRecentMessages` Nachrichten sind festgenagelt und werden nie berührt.
2. Der **Zustand**, der an Jev gesendet wird, ist die gesamte Unterhaltung bis jetzt, älteste zuerst,
   wobei jedes Werkzeugergebnis durch eine kurze Notiz ersetzt wird (`ok, 4213 chars (omitted)`).
   Werkzeugeingaben sind enthalten, Texte sind enthalten, nichts wird zusammengefasst.
3. Der Zustand wird in Stufen an `maxStateTokens` angepasst (standardmäßig 25k), wobei jede Stufe
   nur angewendet wird, wenn die vorherige nicht reichte: Werkzeugeingaben auf 1000, dann 200, dann 60 Zeichen gekürzt;
   lange Texte auf Kopf + Ende reduziert, älteste nicht festgenagelte Nachrichten zuerst; alte nicht festgenagelte Nachrichten
   zu einer Notiz `[… N chars omitted …]` zusammengefasst; alte Werkzeugaufrufe auf je eine Zeile reduziert
   (`t12 Read file_path=src/a.ts → ok 480ch`); alte aufruflose Nachrichten weggelassen; Folgen alter
   Nur-Aufruf-Nachrichten zu einem Eintrag gefaltet. Passt es immer noch nicht, bricht die Komprimierung ab. Token werden
   ohne Tokenizer geschätzt (ein Wort pro sechs Buchstaben, ein halbes Token pro Ziffer, ~eines pro anderem Symbol),
   kalibriert, um etwas über den von Jev gemeldeten Zahlen zu liegen.
4. Für jeden nicht festgenagelten Aufruf erhält Jev zwei `noul`-Fragen: Soll der **Aufruf**
   bleiben (zu wissen, dass er gemacht wurde, mit seiner Eingabe, ist noch wichtig), und soll das
   **Ergebnis** wortgetreu bleiben (sein Inhalt wird noch gebraucht, und das Werkzeug erneut auszuführen nützt nichts).
5. Die Fragen werden auf so viele Anfragen verteilt wie nötig, damit Zustand plus Fragen
   unter `maxRequestTokens` bleiben (standardmäßig 30k, unter Jevs 32k-Anfragelimit). Der gleiche vollständige
   Zustand wird mit jeder Anfrage erneut gesendet; die Anfragen laufen gleichzeitig und ihre Antworten werden zusammengeführt.
6. Entscheidungen je Aufruf gegen `keepThreshold`:
   - `keepResult ≥ threshold` → Aufruf und Ergebnis behalten;
   - sonst `keepCall ≥ threshold` → den Aufruf behalten, das Ergebnis auf seine ersten
     `truncateHeadChars` Zeichen plus eine einzeilige Notiz kürzen;
   - sonst → den Aufruf zusammen mit seinem Ergebnis entfernen.
7. Die Nachrichtenliste wird neu aufgebaut: Eine Nachricht, die ihren gesamten Inhalt verliert, wird
   entfernt, unberührte Nachrichten werden als dieselben Objekte zurückgegeben, und kein Ergebnis bleibt je ohne seinen Aufruf.

Jev-Fehler, fehlerhafte Antworten, ein fehlender Key oder eine Unterhaltung, die nicht hineinpasst, führen zum
Abbruch; der Aufrufer (oder der Claude-Code-Hook) entscheidet, was als Rückfall gilt.

## Install und Nutzung

```sh
npm install fast-jev-compaction
export TYPESAFE_API_KEY=...
```

```ts
import { compactMessages, reductionRatio, type Message } from 'fast-jev-compaction';

const transcript: Message[] = [
  { role: 'user', text: 'Fix the failing test. Never edit src/generated.', toolUses: [] },
  {
    role: 'assistant',
    text: '',
    toolUses: [{ tool_use_id: 'toolu_1', tool: 'Read', input: { file_path: 'src/a.ts' } }],
  },
  { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'toolu_1', text: '…file…' }] },
  // …
];

const result = await compactMessages(transcript, { preserveRecentMessages: 4 });
console.log(result.messages, result.decisions, result.stats);
if (reductionRatio(result) < 0.25) {
  // not worth it: keep the original transcript, or summarize instead
}
```

`Message` ist eine Teilmenge von Claude Codes `SessionMessage`, ein Sitzungs-Transkript kann also
direkt übergeben werden.

Um einen eigenen Transport mitzubringen, implementiere `JevAsker` (eine Methode `ask(state, questions)`)
und rufe `compact(messages, asker, options)` auf; `buildJevRequest` und `parseJevResponse` liefern den
HTTP-Anfragekörper und die Antwortvalidierung. Auch die Bausteine (`collectToolCalls`, `fitState`, `batchCalls`,
`decideCall`, `applyDecisions`) sind exportiert.

`apiKey` ist standardmäßig `process.env.TYPESAFE_API_KEY`. Commite den Key nie und lege ihn in keiner
Quelldatei ab.

## Optionen

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `apiKey` | `TYPESAFE_API_KEY` | TypeSafe-API-Key (`compactMessages`/`JevClient`) |
| `model` | `jev-latest` | Jev-Modellname |
| `baseUrl` | `https://api.typesafe.ai/v1/systemone` | System-One-Endpunkt |
| `fetch` | natives `fetch` | Einsetzbare fetch-Implementierung für Tests |
| `goal` | letzte 3 User-Prompts | Beschreibung der laufenden Aufgabe, im Zustand enthalten |
| `keepThreshold` | `0.5` | Mindestwahrscheinlichkeit, damit ein Aufruf oder Ergebnis bleibt |
| `preserveRecentMessages` | `6` | Neueste Nachrichten, die nie berührt werden (die erste bleibt immer) |
| `maxStateTokens` | `25000` | Geschätzte Token-Obergrenze für den Zustand |
| `maxRequestTokens` | `30000` | Geschätzte Obergrenze für Zustand plus eine Fragencharge |
| `truncateHeadChars` | `300` | Zeichen eines verworfenen Werkzeugergebnisses, die vor seiner Notiz bleiben |

`result.stats` meldet Nachrichten- und Zeichenzahlen vorher und nachher, die Entscheidungen nach Grund,
die Zustandsgröße in geschätzten Token, welche Anpassungsstufe nötig war und die Anzahl der Anfragen.

## Einschränkungen

- Nur Werkzeugaufrufe und -ergebnisse kommen infrage; Textnachrichten werden in der Ausgabe nie entfernt
  oder gekürzt (nur im Zustand, den Jev sieht, werden sie reduziert).
- Token-Größen sind Schätzungen aus Zeichenzahlen, kein Tokenizer.
- Die Kalibrierung erfolgt auf Anfragenebene; eine Wahrscheinlichkeit ist kein Beweis, dass ein Ergebnis
  gefahrlos gelöscht werden kann. Der Assistant kann das Werkzeug immer erneut ausführen.
- Der vollständige Zustand wird bei jeder Anfrage wiederholt, eine Unterhaltung nahe der Zustandsobergrenze
  kostet also eine Anfrage pro Handvoll Fragen.

## Claude-Code-Plugin

Das Repository-Stammverzeichnis ist ein Claude-Code-Funktions-Hook-Plugin: `hooks/fast-jev.ts`
ist ein dünner Adapter, der `session.compact`-Transkripte durch `src/` schickt und bei Fehlern oder
unzureichender Reduktion auf Claude Codes eingebaute Zusammenfassung zurückfällt. Konfiguration und
Claude-Code-Typreferenz 2.1.274 stehen in [`hooks/README.md`](hooks/README.md).

### In Claude Code installieren

Funktions-Hooks sind eine Early-Access-Funktion von Claude Code (2.1.274+), das Opt-in-Flag muss also
überall gesetzt sein, wo Claude Code läuft, z. B. in `~/.claude/settings.json`:

```json
{ "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1", "TYPESAFE_API_KEY": "<your key>" } }
```

Füge dann dieses Repository als Plugin-Marketplace hinzu und installiere das Plugin, entweder von der
Shell aus oder als Slash-Befehle innerhalb einer Sitzung:

```sh
claude plugin marketplace add tamaratran/fast-jev-compaction
claude plugin install fast-jev-compaction@fast-jev-compaction
```

Bei der Installation wirst du nach den Plugin-Optionen gefragt (API-Key, Schwellenwerte, `truncateHeadChars`,
…); belasse sie auf den Standardwerten, um `TYPESAFE_API_KEY` aus der Umgebung zu nutzen.
Starte Claude Code neu oder führe `/reload-plugins` aus. Von da an läuft `/compact` (und die
automatische Komprimierung) über Jev: Der Toast lautet
`fast-jev-compaction: kept N/M messages, no summary (…)`, wenn die bereinigte Unterhaltung die
eingebaute Zusammenfassung ersetzt hat, oder `fallback to built-in summary (…)`, wenn Jev nicht genug
entfernen konnte (kurze Sitzungen oder ein Fehler).

Zum Ausführen aus einem Checkout ohne Installation: `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir .`
vom Repository-Stammverzeichnis. Ein Veröffentlichungsschritt ist nicht nötig; der Marketplace ist einfach die
`.claude-plugin/marketplace.json` des Repos.

## Entwicklung

```sh
npm install
npm run typecheck        # Bibliothek + Hook
npm test
npm run build
npm run validate:plugin  # claude plugin validate
TYPESAFE_API_KEY="$(cat ~/.typesafe_key)" npm run demo
```

Die Unit-Tests nutzen ein falsches Jev und kontaktieren TypeSafe nie. Die Demo ist die Live-Netzwerkprüfung.

## Animierte Demo (macOS)

`demo/JevDemo` ist eine kleine native SwiftUI-App, die eine geskriptete, dramatisierte Version des
Komprimierungsablaufs in einem Terminal im Claude-Code-Stil abspielt: Die Werkzeugaufrufe eines festen
Transkripts werden bewertet, Ergebnisse und Aufrufe, die Jev freigibt, werden rot und fallen weg, der Rest
bleibt wortgetreu. Sie ruft nie die API auf; sie existiert, um aufgenommen zu werden.

```sh
demo/JevDemo/build.sh   # baut demo/JevDemo/build/JevDemo.app und startet es
```

Drücke in der App die Leertaste, um von vorn abzuspielen.

## Quelle und Lizenz

- Originalautor: tamaratran
- Originalrepository: https://github.com/tamaratran/fast-jev-compaction
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
