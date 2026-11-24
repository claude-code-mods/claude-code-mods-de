// The pane's drawing: three blocks from the view state, each row one string, the buttons on rows of their own, so a
// long line never pushes them off and a narrow pane wraps them. The same tree on every surface; the terminal gets
// `plain` buttons with a hotkey where one is natural.
import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { Decision, GuardEntry, Pending, Recall, Saving } from '../types'
import { hhmm, isHash, isId, plainDecision, routeWords } from './files'

export type View = {
  on: boolean
  hasCli: boolean
  promptSeen: boolean
  recall: Recall | null
  recallState: 'none' | 'this' | 'other' | 'missing'
  guard: { entry: GuardEntry; thisCall: boolean } | null
  lastCall: GuardEntry | { tool: string; missing: true } | null
  decision: Decision | null
  saving: Saving
  savingNote: string | null
  pending: Pending
}
export type Where = 'recall' | 'guard' | 'decision'
export type Actions = {
  why: (idOrHash: string, where: Where) => void
  wrong: (id: string, kind: string | null, where: Where) => void
  forget: (id: string, kind: string | null, where: Where) => void
  guardLog: () => void
  missed: (where: Where) => void
  confirm: (yes: boolean) => void
  close: () => void
}

const MAX_TEXT = 300
const cut = (s: string) => (s.length > MAX_TEXT ? `${s.slice(0, MAX_TEXT - 1)}…` : s)
const verb = (d: GuardEntry['decision']) => (d === 'deny' ? 'abgelehnt' : d === 'ask' ? 'nachgefragt' : d === 'warn' ? 'gewarnt' : 'erlaubt')

