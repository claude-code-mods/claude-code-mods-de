import type { CalmSnapshot, Prefs } from '../types'
import { SKINS } from './themes'

export const DEFAULT_PREFS: Prefs = {
  skin: 'noir',
  icons: 'unicode',
  prompt: 'left',
  words: 'skin',
  rail: true,
  tables: 'on',
  shimmer: true,
  band: true,
  countdown: false,
  clipOutput: false,
  markdown: true,
  quiet: false,
  charts: true,
  math: true,
  commands: true,
  shell: true,
  highlight: true,
  hints: true,
  links: true,
  copy: true,
  fold: true,
  expand: false,
  compact: true,
  calm: null,
}

// The on/off settings, by the word /skin and the settings pane use for each. Tables have a
// third state, `text`, so they are switched on their own.
export const TOGGLES = {
  rail: 'rail',
  shimmer: 'shimmer',
  band: 'band',
  countdown: 'countdown',
  clip: 'clipOutput',
  markdown: 'markdown',
  quiet: 'quiet',
  charts: 'charts',
  math: 'math',
  commands: 'commands',
  shell: 'shell',
  highlight: 'highlight',
  hints: 'hints',
  links: 'links',
  copy: 'copy',
  fold: 'fold',
  expand: 'expand',
  compact: 'compact',
} as const satisfies Record<string, keyof Prefs>

export type ToggleWord = keyof typeof TOGGLES

export type Outcome = {
  prefs: Prefs
  message: string
  // `row` prints a transcript line (listings, mistakes); `toast` confirms a change quietly.
  channel: 'row' | 'toast'
}

const flagOr = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback

export const TABLE_MODES = ['on', 'text', 'off'] as const satisfies readonly Prefs['tables'][]

// Tables were on/off before `text`, so a stored boolean still reads.
export function tablesOr(value: unknown, fallback: Prefs['tables']): Prefs['tables'] {
  if (typeof value === 'boolean') {
    return value ? 'on' : 'off'
  }

  return TABLE_MODES.find(mode => mode === value) ?? fallback
}

// The settings pane's tables button steps through the modes in order.
export const nextTables = (mode: Prefs['tables']): Prefs['tables'] =>
  TABLE_MODES[(TABLE_MODES.indexOf(mode) + 1) % TABLE_MODES.length] ?? 'on'

// A stored calm snapshot, or null when it is not one: then calm reads as off.
function calmOf(value: unknown): CalmSnapshot | null {
  const saved = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null

  return saved !== null && typeof saved.shimmer === 'boolean' && typeof saved.rail === 'boolean' && typeof saved.quiet === 'boolean'
    ? { shimmer: saved.shimmer, rail: saved.rail, quiet: saved.quiet }
    : null
}

// What the store hands back may be old, hand-edited or from another version.
export function parsePrefs(raw: unknown, names: readonly string[]): Prefs {
  const saved = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {}
  const skin = saved.skin

  return {
    skin:
      typeof skin === 'string' && (skin === 'off' || names.includes(skin))
        ? skin
        : DEFAULT_PREFS.skin,
    icons: saved.icons === 'ascii' ? 'ascii' : 'unicode',
    prompt: saved.prompt === 'right' || saved.prompt === 'plain' ? saved.prompt : 'left',
    words: saved.words === 'claude' ? 'claude' : 'skin',
    rail: flagOr(saved.rail, DEFAULT_PREFS.rail),
    tables: tablesOr(saved.tables, DEFAULT_PREFS.tables),
    shimmer: flagOr(saved.shimmer, DEFAULT_PREFS.shimmer),
    band: flagOr(saved.band, DEFAULT_PREFS.band),
    countdown: flagOr(saved.countdown, DEFAULT_PREFS.countdown),
    clipOutput: flagOr(saved.clipOutput, DEFAULT_PREFS.clipOutput),
    markdown: flagOr(saved.markdown, DEFAULT_PREFS.markdown),
    quiet: flagOr(saved.quiet, DEFAULT_PREFS.quiet),
    charts: flagOr(saved.charts, DEFAULT_PREFS.charts),
    math: flagOr(saved.math, DEFAULT_PREFS.math),
    commands: flagOr(saved.commands, DEFAULT_PREFS.commands),
    shell: flagOr(saved.shell, DEFAULT_PREFS.shell),
    highlight: flagOr(saved.highlight, DEFAULT_PREFS.highlight),
    hints: flagOr(saved.hints, DEFAULT_PREFS.hints),
    links: flagOr(saved.links, DEFAULT_PREFS.links),
    copy: flagOr(saved.copy, DEFAULT_PREFS.copy),
    fold: flagOr(saved.fold, DEFAULT_PREFS.fold),
    expand: flagOr(saved.expand, DEFAULT_PREFS.expand),
    compact: flagOr(saved.compact, DEFAULT_PREFS.compact),
    calm: calmOf(saved.calm),
  }
}

