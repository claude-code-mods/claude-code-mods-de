// Model-free hand-over (requirements FR-15, UC-6; tech spec § 3.4). Pure: built only from records.
// It answers the eight questions and keeps three sources apart: what the user confirmed (the task),
// what tools observed (operations, evidence), and what Claude only claimed (never stored as a fact,
// so the hand-over says plainly that nothing claimed is shown as verified).

import { CAPS, sanitize } from './sanitize.js'
import { HARD_FORBIDDEN } from './policy.js'
import { evidenceCurrent } from './view.js'

const s = (x, n = 200) => sanitize(x, n)

// Each section is { heading, items, fixed }: headings and `fixed` lines always appear; `items` fill the
// remaining budget in order and the rest is counted, so the size cap never drops a heading or the
// limits disclosure (INV-005) the way truncating the finished text would.
function assemble(head, sections, cap) {
  const fixedText = [...head, ...sections.flatMap((x) => ['', x.heading, ...x.fixed])].join('\n')
  const omitLine = (n) => `- … ${n} weitere ausgelassen (Größenbegrenzung der Übergabe)`
  let budget = cap - fixedText.length - sections.length * omitLine(99999).length
  const out = [...head]
  for (const x of sections) {
    out.push('', x.heading)
    let shown = 0
    for (const it of x.items) {
      if (it.length + 1 > budget) break
      out.push(it); budget -= it.length + 1; shown++
    }
    if (shown < x.items.length) out.push(omitLine(x.items.length - shown))
    out.push(...x.fixed)
  }
  return out.join('\n')
}

