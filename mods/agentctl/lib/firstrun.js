// First run (tech spec § 3.7, 2026-10-07): parsing `/agentctl …`, the drafting request a goal
// prepares, and the copy a first-time user reads. Pure: no `$`, no I/O.
//
// Found by a user's first run of 0.2.2: every path assumed the vocabulary, so a sentence after
// `/agentctl` got the usage grammar. A goal now prepares a request for Claude in the person's own
// prompt box; nothing here sends or binds anything.

import { renderArgv } from './policy.js'

// Verbs and how many words may follow each. `task` and `events` check their own arguments.
export const VERBS = {
  status: { max: 1, args: ['--details'] },
  help: { max: 1, args: ['advanced'] },
  proposal: { max: 0 },
  accept: { max: 1 },
  discard: { max: 0 },
  task: { max: Infinity },
  policy: { max: 0 },
  events: { max: 1 },
  handoff: { max: 0 },
  last: { max: 0 },
  stop: { max: 0 },
}

function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return d[a.length][b.length]
}

// What the line after `/agentctl` is: a verb (with its words), a near-miss of a verb, or a goal.
// Only a line that looks like command syntax — one ASCII word, optionally a digest or a number —
// can be a near-miss, so "test the login flow" stays a goal while "accepet ab12cd34" is corrected.
export function parseCommand(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return { kind: 'status', words: [] }
  const words = text.split(/\s+/)
  const head = words[0].toLowerCase()
  if (Object.hasOwn(VERBS, head)) {
    const rest = words.slice(1)
    const v = VERBS[head]
    if (rest.length > v.max) return { kind: 'extra', verb: head, rest }
    if (v.args && rest.length && !v.args.includes(rest[0])) return { kind: 'extra', verb: head, rest }
    return { kind: 'verb', verb: head, rest }
  }
  if (/^[a-z]{3,}(\s+[0-9a-z]{1,24})?$/i.test(text)) {
    let best = null
    for (const v of Object.keys(VERBS)) {
      const d = distance(head, v)
      if (d <= 2 && (!best || d < best.d)) best = { v, d }
    }
    if (best) return { kind: 'typo', verb: best.v, words }
  }
  return { kind: 'goal', text }
}

// A limited English / Traditional Chinese copy heuristic over the goal text — not locale detection.
export function languageOf(goal) {
  return /\p{Script=Han}/u.test(String(goal ?? '')) ? 'zh' : 'en'
}