// /skin calm: nein motion, one Zeile per Werkzeug row, lesen-only Ausgabe folded. What it changes is
// kept, so calm off puts back what was there before. Failures stay whole either way
// (register.tsx draws them past quiet while calm is on).
export function withCalm(current: Prefs, on: boolean): Prefs {
  if (on) {
    return current.calm !== null
      ? current
      : { ...current, calm: { shimmer: current.shimmer, rail: current.rail, quiet: current.quiet }, shimmer: false, rail: false, quiet: true }
  }

  return current.calm === null ? current : { ...current, ...current.calm, calm: null }
}

const changed = (prefs: Prefs, message: string): Outcome => ({ prefs, message, channel: 'toast' })

const refused = (prefs: Prefs, message: string): Outcome => ({ prefs, message, channel: 'row' })

const onOff = (on: boolean): string => (on ? 'on' : 'off')

// A markdown table, its columns padded so it lines up as plain text too.
export function markdownTable(head: readonly string[], rows: readonly (readonly string[])[]): string {
  const widths = head.map((title, column) => Math.max(title.length, ...rows.map(row => (row[column] ?? '').length)))
  const line = (cells: readonly string[]) => `| ${widths.map((width, column) => (cells[column] ?? '').padEnd(width)).join(' | ')} |`

  return [line(head), line(widths.map(width => '-'.repeat(width))), ...rows.map(line)].join('\n')
}

const isBuiltIn = (name: string): boolean => SKINS.some(skin => skin.name === name)

// /skin list: the skins, then every setting, laid out as skin-code lays out its list.
// `extra` adds rows to the settings that the command reads from elsewhere.
export function listing(current: Prefs, names: readonly string[], extra: readonly (readonly [string, string])[] = []): string {
  const mark = (name: string) => (name === current.skin ? `${name} (aktuell)` : name)

  return [
    `Skins · aktuell: ${current.skin}`,
    '',
    markdownTable(
      ['Skin', 'Art'],
      [
        ...names.map(name => [mark(name), isBuiltIn(name) ? 'integriert' : 'eigen']),
        [mark('off'), 'Claude Codes eigenes Aussehen'],
      ],
    ),
    '',
    markdownTable(
      ['Einstellung', 'Wert'],
      [
        ['icons', current.icons],
        ['prompt', current.prompt],
        ['words', current.words],
        ['rail', onOff(current.rail)],
        ['tables', current.tables],
        ['shimmer', onOff(current.shimmer)],
        ['band', onOff(current.band)],
        ['clip', onOff(current.clipOutput)],
        ['markdown', onOff(current.markdown)],
        ['quiet', onOff(current.quiet)],
        ['charts', onOff(current.charts)],
        ['math', onOff(current.math)],
        ['commands', onOff(current.commands)],
        ['shell', onOff(current.shell)],
        ['highlight', onOff(current.highlight)],
        ['hints', onOff(current.hints)],
        ['links', onOff(current.links)],
        ['copy', onOff(current.copy)],
        ['fold', onOff(current.fold)],
        ['expand', onOff(current.expand)],
        ['compact', onOff(current.compact)],
        ['calm', onOff(current.calm !== null)],
        ...extra,
      ],
    ),
    '',
    '`skin <name>` wählt einen Skin.',
    '',
    '`skin help` zeigt die Befehle.',
  ].join('\n')
}

