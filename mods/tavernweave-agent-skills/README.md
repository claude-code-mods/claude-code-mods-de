# TavernWeaveX无限月读

> **2.4.0 正式发行**:Neue native Antigravity-Unterstützung (AGY) – AGY-Host-PlUGIN-Vorlage, Anweisungsdateien und Persistenz für vier Leitstufen; zugleich wurden Codex- und Claude-Plugins sowie Marketplace-Beschreibung an die Hauptinstallationsliste angeglichen und die Versionskonsistenz wiederhergestellt. Namen und Anzahl der 23 Skills bleiben unverändert. Veröffentlichungsdateien und Prüfdateien: v2.4.0 正式发布页.

> Diese Version baut auf 2.3.6 auf und ergänzt native Antigravity-Unterstützung bei unveränderten 23 Skills. Das seit 2.2.0 vorhandene Claude-Code-Plugin bietet weiterhin automatische Host-Front-Door-Injektion, den Agenten `tavernweave` und den Soul-Modus-Schalter über dem Eingabefeld; das TavernWeave X DSH-Paket enthält nun das Client-Panel „Hand Gottes“ (Rad, vollständige Floating-Fenster, Weltbuch, Frontend-Design- und Animationsdatenbank, Projekt-/Kartenverwaltung) in einer Installation; Weltbuch-Gestaltung und Schreibzugang bleiben erhalten.

<p align="center">
  <img src="docs/assets/tavernweave-v1-cover.png" alt="Eine digitale Weberei in einer Fantasy-Taverne, die Rollenkarten, Weltbücher, Designmaterial und Engineering-Module zu einem einheitlichen Arbeitsablauf verwebt" width="100%">
</p>

<p align="center"><strong>Webe Ideen, Material, Code und Abnahme zu einer wirklich wartbaren Rollenkarte.</strong></p>

TavernWeaveX无限月读 (TW) hilft dir, Ideen in nutzbare und weiter veränderbare Rollenkarten, Webseiten oder kleine Werkzeuge zu überführen. Sage einfach, was du willst oder wo es hakt; TW ordnet Anforderungen ein, schlägt Lösungen vor, erstellt und prüft sie und erklärt den nächsten Schritt. Dazu nutzt es aufgabenbezogen geladene Skills. Es unterstützt Codex, Claude Code und über das TavernWeave X DSH-Pluginpaket auch DeepSeek Harness; im DSH-Paket ist zugleich das Client-Panel „Hand Gottes“ enthalten.

Die Quelle ist TavernWeaveX无限月读 2.4.0 (offizielle Veröffentlichung) mit nativer AGY-Unterstützung, vierstufig persistierten Leitpräferenzen und behobenen Versionsinkonsistenzen zwischen den Hosts; 23 native Skills, Namen und Anzahl unverändert. Die Maschinenkennung `tavernweave-agent-skills`, bestehende Skill-Namen und die Repository-Adresse bleiben erhalten. Vollständiges Paket, Pluginpaket und Prüfdateien: v2.4.0 正式发布页; historische Veröffentlichungen: v2.2.0, v2.1.0, v1.9.1, v1.9.0.

**Hauptzweck des vereinheitlichten Plugins ist es, berechtigten Nutzern TW in langen Cloud-Aufgaben in dots zu ermöglichen.** Codex und dots teilen `TavernWeave-Codex-v2.4.0.zip`; eine eigene Cloud-Version gibt es nicht. TW liefert Skills und Referenzmaterial; Cloud-Ausführung, Fortsetzung, dauerhafter Speicher und Werkzeuge stammen vom Host. Eine lokale Installation synchronisiert nicht automatisch mit dem dots-Konto. Nutzung und Kontozugang: [统一插件指南](docs/plugin-guide.md).

TW kann Weltbücher einzeln entwerfen oder überarbeiten: zuerst Wissensgrenzen, Text und Trigger klären, dann zwischen nativen Einträgen, bedingter Ausgabe, explizitem Lesen oder einer lokalen Mischung wählen. Weltbuch-Inhalte, Gesamtkarte, Weltbau, Variablen und Laufzeit-Debugging werden getrennt übergeben; Budget-Optimierung braucht echte Messungen, Modellwirkung Beobachtung im Host. Auch gewöhnliche Software- und Kartenaufgaben nutzen klarere Anforderungsermittlung und Promptspezifikationen; getroffene Entscheidungen sind wiederverwendbar.

Es gilt die seit 1.9.0 bestätigte „Mondtinte“-Methode: eine vollständige Karte basiert auf Opening und Weltbuch, als reiner Text, MVU Zod oder hybrid organisiert, ergänzt um Weltanschauung, Variablen und Figurenarbeit. Das Frontend folgt Awwwards-Designanforderungen; die Oberfläche bleibt sauber, Floskeln werden je nach Zweck vermieden.

