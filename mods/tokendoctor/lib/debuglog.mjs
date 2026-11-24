// What a Claude Code debug log (`claude --debug`, `--debug-file`) says about this setup: which mods
// loaded in which tier and on which events, whether the built-in guard was seated, hooks that were
// skipped, the window Claude Code compacts at, and warnings that cost tokens. Pure: text in, facts
// and findings out. bin/tokendoctor-selfcheck produces a log with one small request; the audit reads
// one the person already has (~/.claude/debug) when it is recent. A long session's log can pass the
// longest string Node makes, so a caller reading a file passes its lines (lib/transcript.mjs).

const TIERS = ['prepend', 'user', 'append', 'builtin']

/** `text`: the log, or its lines (any iterable of strings). */
export function parseDebugLog(text) {
  const out = {
    version: null,
    guard: null,
    modules: [],
    skipped: [],
    notOrg: [],
    listSkipped: [],
    skillBudget: null,
    effectiveWindow: null,
    pluginSkills: {},
    errors: 0,
  }
  const seen = new Set()
  for (const line of typeof text === 'string' ? text.split('\n') : text) {
    const body = line.replace(/^\S+ \[(DEBUG|INFO|WARN|ERROR)\] /, '')
    if (/ \[ERROR\] /.test(line) && !/NON-FATAL/.test(line)) out.errors++
    let m
    if ((m = /claude-code\/(\d+\.\d+\.\d+)/.exec(body)) && !out.version) out.version = m[1]
    if ((m = /^cc-plugin-sec-default@builtin (seated outermost|not seated): (.+)$/.exec(body))) {
      out.guard = { seated: m[1] !== 'not seated', reason: m[2].trim() }
    } else if ((m = /^hooks module (.+?) loaded \((\w+), environment \d+, tier (\w+)\); events: (.+)$/.exec(body))) {
      if (seen.has(m[1])) continue
      seen.add(m[1])
      out.modules.push({ id: m[1], kind: m[2], tier: m[3], events: m[4].split(',').map((e) => e.trim()) })
    } else if ((m = /^(\S+): (\S+) hook skipped: (.+)$/.exec(body))) {
      out.skipped.push({ mod: m[1], event: m[2], reason: m[3].trim() })
    } else if ((m = /^(\S+@\S+) is enabled by managed settings, but (.+)$/.exec(body))) {
      out.notOrg.push({ id: m[1], reason: m[2].trim() })
    } else if ((m = /^(prependPlugins|appendPlugins) names (\S+), which (.+); skipped$/.exec(body))) {
      out.listSkipped.push({ list: m[1], id: m[2].replace(/,$/, ''), reason: m[3] })
    } else if ((m = /Skill listing over budget: (\d+) skills, (\d+) chars > (\d+) budget/.exec(body))) {
      out.skillBudget = { skills: Number(m[1]), chars: Number(m[2]), budget: Number(m[3]) }
    } else if ((m = /^autocompact: .*effectiveWindow=(\d+)/.exec(body))) {
      out.effectiveWindow = Number(m[1])
    } else if ((m = /^Loaded (\d+) skills from plugin (\S+) /.exec(body))) {
      out.pluginSkills[m[2]] = Math.max(out.pluginSkills[m[2]] ?? 0, Number(m[1]))
    }
  }
  return out
}

const isOurs = (id) => /^tokendoctor@/.test(id)

