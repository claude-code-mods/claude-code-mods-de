import type { RowSpec } from './rows'

export type ShortcutKey = { key: string; label: string; terminal?: true }
export type ShortcutGroup = { title: string; keys: ShortcutKey[] }

const GROUPS: readonly ShortcutGroup[] = [
  {
    title: 'Move',
    keys: [
      { key: 'j / k', label: 'down / up' },
      { key: 'h / l', label: 'collapse oder parent / expand' },
      { key: 'o, Enter', label: 'öffnen a Datei oder toggle a Ordner' },
      { key: 'z', label: 'jump to a Ordner' },
      { key: 'Space', label: 'Quick Look on macOS', terminal: true },
    ],
  },
  {
    title: 'Search',
    keys: [
      { key: 's', label: 'focus search' },
      { key: 'i', label: 'search in the Ordner under the cursor' },
      { key: 'c / r', label: 'match case / regular expression' },
      { key: 'q', label: 'search Datei contents statt names' },
    ],
  },
  {
    title: 'Files und actions',
    keys: [
      { key: 'd', label: 'diff' },
      { key: 'click', label: 'auswählen one row' },
      { key: 'ctrl+click', label: 'hinzufügen oder drop a row; alt+klicken on macOS' },
      { key: 'shift+click', label: 'auswählen the range von the anchor' },
      { key: 'shift+j / k', label: 'extend the selection down / up' },
      { key: 'v / V', label: 'hinzufügen oder drop the row / leeren the marks' },
      { key: 'y / Y', label: 'copy relative / absolute Pfad' },
      { key: 'u', label: 'copy the Name' },
      { key: 't', label: 'shell in a tmux oder herdr pane' },
      { key: 'x', label: "guard von Claude's edits" },
      { key: 'w', label: 'Dateien written outside the repo' },
    ],
  },
  {
    title: 'View',
    keys: [
      { key: 'p', label: 'preview oder treemap', terminal: true },
      { key: 'f / b', label: 'page the preview', terminal: true },
      { key: '[ / ]', label: 'previous / nächste PDF oder Word page', terminal: true },
      { key: 'a', label: 'auto-collapse' },
      { key: 'n / g / m', label: 'sort by Name / git / value' },
    ],
  },
  {
    title: 'Pane',
    keys: [
      { key: '?', label: 'zeigen oder ausblenden this list', terminal: true },
      { key: 'ctrl+x tab', label: 'give the pane the keyboard', terminal: true },
      { key: 'alt+l', label: 'give the tree the keyboard', terminal: true },
      { key: 'alt+h', label: 'zurück to the Prompt', terminal: true },
      { key: '/filetree keys', label: 'set up alt+l und alt+h', terminal: true },
      { key: 'Esc', label: 'zurück to the Prompt', terminal: true },
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
  const rows: RowSpec[] = [{ id: '', left: [{ t: ' Keyboard shortcuts', b: true, c: accent }], right: [{ t: '? closes ', c: muted }] }]
  for (const g of groups) {
    rows.push({ id: '', left: [{ t: ' ' }], right: [] })
    rows.push({ id: '', left: [{ t: ` ${g.title}`, b: true }], right: [] })
    for (const k of g.keys) rows.push({ id: '', left: [{ t: `   ${k.key.padEnd(width)}`, c: accent }, { t: k.label }], right: [] })
  }
  return rows
}
