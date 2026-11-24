import type { Host } from '../../hooks/model-text'
import type { AgentTool } from '../../hooks/tools'

export const OMP: Host = {
  agent: 'omp',
  surface: 'the /inbox Bereich',
  band: 'a band above their prompt',
  findingsIn: 'the Finds tab of the /inbox Bereich',
  prsIn: 'the PRs tab of the /inbox Bereich',
  recordTool: 'record',
  closeTool: 'close',
  splitsPlanIntoSubjects: false,
  intro:
    "The inbox extension zeigt the user what waits on them: your öffnen Fragen und the Aufgaben nur they can do, in the /inbox Bereich, und your findings, in the Bereich's Finds tab. A Leiste above their Prompt zeigt nur counts: one for your Fragen und their Aufgaben together, one for your findings, und one for their PRs that wait on them.",
}

/** The names omp shows for the inbox's tools. */
export const TOOL_LABELS: Record<AgentTool, string> = {
  record: 'Inbox record',
  close: 'Inbox close',
  order_prs: 'Inbox PR order',
}
