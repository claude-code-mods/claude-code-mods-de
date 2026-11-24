// The settings tokendoctor-set may change: keys that move token use or cost, each checked against
// settings-reference.md or env-vars.md. `live`: Claude Code reloads settings files on change, except
// model and effortLevel (settings.md#when-edits-take-effect); env values are read at session start.
// Hooks, permissions and anything that widens what Claude
// may do are deliberately absent, so a model driving this tool cannot grant itself more.
const n = (min, max) => (v) => Number.isInteger(v) && v >= min && v <= max
const oneOf = (...xs) => (v) => xs.includes(v)
const bool = (v) => typeof v === 'boolean'
const str = (v) => typeof v === 'string' && v.length > 0 && v.length < 200
// A model alias or a full model id: anything else would be sent to the API as a model name.
const model = (v) => typeof v === 'string' && /^(default|best|opusplan|(opus|sonnet|haiku|fable)(\[1m\])?|claude-[a-z0-9.-]+(\[1m\])?)$/.test(v)
const envNum = (min, max) => (v) => /^\d+$/.test(String(v)) && Number(v) >= min && Number(v) <= max

export const TUNABLES = {
  autoCompactWindow: { check: n(100000, 1000000), live: true, about: 'Token im Kontext vor der automatischen Verdichtung' },
  autoCompactEnabled: { check: bool, live: true, about: 'automatische Verdichtung an oder aus' },
  idleCompaction: { check: bool, live: true, about: 'lange inaktive Gespräche verdichten, bevor der einstündige Cache abläuft' },
  model: { check: model, live: false, about: 'Standardmodell für neue Sitzungen' },
  advisorModel: { check: model, live: true, about: 'Beratermodell' },
  effortLevel: { check: oneOf('low', 'medium', 'high', 'xhigh'), live: false, about: 'Denkaufwand' },
  alwaysThinkingEnabled: { check: bool, live: true, about: 'erweitertes Denken standardmäßig' },
  fastMode: { check: bool, live: true, about: 'Schnellmodus (höherer Preis pro Token)' },
  fastModePerSessionOptIn: { check: bool, live: true, about: 'Schnellmodus erst nach /fast in einer Sitzung' },
  includeGitInstructions: { check: bool, live: true, about: 'integrierte Git-Anweisungen und -Status im System-Prompt' },
  bashOutputMaxChars: { check: n(1000, 150000), live: true, about: 'Bash output kept inline' },
  promptSuggestionEnabled: { check: bool, live: true, about: 'Eingabevorschläge (eine kleine Anfrage nach jeder Antwort)' },
  skillListingBudgetFraction: { check: (v) => typeof v === 'number' && v > 0 && v <= 0.1, live: true, about: 'Anteil des Kontexts für die Skill-Liste' },
  skillListingMaxDescChars: { check: n(100, 5000), live: true, about: 'Zeichen pro Skill-Beschreibung in der Liste' },
  outputStyle: { check: str, live: true, about: 'Ausgabestil' },
  cleanupPeriodDays: { check: n(1, 3650), live: true, about: 'Tage, die Transkripte aufbewahrt werden' },
  disableClaudeAiConnectors: { check: bool, live: true, about: 'claude.ai-Konnektoren aus' },
  promptCacheTtl: { check: oneOf('5m', '1h'), live: true, about: 'Prompt-Cache-Lebensdauer des Hauptgesprächs' },
  subagentPromptCacheTtl: { check: oneOf('5m', '1h'), live: true, about: 'Prompt-Cache-Lebensdauer der Subagenten' },
  // tokendoctor's own options, kept where Claude Code keeps a plugin's: pluginConfigs.
  'tokendoctor.slide': { path: 'pluginConfigs.tokendoctor@tokendoctor.options.slide', check: bool, live: false, about: 'wo Claude Code verdichtet: alte Werkzeugausgaben kürzen statt das Gespräch zusammenzufassen' },
  'tokendoctor.slideTo': { path: 'pluginConfigs.tokendoctor@tokendoctor.options.slideTo', check: n(20, 90), live: false, about: 'wie viel Kontext ein Gleiten freigibt, in Prozent des Verdichtungspunkts von Claude Code' },
  'env.CLAUDE_CODE_SUBAGENT_MODEL': { check: model, live: false, about: 'Modell für Subagenten ohne eigenes Modell' },
  'env.CLAUDE_CODE_EFFORT_LEVEL': { check: oneOf('low', 'medium', 'high', 'xhigh', 'max'), live: false, about: 'Aufwand, über /effort und effortLevel' },
  'env.CLAUDE_CODE_AUTO_COMPACT_WINDOW': { check: (v) => /^(\d+[kK]?|1[mM])$/.test(String(v)), live: false, about: 'Fenster für automatische Verdichtung, über der Einstellung' },
  'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE': { check: envNum(1, 100), live: false, about: 'Prozent des Fensters, bei dem automatische Verdichtung einsetzt (kann nur gesenkt werden)' },
  'env.CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS': { check: envNum(100000, 1000000), live: false, about: 'Kontextgröße, ab der Verdichtung bei Inaktivität greift (Standard 200.000)' },
  maxEffortLevel: { check: oneOf('low', 'medium', 'high', 'xhigh', 'max'), live: true, about: 'höchster Aufwand, den Sitzung, Skill oder Subagent verwenden dürfen' },
  'env.MAX_MCP_OUTPUT_TOKENS': { check: envNum(1000, 200000), live: false, about: 'Ausgabelimit für MCP-Werkzeuge' },
  'env.BASH_MAX_OUTPUT_LENGTH': { check: envNum(1000, 150000), live: false, about: 'Bash-Ausgabelimit (bashOutputMaxChars hat Vorrang)' },
  'env.ENABLE_TOOL_SEARCH': { check: (v) => /^(true|false|auto(:\d+)?)$/.test(String(v)), live: false, about: 'MCP-Werkzeugdefinitionen verzögern' },
  'env.CLAUDE_CODE_MAX_OUTPUT_TOKENS': { check: envNum(1000, 200000), live: false, about: 'maximale Ausgabe-Token pro Antwort' },
  'env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS': { check: envNum(1000, 200000), live: false, about: 'Ausgabelimit des Read-Werkzeugs' },
  'env.CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS': { check: oneOf('1', '0'), live: false, about: 'integrierte Git-Anweisungen entfernen' },
}

// Parses a command-line value as JSON when it is one (true, 400000, "1h"), else keeps the text.
export function parseValue(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

// Returns the settings op for a change, or throws with the reason it is refused.
export function tunableOp(key, value) {
  const t = TUNABLES[key]
  if (!t) throw new Error(`"${key}" ist keine Einstellung, die tokendoctor ändert. Erlaubt: ${Object.keys(TUNABLES).join(', ')}`)
  const path = t.path ?? key
  if (value === undefined) return { op: 'unset', key: path }
  const v = key.startsWith('env.') ? String(value) : value
  if (!t.check(v)) throw new Error(`${JSON.stringify(value)} ist kein gültiger Wert für ${key} (${t.about})`)
  return { op: 'set', key: path, value: v }
}