export function handoff({ task, state, evidence, fingerprint, decisions, now, sessionId }) {
  // When the last tree reading was taken: the hand-over starts no process, so it never re-reads.
  const seenAt = typeof fingerprint?.at === 'number' ? ` Stand ${new Date(fingerprint.at).toISOString()}` : ''
  const head = [
    `# Übergabe — ${task ? s(task.goal, 120) : 'keine Aufgabe gebunden'}`,
    '',
    `Erstellt aus strukturierten Einträgen am ${new Date(now).toISOString()} (Sitzung ${s(sessionId, 60)}); es wurde kein Modell aufgerufen.`,
  ]
  const sec = []
  sec.push({ heading: '## 1. Ziel', items: [], fixed: [task ? s(task.goal, 500) : 'Für diese Sitzung wurde keine Aufgabe angegeben.'] })
  const scope = []
  if (task) {
    scope.push(`- Worktree: ${s(task.worktree)}`)
    scope.push(`- Bearbeitungen: ${(task.allow ?? []).includes('edit') ? `erlaubt in ${(task.editRoots ?? ['.']).map((r) => s(r)).join(', ')}` : 'nicht erlaubt'}`)
    scope.push(`- Autorisierte Executoren: ${(task.executors ?? []).map((e) => s(e.argv.join(' '))).join('; ') || 'keine'}`)
    scope.push(`- Verboten: ${(task.forbid ?? []).map((f) => s(Array.isArray(f) ? f.join(' ') : f)).join('; ') || 'nichts'}, zusätzlich ${[...new Set(HARD_FORBIDDEN.map((h) => h.rule))].join(', ')}`)
    if (task.acceptance?.length) scope.push(`- Abnahmebedingungen: ${task.acceptance.map((a) => s(a)).join('; ')}`)
  }
  sec.push({ heading: '## 2. Erlaubter und verbotener Bereich', items: scope, fixed: task ? [] : ['- Es wurde kein Bereich angegeben.'] })
  const ops = Object.entries(state.ops ?? {})
  const edits = ops.filter(([, o]) => ['Write', 'Edit', 'NotebookEdit', 'MultiEdit'].includes(o.tool) && o.outcome === 'ok')
  sec.push({ heading: '## 3. Was sich geändert hat', items: [], fixed: [
    fingerprint ? `- Baum: HEAD ${s(fingerprint.head, 60)}, ${fingerprint.changedCount ?? '?'} geänderte oder nicht verfolgte Pfade (${fingerprint.coverage})${seenAt ? `, gelesen${seenAt}` : ''}` : '- Baum: für diese Übergabe nicht gelesen',
    // Only the edit tools are counted here; a file changed through Bash shows in the tree line above
    // (found in an uncoached run: "Edits observed: 0" beside a changed README read as "nothing changed").
    `- Aufrufe von Bearbeitungswerkzeugen in dieser Sitzung: ${edits.length} (Änderungen über Bash werden hier nicht gezählt; die Baum-Zeile ist der Nachweis)`,
  ] })
  const ev = Object.values(evidence ?? {})
  const matches = (e) => fingerprint && e.after && e.before && e.before.value === e.after.value && e.after.value === fingerprint.value && e.outcome === 'ok'
  // Partial coverage is never "verified": what a reading did not cover may have changed — the
  // before, the after and the last reading must each be complete. The same rule `/agentctl` uses.
  const current = (e) => evidenceCurrent(e, fingerprint)
  const verified = ev.filter(current).map((e) => `- ${s(e.requested)} — kein Fehler gemeldet, stimmt mit der letzten Baumlesung überein${seenAt} (${e.coverage})`)
  sec.push({ heading: '## 4. Verifiziert (Ausführungsnachweise zur letzten Baumlesung)', items: verified, fixed: verified.length ? [] : ['- Nichts.'] })
  const notVerified = ev.filter((e) => !current(e)).map((e) => {
    const why = e.outcome === 'backgrounded' ? 'gestartet, Abschluss nicht beobachtet' : e.outcome !== 'ok' ? `Ergebnis ${e.outcome}` : !e.after || !e.before ? 'Nachweis nicht verfügbar' : e.before.value !== e.after.value ? 'Baum während des Laufs geändert' : matches(e) ? 'unvollständige Abdeckung — ein Teil des Baums wurde nicht gelesen' : 'veraltet — der Baum wurde seitdem geändert'
    return `- ${s(e.requested)} — ${why}`
  })
  sec.push({ heading: '## 5. Nicht verifiziert', items: notVerified, fixed: ['- Alles, was Claude ohne einen obigen Nachweis als erledigt, bestanden oder behoben bezeichnet, ist nur seine eigene Einschätzung.'] })
  const open = ops.filter(([, o]) => o.endedAt === undefined && o.outcome !== 'refused')
  const bg = Object.entries(state.background ?? {}).filter(([, b]) => b.status === 'started' || b.status === 'in-flight')
  const running = [
    ...open.map(([id, o]) => `- ${s(o.requested)} (${o.tool}, ${o.outcome}) — ${id}`),
    ...bg.map(([id, b]) => `- Hintergrund ${s(id, 60)} — ${b.status}${b.asOf ? ` Stand ${new Date(b.asOf).toISOString()}` : ''}`),
  ]
  sec.push({ heading: '## 6. Läuft noch oder unklar', items: running, fixed: running.length ? [] : ['- Nichts wurde als noch laufend beobachtet. Nicht verfolgte Prozesse lassen sich weder bestätigen noch ausschließen.'] })
  const iv = Object.keys(state.interventions ?? {})
  sec.push({ heading: '## 7. Nächster Schritt', items: [], fixed: [iv.length ? `- Klären: ${iv.map((x) => s(x, 60)).join(', ')}` : '- Nichts aufgezeichnet. Entscheide anhand der Abschnitte 4–6.'] })
  const refused = (decisions ?? []).filter((d) => d.outcome === 'deny' || d.outcome === 'unknown' || d.outcome === 'needs-user-refused')
  sec.push({ heading: '## 8. Weiterhin nicht erlaubt', items: [], fixed: [
    ...(refused.length ? refused.slice(-10).map((d) => `- ${s(d.requested)} — ${s(d.rule)}`) : ['- In dieser Sitzung wurde kein Aufruf abgelehnt; der verbotene Bereich in Abschnitt 2 gilt weiterhin.']),
    '- Frühere Freigaben gelten nicht fort: bei Fortsetzung wird jeder Aufruf erneut klassifiziert und der Host fragt erneut.',
    // INV-005: what this mod cannot refuse is disclosed here as in /agentctl policy, never silent.
    '- Grenzen: Wenn der Host den Hook dieses Mods überspringt (Worker-Absturz, Mod deaktiviert), lehnt hier nichts ab; ein anderes Mod kann eine Entscheidung bei tool.check ändern. Harte Regeln gehören in permissions.deny.',
  ] })
  return assemble(head, sec, CAPS.handoff)
}
