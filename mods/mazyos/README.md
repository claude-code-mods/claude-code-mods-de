# MazyOS: das Betriebssystem für dein Unternehmen in Claude Code

> Claude-Code-Plugin auf Deutsch. Das Gedächtnis deiner Firma, deine visuelle
> Identität und 17 Skills für Marketing, SEO, Google Ads und
> Kundenakquise. Du führst, Claude arbeitet.

Du installierst es einmal. Danach weiß Claude in jedem Ordner deines
Unternehmens von Anfang an, wer du bist, wie du sprichst und was diese Woche
zählt. Bittest du um ein Karussell, erscheint es in deinem Markendesign.
Bittest du um Leads, durchsucht er Google Maps und baut dir eine
Vorschau-Website. Bittest du um den Anzeigenbericht, liest er die CSV und
zeigt dir, wo das Geld abfließt.

Lass uns loslegen.

---

## Was MazyOS ist

Claude Code ist das Tool von Anthropic, das Claude auf deinem Computer in
einem deiner Ordner ausführt. MazyOS ist ein Plugin dafür: ein Paket aus
Skills (Abläufen, denen Claude folgt) und einem Mod (einem Stück Code, das
Claude Code während der Arbeit verändert).

Zusammen machen sie Claude zu einem KI-Agenten, der dein Unternehmen kennt.
Konkret:

**Er erinnert sich.** Drei Textdateien in `_memoria/` speichern, wer das
Unternehmen ist, welcher Ton du triffst und worauf du gerade fokussiert bist.
Jede Sitzung beginnt mit diesen Dateien im Kontext. Wenn du etwas
korrigierst („schreib nicht so“, „dieser Kunde ist gegangen“), fragt Claude,
ob er es speichern soll, und speichert es am richtigen Ort.

**Er trägt deine Handschrift.** `identidade/design-guide.md` speichert
Farben, Schriften und Logo. Karussell, Angebot, Folie: alles erscheint mit
deiner Marke.

**Er übernimmt die Routine.** 17 fertige Skills und ein Weg, eigene zu
erstellen: Du erzählst, was sich jede Woche wiederholt, und Claude macht
daraus eine Skill.

Du musst nicht programmieren können. Du musst nur Fragen zu deinem
Unternehmen beantworten können.

---

## MazyOS für Claude Code installieren

Öffne Claude Code in einem beliebigen Ordner und füge ein:

```
/plugin install mazyos --marketplace mazzeoia/MazyOS
```

Er fragt, ob der Marketplace hinzugefügt werden darf (`y`) und in welchem
Geltungsbereich. Wähle `user`, dann gilt es für alle deine Ordner. Danach
erscheinen drei Optionen (Panel, Statuszeile, Git-Bremse). Du kannst alles
eingeschaltet lassen; unter `/config` kannst du es jederzeit ändern.

Lieber das Terminal? Geht auch:

```bash
claude plugin install mazyos --marketplace mazzeoia/MazyOS
```

In der Claude-Desktop-App, in der es `/plugin` nicht gibt: klicke auf `+`
neben dem Eingabefeld, dann auf Plugins, Add marketplace mit
`mazzeoia/MazyOS` und anschließend Add plugin.