export function draw($: EngineInterface, e: RenderInput<'Pane'>, v: View, act: Actions): RenderElement {
  const { Box, Text, Button } = $.ui.resolve(e)
  const width = typeof e.props.bodyColumns === 'number' && e.props.bodyColumns > 0 ? e.props.bodyColumns : undefined
  const buttons = (id: string, kind: string | null, suffix: string, where: Where) => (
    <Box flexDirection="row" gap={1}>
      <Button key={`why:${suffix}`} plain onPress={() => act.why(id, where)}>why</Button>
      <Button key={`wrong:${suffix}`} plain onPress={() => act.wrong(id, kind, where)}>wrong</Button>
      <Button key={`forget:${suffix}`} plain onPress={() => act.forget(id, kind, where)}>forget</Button>
    </Box>
  )
  const pending = (where: Where) => {
    const p = v.pending
    if (!p || p.where !== where) return null
    if (p.kind === 'confirm') {
      const text = p.action === 'forget' ? `${p.id} stilllegen? Es bleibt in JEVMEM.md als [retired] stehen.` : p.action === 'wrong' ? `${p.id} als falsch markieren und stilllegen?` : 'Diesen Zug als Gedächtniszeile speichern? jevmem missed bestimmt die Art und fügt sie hinzu.'
      return (
        <Box flexDirection="column">
          <Text wrap="wrap">{text}</Text>
          <Box flexDirection="row" gap={1}>
            <Button key="confirm:no" variant="primary" hotkey="n" onPress={() => act.confirm(false)}>no</Button>
            <Button key="confirm:yes" hotkey="y" onPress={() => act.confirm(true)}>yes</Button>
          </Box>
        </Box>
      )
    }
    if (p.kind === 'output') {
      const lines = p.text.split('\n')
      const shown = lines.slice(0, 40)
      return (
        <Box flexDirection="column">
          <Text dimColor>{p.title}</Text>
          {shown.map((l) => (
            <Text wrap="wrap">{l === '' ? ' ' : l}</Text>
          ))}
          {lines.length > shown.length && <Text dimColor>{`${lines.length - shown.length} weitere Zeilen: führe den Befehl in einem Terminal aus`}</Text>}
          <Button key="output:close" plain onPress={() => act.close()}>close</Button>
        </Box>
      )
    }
    return (
      <Box flexDirection="column">
        <Text dimColor wrap="wrap">{p.text}</Text>
        <Button key="output:close" plain onPress={() => act.close()}>close</Button>
      </Box>
    )
  }

  // Block 1: recalled for this prompt.
  const recall: RenderElement[] = []
  if (!v.promptSeen) recall.push(<Text dimColor>noch keine Eingabe</Text>)
  else if (v.recallState !== 'this' || !v.recall) recall.push(<Text dimColor>nichts für diese Eingabe</Text>)
  else {
    const r = v.recall
    if (r.lines === 0) recall.push(<Text dimColor wrap="wrap">noch keine Gedächtniszeilen: nenne eine Entscheidung, eine Regel oder einen Fehlschlag, und jevmem speichert sie</Text>)
    else if (r.served.length === 0) recall.push(<Text dimColor>keine Zeile passt zu dieser Eingabe</Text>)
    for (const m of r.served) {
      const id = String(m.id ?? '')
      recall.push(<Text wrap="wrap">{`${id} [${String(m.kind ?? '?')}] ${cut(String(m.text ?? ''))}`}</Text>)
      if (isId(id)) recall.push(buttons(id, m.kind ?? null, id, 'recall'))
      else recall.push(<Text dimColor>keine Gedächtnis-ID</Text>)
    }
    for (const w of r.withheld) recall.push(<Text dimColor wrap="wrap">{`${String(w.id)} zurückgehalten: ${cut(String(w.reason ?? ''))}`}</Text>)
    const how = r.path === 'word-match' ? `Wortübereinstimmung: Jev hat nicht geantwortet${r.error ? ` (${cut(r.error)})` : ''}` : `Jev ${r.ms} ms`
    if (r.lines !== 0) recall.push(<Text dimColor wrap="wrap">{`${r.served.length} geliefert · ${r.withheld.length} zurückgehalten · ${r.gated} gesperrt · ${how}`}</Text>)
  }

  // Block 2: the guard.
  const guard: RenderElement[] = []
  if (v.guard) {
    const g = v.guard.entry
    guard.push(<Text wrap="wrap">{`${g.tool} ${verb(g.decision)} (${g.mode ?? g.route}) · ${v.guard.thisCall ? 'dieser Aufruf' : hhmm(g.ts)}`}</Text>)
    for (const r of g.rules ?? []) guard.push(<Text wrap="wrap">{`${r.id} ${r.p !== undefined ? r.p.toFixed(2) : '?'} ${cut(r.text)}${r.unverified ? ' (ungeprüft)' : ''}${r.unchecked ? ' (ungeprüft)' : ''}`}</Text>)
    if (g.action) guard.push(<Text dimColor wrap="wrap">{cut(g.action)}</Text>)
    if (g.tamper) guard.push(<Text dimColor wrap="wrap">{`Manifestprüfung: ${cut(g.tamper)}`}</Text>)
    const ruleId = g.rules?.find((r) => isId(r.id))?.id
    guard.push(
      <Box flexDirection="row" gap={1}>
        {ruleId && <Button key="why:guard" plain onPress={() => act.why(ruleId, 'guard')}>why</Button>}
        <Button key="log:guard" plain onPress={() => act.guardLog()}>log</Button>
      </Box>,
    )
  }
  if (v.lastCall && 'missing' in v.lastCall) guard.push(<Text dimColor>{`${v.lastCall.tool}: kein Protokolleintrag für diesen Aufruf`}</Text>)
  else if (v.lastCall && (!v.guard || v.guard.entry !== v.lastCall)) guard.push(<Text dimColor wrap="wrap">{`Letzter Aufruf: ${v.lastCall.tool} ${verb(v.lastCall.decision)} (${routeWords[v.lastCall.route] ?? v.lastCall.route})`}</Text>)
  if (!guard.length) guard.push(<Text dimColor>noch kein geprüfter Aufruf</Text>)

  // Block 3: saved last turn.
  const saved: RenderElement[] = []
  const d = v.decision
  if (v.saving === 'none') saved.push(<Text dimColor>noch kein Zug</Text>)
  else if (v.saving === 'saving') saved.push(<Text dimColor>wird gespeichert…</Text>)
  else if (v.saving !== 'ready' || !d) saved.push(<Text dimColor wrap="wrap">{v.savingNote ?? 'noch nicht entschieden'}</Text>)
  else if (d.action === 'saved' && d.id) {
    saved.push(<Text wrap="wrap">{`${d.id} [${d.kind ?? '?'}] ${cut(d.line ?? '')}`}</Text>)
    if (d.superseded) saved.push(<Text dimColor>{`ersetzt ${d.superseded}`}</Text>)
    if (d.duplicate_of) saved.push(<Text dimColor>{`Duplikat von ${d.duplicate_of}`}</Text>)
    if (isId(d.id)) saved.push(buttons(d.id, d.kind, 'last', 'decision'))
    else saved.push(<Text dimColor>keine Gedächtnis-ID</Text>)
  } else {
    saved.push(<Text dimColor wrap="wrap">{plainDecision(d)}</Text>)
    // 0.7.6: a skipped turn can be labelled as missed from here (the prompt as typed goes to `jevmem missed`).
    const row: RenderElement[] = []
    if (isHash(d.hash)) row.push(<Button key="why:last" plain onPress={() => act.why(d.hash!, 'decision')}>why</Button>)
    if (d.action === 'skipped' && v.promptSeen) row.push(<Button key="missed:last" plain onPress={() => act.missed('decision')}>missed</Button>)
    if (row.length) saved.push(<Box flexDirection="row" gap={1}>{row}</Box>)
  }

  return (
    <Box flexDirection="column" width={width}>
      <Text weight="bold">Für diese Eingabe abgerufen</Text>
      {recall}
      {pending('recall')}
      <Text> </Text>
      <Text weight="bold">Der Wächter</Text>
      {guard}
      {pending('guard')}
      <Text> </Text>
      <Text weight="bold">Letzter Zug gespeichert</Text>
      {saved}
      {pending('decision')}
    </Box>
  )
}
