# Die besten Claude-Code-Mods

[English](https://github.com/claude-code-mods/best-claude-code-mods) · [简体中文](https://github.com/claude-code-mods/claude-code-mods-zh) · [繁體中文](https://github.com/claude-code-mods/claude-code-mods-zh-tw) · [日本語](https://github.com/claude-code-mods/claude-code-mods-ja) · [한국어](https://github.com/claude-code-mods/claude-code-mods-ko) · [Español](https://github.com/claude-code-mods/claude-code-mods-es) · [Français](https://github.com/claude-code-mods/claude-code-mods-fr) · **Deutsch** · [Português (Brasil)](https://github.com/claude-code-mods/claude-code-mods-pt-br) · [Русский](https://github.com/claude-code-mods/claude-code-mods-ru)

**Handverlesen, geprüft, festgepinnt. Einmal hinzufügen, 40 Mods.**

> **Kernoberfläche und Dokumentation sind weitgehend lokalisiert; einige Mods enthalten noch englische Texte.** Die Plugin-Quellen sind in diesem Repository enthalten, sodass die wichtigsten Beschriftungen, Befehle und Panels nach der Installation auf Deutsch erscheinen. Code-Bezeichner, Hook-Ereignisnamen, Skills und Anweisungen für das Modell bleiben englisch, damit sich das Verhalten nicht ändert.

Mods sind Claude-Code-Plugins aus Funktions-Hooks: Sie beobachten, ändern oder übernehmen, was Claude Code tut, und zeichnen ihre eigene Oberfläche. Dieser Marketplace sammelt die besten Mods der Community. Jeder ist mit `claude plugin validate` geprüft und auf den geprüften Commit festgelegt, sodass spätere Änderungen des Autors dich nie ungeprüft erreichen.

Erfordert Claude Code 2.1.287 oder neuer.

## Installation

In einer Claude-Code-Sitzung im Terminal:

```
/plugin marketplace add claude-code-mods/claude-code-mods-de
/plugin install <Mod-Name>@claude-code-mods-de
```

Zum Beispiel `/plugin install terminal-browser@claude-code-mods-de`. Mit `/plugin marketplace update claude-code-mods-de` holst du neue Mods und Updates.

## Katalog

Der Eintrag **Reichweite** auf jeder Karte zeigt, was der Code eines Mods laut Validator über das Zeichnen der Oberfläche hinaus tun kann. Lies den Quellcode eines Mods, bevor du ihn installierst: Die Prüfung liest den Code, ohne ihn auszuführen, und ist kein Sicherheitsaudit.

### Dashboards und Nutzung

[![token-optimizer](https://raw.githubusercontent.com/alexgreensh/token-optimizer/main/docs-site/public/media/token-optimizer-desktop-status-bar.gif)](https://github.com/alexgreensh/token-optimizer/tree/e3f1a2dcad8d8999096b8a881c4d98cdba4ef1a5/desktop/token-optimizer-desktop)

#### [`token-optimizer`](https://github.com/alexgreensh/token-optimizer/tree/e3f1a2dcad8d8999096b8a881c4d98cdba4ef1a5/desktop/token-optimizer-desktop)

*von alexgreensh* · Eine Token-Optimizer-Statusleiste, die zeigt, wohin Tokens fließen und wie du weniger verbrauchst.

**Reichweite:** Befehle ausführen, Modellaufrufe, Dateien

`/plugin install token-optimizer@claude-code-mods-de`

---

[![council](https://github.com/hex/claude-council/raw/main/assets/desktop-code-tab.png)](https://github.com/hex/claude-council/tree/f2f7f42122b288599cef8cea97dcc490acea98a5)

#### [`council`](https://github.com/hex/claude-council/tree/f2f7f42122b288599cef8cea97dcc490acea98a5)

*von hex* · Fragt mehrere KI-Agenten gleichzeitig für unterschiedliche Perspektiven ab, mit einem Streaming-Bereich und einer optionalen zusätzlichen Prüfung.

**Reichweite:** Befehle ausführen, Modellaufrufe, Dateien

`/plugin install council@claude-code-mods-de`

---

[![codex-attachment-manager](https://github.com/chipfighter/context-attachment-manager/raw/main/docs/images/hero.gif)](https://github.com/chipfighter/context-attachment-manager/tree/d68a721b7432059c9056d546ff2a26b11b3c0e0c)

#### [`codex-attachment-manager`](https://github.com/chipfighter/context-attachment-manager/tree/d68a721b7432059c9056d546ff2a26b11b3c0e0c)

*von chipfighter* · Sendet frühere Bilder als kurze Platzhalter und holt die Originale per ID zurück, damit lange Bildsitzungen den Prompt-Cache behalten.

**Reichweite:** Netzwerk, MCP

`/plugin install codex-attachment-manager@claude-code-mods-de`

---

[![cache-tax](https://github.com/karanb192/cache-tax/raw/main/site/assets/refusal.gif)](https://github.com/karanb192/cache-tax/tree/535ff33225e666e605e731d78f5ac5efe243c7c3)

#### [`cache-tax`](https://github.com/karanb192/cache-tax/tree/535ff33225e666e605e731d78f5ac5efe243c7c3)

*von karanb192* · Hält den einstündigen Prompt-Cache in Pausen warm, fragt vor dem Senden ohne Cache nach und zeigt die geschätzten Kosten der Neuerstellung.

**Reichweite:** Modellaufrufe

`/plugin install cache-tax@claude-code-mods-de`

---

[![agent-standup-band](https://atoll92.github.io/agent-standup/media/banner.png)](https://github.com/Atoll92/agent-standup/tree/846d5324f7c00f06d598c86e87ed8b51d774b3ac/plugin-band)

#### [`agent-standup-band`](https://github.com/Atoll92/agent-standup/tree/846d5324f7c00f06d598c86e87ed8b51d774b3ac/plugin-band)

*von Atoll92* · Eine Zeile über der Eingabe, wenn eine andere lokale Sitzung dich braucht, und eine Benachrichtigung, wenn sie ihren Zug beendet.

**Reichweite:** Befehle ausführen, Dateien

`/plugin install agent-standup-band@claude-code-mods-de`

---

[![shunt](docs/assets/shunt.png)](https://github.com/pleaseai/shunt/tree/57182b328e92d3c70bc9ca5a1fd1ee9104cfbabb/plugins/shunt)

#### [`shunt`](https://github.com/pleaseai/shunt/tree/57182b328e92d3c70bc9ca5a1fd1ee9104cfbabb/plugins/shunt)

*von pleaseai* · Eine Nutzungsleiste für das Shunt-Gateway: Verbrauch und Zurücksetzungszeit pro Zeitfenster sowie eine vollständige /shunt:usage-Aufschlüsselung.

**Reichweite:** Netzwerk, Befehle ausführen

`/plugin install shunt@claude-code-mods-de`

---

[![tokendoctor](https://github.com/localixai/tokendoctor/raw/main/docs/demo.gif)](https://github.com/localixai/tokendoctor/tree/051fa9598f0a50ed30974b618f2911381b7dcf90)

#### [`tokendoctor`](https://github.com/localixai/tokendoctor/tree/051fa9598f0a50ed30974b618f2911381b7dcf90)

*von localixai* · Spielt deine früheren Sitzungen ab, um zu zeigen, was jede Änderung gespart hätte, und wendet nur das an, was du auswählst.

**Reichweite:** Befehle ausführen, Modellaufrufe

`/plugin install tokendoctor@claude-code-mods-de`

---

[![skins](https://github.com/hellosverre/claude-skins/raw/main/docs/demo.gif)](https://github.com/hellosverre/claude-skins/tree/cf0d39f3785d5c5a4b6189ecc487b1ac479efea0)

#### [`skins`](https://github.com/hellosverre/claude-skins/tree/cf0d39f3785d5c5a4b6189ecc487b1ac479efea0)

*von hellosverre* · Skins und fünfzehn Themes für das Transkript, mit reichhaltigen Karten und einer Nutzungsleiste; /skin wechselt sie live.

**Reichweite:** Netzwerk, Befehle ausführen, Modellaufrufe, Dateien

`/plugin install skins@claude-code-mods-de`

---

[![ctx-handoff](docs/assets/ctx-handoff-mod.png)](https://github.com/cablate/ctx-handoff-mod/tree/a416713a0495be799a31f3650e18458e242270c7)

#### [`ctx-handoff`](https://github.com/cablate/ctx-handoff-mod/tree/a416713a0495be799a31f3650e18458e242270c7)

*von cablate* · Verwandelt, was du Claude beibringst, in Projektnotizen, fängt typische Fehler ab, hält den Cache warm und setzt lange Sitzungen fort.

**Reichweite:** Modellaufrufe, Dateien

`/plugin install ctx-handoff@claude-code-mods-de`

---

[![ripple](https://github.com/PBJ-2/clauderipple/raw/main/docs/media/demo.webp)](https://github.com/PBJ-2/clauderipple/tree/c1c6b76a9e4e7a51df2ec5907d6e41d6bf8591e3/packages/mod)

#### [`ripple`](https://github.com/PBJ-2/clauderipple/tree/c1c6b76a9e4e7a51df2ec5907d6e41d6bf8591e3/packages/mod)

*von PBJ-2* · Wählt pro Eingabe den Denkaufwand und pro delegierter Aufgabe den Worker, hält den Prompt-Cache warm und zeigt, wohin jede Anfrage ging.

**Reichweite:** Netzwerk, Befehle ausführen, Modellaufrufe, MCP, Dateien

`/plugin install ripple@claude-code-mods-de`

---

[![tavernweave-agent-skills](https://github.com/LiarMTTT/TavernWeave/raw/main/docs/assets/tavernweave-v1-cover.png)](https://github.com/LiarMTTT/TavernWeave/tree/f9863d2b05305457fe9ed8b0c5688d52aca400a5)

#### [`tavernweave-agent-skills`](https://github.com/LiarMTTT/TavernWeave/tree/f9863d2b05305457fe9ed8b0c5688d52aca400a5)

*von LiarMTTT* · 23 gemeinsame Skills für Rollenkarten, Softwarearbeit und begrenzte Cloud-Aufgaben, plus ein Soul-Modus-Schalter über der Eingabe.

**Reichweite:** —

`/plugin install tavernweave-agent-skills@claude-code-mods-de`

---

[![agent-usage-guard](https://github.com/rbartoli/agent-usage-guard/releases/download/agent-usage-guard--v1.0.0/agent-usage-guard.gif)](https://github.com/rbartoli/agent-usage-guard/tree/02594c2620be9eb60c32e2f77d9d512d9f61b205)

#### [`agent-usage-guard`](https://github.com/rbartoli/agent-usage-guard/tree/02594c2620be9eb60c32e2f77d9d512d9f61b205)

*von rbartoli* · Hält Subagenten-Verzweigung, umfangreiche Kontext-Eingaben und Wiederholungsschleifen zurück, bevor sie dein Nutzungsfenster verbrauchen.

**Reichweite:** Modellaufrufe, Dateien

`/plugin install agent-usage-guard@claude-code-mods-de`


### Agenten und Subagenten

[![shared-session](https://github.com/Paradigm-Study/claude-share/raw/main/docs/assets/invitation-demo.png)](https://github.com/Paradigm-Study/claude-share/tree/9d88f996ac4245c756a89b34e98cfde375028950/plugin)

#### [`shared-session`](https://github.com/Paradigm-Study/claude-share/tree/9d88f996ac4245c756a89b34e98cfde375028950/plugin)

*von Paradigm-Study* · Teile eine Sitzung per Link oder mit deinem Team; Teammitglieder steigen aus ihrem eigenen Claude Code ein und sehen jeden Zug live mit.

**Reichweite:** —

`/plugin install shared-session@claude-code-mods-de`

---

[![flightdeck](https://github.com/scasella/claude-flightdeck/raw/main/docs/media/demo.gif)](https://github.com/scasella/claude-flightdeck/tree/626cc0b46d417f81bbff9f5ba3b49abaf8912a85)

#### [`flightdeck`](https://github.com/scasella/claude-flightdeck/tree/626cc0b46d417f81bbff9f5ba3b49abaf8912a85)

*von scasella* · Ein Live-Agenten-Dashboard: Modell-Vitalwerte, ein bereitschaftshabender Architekt, Berechtigungsprüfungen, Subagenten-Karten und ein Sitzungsprotokoll.

**Reichweite:** —

`/plugin install flightdeck@claude-code-mods-de`

---

[![start](https://github.com/rsmdt/the-startup/raw/main/logo.png)](https://github.com/rsmdt/the-startup/tree/e803d51fdb423271d3dde189f5416f3ec51386a9/plugins/start)

#### [`start`](https://github.com/rsmdt/the-startup/tree/e803d51fdb423271d3dde189f5416f3ec51386a9/plugins/start)

*von rsmdt* · Workflows-Orchestrierungsbefehle für agentische Softwareentwicklung.

**Reichweite:** Dateien

`/plugin install start@claude-code-mods-de`

---

[![lane-stack](docs/assets/claude-lane-stack.png)](https://github.com/VKirill/claude-lane-stack/tree/8bac2b876b72053aa445bb9d1c7c6079bfc4ba8c/plugins/lane-stack)

#### [`lane-stack`](https://github.com/VKirill/claude-lane-stack/tree/8bac2b876b72053aa445bb9d1c7c6079bfc4ba8c/plugins/lane-stack)

*von VKirill* · Ein Solo-PM-Förderband für Claude Code: Orchestrator-Agenten, Lane-Playbooks sowie Befehle zum Einstieg und Fortsetzen.

**Reichweite:** Netzwerk, Modellaufrufe

`/plugin install lane-stack@claude-code-mods-de`


### Produktivität und Kontext

[![pebrel-prompt-suggestions](https://github.com/Kuddev/pebrel/raw/main/docs/screenshots/nebula-claude-session.png)](https://github.com/Kuddev/pebrel/tree/ed9b2331340877ba3d775e38c4df6bd1a2abb1fe/pebrel_app/res/prompt-suggestions/claude)

#### [`pebrel-prompt-suggestions`](https://github.com/Kuddev/pebrel/tree/ed9b2331340877ba3d775e38c4df6bd1a2abb1fe/pebrel_app/res/prompt-suggestions/claude)

*von Kuddev* · Native Eingabevorschläge bei leerer Eingabe über die Pebrel-Sitzungsbrücke.

**Reichweite:** Netzwerk

`/plugin install pebrel-prompt-suggestions@claude-code-mods-de`

---

[![fast-jev-compaction](docs/assets/fast-jev-compaction.png)](https://github.com/tamaratran/fast-jev-compaction/tree/e3f262a7f4d42bd8dd32ced30d26176f7cb545b0)

#### [`fast-jev-compaction`](https://github.com/tamaratran/fast-jev-compaction/tree/e3f262a7f4d42bd8dd32ced30d26176f7cb545b0)

*von tamaratran* · Wortgetreue, Jev-gesteuerte Komprimierung von Claude-Code-Sitzungen.

**Reichweite:** Netzwerk, Modellaufrufe

`/plugin install fast-jev-compaction@claude-code-mods-de`

---

[![lot-map](https://github.com/alexeyw/lot-map/raw/main/docs/demo.gif)](https://github.com/alexeyw/lot-map/tree/ad60f057902765d778eedde770d337be45fac3af)

#### [`lot-map`](https://github.com/alexeyw/lot-map/tree/ad60f057902765d778eedde770d337be45fac3af)

*von alexeyw* · Eine Live-Karte neben dem Chat: Speicher, Dateien, Shell, Web, Modell, Agenten, Skills und Hooks leuchten auf, wenn sie genutzt werden.

**Reichweite:** —

`/plugin install lot-map@claude-code-mods-de`

---

[![storybloq](https://raw.githubusercontent.com/Storybloq/storybloq/main/assets/board.png)](https://github.com/Storybloq/storybloq/tree/f0b4c08e3a15ffb9841e5a3058c6b1ca57607154/plugins/storybloq)

#### [`storybloq`](https://github.com/Storybloq/storybloq/tree/f0b4c08e3a15ffb9841e5a3058c6b1ca57607154/plugins/storybloq)

*von Storybloq* · Projektgedächtnis: Tickets, Issues, Übergaben und Erkenntnisse in einem Ordner .story/ in deinem Repository.

**Reichweite:** Dateien

`/plugin install storybloq@claude-code-mods-de`

---

[![just-do-it](docs/assets/claude-ops.png)](https://github.com/Lifecycle-Innovations-Limited/claude-ops/tree/e434ef7e612f2ff5769def6101fc9d984888d377/claude-ops/skills/ops-jdi/plugin)

#### [`just-do-it`](https://github.com/Lifecycle-Innovations-Limited/claude-ops/tree/e434ef7e612f2ff5769def6101fc9d984888d377/claude-ops/skills/ops-jdi/plugin)

*von Lifecycle-Innovations-Limited* · Führt autorisierte Arbeit durch Prüfung und Auslieferung weiter und zeigt behebbare Einrichtungsprobleme.

**Reichweite:** Befehle ausführen, Modellaufrufe

`/plugin install just-do-it@claude-code-mods-de`

---

[![filetree](https://github.com/data-goblin/claude-code-filetree/raw/main/media/filetree-shimmer.gif)](https://github.com/data-goblin/claude-code-filetree/tree/1fdc3a963f2dc22a939f661ff0ff5a76646c9112)

#### [`filetree`](https://github.com/data-goblin/claude-code-filetree/tree/1fdc3a963f2dc22a939f661ff0ff5a76646c9112)

*von data-goblin* · Ein Dateibaum im IDE-Stil, der zeigt, was Claude tut und wo in deinen Dateien.

**Reichweite:** Befehle ausführen, Modellaufrufe, Dateien

`/plugin install filetree@claude-code-mods-de`

---

[![jev-auto-compact](https://github.com/notque/vexjoy-agent/raw/main/docs/repo-hero.png)](https://github.com/notque/vexjoy-agent/tree/c68ac1fea2a03e437ccc95112d1e56e467a9bd00/plugins/jev-auto-compact)

#### [`jev-auto-compact`](https://github.com/notque/vexjoy-agent/tree/c68ac1fea2a03e437ccc95112d1e56e467a9bd00/plugins/jev-auto-compact)

*von notque* · Bei 60 % Kontext werden veraltete Tool-Aufrufe ohne Generierung entfernt; statt auf eine LLM-Zusammenfassung zurückzufallen, wird übersprungen.

**Reichweite:** Netzwerk, Modellaufrufe

`/plugin install jev-auto-compact@claude-code-mods-de`

---

[![caliber-jev-compaction](https://github.com/caliber-ai-org/ai-setup/raw/master/assets/readme/pillars.png)](https://github.com/caliber-ai-org/ai-setup/tree/f5dbc002022a8a10acad25c1cce23ddefdc19d0d/plugin/caliber-jev-compaction)

#### [`caliber-jev-compaction`](https://github.com/caliber-ai-org/ai-setup/tree/f5dbc002022a8a10acad25c1cce23ddefdc19d0d/plugin/caliber-jev-compaction)

*von caliber-ai-org* · Wortgetreue, Jev-gesteuerte Komprimierung von Claude-Code-Sitzungen.

**Reichweite:** Netzwerk, Modellaufrufe

`/plugin install caliber-jev-compaction@claude-code-mods-de`

---

[![operator](https://github.com/aerovato/operator-memory/raw/main/docs/assets/change-the-loop.png)](https://github.com/aerovato/operator-memory/tree/93c3fce64f0a72adeb89fa868600eb418548ec07/packages/claude-code)

#### [`operator`](https://github.com/aerovato/operator-memory/tree/93c3fce64f0a72adeb89fa868600eb418548ec07/packages/claude-code)

*von aerovato* · Beständiges Projekt- und Nutzergedächtnis für agentengesteuerte Entwicklung.

**Reichweite:** —

`/plugin install operator@claude-code-mods-de`

---

[![carbon](https://github.com/gwittebolle/claude-carbon/raw/main/docs/desktop-pane.png)](https://github.com/gwittebolle/claude-carbon/tree/9ad53f1dd07fb0e11fcdb94d294ed794d660cf4b)

#### [`carbon`](https://github.com/gwittebolle/claude-carbon/tree/9ad53f1dd07fb0e11fcdb94d294ed794d660cf4b)

*von gwittebolle* · Verfolgt den CO₂-Fußabdruck deiner Claude-Code-Sitzungen im Terminal und in der Desktop-App.

**Reichweite:** Dateien

`/plugin install carbon@claude-code-mods-de`

---

[![work-mode](https://github.com/danyuchn/claude-work-mode/raw/main/promo/demo-poster-en.png)](https://github.com/danyuchn/claude-work-mode/tree/e19eda1e8465308bd79a74fad295cf9b6d9cdf71/plugins/work-mode)

#### [`work-mode`](https://github.com/danyuchn/claude-work-mode/tree/e19eda1e8465308bd79a74fad295cf9b6d9cdf71/plugins/work-mode)

*von danyuchn* · Sitzungsmodi: auto (keine Rückfragen mitten in der Aufgabe), out (Stapelarbeit delegieren) und wrap (zusammenführen und abschließen).

**Reichweite:** Befehle ausführen, Dateien

`/plugin install work-mode@claude-code-mods-de`

---

[![show-your-work](https://github.com/iamumeransari/claude-show-your-work/raw/main/docs/homepage.jpg)](https://github.com/iamumeransari/claude-show-your-work/tree/71e546044e3ba61b98a6938a03270da791f9ca2e)

#### [`show-your-work`](https://github.com/iamumeransari/claude-show-your-work/tree/71e546044e3ba61b98a6938a03270da791f9ca2e)

*von iamumeransari* · Zeigt fertige Arbeit direkt im Terminal: Screenshots, Klick-durch-Videos und synchronisierte Qualitätsprüfungen vorher/nachher.

**Reichweite:** Netzwerk, Befehle ausführen, Modellaufrufe, Dateien

`/plugin install show-your-work@claude-code-mods-de`

---

[![inbox](docs/assets/inbox.png)](https://github.com/petekp/inbox/tree/02e441cd447edf86fc30fbd03e9117a8ead9da7a)

#### [`inbox`](https://github.com/petekp/inbox/tree/02e441cd447edf86fc30fbd03e9117a8ead9da7a)

*von petekp* · Sammelt die Fragen, Aufgaben, Erkenntnisse und PRs, die in einer Sitzung auf dich warten.

**Reichweite:** —

`/plugin install inbox@claude-code-mods-de`

---

[![compact-adviser](https://github.com/kunchenguid/compact-adviser/raw/main/docs/hint-status-line.png)](https://github.com/kunchenguid/compact-adviser/tree/37fa1a665b8933de68c90014312060e862cf121a/packages/claude-mod)

#### [`compact-adviser`](https://github.com/kunchenguid/compact-adviser/tree/37fa1a665b8933de68c90014312060e862cf121a/packages/claude-mod)

*von kunchenguid* · Schlägt /compact an einem abgeschlossenen Prüfpunkt vor (oder führt es auf Wunsch aus), bewertet von TypeSafe Jev.

**Reichweite:** Netzwerk, Modellaufrufe, Dateien

`/plugin install compact-adviser@claude-code-mods-de`


### Darstellung und Vorschau

[![terminal-browser](docs/assets/terminal-browser.webp)](https://github.com/zenbu-labs/terminal-browser/tree/fa9e5eb053d2a1da11f7ccba720a0d3d389c05a6/claude-code-plugin)

#### [`terminal-browser`](https://github.com/zenbu-labs/terminal-browser/tree/fa9e5eb053d2a1da11f7ccba720a0d3d389c05a6/claude-code-plugin)

*von zenbu-labs* · Ein Browser direkt in Claude Code: Websites und HTML ansehen und dem Agenten die Steuerung des integrierten Browsers erlauben.

**Reichweite:** Netzwerk, Befehle ausführen, Modellaufrufe, Dateien

`/plugin install terminal-browser@claude-code-mods-de`

---

[![prismantis](https://github.com/NahumLitvin/prismantis/raw/main/docs/tour.gif)](https://github.com/NahumLitvin/prismantis/tree/3718a40abc57b836108a65bd9f01d06d3237e52d/plugin)

#### [`prismantis`](https://github.com/NahumLitvin/prismantis/tree/3718a40abc57b836108a65bd9f01d06d3237e52d/plugin)

*von NahumLitvin* · Farbenfrohe, anpassbare Darstellung von Antworten: Tabellen, Überschriften, Code, Zahlen, Pfade und Links.

**Reichweite:** Befehle ausführen, Dateien

`/plugin install prismantis@claude-code-mods-de`


### Sicherheit und Schutz

[![lcu-approve](https://github.com/amontlabs/lcu/raw/main/docs/assets/approval-demo.gif)](https://github.com/amontlabs/lcu/tree/1bd45b304295c7665b559fcc32f7b3a8f1b1d859/adapters/claude-mod/lcu-approve)

#### [`lcu-approve`](https://github.com/amontlabs/lcu/tree/1bd45b304295c7665b559fcc32f7b3a8f1b1d859/adapters/claude-mod/lcu-approve)

*von amontlabs* · Genehmigung pro App für die Computer-Nutzung: für dieses Gespräch erlauben, immer erlauben oder ablehnen, plus ein Panel genehmigter Apps.

**Reichweite:** Befehle ausführen, MCP, Dateien

`/plugin install lcu-approve@claude-code-mods-de`

---

[![agentctl](https://raw.githubusercontent.com/sd0xdev/sd0x-harness/main/banner.jpg)](https://github.com/sd0xdev/sd0x-harness/tree/b0206637edd2e44c993da12b6b30858f96bc3cdc/mods/agentctl)

#### [`agentctl`](https://github.com/sd0xdev/sd0x-harness/tree/b0206637edd2e44c993da12b6b30858f96bc3cdc/mods/agentctl)

*von sd0xdev* · Eine Steuerungsebene für eine Claude-Code-Sitzung: Aufgabenumfang, Belege und Übergabe.

**Reichweite:** Befehle ausführen, Modellaufrufe, Dateien

`/plugin install agentctl@claude-code-mods-de`

---

[![multi-core](docs/assets/cc-multi-cli-plugin.png)](https://github.com/greenpolo/cc-multi-cli-plugin/tree/66d9b0a6b06b25fd648ecd53311a647bb57e2fb4/plugins/multi-core)

#### [`multi-core`](https://github.com/greenpolo/cc-multi-cli-plugin/tree/66d9b0a6b06b25fd648ecd53311a647bb57e2fb4/plugins/multi-core)

*von greenpolo* · Nutze ChatGPT-, Cursor-, OpenCode- und Antigravity-Modelle in einer Sitzung und wechsle mit /model.

**Reichweite:** Netzwerk, Modellaufrufe

`/plugin install multi-core@claude-code-mods-de`

---

[![jevmem-pane](docs/assets/jevmem.png)](https://github.com/Avinash-jetwani/jevmem/tree/c29753ccb2c9706e417fda25efa422682358955b/pane)

#### [`jevmem-pane`](https://github.com/Avinash-jetwani/jevmem/tree/c29753ccb2c9706e417fda25efa422682358955b/pane)

*von Avinash-jetwani* · Ein Seitenbereich, der zeigt, was jevmem abgerufen hat, was seine Schutzlogik entschieden hat und was der letzte Zug gespeichert hat.

**Reichweite:** Befehle ausführen, Dateien

`/plugin install jevmem-pane@claude-code-mods-de`


### Git, PRs und Deployment

[![fm](https://github.com/kunchenguid/firstmate/raw/main/assets/banner.png)](https://github.com/kunchenguid/firstmate/tree/427056c4181c41074ad24f051f79919330df0fa5/.claude/mods/firstmate-calm)

#### [`fm`](https://github.com/kunchenguid/firstmate/tree/427056c4181c41074ad24f051f79919330df0fa5/.claude/mods/firstmate-calm)

*von kunchenguid* · Die Segelboot-Animationsanzeige und eine nur für das Gespräch sichtbare Transkriptansicht, die eine Calm-Modus-Einstellung über Sitzungen hinweg teilt.

**Reichweite:** Dateien

`/plugin install fm@claude-code-mods-de`

---

[![turbo](https://github.com/tobihagemann/turbo/raw/main/assets/logo/thunderbolt-icon-256.png)](https://github.com/tobihagemann/turbo/tree/3bc6b4436d96be22497109e16e68fe4dfa323531/claude)

#### [`turbo`](https://github.com/tobihagemann/turbo/tree/3bc6b4436d96be22497109e16e68fe4dfa323531/claude)

*von tobihagemann* · Eine von Menschen kontrollierte agentische Software-Fabrik: Du entscheidest, was gebaut wird, und bewertest das Ergebnis; Skills bauen und liefern es.

**Reichweite:** Modellaufrufe, Dateien

`/plugin install turbo@claude-code-mods-de`

---

[![mazyos](docs/assets/MazyOS.png)](https://github.com/Mazzeo-Marketing/MazyOS/tree/d2b65b392f1ee230afb088d155fc734def5f105d)

#### [`mazyos`](https://github.com/Mazzeo-Marketing/MazyOS/tree/d2b65b392f1ee230afb088d155fc734def5f105d)

*von Mazzeo-Marketing* · Ein portugiesisches Business-OS-Plugin: Das Gedächtnis deiner Firma in jeder Sitzung, Markenidentität in allen Ausgaben und 17 Marketing-/SEO-Skills.

**Reichweite:** Dateien

`/plugin install mazyos@claude-code-mods-de`

---

[![engineer](docs/assets/engineer.png)](https://github.com/swingerman/engineer/tree/ae4cb5fe32007dd6a3d717c9998dcfb12b1f348e/engineer)

#### [`engineer`](https://github.com/swingerman/engineer/tree/ae4cb5fe32007dd6a3d717c9998dcfb12b1f348e/engineer)

*von swingerman* · Ein strukturiertes Methoden-Set für agentische Softwareentwicklung: Aufnahme, Akzeptanzkriterien, Spezifikation, Planung, Implementierung, Prüfung und Härtung.

**Reichweite:** Befehle ausführen, Modellaufrufe

`/plugin install engineer@claude-code-mods-de`

## Einen Mod vorschlagen

Öffne ein Issue mit dem Link zum Repository des Mods. Um ihn selbst hinzuzufügen, ergänze einen Eintrag in `community.json` (Repository, Ordner, geprüfter Commit, Kategorie, Lizenz), schreibe seine Einzeiler in `readme/summaries.json`, führe `python3 scripts/build-catalog.py` aus und öffne einen Pull Request.

## Danksagung und Lokalisierung

Jeder Mod gehört seinem Originalautor und behält seine eigene Lizenz. Neben dem Sammeln stellt dieses Repository eine **deutsche Lokalisierung** bereit: Die Plugins sind unter `mods/` gebündelt, ihre Beschriftungen, Befehlsbeschreibungen, Panels und Prompts sind übersetzt, und die Dokumentation jedes Mods ist ebenfalls übersetzt (das Original bleibt als `README.en.md` erhalten). Der Originalautor und die Lizenz sind am Ende jeder Dokumentation genannt. Wenn du eine lokalisierte Kopie entfernt oder die Urheberangabe geändert haben möchtest, öffne bitte ein Issue.

Inoffizielles Projekt; nicht mit Anthropic verbunden.