/** Findings from a parsed log. `slideOn`: the person turned the slide on. */
export function debugFindings(log, { slideOn = false, source = 'the debug log' } = {}) {
  const findings = []
  const doc = (anchor) => `https://code.claude.com/docs/en/plugins/mods/${anchor}`
  const ours = log.modules.find((m) => m.id.split(',').map((s) => s.trim()).some(isOurs))

  if (!ours) {
    findings.push({
      id: 'tokendoctor-not-loaded', severity: 'error',
      title: 'Das Hooks-Modul von tokendoctor wurde nicht geladen',
      detail: `No \`hooks module tokendoctor@… loaded\` line in ${source}: /tokendoctor, the slide and the optimize tools are missing. ` +
        'Prüfe /plugin auf einen Fehler, ob eine Kopie aktiviert ist, und führe `claude plugin validate` dafür aus.',
      doc: doc('troubleshoot.md#find-out-why-a-mod-does-nothing'),
    })
  } else if (slideOn && log.guard?.seated && ours.tier === 'user') {
    findings.push({
      id: 'slide-behind-guard', severity: 'warn',
      title: 'Im Protokoll zu sehen: Das Gleiten läuft hinter der Schutzfunktion',
      detail: `${source} has the guard seated (${log.guard.reason}) and tokendoctor in the user tier, which compaction skips. ` +
        'Führe `tokendoctor-org-install` aus.',
      doc: doc('admin.md#know-which-hooks-of-a-users-mod-dont-run'),
    })
  }

  // Another mod that hooks compaction ahead of tokendoctor can answer it first.
  if (ours && slideOn && ours.events.includes('session.compact')) {
    const rank = (t) => TIERS.indexOf(t)
    const ahead = log.modules.filter((m) => m !== ours && !m.id.includes('sec-default') && m.events.includes('session.compact') && rank(m.tier) <= rank(ours.tier))
    if (ahead.length) {
      findings.push({
        id: 'compact-hooks-ahead', severity: 'info',
        title: `${ahead.length} weitere Mod(s) haken vor tokendoctor bei der Verdichtung ein`,
        detail: `${ahead.map((m) => `${m.id} (tier ${m.tier})`).join(', ')}. A mod earlier in the chain can summarize, change or skip a ` +
          'Verdichtung, bevor das Gleiten sie sieht.',
        doc: 'https://code.claude.com/docs/en/plugins/mods/events.md#the-order-mods-run-in',
      })
    }
  }

  for (const n of log.notOrg.filter((x) => isOurs(x.id))) {
    findings.push({
      id: 'org-copy-not-org', severity: 'error',
      title: 'Die Rechner-Kopie von tokendoctor zählt nicht als die der Organisation',
      detail: `Claude Code: "${n.id} is enabled by managed settings, but ${n.reason}". Run \`sudo tokendoctor-org-install --system --write\` again.`,
      doc: doc('admin.md#install-your-organizations-mods'),
    })
  }
  for (const n of log.listSkipped.filter((x) => isOurs(x.id))) {
    findings.push({
      id: 'org-copy-not-org', severity: 'error',
      title: `${n.list} skipped tokendoctor`,
      detail: `Claude Code: "${n.list} names ${n.id}, which ${n.reason}; skipped".`,
      doc: doc('admin.md#install-your-organizations-mods'),
    })
  }

  if (log.skipped.length) {
    const by = {}
    for (const s of log.skipped) by[`${s.mod} ${s.event}`] = s.reason
    findings.push({
      id: 'mod-hooks-skipped', severity: log.skipped.some((s) => isOurs(s.mod) || s.mod === 'tokendoctor') ? 'warn' : 'info',
      title: `${log.skipped.length} mod hook call(s) were skipped`,
      detail: Object.entries(by).slice(0, 6).map(([k, r]) => `${k}: ${r}`).join('; ') +
        '. Ein übersprungener Hook hat für dieses Ereignis nichts getan (er hat einen Fehler geworfen, eine Zeitüberschreitung hatte oder das falsche Format geliefert).',
      doc: doc('events.md#handle-a-hook-that-fails'),
    })
  }

  if (log.skillBudget) {
    const top = Object.entries(log.pluginSkills).sort((a, b) => b[1] - a[1]).slice(0, 3)
    findings.push({
      id: 'skill-listing-over-budget', severity: 'warn',
      title: `Die Skill-Liste überschreitet ihr Budget: ${log.skillBudget.skills} Skills`,
      detail: `${log.skillBudget.chars.toLocaleString('en')} characters against ${log.skillBudget.budget.toLocaleString('en')}, so Claude Code cuts descriptions short ` +
        'und Claude wählt Skills mit weniger Informationen. Jede Sitzung zahlt für die Liste' +
        (top.length ? `; the most skills come from ${top.map(([p, n]) => `${p} (${n})`).join(', ')}` : '') +
        '. Deaktiviere nicht genutzte Plugins (/plugin), statt das Budget zu erhöhen.',
      doc: 'https://code.claude.com/docs/en/skills.md',
    })
  }
  return findings
}