Auch eine einzelne Rollenkarten-Promptregel kann direkt angefordert werden. Der Agent behält Bedeutung und Stärke der Einschränkung und liefert je nach Anfrage Text oder Weltbucheintrag. Bei `bindings`-Typfehlern liefert das Bindungswerkzeug eine klare Diagnose statt einer Array-Methoden-Ausnahme. 1.9.0 behebt außerdem, dass nach fehlgeschlagenem Komponentenexport unter Windows halbfertige Dateien zurückbleiben konnten; nicht bereinigbare Dateien werden ausdrücklich aufgelistet. Änderungen: [更新日志](CHANGELOG.md).

Das Projektfortschrittsboard erzeugt `orchestrate-project-blueprint` weiterhin in jedem Projekt: es zeigt Gesamt- und Modul-Fortschritt für Implementierung und Abnahme, klappt Prüfpunkte und Belege auf und speichert Ideen, Fehler und Review-O-Töne. Es liest Umfang und Abnahme aus der Gesamtdesignvorgabe sowie Status, Belege und nächste Hürde aus NEXT; die Synchronisierung zeigt zuerst Differenzen. Neue Ideen erweitern nicht automatisch den bestätigten Umfang; Prozentwerte ersetzen weder Steuerung noch echte Host-Abnahme. Nutzung: [项目进度画板](docs/project-progress-board.md).

Die Werksbibliothek unterstützt Romane, Original-/Fanmaterial und vernetzte Bild-/Textreferenzen; geliefert wird editierbares Markdown plus JSONL-Index, exportierbar nach SQLite; die Suche erfolgt nach Quelle, Adaptionsversion und Wissensstand. Siehe [作品资料库使用说明](docs/work-library.md).

Alle Fähigkeiten folgen dem Grundsatz „einfache Sprache und Erklärung von Fachbegriffen“; die Stufen Neu, Einstieg, Geübt und Erfahren wählt der Nutzer. Textverfeinerung, vollständige und Architektur-Reviews, Brainstorming, eingebaute Design-Library, Soul und die Anleitung zur Übernahme alter Karten bleiben verfügbar. Die Installationsprüfung richtet sich nach der tatsächlich erhaltenen Maschinenliste; Client-Laden und Qualitäts-/Token-Messungen bleiben eigene Prüfpunkte.

> TavernWeave-Originalinhalte stehen unter der [PolyForm Noncommercial License 1.0.0](LICENSE). Nichtkommerzielle Nutzung, Änderung und Weitergabe sind erlaubt; ohne gesonderte Genehmigung dürfen Original, Änderungen und Weiterverbreitung nicht kommerziell genutzt werden. Bei Weitergabe müssen Lizenz und Urheberhinweise erhalten bleiben. Drittanbieterinhalte unterliegen ihren [eigenen Lizenzen](THIRD_PARTY_NOTICES.md).

## In einem Satz beginnen

Gewöhnliche Kartenerstellung oder Vibe Coding:

```text
我想用 TavernWeave 做一个【描述你想要的作品】。
先看看已有文件，帮我整理成一个能亲手试用的小成果；用大白话说明推荐理由和我需要决定的事情。
```

Wenn Kartendateien bereits vorliegen:

```text
我接手了这张角色卡，想【沿原作继续更新 / 做二创】。
先帮我看懂原卡，说明有哪些材料、哪些内容需要保留，再一起选第一次改动。
```

## Zusammenarbeit im gewählten Tempo

| Leitstufe | Was du bekommst |
| --- | --- |
| Neu | Ein kleiner Schritt nach dem anderen, mit ausführlicher Erklärung von Bedienort, Grund, Fachbegriffen und erwartetem Ergebnis |
| Einstieg | Eine kleine Phase nach der anderen, ebenso ausführlich zu Vorgehen, Zusammenhängen, Abwägungen und Prüfung |
| Geübt | Routineschritte zusammengefasst, mit den entscheidenden Entscheidungen, Gründen und Prüfergebnissen |
| Erfahren | Im Alltag direkt Ergebnisse, Änderungen, Differenzen und Belege, weniger wiederholte Grundlagen |

Du kannst direkt sagen: „Ab jetzt Einstieg“ oder „Setze meine Stufe auf Erfahren“. Vor dem Speichern werden tatsächlicher Ort und Geltungsbereich genannt; bestehende Auswahl bleibt bei Upgrades erhalten; ohne Auswahl wird keine Stufe automatisch zugewiesen. „Diesmal kürzer“ gilt nur für diese Erklärung. **Alle Stufen erklären bei Bedarf oder bei Fehlerbehebung weiterhin ausführlich, es sei denn, du sagst ausdrücklich, dass der betreffende Bereich das nicht braucht.**