Noch kein Claude Code? Es ist von Anthropic, installiert über die Website
([code.claude.com](https://code.claude.com)), läuft auf Mac, Windows und
Linux und benötigt entweder einen kostenpflichtigen Claude-Plan (Pro, Max,
Team) oder einen API-Schlüssel.

---

## Das System in deinem Unternehmen in Betrieb nehmen

Erstelle einen Ordner mit dem Namen deines Unternehmens (oder nutze einen
vorhandenen), öffne Claude Code darin und führe aus:

```
/mazyos:instalar
```

Er baut die Struktur (`_memoria/`, `identidade/`, `marketing/`,
`saidas/`, `dados/`, `scripts/`) auf und führt ein etwa fünfminütiges
Interview: Was verkaufst du, an wen, wie schreibst du, wo hakt es heute,
welche Markenfarben gibt es? Du antwortest nur. Am Ende ist das Gedächtnis
gefüllt und das System kennt dich.

Das machst du einmal. Danach genügt es, Claude im Ordner zu öffnen und
Dinge anzufordern.

---

## Was sich mit MazyOS in Claude Code ändert

Das ist der Teil mit dem Mod. Innerhalb eines MazyOS-Ordners:

- **Das Gedächtnis kommt von selbst.** Unternehmen, Vorlieben und Strategie
  gehen als Projektanweisungen in den Kontext, neben `CLAUDE.md`. Ändert
  sich eine Datei, bekommt Claude die neue Version. Niemand muss ihn zum
  Lesen auffordern.
- **Die Regeln kommen mit.** Das Gedächtnis vor der Antwort lesen, vor dem
  Speichern einer Korrektur nachfragen, bei geändertem Kontext Bescheid
  sagen, für wiederkehrende Aufgaben eine Skill vorschlagen. All das
  gelangt in jede Sitzung, direkt aus dem Plugin, ohne von einer Datei
  abzuhängen, die du versehentlich löschen könntest.
- **Ein Panel neben dem Chat.** Es zeigt das Unternehmen, den Fokus, den
  Ton, welche Gedächtnisdateien gefüllt sind und wann sie aktualisiert
  wurden, dazu Schnellknöpfe: Sitzung öffnen, Gedächtnis aktualisieren,
  auf GitHub speichern. In einem breiten Terminal öffnet es sich von
  selbst. `/mazyos` öffnet es jederzeit.
- **Eine Statuszeile.** `MazyOS · Acme · foco: 3 Kunden abschließen` steht
  unter dem Prompt, damit du den Faden nicht verlierst.
- **Hinweis bei Gedächtnisänderungen.** Hat Claude `estrategia.md`
  bearbeitet? Panel und Status aktualisieren sich sofort und ein Hinweis
  erscheint.
- **Git-Bremse.** `git push --force`, `git reset --hard` und Verwandtes
  laufen erst nach deiner Bestätigung. Wenn nicht nachgefragt werden kann,
  laufen sie gar nicht.

Außerhalb eines MazyOS-Ordners bleibt das Plugin still. Es weist nur einmal
pro Ordner darauf hin, dass `/mazyos:instalar` existiert.

---

## MazyOS für VS Code und Antigravity

Das gleiche System gibt es auch als Editor-Erweiterung im Ordner
[vscode/](vscode/). Sie liest dasselbe Gedächtnis, bringt dieselben 17
Skills mit und lässt dich wählen, wer die Arbeit ausführt: Claude Code
(dein Claude-Konto), Codex (dein ChatGPT-Konto) oder Antigravity (dein
Google-Konto). Jedes meldet sich über die offizielle Anmeldung seines
eigenen CLI an; die Erweiterung bereitet nur die Anfrage vor und zeigt in
einer Konsole neben dem Editor, was passiert. Funktioniert in VS Code,
Antigravity IDE und Cursor.

Solange sie nicht im Marketplace ist, installierst du über die in
`vscode/` erzeugte `.vsix`-Datei:

```
cd vscode && npm install && npm run empacotar
code --install-extension mazyos-0.1.0.vsix
```

Den Rest findest du in der [README der Erweiterung](vscode/README.md).

## Die Skills

Es sind 17 Claude-Code-Skills, sofort einsatzbereit. Gib `/mazyos:` ein,
dann erscheint die Liste.

### Für den Alltag

- `/mazyos:abrir` fasst den Kontext in fünf Zeilen zusammen und fragt, was als Nächstes ansteht.
- `/mazyos:salvar` erstellt Commit und GitHub-Push – auch für alle, die git nie benutzt haben.
- `/mazyos:atualizar` vergleicht das Gedächtnis mit dem, was im Ordner liegt, und schlägt Aktualisierungen vor.
- `/mazyos:novo-projeto` erstellt für jeden Kunden oder jedes Vorhaben einen eigenen Ordner mit eigenem Kontext.
- `/mazyos:mapear-rotinas` fragt, was du jede Woche wiederholst, und erstellt dafür jeweils eine Skill.
- `/mazyos:criacao-canonica-de-skills` erstellt, überarbeitet und prüft Skills mit einem gründlicheren Verfahren.

### Inhalte und SEO

- `/mazyos:carrossel` erstellt ein Instagram-Karussell (1080×1350) im Markendesign, mit oder ohne KI-generiertem Foto, inklusive fertiger Bildunterschrift.
- `/mazyos:publicar-tema` macht aus einem Thema Blogartikel, Karussell und drei Bildunterschriften (Instagram, Facebook, LinkedIn), alles aufeinander abgestimmt.
- `/mazyos:seo` führt den 8-Schritte-SEO-Ablauf aus: Nachfrage, Wettbewerb, Google Meu Negócio, On-Page, Inhalte, Google Ads, Monitoring und GEO (in ChatGPT, Gemini und Perplexity erscheinen).
- `/mazyos:responder-avaliacoes` schreibt menschlich klingende Antworten auf Google-Bewertungen.
- `/mazyos:aprovar-post` veröffentlicht Blog, Instagram und Facebook mit einem einzigen Befehl.

### Google Ads und Meta Ads

- `/mazyos:anuncio-google` baut die ganze Kampagne als CSV, die direkt in den Google Ads Editor importiert werden kann.
- `/mazyos:relatorio-ads` liest die Exporte von Google Ads und Meta Ads und liefert den Wochenbericht mit Warnhinweisen und Handlungsempfehlungen.

### Kundenakquise

- `/mazyos:prospecta-maps` geht von einer Nische und einer Stadt aus, sucht Unternehmen bei Google Maps, prüft die CNPJ bei der Receita, baut für jeden Lead eine Vorschau-Website und bereitet die erste Nachricht sowie Follow-ups vor. Das PDF-Angebot entsteht auf Anfrage. Ohne API-Schlüssel.

### Produktion

- `/mazyos:analisar-dados` liest CSV, Tabelle oder PDF und liefert eine Management-Zusammenfassung.
- `/mazyos:email-profissional` entwirft eine E-Mail aus deinen Angaben.

Die Skills, die du für dein Unternehmen erstellst, liegen in
`.claude/skills/` deines Ordners, außerhalb des Plugins, und du rufst sie
als `/<name>` auf.

---

## Häufige Fragen

**Ist MazyOS kostenlos?** Das Plugin ist offen und kostenlos. Du bezahlst
Claude Code: einen Pro-, Max- oder Team-Plan von Claude oder die API von
Anthropic.

**Muss ich programmieren können?** Nein. Du sprichst Deutsch und beantwortest
Fragen zu deinem Unternehmen. Die Befehle sind ein Schrägstrich und ein Name.

**Funktioniert es unter Windows?** Ja. Mac, Windows und Linux, im Terminal,
in VS Code oder in der Claude-App.

**Wo bleiben meine Daten?** In deinem Ordner, auf deinem Computer.
Gedächtnis, Identität und alles, was das System erzeugt, sind deine
Textdateien, die du öffnen, bearbeiten und bei GitHub versionieren kannst.
Das Plugin liest nur und aktualisiert sich über `/plugin`.

**Was ist ein Claude-Code-Plugin?** Ein Paket, das Claude Code Skills,
Befehle und Verhalten hinzufügt und mit einer Zeile installiert wird.
MazyOS ist eines davon.

**Kann ich sehen, was das Plugin mit meinem Claude macht?** Ja, hier ist
alles Open Source. `hooks/sistema.ts` enthält die Regeln, die in den
Kontext gelangen; `hooks/register.tsx` enthält den Mod.

**Ich habe MazyOS früher durch Klonen dieses Repositories genutzt. Und jetzt?**
Installiere das Plugin und lösche in deinem Unternehmensordner
`.claude/skills/` (die Skills kommen aus dem Plugin; selbst erstellte
dürfen bleiben), entferne die allgemeinen MazyOS-Regeln aus `CLAUDE.md`
(das Plugin fügt sie alle selbst ein) und ersetze `/abrir` durch
`/mazyos:abrir`. Gedächtnis, Identität und Ausgaben bleiben unverändert.

---

## Die These

KI ist kein Werkzeug, das dein Unternehmen benutzt. Sie ist das
Betriebssystem, auf dem es läuft.

Der Unterschied ist nicht Geschwindigkeit. Es ist eine neue Fähigkeit: Eine
Person mit KI baut, was früher einem ganzen Team vorbehalten war. Jeder
Prozess, der heute in offener Schleife läuft (entscheidet, führt aus, misst
nicht, wiederholt blind), wird innerhalb von MazyOS zur geschlossenen
Schleife (entscheidet, führt aus, erfasst, fließt zurück, passt sich selbst
an).

Das System ersetzt dich nicht. Es wird Teil deines Unternehmens.

--

[mazyos.com.br](https://mazyos.com.br)

## Quelle und Lizenz

- Originalautor: Mazzeo-Marketing
- Originalrepository: https://github.com/Mazzeo-Marketing/MazyOS
- Lizenz: NOASSERTION
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