// /skin help: every argument, laid out as skin-code lays out its help.
export const helpText = (): string =>
  [
    'skins-Befehle',
    '',
    markdownTable(
      ['Befehl', 'Funktion'],
      [
        ['`/skin`', 'Einstellungen öffnen'],
        ['`/skin <name>`', 'zu diesem Skin wechseln'],
        ['`/skin list`', 'alle Skins und Einstellungen'],
        ['`/skin help`', 'diese Befehle'],
        ['`/skin off`', 'zurück zu Claude Codes eigenem Aussehen'],
        ['`/skin on`', 'skins wieder einschalten'],
        ['`/skin gallery`', 'alle vom Skin gezeichneten Elemente, nummeriert'],
        ['`/skin calm [on/off]`', 'keine Bewegung, eine Zeile pro Werkzeug, schreibgeschützte Ausgabe eingeklappt'],
        ['`/skin copy` · `copy code`', 'letzte Antwort oder letzten Codeblock kopieren'],
        ['`/skin pin` · `unpin` · `share`', 'diesem Ordner ein eigenes Aussehen geben, entfernen oder als Standard festlegen'],
        ['`/skin tables on/text/off`', 'Tabellen als Karten, als auswählbaren Text oder wie Claude Code selbst'],
        ['`/skin prompt left/right/plain`', 'auf welcher Seite die Umrandung des Prompts sitzt, oder ein einfacher Marker'],
        ['`/skin words claude/skin`', 'welche Wörter Spinner und Zug-Fußzeile anzeigen'],
        ['`/skin icons unicode/ascii`', 'das Icons-Set'],
        ['`/skin rail on/off`', 'die farbige Leiste neben Werkzeugzeilen'],
        ['`/skin shimmer on/off`', 'der Lichtstreifen über dem Spinner-Wort'],
        ['`/skin band on/off`', 'die Nutzungsanzeigen über dem Prompt'],
        ['`/skin countdown on/off`', 'verbleibende Zeit für jedes Limit in der Leiste'],
        ['`/skin clip on/off`', 'Claude Codes eigene Shell-Ausgabe auf Anfang und Ende kürzen'],
        ['`/skin markdown on/off`', 'Hinweise und Aufgabenlisten zeichnen'],
        ['`/skin quiet on/off`', 'Lese-, Such- und schreibgeschützte Befehle auf eine Zeile falten'],
        ['`/skin charts on/off`', 'Mermaid-Blöcke als Diagramme'],
        ['`/skin math on/off`', 'Mathematik formatsatz'],
        ['`/skin commands on/off`', 'Slash-Befehlsausgabe als Tabellen und Karten'],
        ['`/skin shell on/off`', 'Shell-Ausgabe als Karte'],
        ['`/skin highlight on/off`', 'Codeblöcke in den Farben des Skins hervorheben'],
        ['`/skin hints on/off`', 'Claude mitteilen, dass hier Diagramme gezeichnet werden'],
        ['`/skin links on/off`', 'URLs und Pfade als Links'],
        ['`/skin copy on/off`', 'Kopier-Schaltflächen auf Karten'],
        ['`/skin fold on/off`', 'lange Blöcke hinter `▾ N weitere` falten'],
        ['`/skin expand on/off`', 'alle Gruppen aus Lese- und Suchvorgängen öffnen'],
        ['`/skin compact on/off`', 'die Schaltfläche „Kompakt“ in der Leiste'],
      ],
    ),
    '',
    '`skin list` zeigt alle Skins und Einstellungen.',
    '',
    '`skin` öffnet die Einstellungen.',
  ].join('\n')

const isToggle = (word: string): word is ToggleWord => Object.hasOwn(TOGGLES, word)

// Every argument but none: with none, /skin opens the settings pane instead.
export function runSkinCommand(args: string, current: Prefs, names: readonly string[]): Outcome {
  const [head = '', value] = args.trim().toLowerCase().split(/\s+/)

  if (isToggle(head)) {
    const field = TOGGLES[head]

    return value === 'on' || value === 'off'
      ? changed({ ...current, [field]: value === 'on' }, `${head} ${value}`)
      : refused(current, `Verwendung: /skin ${head} on|off`)
  }

  switch (head) {
    case 'list':
      return refused(current, listing(current, names))
    case 'help':
      return refused(current, helpText())
    // `default` and `stock` are what people reach for when they want Claude Code's own look.
    case 'off':
    case 'default':
    case 'stock':
      return changed({ ...current, skin: 'off' }, 'skins off')
    case 'on':
      return current.skin === 'off'
        ? changed({ ...current, skin: DEFAULT_PREFS.skin }, `skin: ${DEFAULT_PREFS.skin}`)
        : changed(current, `skin: ${current.skin}`)
    case 'calm':
      return value === 'on' || value === undefined
        ? changed(withCalm(current, true), current.calm === null ? 'calm on' : 'calm ist bereits aktiviert')
        : value === 'off'
          ? changed(withCalm(current, false), current.calm === null ? 'calm ist bereits deaktiviert' : 'calm aus: deine Einstellungen sind zurückgesetzt')
          : refused(current, 'Verwendung: /skin calm [on|off]')
    case 'tables':
      return value === 'on' || value === 'text' || value === 'off'
        ? changed({ ...current, tables: value }, `tables ${value}`)
        : refused(current, 'Verwendung: /skin tables on|text|off')
    case 'prompt':
      return value === 'left' || value === 'right' || value === 'plain'
        ? changed({ ...current, prompt: value }, `prompt ${value}`)
        : refused(current, 'Verwendung: /skin prompt left|right|plain')
    case 'words':
      return value === 'claude' || value === 'skin'
        ? changed({ ...current, words: value }, `words: ${value}`)
        : refused(current, 'Verwendung: /skin words claude|skin')
    case 'icons':
      return value === 'unicode' || value === 'ascii'
        ? changed({ ...current, icons: value }, `icons: ${value}`)
        : refused(current, 'Verwendung: /skin icons unicode|ascii')
    default:
      return names.includes(head)
        ? changed({ ...current, skin: head }, `skin: ${head}`)
        : refused(current, `Unbekannter Skin „${head}“. /skin list zeigt sie, /skin help die Befehle`)
  }
}
