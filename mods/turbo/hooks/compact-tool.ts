import type { Args, EngineInterface, Frozen, TurnCompleteReason } from 'claude-code'
import { handoffPrompt, messageOf, ONE_LINE, submitOrToast, TOAST } from './shared'

export const COMPACT_TOOL = 'mcp__turbo__compact-and-continue'

let pendingHandoff: string | undefined

export async function registerCompactTool($: EngineInterface) {
  await $.tool.register({
    name: 'compact-and-continue',
    description:
      'Compacts the main conversation once this turn ends, then continues from the handoff file. ' +
      'Call it only right before ending a turn at a handoff-then-compact gate.',
    inputSchema: {
      type: 'object',
      properties: { handoff: { type: 'string', description: "The handoff file's path." } },
      required: ['handoff'],
    },
  })
}

export async function queueCompaction(_: EngineInterface, e: Frozen<Args<'tool.call'>>) {
  if (e.agentId !== undefined) {
    return { result: 'Keine Verdichtung für einen Subagenten: Dieses Werkzeug verdichtet die Hauptsitzung.' }
  }

  const { handoff } = e as { handoff?: unknown }

  if (typeof handoff !== 'string' || !ONE_LINE.test(handoff)) {
    return { result: 'Keine Verdichtung vorgemerkt: Gib den Pfad der geschriebenen Übergabedatei als `handoff` an.' }
  }

  pendingHandoff = handoff

  return { result: 'Nach Ende dieser Runde wird die Sitzung verdichtet und mit der Übergabe fortgesetzt. Beende die Runde jetzt.' }
}

export async function compactAfterTurn($: EngineInterface, reason: TurnCompleteReason) {
  const handoff = pendingHandoff
  pendingHandoff = undefined

  if (handoff === undefined || reason !== 'answer') {
    return
  }

  try {
    const compacted = await $.session.compact({
      instructions: `Behalte den Pfad der Übergabedatei, ${handoff}: Die Sitzung wird nach dieser Verdichtung damit fortgesetzt.`,
    })

    if (compacted.skip !== undefined) {
      $.ui.toast(`${compacted.skip}: Verdichtung übersprungen. Führe /compact aus und antworte dann "continue".`, TOAST)

      return
    }
  } catch (error) {
    $.ui.toast(`${messageOf(error)}: Verdichtung fehlgeschlagen. Führe /compact aus und antworte dann "continue".`, TOAST)

    return
  }

  $.clock.after(
    0,
    () =>
      void submitOrToast(
        $,
        handoffPrompt(handoff, 'compacted'),
        `${handoff}: verdichtet, aber die Fortsetzungsaufforderung wurde nicht gesendet. Antworte "continue".`,
      ),
  )
}
