import type { Args, EngineInterface, Frozen } from 'claude-code'

export const CONTEXT_TOOL = 'mcp__turbo__context-level'

export async function registerContextTool($: EngineInterface) {
  await $.tool.register({
    name: 'context-level',
    description: "Reads how much of this session's context window remains.",
  })
}

export async function answerContextLevel($: EngineInterface, e: Frozen<Args<'tool.call'>>) {
  if (e.agentId !== undefined) {
    return {
      result: "Keine Messung für einen Subagenten: Dieses Werkzeug misst das Kontextfenster der Hauptsitzung.",
    }
  }

  const { context } = await $.session.usage()

  if (context.percent === undefined) {
    return { result: 'Für das aktuelle Kontextfenster liegt noch keine Messung vor.' }
  }

  return { result: `Es sind noch ${100 - context.percent}% des Kontextfensters frei.` }
}