Notwendige Fachbegriffe werden beim ersten Auftreten erklärt, mit der Zuordnung „Originalbegriff / einfache Sprache / konkrete Bedeutung“. Einfache Sprache und Leitstufe sind unabhängig von Soul-Persona und Textverfeinerung; das Verlassen eines Modus löscht die Auswahl nicht. Regeln und Beispiele: [共用沟通与引导](skills/consult-tavernweave-library/references/communication-and-guidance.md).

## Optionale Ausdrucks- und Kollaborationsarten

Sanfte Anleitung:

```text
阿瞳助我！
```

Strenge Lernversion:

```text
MTTT.sir，拷打我！
```

Frontend-Review-Easter-Egg:

```text
灵魂杀手！
```

Aus einem Wunsch Gesamtdesign und erste Version verdichten:

```text
脑暴模式
```

Drei Soul-Perspektiven gemeinsam brainstormen:

```text
脑暴模式，Soul 联席
```

Nach Designbestätigung die eingefrorene erste Version starten:

```text
按蓝图开跑第一版
```

Den gesamten Vibe-Code-Wachstumsverlauf aus aktuellen Belegen neu prüfen:

```text
照镜子
```

Nur ein kopierbares, speicherbares vollständiges Textbewertungsformular ausgeben:

```text
照镜子，只要文字评估表单，不要画板
```

Persona-Ebene verlassen:

```text
Soul 归位
```

Soul bleibt eine aufgabenbezogene Portable-Overlay-Schicht. 阿瞳 und MTTT.sir sind zwei öffentliche Lehrprojektionen der MTTT-Methode; 灵魂杀手 prüft das Frontend als inoffizielles Johnny-Silverhand-Fan-Easter-Egg: derbe Kritik ist erlaubt, muss aber Belege liefern und Lösungen nennen. Die drei Plätze sind lediglich drei gekennzeichnete Perspektiven desselben Agenten; sie teilen Fakten, Rechte, 1–2 notwendige Entscheidungen pro Runde (insgesamt höchstens 4) und dasselbe Abschlusskonto – keine drei unabhängigen Modelle. Es erhält weder automatisch ChatGPT-Verlauf noch privates RAG, bleibt nicht über neue Aufgaben bestehen und erweitert weder Datei-, Git-, Netzwerk-, Veröffentlichungs- noch Produktionsrechte.

## Textverfeinerung und vollständige / Architektur-Reviews · v1.4.0

„洗稿这段“, „去 AI 味“ oder „去八股“ ergibt direkt eine überarbeitete Fassung mit erhaltener Bedeutung. Standard ist leichtes Polieren; Strukturumbau oder tiefgreifendes Umschreiben sind möglich; Rollencharakter, Zahlen, Code, Makros und Variablen behalten ihre Constraints.

| Verwendung | Einschalten | Ausschalten |
| --- | --- | --- |
| Einmalig | 洗稿这段…… | Endet nach Abgabe |
| Laufende Aufgabe | 开启持续洗稿模式 | 退出洗稿模式 |
| Arbeitsbereich dauerhaft | 在本工作区开启洗稿模式 | 关闭工作区洗稿模式 |
| Client dauerhaft | 为当前客户端全局开启洗稿模式 | 关闭客户端全局洗稿模式 |

Dauerhafte Modi umfassen erstellten Text, externe Texte, Alltagsnotizen, Pläne und Review-Berichte; Zitate, Code, notwendige Vorlagen und Belege bleiben erhalten. Persistente Modi zeigen zuerst die tatsächliche Regeldatei und die Differenz und schreiben erst nach Zustimmung in einen eigenen Block. Installation/Upgrade von TW schaltet nichts automatisch ein. Das Verlassen einer Aufgabe betrifft nur diese Aufgabe; „查看洗稿模式状态“ unterscheidet die Geltungsbereiche und Host-Ladebelege.

„全量审查“ prüft den gesamten vereinbarten Bereich; „架构审查“ verfolgt Zuständigkeiten, Abhängigkeiten, Zustände und Schlüsselpfade; „全量架构审查“ kombiniert beides. Software und Rollenkarten sind gleichermaßen betroffen. Der Bericht behält geprüft, teilweise geprüft, ungelesen und ausgeschlossen und liefert alle belegten Befunde. Auch „灵魂杀手，全量架构审查“ ist im Soul-Stil möglich; die Zusammenfassung hat höchstens drei Punkte, der vollständige Bericht wird nicht gekürzt. Reviews liefern zuerst schreibgeschützte Ergebnisse.

## Fünf Zugangsebenen

```text
Host Front Door (optionaler lokaler Einstieg)
  -> Soul (阿瞳 / MTTT.sir / 灵魂杀手 / 三席, optional)
    -> 脑暴编排 (Gesamtdesign + First Playable + Blaupause/Blaupausen, optional)
      -> Library (A0 + ST-Leitfäden + Design/Bewegung + Quellen-Wiki + Auswahlseite)
        -> Gemäß Maschinenliste verteilte Engineering-Skills (Erstellung, Komponenten, API, UI, Debug, Wachstumsprüfung, Build, Abnahme usw.)
```