// A path for a POSIX shell, single-quoted: the only character needing care inside is `'` itself.
export function shellQuote(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`
}

// The helper lives in the mod; `$.plugin.root` is the plugin's directory, but tolerate a root that
// points at `.claude-plugin` itself.
export function helperPath(root) {
  const r = String(root ?? '').replace(/\/+$/, '')
  return `${r.endsWith('/.claude-plugin') ? r.slice(0, -'/.claude-plugin'.length) : r}/bin/propose.mjs`
}

// The request the person sends to Claude. The goal is quoted verbatim and never truncated; the rest
// is fixed text kept short, since it becomes one ordinary model turn.
export function draftingRequest({ goal, worktree, base, root, lang }) {
  const helper = `node ${shellQuote(helperPath(root))} --worktree ${shellQuote(worktree)} --stdin`
  const baseText = base ? `"${base}"` : 'null'
  if (lang === 'zh') {
    return [
      `請為這件事起草 agentctl 任務範圍：「${goal}」`,
      `先跑 ${helper.replace(' --stdin', ' --help')} 看欄位，讀專案後提出最窄範圍（編輯路徑、檢查指令、驗收）。有不清楚的地方就問我並等我回答——回答前不要寫 proposal，也別自己加權限。`,
      `用 ${helper} 寫入（base 為 ${baseText}；heredoc 分隔字加引號且不在 JSON 內），只寫 proposal，然後等我確認。`,
    ].join('\n')
  }
  return [
    `Entwirf einen agentctl-Aufgabenbereich für: „${goal}“`,
    `Lies zuerst mit ${helper.replace(' --stdin', ' --help')} die Felder. Lies das Projekt und schlage den engstmöglichen Bereich vor (Bearbeitungspfade, Prüfbefehle, Abnahmebedingungen). Falls etwas unklar ist, frage mich und warte auf meine Antwort — schreibe vorher keinen Vorschlag und erfinde keine Berechtigungen.`,
    `Schreibe ihn mit ${helper} (Basis ${baseText}; ein in Anführungszeichen gesetztes Heredoc-Trennzeichen, das nicht im JSON vorkommt). Schreibe nur den Vorschlag und warte dann auf meine Bestätigung.`,
  ].join('\n')
}

const COPY = {
  de: {
    filled: (bound) => `Eine Anfrage an Claude, den Bereich zu entwerfen, liegt in deinem Eingabefeld — drücke Enter, um sie zu senden. ${bound ? 'Die aktuelle Aufgabe bleibt in Kraft, bis du den neuen Bereich akzeptierst.' : 'Es ist noch nichts gebunden.'}`,
    mixed: (bound) => `Die Anfrage wurde nach dem Text eingefügt, den du inzwischen getippt hast; beides liegt in deinem Eingabefeld. Bearbeite es, bevor du Enter drückst. ${bound ? 'Die aktuelle Aufgabe bleibt in Kraft, bis du den neuen Bereich akzeptierst.' : 'Es ist noch nichts gebunden.'}`,
    copy: (bound) => `Sende dies an Claude, damit es den Bereich entwirft (${bound ? 'die aktuelle Aufgabe bleibt in Kraft, bis du den neuen akzeptierst' : 'es ist noch nichts gebunden'}):`,
    typo: (v) => `Meintest du „/agentctl ${v}“? Um eine Aufgabe zu starten, beschreibe sie: /agentctl <was du tust>`,
    extra: (v) => `„/agentctl ${v}“ akzeptiert solche Argumente nicht. ${v === 'proposal' ? 'Es zeigt einen wartenden Entwurf; um einen zu erstellen, beschreibe die Arbeit: /agentctl <was du tust>' : 'Siehe /agentctl help.'}`,
    acceptLine: (d) => `Diesen Bereich akzeptieren: /agentctl accept ${d} — damit wird nur der Bereich gebunden, keine Arbeit gestartet.`,
    accepted: 'Bereich gebunden. Als Nächstes: Bitte Claude, die Arbeit zu starten.',
    runChecks: (checks) => `Um Nachweise zu hinterlassen, führe jede Prüfung genau wie angegeben aus: ${checks.join(' · ')} — eine Pipe, Umleitung oder ein Wrapper verhindert, dass ein Lauf zählt, und zusätzliche Argumente können weniger prüfen als angegeben.`,
    wholeScope: '/agentctl policy zeigt den gesamten Bereich.',
    noTaskLast: 'Es ist keine Aufgabe gebunden, daher gibt es noch keine Übergabe. Starte eine: /agentctl <was du tust>',
    noHandover: 'Diese Aufgabe hat noch keine gespeicherte Übergabe: /agentctl handoff speichert eine.',
    next: {
      none: 'Als Nächstes: beschreibe die Arbeit — /agentctl <was du tust>. Integrierte Ablehnungen (direkter git push, Schreibzugriffe auf Produktion) gelten jetzt schon.',
      proposal: (d) => `Als Nächstes: /agentctl proposal prüfen, dann /agentctl accept ${d}`,
      task: 'Als Nächstes: Bitte Claude zu arbeiten; /agentctl handoff speichert den aktuellen Stand.',
      taskThenChecks: (checks) => `Als Nächstes: Bitte Claude zu arbeiten und dann die Prüfungen genau wie angegeben auszuführen: ${checks.join(' · ')}. Sobald sie aktuell sind: /agentctl handoff`,
      rerun: (checks) => `Als Nächstes: auf diesem Stand nicht aktuell — bitte Claude, genau wie angegeben auszuführen: ${checks.join(' · ')}. Danach: /agentctl handoff`,
      checksCurrent: 'Als Nächstes: alle angegebenen Prüfungen sind auf diesem Stand aktuell — /agentctl handoff speichert die Übergabe.',
    },
  },
  zh: {
    filled: (bound) => `已把請 Claude 起草範圍的請求放進輸入框——按 Enter 送出。${bound ? '接受新範圍之前，目前的任務照舊生效。' : '目前尚未綁定任何範圍。'}`,
    mixed: (bound) => `請求接在你剛才打的字後面，兩者都在輸入框裡；送出前請先整理。${bound ? '接受新範圍之前，目前的任務照舊生效。' : '目前尚未綁定任何範圍。'}`,
    copy: (bound) => `把這段送給 Claude 讓它起草範圍（${bound ? '接受新範圍之前，目前的任務照舊生效' : '目前尚未綁定任何範圍'}）：`,
    typo: (v) => `你是要用「/agentctl ${v}」嗎？要開始任務，請描述它：/agentctl <你要做的事>`,
    extra: (v) => `「/agentctl ${v}」不接受這些參數。${v === 'proposal' ? '它只顯示等待中的草稿；要起草，請描述工作：/agentctl <你要做的事>' : '見 /agentctl help。'}`,
    acceptLine: (d) => `確認此範圍：/agentctl accept ${d} ——只會綁定範圍，不會開始任何工作。`,
    accepted: '範圍已綁定。下一步：請 Claude 開始這項工作。',
    runChecks: (checks) => `要留下證據，請照原樣執行每條檢查：${checks.join(' · ')} ——加 pipe、redirect 或外層包裝就不算；多加參數可能只檢查到一部分。`,
    wholeScope: '完整範圍：/agentctl policy',
    noTaskLast: '目前沒有綁定任務，所以還沒有交接紀錄。開始一個：/agentctl <你要做的事>',
    noHandover: '這個任務還沒有存過交接：/agentctl handoff 會存一份。',
    next: {
      none: '下一步：描述工作——/agentctl <你要做的事>。內建規則（直接 git push、production 寫入）現在就會擋。',
      proposal: (d) => `下一步：看 /agentctl proposal，再 /agentctl accept ${d}`,
      task: '下一步：請 Claude 開始工作；/agentctl handoff 會存下目前進度。',
      taskThenChecks: (checks) => `下一步：請 Claude 開始工作，完成後逐字執行檢查：${checks.join(' · ')}。檢查都是最新的之後：/agentctl handoff`,
      rerun: (checks) => `下一步：這些檢查在目前的程式碼上不是最新的——請 Claude 逐字執行：${checks.join(' · ')}。之後：/agentctl handoff`,
      checksCurrent: '下一步：宣告的檢查在目前的程式碼上都是最新的——/agentctl handoff 會存下交接。',
    },
  },
}

export function copy(lang) {
  return COPY[lang === 'zh' ? 'zh' : 'de']
}

// A check as a line Claude can run as written: quoted so it reads back as the declared argv, never
// shortened. An argv no quoting can carry is shown as its JSON array instead, which says to run it as
// those words.
export function checkLine(argv) {
  return renderArgv(argv) ?? `${JSON.stringify(argv)} (als diese Wörter)`
}

// The task's declared checks, as the command lines Claude must run as written.
export function checkArgv(task) {
  return (task?.executors ?? []).filter((e) => e.check).map((e) => checkLine(e.argv))
}

// The next step for a bound task, from where its declared checks stand (`checkProgress` in view.js).
// Found in an uncoached run: with the work done, "ask Claude to start" was still the next step.
export function nextForTask(t, progress) {
  if (!progress.declared) return t.next.task
  if (!progress.pending.length) return t.next.checksCurrent
  return progress.ran ? t.next.rerun(progress.pending) : t.next.taskThenChecks(progress.pending)
}

export function helpText(lang, advanced) {
  if (lang === 'zh') {
    return advanced ? [
      '進階：',
      '  /agentctl task show | set <json> | clear — 直接檢視或設定任務',
      '  /agentctl policy — 目前範圍與限制',
      '  /agentctl events [n] — 最近的拒絕與交給 host 的呼叫',
      '  /agentctl handoff · last — 存下交接 · 顯示上次的交接',
      '  /agentctl stop — 取消目前回合並存下交接',
      '  /agentctl status --details · discard — 完整狀態 · 丟棄草稿',
    ].join('\n') : [
      'agentctl 讓 Claude 在你確認的範圍內工作，並記錄檢查證據。',
      '  /agentctl <你要做的事> — Claude 起草範圍（不會綁定）',
      '  /agentctl accept <digest> — 你確認範圍（不會開始工作）',
      '  /agentctl — 目前狀態與下一步',
      '更多：/agentctl help advanced',
    ].join('\n')
  }
  return advanced ? [
    'Erweitert:',
    '  /agentctl task show | set <json> | clear — Aufgabe direkt ansehen oder setzen',
    '  /agentctl policy — geltender Bereich und seine Grenzen',
    '  /agentctl events [n] — jüngste Ablehnungen und an den Host delegierte Aufrufe',
    '  /agentctl handoff · last — Übergabe speichern · die letzte anzeigen',
    '  /agentctl stop — Runde abbrechen und eine Übergabe speichern',
    '  /agentctl status --details · discard — vollständiger Status · Entwurf verwerfen',
  ].join('\n') : [
    'agentctl hält Claude in einem von dir bestätigten Bereich und zeichnet Prüfnachweise auf.',
    '  /agentctl <was du tust> — Claude entwirft einen Bereich (bindet nichts)',
    '  /agentctl accept <digest> — du bestätigst ihn (startet keine Arbeit)',
    '  /agentctl — aktueller Stand und nächste Schritte',
    'Mehr: /agentctl help advanced',
  ].join('\n')
}

// What the box should suggest while a proposal waits (found live on 2.1.292: the host's own guess —
// "確認" — took the box, so Tab + Enter sent that word to Claude instead of accepting). Only the
// host's own guess is replaced, and only while a proposal is waiting; a plugin's suggestion, ours
// included, passes unchanged.
export function suggestionWhileWaiting(originKind, pendingDigest) {
  return originKind === 'suggestion' && pendingDigest ? `/agentctl accept ${String(pendingDigest).slice(0, 8)}` : null
}
