# terminal-browser claude code plugin

> Dieses Plugin ist experimentell und hat einige [bekannte Einschränkungen](#caveats).




https://github.com/user-attachments/assets/a79e7667-6fcb-49a4-9967-44d0f942102c



## Installation

terminal-browser installieren
```
curl -fsSL https://terminal-browser.sh/install | bash # oder brew install terminal-browser
```

Stelle sicher, dass du die neueste Version von Claude Code verwendest
```
claude update
```

Aktiviere die UI-Plugins von Claude Code, indem du dies zu `~/.claude/settings.json` hinzufügst:
```json
{
  "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1" }
}
```




Das Plugin terminal-browser installieren
```
# Marketplace festlegen
claude plugin marketplace add zenbu-labs/terminal-browser

# Plugin installieren
claude plugin install terminal-browser@terminal-browser
```

Jetzt kannst du in Claude Code `/browser` ausführen, um den Browser zu öffnen

### Aktualisieren

Das Claude-Code-Plugin aktualisieren
```
claude plugin update terminal-browser@terminal-browser
```

terminal-browser aktualisieren
```
terminal-browser upgrade
```

### Konfiguration

Du kannst das Plugin terminal-browser so konfigurieren, dass es ein Werkzeug enthält, mit dem Claude den Browser öffnen kann. Das ist standardmäßig deaktiviert, da Claude die CLI `terminal-browser` bereits nutzen kann, um den Browser in einem geteilten Fensterbereich im Terminal zu öffnen. Du kannst das Werkzeug aktivieren, indem du Folgendes zu `~/.claude/settings.json` hinzufügst:

```json
{
  "pluginConfigs": {
    "terminal-browser@terminal-browser": {
      "options": {
        "agentTool": true
      }
    }
  }
}
```


## terminal-browser plugin API

Das Plugin terminal-browser enthält eine API, mit der du in einem anderen Claude-Code-Plugin programmatisch den Browser öffnen und eine URL laden kannst. Einige Beispiele für nützliche Plugins, die du damit bauen kannst:
- Der Slash-Befehl `/tldraw`, der tldraw im geteilten Fensterbereich von Claude Code öffnet
- Der Slash-Befehl `/open-pr`, der den PR zu dem Branch öffnet, an dem du arbeitest

```typescript
export type BrowserOpenInput = { url?: string }

export type BrowserOpenResult =
  | { ok: true; url: string }
  | { ok: false; error: string }

export type Browser = {
  open: (input: BrowserOpenInput) => Promise<BrowserOpenResult>
  close: (input?: Record<string, never>) => Promise<boolean>
}

// Verwendung: im Hooks-Modul deines Plugins
on('command.run', { command: 'tldraw' }, async ($) => {
  const result = await $.browser.open({ url: 'https://www.tldraw.com/' })
  return { text: result.ok ? 'Opened tldraw' : result.error }
})
```

## Wie funktioniert es?

terminal-browser nutzt das [kitty graphics protocol], um von einem echten Browser erzeugte Pixel im Terminal anzuzeigen. Um den Browser innerhalb von Claude Code darzustellen, verwenden wir die neue [function hooks API](https://github.com/anthropics/claude-code/issues/91870) von Claude Code.

Die Interna von terminal-browser wurden in eine JavaScript-Bibliothek ausgelagert: https://github.com/zenbu-labs/terminal-browser/tree/main/pixel – falls du deine eigene grafische Anwendung in Claude Code bzw. im Terminal bauen möchtest.


## Unterstützte Terminals

Das Claude-Code-Plugin terminal-browser funktioniert nur in Terminals, die das [kitty graphics protocol] unterstützen und [kitty unicode placeholders](https://sw.kovidgoyal.net/kitty/graphics-protocol/#unicode-placeholders) implementieren. Die bekanntesten Terminals mit dieser Unterstützung sind:
- [ghostty](https://ghostty.org)
- [kitty](https://sw.kovidgoyal.net/kitty/)

Wenn dein Terminal die erforderlichen Funktionen nicht unterstützt, kann der Versuch, den Browser in Claude Code zu öffnen, die TUI zerstören.

Darüber hinaus unterstützen alle Terminals, die auf libghostty basieren, diese Funktion, zum Beispiel:
- [cmux](https://cmux.com/)
- [supacode](https://supacode.sh/)

Weitere auf libghostty basierende Terminals findest du hier: [awesome-libghostty](https://github.com/Uzaaft/awesome-libghostty)

Selbst wenn dein Terminal die nötige Grafikfunktion unterstützt, funktioniert das Plugin möglicherweise nicht, wenn du einen Multiplexer verwendest. Multiplexer schreiben die Ausgabe von Terminalprogrammen um und beschädigen dadurch Grafikbefehle. tmux-Unterstützung kommt bald (terminal-browser funktioniert derzeit in tmux, allerdings noch nicht über das Claude-Code-Plugin), und in herdr ist die Leistung über das Claude-Code-Plugin sehr schlecht, wird sich aber voraussichtlich bald bessern. Andere Multiplexer habe ich nicht getestet. Wenn es nicht funktioniert, öffne bitte ein Issue, dann prüfe ich, ob wir es unterstützen können.




## Einschränkungen:
- setzt ein Terminal voraus, das das [kitty graphics protocol] unterstützt
- die Mausposition weicht manchmal leicht ab, da Claude Code keine Mauskoordinaten in Pixeln meldet
- das Plugin muss Fetch-Anfragen an einen lokalen HTTP-Server senden, um mit der CLI von terminal-browser zu kommunizieren. Dadurch kann dein Betriebssystem eine Abfrage anzeigen, dass dein Terminal auf das lokale Netzwerk zugreifen möchte
- Claude Code setzt eine sehr hohe Mindestbreite für den Chatbereich, sodass sich der Browser manchmal nicht auf die gewünschte Größe ändern lässt
- das Plugin hängt von der experimentellen Function-Hooks-API von Claude Code ab, die instabil ist; zwischen Versionen kann das Plugin daher brechen

[kitty graphics protocol]: https://sw.kovidgoyal.net/kitty/graphics-protocol/

## Quelle und Lizenz

- Originalautor: zenbu-labs
- Originalrepository: https://github.com/zenbu-labs/terminal-browser
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
