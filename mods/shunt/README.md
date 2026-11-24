# shunt

Ein **Claude-Mod** – ein Claude-Code-Plugin, dessen Verhalten ein Modul mit
[Function Hooks](https://github.com/anthropics/claude-code/issues/91870) ist –,
das die Nutzung in einer Leiste über dem Prompt anzeigt – bei einem
[shunt](https://github.com/pleaseai/shunt)-Gateway den gemeinsamen Kontenpool
von shunt, andernfalls die eigenen Claude-Ratenlimits der Sitzung – und den
Befehl `/shunt:usage` mit der vollständigen Aufschlüsselung des Pools beantwortet.

```
shunt · 5H 5% ↻1h 41m · WK 46% ↻1d 7h · Fable 31% ↻1d 7h ⚠ anthropic degraded
```

```
> /shunt:usage

shunt: pool — degraded   http://127.0.0.1:3001

  5h    ▓▓▓▓▓▓░░░░  62% left   resets 04:11
  7d    ▓▓▓▓▓▓▓▓░░  81% left   resets Sun 01:11
  fable ▓▓░░░░░░░░  19% left   resets Sun 01:11

  claude  ok         5h  71%  7d  84%  fable  19%
  codex   exhausted  5h   0%  7d  40%  fable    —

  headroom left, averaged over the pool's accounts; a shared figure, not a promise about your next request
```

Der Mod liest den Endpunkt [`GET /usage`](https://shunt.sh/reference/endpoints/)
des Gateways und gibt ihn aus. Er beantwortet den Befehl selbst – der Hook kehrt
zurück, ohne `next` aufzurufen, sodass nichts an das Modell gesendet wird und die
Antwort keine Tokens kostet.

## Die Nutzungsleiste

Auf einem shunt-Gateway zeigt die Leiste den Pool, gekennzeichnet mit `shunt ·`. Jede Zahl gibt an, wie viel des Fensters **verbraucht** ist – `1 - remaining`, derselbe poolweite Mittelwert, den der Befehl als verbleibenden Spielraum meldet –, gefolgt von der Zeit bis zur frühesten Zurücksetzung des Fensters. Verbraucht statt übrig, damit die Anzeige derselben Lesart entspricht wie Claudes eigenes `/usage` und wie die Leiste es von shunt abliest. Ab 70 % wird eine Zahl bernsteinfarben, ab 90 % rot. Jeder gepoolte Anbieter, dessen Status nicht `ok` ist, wird am Ende markiert (`⚠ anthropic degraded`: bernsteinfarben bei `degraded`, rot bei `exhausted` oder `capped`), oder der Pool selbst, wenn kein Anbieter aufgeführt ist. Ein Fenster, das kein Konto meldet, wird ausgelassen.

Außerhalb von shunt – kein Gateway eingestellt, ein Gateway, das `GET /usage` mit 404 beantwortet, eine erfolgreiche Antwort, die kein Poolbericht ist, oder ein Pool ohne Anbieter – zeigt die Leiste stattdessen die eigenen Ratenlimits der Sitzung, ohne Kennzeichnung, so wie `$.session.usage()` und `session.measure` sie melden:

```
5H 5% ↻1h 41m · WK 46% ↻1d 7h
```

Auf shunt liest sie `GET /usage` beim Sitzungsstart, danach jede Minute und nach jeder Runde – also in dem Moment, in dem gerade aus dem Pool verbraucht wurde – und ignoriert die eigenen Limits der Sitzung, die vom zuletzt antwortenden Poolkonto stammen. Ein abgelehntes Token (401 oder 403), ein nicht erreichbares Gateway, ein anderer Fehlerstatus oder ein fehlgeschlagener Helfer `shunt gateway token` ist ein Fehler bei shunt und wird daher markiert statt ersetzt: `shunt · ⚠ credential refused` oder `shunt · ⚠ gateway login unavailable` für den Helfer. Ohne Gateway und ohne Ratenlimits (ein API-Schlüssel, der direkt an Anthropic gesendet wird) zeichnet die Leiste nichts. Was ein anderes Plugin in der Leiste zeichnet, bleibt links von ihr stehen.

Du kannst die Leiste für die Sitzung über ihr `[-]` einfalten (Strg+X Strg+A) oder mit der unten beschriebenen Option `usageBand` abschalten.

## Die Zahlen lesen

`remaining` ist der Anteil der kombinierten Kapazität des Pools, der noch **nutzbar** ist; `62 %` bedeutet also, dass 62 % des Spielraums übrig sind, nicht dass 62 % verbraucht sind. Es ist `mean(clamp(cap - utilization, 0, 1))` über alle nicht deaktivierten Konten, die das Fenster melden, wobei `cap` die harte Obergrenze `max_utilization` des Kontos für dieses Fenster ist (`100 %`, wenn keine gesetzt ist): Neun erschöpfte Konten plus ein frisches ohne Obergrenze ergeben `10 %`, nicht `100 %`, und ein Konto bei 44 % unter einer 50-%-Grenze zählt nur `6 %`. Ein Konto, das eine Obergrenze bereits von den Anfragen des Fensters ausschließt, zählt null; eine 5h- oder 7d-Grenze schließt es von allen Anfragen aus, auch von Fable-Anfragen.

Es ist eine **poolweite Aggregation, keine Vorhersage** – das Routing gewichtet auch Verfügbarkeit, Modell, Sitzungsbindung und Priorität, daher ist ein gesunder Wert keine Garantie, dass deine nächste Anfrage angenommen wird. Für den routingbewussten Worst Case verwende stattdessen `GET /api/oauth/usage`.

| Fenster | Was es abdeckt |
| ------- | -------------- |
| `5h`    | Das rollierende 5-Stunden-Sitzungsfenster |
| `7d`    | Das gemeinsame Wochenfenster |
| `fable` | Das auf Fable bezogene Wochenfenster (`7d_oi`) |

Ein Fenster zeigt `—`, wenn kein nicht deaktiviertes Konto es meldet. ChatGPT-/Codex-Konten füllen `5h` und `7d` aus den Antwort-Headern `x-codex-*` und haben kein eigenes Fable-Signal.

`pool` ist die Aggregation über alle gepoolten Anbieter; die Zeilen darunter sind dieselbe Aggregation je Anbieter, sodass eine Sitzung, die zu einem Anbieter geroutet wurde, dessen Spielraum statt des gemischten Wertes lesen kann. Der Endpunkt enthält niemals Kontonamen, Anzahlen, Prioritäten oder Werte einzelner Konten – diese Details bleiben hinter dem nur für Administratoren zugänglichen `GET /admin/api/pool`.

## Voraussetzungen

1. **Richte Claude Code auf dein Gateway**, wie du es bereits für das Routing tust:

   ```bash
   export ANTHROPIC_BASE_URL=http://127.0.0.1:3001
   export ANTHROPIC_AUTH_TOKEN=<your client token>
   ```

2. **Aktiviere den Endpunkt** auf dem Gateway. `GET /usage` ist optional und erfordert entweder `[server.auth]` (Client-Tokens) oder `[server.gateway]` (Gateway-Anmeldung), zusätzlich zur Tabelle `[server.usage]` in `shunt.toml`:

   ```toml
   [server.auth]

   # Presence alone opts in; the table takes no keys.
   [server.usage]
   ```

   Wenn du statt `[server.auth]` `[server.gateway]` verwendest, siehe unten [Sitzungen mit `shunt gateway claude`](#shunt-gateway-claude-sitzungen). `[server.auth]` bezieht seine Tokens aus der Umgebung statt aus der TOML – standardmäßig `SHUNT_CLIENT_TOKENS`, als Paare `name:token` –, und das Gateway startet nicht, wenn die Variable fehlt. Exportiere sie dort, wo das Gateway läuft, mit demselben Token, den du oben als `ANTHROPIC_AUTH_TOKEN` gesetzt hast:

   ```bash
   export SHUNT_CLIENT_TOKENS="claude-code:<your client token>"
   ```

3. **Starte Claude Code mit aktivierten Function Hooks** – das Feature ist im Early Access:

   ```bash
   CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
   ```

Ohne Schritt 3 gibt es keine Leiste; der Befehl existiert weiterhin, greift aber auf `commands/usage.md` zurück, das das Modell bittet, den Endpunkt stattdessen mit einem Werkzeugaufruf zu lesen.

## Install

```
/plugin marketplace add pleaseai/shunt
/plugin install shunt@shunt
```

## Konfiguration

Eine Option, eine Zeile in `/config` (gespeichert in `settings.json` unter `pluginConfigs`):

| Option | Standard | Zweck |
| ------ | ------- | ------- |
| `usageBand` | `true` | Die Leiste über dem Prompt anzeigen. Ausgeschaltet registriert der Mod keine Leiste und fragt nichts ab; `/shunt:usage` antwortet weiterhin |

Der Mod liest fünf Umgebungsvariablen und schreibt keine. Standardmäßig sendet er die Anmeldedaten der Sitzung an das Gateway, an das die Sitzung bereits jede Nachricht sendet, und erreicht damit keinen Host, den sie nicht schon nutzte; `SHUNT_BASE_URL` ist die einzige bewusste Ausnahme und verweist auf ein Gateway deiner Wahl. Ohne jede gesetzte Base-URL fragt er nichts ab, statt die Anmeldedaten an die API von Anthropic zu senden.

| Variable | Zweck |
| -------- | ------- |
| `SHUNT_BASE_URL` | Die Base-URL des Gateways; überschreibt `ANTHROPIC_BASE_URL` |
| `ANTHROPIC_BASE_URL` | Das Gateway, über das diese Sitzung bereits läuft |
| `SHUNT_TOKEN` | Der Client-Token; überschreibt die beiden folgenden, gesendet als `Authorization: Bearer` |
| `ANTHROPIC_AUTH_TOKEN` | Gesendet als `Authorization: Bearer`, so wie Claude Code es tut |
| `ANTHROPIC_API_KEY` | Gesendet als `x-api-key`, so wie Claude Code es tut |

Mit `SHUNT_BASE_URL` kannst du den Pool eines Gateways lesen, während du den Datenverkehr über ein anderes leitest.

### Sitzungen mit `shunt gateway claude`

`shunt gateway claude` entfernt `ANTHROPIC_AUTH_TOKEN` und `ANTHROPIC_API_KEY` aus der Umgebung, die es an Claude Code übergibt, und verdrahtet stattdessen `apiKeyHelper` mit `shunt gateway token`; Claude Code verarbeitet die Ausgabe des Helfers selbst und exportiert sie nie erneut. Wenn keine der obigen Variablen eine Anmeldedaten enthält, liest der Mod daher die zusammengeführten Einstellungen (einschließlich `--settings`) und führt, wenn `apiKeyHelper` der eigene von shunt ist – `shunt gateway token`, als bloßer Name oder als Pfad, so wie ihn der Starter schreibt –, diesen direkt ohne Shell aus und sendet das ausgegebene Gateway-Anmeldetoken als `Authorization: Bearer`. Da keine Shell beteiligt ist, erweitert der Mod ein führendes `~/` in einem nicht in Anführungszeichen stehenden Helferpfad selbst zum Home-Verzeichnis (`HOME`, sonst `USERPROFILE`); ein in Anführungszeichen gesetztes `'~/…'` bleibt wie in einer Shell wörtlich. Die Anmeldung gehört zu dem Gateway, mit dem die Sitzung spricht (`ANTHROPIC_BASE_URL`), und wird nur gesendet, wenn `SHUNT_BASE_URL` fehlt oder dieselbe Base-URL bezeichnet – als Zeichenkette verglichen nach dem Entfernen von Leerzeichen und abschließenden Schrägstrichen, sodass `localhost` und `127.0.0.1` als verschieden gelten –; andernfalls wird der Helfer gar nicht erst ausgeführt. Um den Pool eines anderen Gateways zu lesen, exportiere dafür `SHUNT_TOKEN`. Schlägt dieser Helfer fehl – ein von null abweichender Exit-Code, keine Ausgabe oder er lässt sich nicht starten –, meldet die Leiste `shunt · ⚠ gateway login unavailable` und `/shunt:usage` rät zur Ausführung von `shunt gateway login`, statt stillschweigend die eigenen Limits der Sitzung zu zeigen.

Das Token wird fünf Minuten wiederverwendet, sodass eine Abfrage pro Minute den Helfer nicht jede Minute ausführt. Ein vom Gateway abgelehntes wiederverwendetes Token wird verworfen und der Helfer erneut aufgerufen, da eine Aktualisierung es inzwischen gedreht haben kann. Jeder andere `apiKeyHelper` – ein Passwortmanager, ein Skript mit Abfrage – wird nie ausgeführt: Der Mod würde ihn sonst alle paar Minuten für eine Nutzungszahl starten. Exportiere in einer solchen Sitzung stattdessen `SHUNT_TOKEN` mit einem `[server.auth]`-Client-Token, oder die Leiste fällt auf die eigenen Ratenlimits der Sitzung zurück.

Das Gateway muss eine Gateway-Anmeldung auf `GET /usage` akzeptieren, wofür ein shunt-Build nötig ist, der `[server.gateway]`-Anmeldungen dort authentifiziert; `[server.usage]` mit nur `[server.gateway]` genügt.

## Warum `/shunt:usage` und nicht `/usage`

`/usage` ist ein eingebauter Befehl von Claude Code, und die Engine erlaubt einem Plugin nicht, den Namen eines eingebauten Befehls zu übernehmen:

```
$.command.register: "/usage" refused: it is the built-in /usage
```

`$.command.register` nimmt einen nackten, globalen Namen. Ein **Markdown**-Befehl eines Plugins wird dagegen vom Plugin mit einem Namensraum versehen, sodass `commands/usage.md` in einem Plugin namens `shunt` als `shunt:usage` geführt wird und mit nichts kollidiert. Das Hooks-Modul fängt anschließend `command.run` für diesen Namen ab und antwortet direkt.

## Aufbau

| Pfad | Was es ist |
| ---- | ---------- |
| `hooks/register.tsx` | Die Hooks: `command.run` für `shunt:usage` sowie `session.start`, `session.measure`, `turn.complete` und `ui.render` der Leiste auf `AbovePrompt` |
| `hooks/endpoint.ts` | Ermittelt die Gateway-URL und den Header mit den Anmeldedaten |
| `hooks/report.ts` | Liest den Body von `GET /usage` defensiv |
| `hooks/reading.ts` | Verwandelt einen Umlauf in einen Bericht oder ein Problem, ausführlich und kurz |
| `hooks/views.ts` | Zeichnet die Balken, Prozentsätze und Zurücksetzungszeiten des Befehls |
| `hooks/band.ts` | Die Zellen, Warnungen, Stufen und Countdowns der Leiste, aus dem Pool oder den eigenen Limits der Sitzung |
| `hooks/names.ts` | Der Befehlsname und die festen Texte |
| `types/index.d.ts` | Der Vertrag für `$.state`: die Pool-Momentaufnahme, die Limits der Sitzung und die Uhr, aus der die Leiste zeichnet |
| `commands/usage.md` | Der Befehl und der Fallback ohne Function Hooks |
| `tests/*.spec.ts` | Vitest-Suite über die reinen Module |
| `tests/mod/*.test.tsx` | Engine-Suite über die Hooks, ausgeführt von `claude plugin test` |

## Entwicklung

```bash
# Die statische Analyse der Nebenwirkungen: welche Ereignisse gehookt werden,
# welche $-Aufrufe und Umgebungsvariablen vorgenommen und gelesen werden.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude plugin validate plugins/shunt

# Die Suite der reinen Module und die Typprüfung (beide CI-Gates).
cd plugins/shunt && npm ci && npm run typecheck && npm test

# Die Hooks gegen die Engine selbst: die Leiste und der Befehl, mit Gateway,
# Uhr und Umgebung gemockt. Benötigt eine Claude-Code-Binary, daher nicht in CI.
claude plugin test plugins/shunt

# Direkt aus dem Quellcode gegen ein live Gateway ausführen.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir plugins/shunt
```

`hooks/register.tsx` ist die einzige Hooks-Datei, die `claude-code` importiert. Für die Typprüfung braucht sie die eigene `claude-code.d.ts` der Engine, die Claude Code über `/plugin-types` in das Projekt eines Plugin-Autors schreibt; die anderen Module importieren nichts von der Engine, weshalb die Suite ohne sie läuft. Aus demselben Grund schließt `tsconfig.json` `hooks/register.tsx` von `npm run typecheck` aus, zusammen mit `tests/mod`, der Engine-Suite – dieser Ausschluss ist beabsichtigt, kein Versehen, und um diese eine Datei zu typprüfen, muss zuerst `/plugin-types` ausgeführt werden.

> Function Hooks sind Early Access. Hooks-Module werden nur dort geladen, wo sie
> aktiviert sind, und die API, gegen die dieser Mod geschrieben ist, kann sich
> zwischen Claude-Code-Versionen ohne Ankündigung ändern.

## Lizenz

MIT OR Apache-2.0, passend zum shunt-Projekt.

## Quelle und Lizenz

- Originalautor: pleaseai
- Originalrepository: https://github.com/pleaseai/shunt
- Lizenz: Apache-2.0
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