- **Host Front Door (optionaler lokaler Einstieg)** bringt einfache Sprache, Aufgabenrouting und Kollaborationsregeln in den lokalen Client; bei Installation des Claude-Code-Plugins per SessionStart-Hook automatisch injiziert, alternativ zum CLAUDE.md-Block (siehe Claude-Code-Plugin). Die Leitstufe wird separat gespeichert und bleibt bei Aktualisierung erhalten; Dateiabgleich und tatsächliches Client-Laden werden getrennt geprüft.
- **Soul (optionale Persona)** verändert Ton und Lehrweise innerhalb der gewählten Leitstufe, nicht Fakten, Rechte oder Abnahmeergebnisse.
- **脑暴编排** steuert Runden der Richtungsfindung, Entscheidungen in vier Zuständen, die Grenze der ersten Version und den Umfang der Blaupause; kein aktiver Schritt darf ohne Grund rekursiv wuchern. Echte Probleme dürfen vorübergehend unterteilt werden; nach Lösung oder Bestätigung der Blockade muss die Nebenlinie geschlossen und zum übergeordneten Schritt zurückgekehrt werden.
- **Library** wird als Einheit ausgeliefert und bei Bedarf gelesen; eine Installation bedeutet nicht, dass die ganze Bibliothek in jeder Runde geladen wird.
- **Engineering-Skills** erledigen die eigentliche Arbeit. Persona und Material können die Autorität der Ziel-Laufzeit nicht ersetzen.

## Skill-Array

| Skill | Hauptzuständigkeit |
| --- | --- |
| `activate-tavernweave-soul` | Aktivieren, Wechseln oder Beenden des aktuellen 阿瞳-/MTTT.sir-/灵魂杀手-Modus; Johnny ist Frontend-Review-Easter-Egg ohne privates RAG |
| `build-work-library` | Romane, Original-/Fanmaterial, vernetzte Text-/Bildreferenzen; Quellenrückverfolgung, Filter nach Version/Stufe, manuelle Bearbeitung, gestaffelte Fortsetzung, Markdown+JSONL und SQLite-Export |
| `consult-tavernweave-library` | Zugang zu A0, 31 offiziellen ST-Leitfäden und dem C8-Experimentalleitfaden; bedarfsgerechte Abfrage von 462 Design-, 194 Bewegungs-, 86 Konzept-Einträgen, 1.609 destillierten Ledger-Einträgen und Offline-Auswahlseiten |
| `orchestrate-project-blueprint` | Verdichtet Rollenkarten- oder Vibe-Code-Wünsche zu Gesamtdesign, First Playable, gestaffelten Blaupausen, NEXT und antirekursiven Ausführungs-Toren; kann das Soul-Dreisitz anrufen; Fortschrittsboard, Prozentwerte, Feedbackprotokoll und Synchronisierung von Gesamtdesign/NEXT |
| `reflect-on-vibe-code-growth` | Bewertet das Vibe-Code-Fähigkeitsnetz aus aktuellem Codex/Chat/Projekt und Lieferbelegen neu; liefert vollständig kopierbares Textbewertungsformular und siebenkapiteligen Interaktionsbericht, vergleicht nicht veränderbare historische Punkte auf vergleichbarer Skala und speichert anonymisierte, nur anhängende lokale Historie |
| `worldbook-design-and-writing` | Plant, zerlegt, prüft und verfeinert Weltbücher einzeln; wählt gemeinsam native, Vorlagen- oder lokale Mischwege, bewahrt Semantik und Wissensgrenzen; präzise API und Laufzeitabnahme an zuständige Fähigkeiten |
| `tavern-card-builder` | Erkennt Kartentyp und Abhängigkeiten, pflegt Erstellungsautorität, Materialherkunft, Weltbuch, MVU, CoT, Opening und Grenzen der Gedächtnisarchitektur |
| `sillytavern-card-components` | Verlustfreies Zerlegen von Karten, Komponentengrenzen, registry/recipe und Hin-und-zurück-Konsistenz |
| `sillytavern-component-update` | Komponentenweise Aktualisierung, importierbare Testartefakte und Übergabe an die Gesamtkarten-Pipeline; verhindert stilles Neukapseln |
| `sillytavern-render-regex-pipeline` | Prüft Regex-Semantik, placement, Anzeige/Prompt, Tiefe und Phasen mit Fixtures |
| `sillytavern-rolecard-security` | Schreibgeschützter Scan auf Injektion, dynamische Ausführung, Credential-Formen, Remote-Laden und bereichsübergreifende Rechte |
| `sillytavern-database-rolecards` | Tabellenstruktur, Nachrichtenebenen, Bindings und idempotente Migrationen; C8-Kompatibilität auf derselben Ebene bleibt experimentell |
| `sillytavern-extension-dev` | Minimales UI-Extension-Gerüst, Manifest, Lebenszyklus, Fähigkeits-Snapshot und Versions-Tore |
| `sillytavern-rolecard-performance` | Anonymisierte Budgets, Regression und namentliche echte Laufzeit-Samples |
| `sillytavern-media-live2d-runtime` | Medien, Audio, Live2D, Vorladen, Provider, Fallback und Aufräumen |
| `sillytavern-card-pipeline` | Abhängigkeitsvorprüfung, Live-Entwicklungsanpassung, Montage, JSON/PNG, Weltbuch-Synchronisierung und Veröffentlichungstor |
| `sillytavern-api-reference` | Verifiziert versionssensible ST-, Tavern-Helper-, STScript-, EJS-, Makro- und MVU-APIs |
| `sillytavern-runtime-debug` | Verfolgt in echtem SillyTavern iframe, Konsole, DOM, Stile, Daten und Lebenszyklus |
| `sillytavern-embedded-ui` | Opening-Seite, Statusleiste, Kontrollzentrum, Schubladen, Floating-Fenster und mobile Interaktion; baut nach Werk optional Sandbox-Spezifikationen, gemeinsame Simulation, Zustandsvergleich und Schieberegler-Debugging |
| `code-quality-workflow` | Vollständige und Architektur-Reviews, Abdeckungsprotokoll, vollständige Befunde, Tore, minimale Korrekturen, Regression und Finish Mode |
| `rewrite-natural-prose` | Textverfeinerung unter Erhalt von Bedeutung und technischer Struktur; einmalig, aufgabenpersistent sowie Arbeitsbereich-/Client-Persistenz mit getrennter Freigabe |
| `shadcn-tailwind-ui` | Zugängliche Produkt-UIs mit React, shadcn/ui, Radix und Tailwind |
| `rolecard-workshop-ops` | Diagnose und Betrieb konfigurierbarer Veröffentlichungsketten bei gleichzeitigem Schutz von Produktionskoordinaten und Credentials |

