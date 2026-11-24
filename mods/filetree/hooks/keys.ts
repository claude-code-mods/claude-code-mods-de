import type { RowSpec } from './rows'

export type ShortcutKey = { key: string; label: string; terminal?: true }
export type ShortcutGroup = { title: string; keys: ShortcutKey[] }

const GROUPS: readonly ShortcutGroup[] = [
  {
    title: 'Bewegen',
    keys: [
      { key: 'j / k', label: 'abwärts / aufwärts' },
      { key: 'h / l', label: 'einklappen oder übergeordnetes Element / ausklappen' },
      { key: 'o, Enter', label: 'Datei öffnen oder Ordner umschalten' },
      { key: 'z', label: 'zu einem Ordner springen' },
      { key: 'Space', label: 'Quick Look on macOS', terminal: true },
    ],
  },
  {
    title: 'Suche',
    keys: [
      { key: 's', label: 'Suche fokussieren' },
      { key: 'i', label: 'im Ordner unter dem Cursor suchen' },
      { key: 'c / r', label: 'Groß-/Kleinschreibung / regulärer Ausdruck' },
      { key: 'q', label: 'Dateiinhalte statt Namen durchsuchen' },
    ],
  },
  {
    title: 'Dateien und Aktionen',
    keys: [
      { key: 'd', label: 'diff' },
      { key: 'click', label: 'eine Zeile auswählen' },
      { key: 'ctrl+click', label: 'Zeile hinzufügen oder entfernen; unter macOS alt+klicken' },
      { key: 'shift+click', label: 'Bereich ab dem Anker auswählen' },
      { key: 'shift+j / k', label: 'Auswahl nach unten / oben erweitern' },
      { key: 'v / V', label: 'Zeile hinzufügen oder entfernen / Markierungen löschen' },
      { key: 'y / Y', label: 'relativen / absoluten Pfad kopieren' },
      { key: 'u', label: 'Namen kopieren' },
      { key: 't', label: 'Shell in einem tmux- oder herdr-Bereich' },
      { key: 'x', label: 'Claudes Änderungen schützen' },
      { key: 'w', label: 'außerhalb des Repos geschriebene Dateien' },
    ],
  },
  {
    title: 'Ansicht',
    keys: [
      { key: 'p', label: 'Vorschau oder Treemap', terminal: true },
      { key: 'f / b', label: 'Vorschau blättern', terminal: true },
      { key: '[ / ]', label: 'vorherige / nächste PDF- oder Word-Seite', terminal: true },
      { key: 'a', label: 'auto-collapse' },
      { key: 'n / g / m', label: 'sort by Name / git / value' },
    ],
  },
  {
    title: 'Bereich',
    keys: [
      { key: '?', label: 'diese Liste ein- oder ausblenden', terminal: true },
      { key: 'ctrl+x tab', label: 'Tastatur an den Bereich geben', terminal: true },
      { key: 'alt+l', label: 'Tastatur an den Baum geben', terminal: true },
      { key: 'alt+h', label: 'zurück zur Eingabe', terminal: true },
      { key: '/filetree keys', label: 'alt+l und alt+h einrichten', terminal: true },
      { key: 'Esc', label: 'zurück zur Eingabe', terminal: true },
    ],
  },
]

export const SCROLL_KEYS: ReadonlySet<string> = new Set(['up', 'down', 'j', 'k', 'pageup', 'pagedown', 'f', 'b', 'home', 'end'])

export function shortcutGroups(desktop: boolean): ShortcutGroup[] {
  return GROUPS.map(g => ({ title: g.title, keys: g.keys.filter(k => !desktop || !k.terminal) })).filter(g => g.keys.length > 0)
}

export function shortcutRows(accent: string, muted: string): RowSpec[] {
  const groups = shortcutGroups(false)
  const width = Math.max(...groups.flatMap(g => g.keys.map(k => k.key.length))) + 2
  const rows: RowSpec[] = [{ id: '', left: [{ t: ' Tastenkürzel', b: true, c: accent }], right: [{ t: '? schließt ', c: muted }] }]
  for (const g of groups) {
    rows.push({ id: '', left: [{ t: ' ' }], right: [] })
    rows.push({ id: '', left: [{ t: ` ${g.title}`, b: true }], right: [] })
    for (const k of g.keys) rows.push({ id: '', left: [{ t: `   ${k.key.padEnd(width)}`, c: accent }, { t: k.label }], right: [] })
  }
  return rows
}
