/**
 * The command the mod answers, and the fixed texts it prints.
 *
 * The name is namespaced by the plugin (`shunt` + `commands/usage.md`), which
 * is what keeps it off the built-in `/usage`: `$.command.register` takes a
 * bare global name and refuses `usage` outright ("it is the built-in /usage"),
 * while a plugin's markdown command lists as `shunt:usage` and is free.
 */
export const COMMAND_NAME = 'shunt:usage'

/**
 * The path `[server.usage]` registers on the gateway.
 */
export const USAGE_PATH = '/usage'

export const NO_BASE_URL_TEXT =
  'kein Gateway, das man fragen konnte — weder SHUNT_BASE_URL noch ANTHROPIC_BASE_URL ist ' +
  'gesetzt, daher spricht diese Sitzung direkt mit Anthropic. Richte Claude Code auf ' +
  'dein Gateway aus (export ANTHROPIC_BASE_URL=http://127.0.0.1:3001) und führe ' +
  '/shunt:usage erneut aus.'

export const NO_TOKEN_TEXT =
  'keine verwendbaren Anmeldedaten — weder SHUNT_TOKEN, ' +
  'ANTHROPIC_AUTH_TOKEN noch ANTHROPIC_API_KEY ist gesetzt, und es gibt keinen ' +
  'shunt-Gateway-apiKeyHelper, aus dem eine Gateway-Anmeldung gelesen werden kann. ' +
  'Melde dich mit shunt gateway login an oder bitte den Gateway-Betreiber um einen Client-Token.'

export const NOT_ENABLED_TEXT =
  'das Gateway hat geantwortet, aber GET /usage ist dort nicht aktiviert. Füge der ' +
  'Gateway-Konfiguration eine Tabelle [server.usage] hinzu und starte es neu; die Tabelle ' +
  'braucht keine Schlüssel, erfordert aber zusätzlich [server.auth] (Client-Tokens) oder ' +
  '[server.gateway] (Gateway-Anmeldung).'

export const REFUSED_TEXT =
  'das Gateway hat die von dieser Sitzung verwendeten Anmeldedaten abgelehnt. Von ' +
  'SHUNT_TOKEN, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_API_KEY und dem shunt-Gateway-Token-Helper ' +
  'wird der erste gesendet, der gesetzt ist; die übrigen werden ignoriert. Ein Client-Token ' +
  'muss von [server.auth] des Gateways akzeptiert werden; eine Gateway-Anmeldung kann ' +
  'abgelaufen oder widerrufen sein. Melde dich erneut mit shunt gateway login an.'

export const HOOK_FAILED_TEXT =
  'die Pool-Nutzung konnte nicht gelesen werden — der Hook, der diesen Befehl beantwortet, ' +
  'ist fehlgeschlagen oder hat sein Zeitbudget überschritten. Führe /shunt:usage erneut aus; ' +
  'wenn es weiterhin fehlschlägt, prüfe, ob das Gateway läuft und erreichbar ist.'

export const NO_POOL_TEXT =
  'das Gateway meldet keinen gepoolten Anbieter, daher gibt es keine gemeinsame ' +
  'Kontingentanzeige. Die Pool-Nutzung erscheint, sobald ein Anbieter mit gepoolten ' +
  'Konten konfiguriert ist (Authentifizierungsmodus oauth oder chatgpt).'