## Öffentliche Grenze der Library

Eine Installation enthält gleichzeitig:

- A0 allgemeine Steuerungs-Checkliste als dauerhafte Vorstufe für schreibende Aufgaben;
- 31 offizielle STDB-Leitfäden und ein ausdrücklich als experimentell markiertes C8;
- 462 Design-, 194 Bewegungs- und 86 Konzept-Einträge sowie 1.609 destillierte Ledger-Einträge nach der AFV-Auswahl 243/243;
- 86 direkt verknüpfte lokale Konzept-/Wiki-Dateien, 89 eigene technische Sandboxes und eine einheitliche Offline-Auswahlseite;
- dateiweise Quellen-, Lizenz-, Anonymisierungs- und SHA-256-Liste.

Ausdrücklich nicht verteilt werden die A1-Steuerungsvorlage, das alte imperative B1, Prozessarchive, lokale Belege, AFV raw/inbox, die 243 Quellauswahl-JSONs, privates RAG, Logs, Credentials und fremde Wissensdomänen; erhalten bleibt nur ein Auswahlaggregat ohne private Termintexte. „Zu Kandidaten hinzufügen“ auf der Auswahlseite bedeutet nur `proposed` – keine Annahme, keine Installation, keine Lizenzfreigabe und keine echte Taverne-Abnahme.

Die Offline-Auswahlseite liegt im Installationsverzeichnis:

```text
skills/consult-tavernweave-library/assets/picker/index.html
```

## Erstellung, Fortsetzung und Abnahme

Lange Projekte nutzen Markdown plus YAML-Frontmatter und beschränkte Strukturblöcke, um eine einzige Erstellungsautorität zu führen. Bestätigt, Kandidat, offen, abgelehnt, implementiert, automatische Belege, echte Host-Belege und Steuerbestätigung dürfen nicht vermischt werden. Sagt der Nutzer „weiter“, werden zuerst Autorität, Git/Arbeitsbaum, Artefakte und nächste Hürde wiederhergestellt; eingefrorene Feststellungen werden nicht erneut abgefragt.

Belege werden schichtweise protokolliert:

```text
Quellcode -> automatische Tests -> Offline-Artefakte -> Browser/Desktop -> echtes SillyTavern -> manuelle Abnahme -> Veröffentlichungsfreigabe
```

Keine Schicht darf die nächste vortäuschen; Automatisierung darf niemals selbst `driver-accepted` schreiben.

## Einsteiger-Anleitung

Wer TavernWeave zum ersten Mal nutzt oder wissen will, wie man den Agenten zu Kartenerstellung, Debugging und Abnahme anleitet, liest: [TavernWeave 奶人教程 · Vibe Code 制卡入门](https://liarmttt.github.io/TavernWeave/).

## Installation und Aktualisierung

Codex-Nutzer sehen zuerst die [Codex-spezifische Nutzung und Installation](docs/codex-skills.md): dort wird zwischen Plugin- und eigenständiger Skill-Erkennung unterschieden und ein Python-Einstieg ohne PowerShell geboten (standardmäßig schreibgeschützte Vorschau; erst nach ausdrücklichem Anwenden wird geschrieben).

Die folgenden Schritte dienen der **lokalen Installation** für Codex oder Claude Code. Das Aktivieren und Nutzen von Plugins im dots-Konto ist in der [统一插件指南](docs/plugin-guide.md) beschrieben; lokale Installation synchronisiert nicht automatisch in die Cloud. Der Installer muss die vollständige Skill-Liste des Repositories `skills/` als Quelle verwenden, fehlende Verzeichnisse anlegen und darf nicht nur lokal bereits vorhandene Skills überschreiben. Host Front Door ist eine optionale lokale Erweiterung; vor der Installation sind Zielregeldatei und Differenz anzusehen:

```text
请完整安装并启用这个 Skill 仓库：
https://github.com/LiarMTTT/TavernWeave

不要只覆盖本机已经存在的 Skill。请以仓库 skills/ 的完整目录为准；安装后按机器清单核对完整数量（2.3.0 为 23/23；已发布的 1.9.1 为 22/22），并单独确认 worldbook-design-and-writing、build-work-library、activate-tavernweave-soul、consult-tavernweave-library、orchestrate-project-blueprint、reflect-on-vibe-code-growth、rewrite-natural-prose 和 Library 离线挑选页存在。

请检测我使用的是 Codex 还是 Claude Code，说明 TavernWeave Host Front Door 是可选本地增强；先展示目标路径、受控区块和 diff，得到我确认后再安装。不要改写受控区块以外的用户规则。
```

Aktualisierung:

```text
请把已安装的 TavernWeave 完整更新到这个仓库的最新版本：
https://github.com/LiarMTTT/TavernWeave

更新必须比较“仓库应有目录”和“实际安装目录”，创建新增 Skill，不能只修改旧目录；同时检查 Host Front Door 是否缺失、过期或漂移，明文给出“更新前门/先看 diff/仅更新 Skills”三种选择。完成后返回两份回执，再新建任务验证本地宿主发现。dots 账户导入另按插件指南验证。
```

Wenn Host oder Agent die portable Installation „jeden Skill in ein projektlokales Verzeichnis kopieren“ verwendet, kann im Repository-Stamm ausgeführt werden:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<actual skill root>'
```

Um das globale Front Door bei der Installation zu behandeln, Host explizit wählen und das Script nachfragen lassen:

```powershell
# Codex: Ziel standardmäßig $CODEX_HOME\AGENTS.md, sonst ~/.codex/AGENTS.md
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<actual skill root>' -AgentHost Codex -HostFrontDoorAction Prompt

# Claude Code: Ziel standardmäßig ~/.claude/CLAUDE.md
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<actual skill root>' -AgentHost Claude -HostFrontDoorAction Prompt
```

Installationsaktionen pflegen ausschließlich den versionierten Block `tavernweave-host-front-door`; vorhandene Dateien werden zuerst gesichert, wiederholte Installation ist idempotent, Fehler-/Doppelmarkierungen und Linkpfade werden abgelehnt. Einzelne Vorschau oder Installation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\manage-host-front-door.ps1 -AgentHost Codex -Action Preview
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\manage-host-front-door.ps1 -AgentHost Codex -Action Install
```

Globale Regeländerungen sind ein eigenes Ausführungs-Tor; der Agent darf wegen des Wortes „empfohlen“ nicht still schreiben. Codex/Claude benötigen eine neue Aufgabe oder einen Neustart zur erneuten Erkennung; die Front-Door-Quittung bedeutet nicht, dass der Soul-Skill tatsächlich aufgerufen wurde.

Nach Installation oder Aktualisierung muss die Prüfung gegen den **tatsächlich gescannten Ort** laufen, nicht nur gegen den Quellcode. Der Prüfer lehnt standardmäßig ab, das TavernWeave-Quellverzeichnis selbst als Installationsziel zu verwenden:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-install.ps1 -TargetRoot '<actual plugin root or skill root>'
```

Die Skill-Anzahl in der Quittung muss mit der Installationsliste der verwendeten Quelle übereinstimmen. Beispiel mit den 23 Skills aus 2.3.0; die veröffentlichte Urfassung 1.9.1 hat 22/22:

```text
INSTALLATION VERIFIED: 23/23
Library: present-and-matched
Library picker: present
Soul: present-and-matched
Host rediscovery: required-new-task
```

Werden bei der Prüfung zugleich Host und Regeldatei angegeben, zeigt die Quittung zusätzlich `Host Front Door: current|missing-block|outdated|drifted`; das ist ein empfohlener Status und ändert nichts an der Beurteilung der Dateivollständigkeit nach Maschinenliste.

Unbefindliche persönliche Skills im Zielverzeichnis bleiben erhalten; die offiziellen TavernWeave-Verzeichnisse der Maschinenliste müssen Datei für Datei mit der aktuellen Quelle übereinstimmen. Die letzte Ebene des Ziels muss ausdrücklich `skills` heißen; das Installationsskript lehnt Laufwerkswurzeln, Benutzerwurzeln, Ziele innerhalb des Quell-Repositories und Verzeichnis-Links ab und rollt bei fehlgeschlagenem Austausch bestehende offizielle Skills zurück.

Nach vollständiger Prüfung der betreffenden Version eine neue Aufgabe oder Sitzung starten, damit der lokale Host die Skills neu erkennt. Auch in der neuen Aufgabe müssen Weltbuch-Gestaltung und Schreiben, Soul, 脑暴编排, 照镜子 und Library tatsächlich aufgerufen werden; die Installationsquittung ersetzt keine Host-Erkennung. Das v2.4.0-Pluginpaket, `TavernWeave-DSH-v2.4.0.tgz` (DeepSeek Harness) und die SHA-256-Prüfdateien befinden sich auf der [正式发布页](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0).

Maintainer, die nur vor der Veröffentlichung den Quellbaum selbst prüfen, können ausdrücklich `-AllowSourceTree` verwenden; dieser Schalter darf nicht für Installationsquittungen normaler Nutzer genutzt werden.

## Antigravity / AGY-Plugin

Antigravity-/AGY-Nutzer sehen zuerst [原生插件构建、安装与验证](host-adapters/antigravity/README.md). Das Paket nutzt dieselben 23 Skills, lädt das Front Door über dauerhafte Regeln und bietet einen AGY-Agenten sowie Persistenz für Einstellungen; strenge Prüfung und Client-Test werden getrennt protokolliert. Die Claude-Plugin-Import-Konvertierung im Repository-Stamm ist nicht der Installationsweg des nativen AGY-Pakets.

## Claude-Code-Plugin

Seit 2.2.0 ist das Repository selbst ein Claude-Code-Plugin-Marketplace (`.claude-plugin/`). In Claude Code ausführen:

```text
/plugin marketplace add LiarMTTT/TavernWeave
/plugin install tavernweave-agent-skills@tavernweave
```

Das Plugin enthält vier Teile, von denen die ersten drei eins zu eins dem DSH-Paket entsprechen:

| Bestandteil | Datei | Entspricht DSH |
| --- | --- | --- |
| 23 Skills, Namen mit Präfix `tavernweave-agent-skills:` | `skills/` | Skill provider |
| Automatische Host-Front-Door-Injektion: bei Sitzungsbeginn als Sitzungskontext (erfordert `node` im PATH) | [`hooks/hooks.json`](hooks/hooks.json), [`hooks/session-start-front-door.mjs`](hooks/session-start-front-door.mjs) | system prompt section |
| Agent `tavernweave`: TW-spezifische Persona, ebenfalls schlankes Werkzeugset (ohne Netzwerk und Subagenten) | [`agents/tavernweave.md`](agents/tavernweave.md) | `TavernWeave X DSH` preset |
| Soul-Modus-Schalter: eine Zeile `Soul 阿瞳 ▸` über dem Eingabefeld; die Auswahl füllt nur die passende Anweisung ins Eingabefeld, gesendet wird sie von dir | [`hooks/soul-switch.tsx`](hooks/soul-switch.tsx) (`modules` in `hooks/hooks.json`) | Hand-Gott-Soul-Floating-Widget (CC behält nur dieses UI-Element) |

Der Agent `tavernweave` kann als Hauptsitzung gestartet werden: `claude --agent tavernweave-agent-skills:tavernweave`; alternativ kann Claude in einer normalen Sitzung TW-Aufgaben an ihn delegieren. Wurden Skills zuvor nach `~/.claude/skills` kopiert, kann diese Kopie nach der Umstellung auf das Plugin entfernt werden, damit Skill-Namen nicht doppelt erscheinen.

Der Soul-Modus-Schalter nutzt die Function-Hook-Schnittstelle von Claude Code (offiziell als early access markiert). Er liegt mit dem Front-Door-Hook in derselben `hooks/hooks.json`; auf Claude Code 2.1.299 wurde bestätigt, dass beide geladen werden. Ältere Versionen, die das Feld `modules` ignorieren, sind ungeprüft. Der Schalter protokolliert nur die tatsächlich von dir gesendete Soul-Anweisung, nicht die bestätigte Aktivierung; er sendet nie selbst Nachrichten. Das UI wird mit `claude plugin test .` getestet.

### Duplizierung mit CLAUDE.md-Blöcken vermeiden

Das Front Door braucht nur einen Ort. Beim Start prüft der Hook die in dieser Sitzung geladenen Anweisungsdateien: `$CLAUDE_CONFIG_DIR/CLAUDE.md` (ohne gesetzte Variable `~/.claude/CLAUDE.md`) sowie `CLAUDE.md`, `.claude/CLAUDE.md` und `CLAUDE.local.md` vom aktuellen Verzeichnis bis zur Wurzel. Blöcke in Dateien haben Vorrang:

| Situation | Verhalten des Hooks |
| --- | --- |
| Keine `tavernweave-host-front-door`-Blöcke in diesen Dateien | Plugin-eigenes Front Door injizieren |
| Vorhandener Block gleicher Version | Keine Injektion; Dateiblock gilt |
| Vorhandener Block anderer Version | Kein Front Door, nur ein Versionshinweis; Dateiblock gilt weiter |
| Umgebungsvariable `TAVERNWEAVE_FRONT_DOOR=off` | Überhaupt keine Injektion |

- Nutzer, die über den Plugin-Marketplace installieren, brauchen `manage-host-front-door.ps1` nicht mehr in `CLAUDE.md` zu schreiben. Wer bereits geschrieben hat und künftig die Plugin-Version aktualisieren will, führt `manage-host-front-door.ps1 -AgentHost Claude -Action Remove` aus (das Script sichert zuerst).
- Nutzer, die per ZIP oder durch Kopieren von `skills/` installieren, haben keinen Hook und schreiben weiter wie oben in `CLAUDE.md`.
- Leitstufen-Blöcke (`tavernweave-guidance-preference`) sind nicht betroffen und bleiben separat in `CLAUDE.md`.

Abnahmestatus: Struktur, Duplizierungsregeln, Ausgabeformat und Anweisungskonsistenz von Hook, Agent und Soul-Schalter werden offline durch [`tests/claude-plugin.test.mjs`](tests/claude-plugin.test.mjs) geprüft, das UI-Verhalten des Soul-Schalters durch [`hooks/soul-switch.test.tsx`](hooks/soul-switch.test.tsx) auf Terminal und Desktop; die tatsächliche Injektion in neuen Claude-Code-Sitzungen, der `--agent`-Start und Subagenten-Aufrufe sind noch nicht real geprüft (siehe Installationsliste `claudePlugin.hostLoading`).

## DeepSeek Harness

Seit 2.1.0 wird DSH als eigenes Plugin-Paket installiert; `skills/` darf **nicht** nach `.agents/skills` kopiert werden, und `AGENTS.md` muss nicht geschrieben werden:

1. `TavernWeave-DSH-v2.4.0.tgz` von der [v2.4.0-Veröffentlichungsseite](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0) herunterladen; oder im Quellbaum `node scripts/build-dsh-plugin.mjs` ausführen, um das lokale Paket neu zu erzeugen;
2. DSH Desktop: Seitenleiste **Plugins → Plugin hinzufügen → Plugin von Drittanbietern installieren → lokaler Pfad/tarball**, danach das Bundle aktivieren;
3. Neue Aufgabe erstellen und im Agent-Preset **TavernWeave X DSH** wählen.

CLI/Web-Profile nutzen `dsh plugin --profile <profile> add <local path|tarball|git URL|package name>`; das `desktop`-Profil wird von der Desktop-Shell verwaltet und darf nicht direkt per CLI aufgerufen werden.

Das Plugin-Paket enthält 23 Skills und Host Front Door (als system-prompt section injiziert); Installation, Upgrade und Deinstallation laufen über den DSH-Pluginsmechanismus. Aufbau, Maschinenvertrag und Laufzeit-Tore: [host-adapters/dsh/README.md](host-adapters/dsh/README.md). DSH befindet sich noch in Developer Preview. 2.1.0 wurde auf DSH Desktop `0.2.1-rc.2` real abgenommen: Plugins-Seite, Preset-Auswahl, 23-Skill-Verzeichnis, Front Door, Soul und Terminal mit vollen Rechten; Modellwirkung, Linux/WSL und die echte Taverne bleiben eigene Abnahmegegenstände. OneDrive-reparse-point-Workspaces benötigen bei `workspace-write` volle Rechte oder ein gewöhnliches Verzeichnis (siehe Vertrag `knownEnvironmentIssues`).

## Quelle und Lizenz

- Originalautor: LiarMTTT
- Originalrepository: https://github.com/LiarMTTT/TavernWeave
- Lizenz: PolyForm Noncommercial License 1.0.0
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
