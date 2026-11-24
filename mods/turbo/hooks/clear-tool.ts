import type { Args, EngineInterface, Frozen, TurnCompleteReason } from 'claude-code'
import { handoffPrompt, messageOf, ONE_LINE, submitOrToast, TOAST } from './shared'

export const CLEAR_TOOL = 'mcp__turbo__clear-and-continue'

const IMPLEMENT_COMMAND = 'turbo:implement-plan'

const SLUG = /^[A-Za-z0-9][A-Za-z0-9._-]*$/

type PlanContinuation = { plan: string; worktree: boolean }

type PendingContinuation = PlanContinuation | { handoff: string }

type ContinuationInput = { plan?: unknown; worktree?: unknown; handoff?: unknown }

let pendingContinuation: PendingContinuation | undefined

export async function registerClearTool($: EngineInterface) {
  await $.tool.register({
    name: 'clear-and-continue',
    description:
      'Clears the main conversation once this turn ends, then continues from a ready plan or a handoff file. ' +
      `For a plan, it runs /${IMPLEMENT_COMMAND} on it. ` +
      'For a handoff, it submits a prompt to read the file and continue. ' +
      'Call it only after the user chose to clear the conversation and continue.',
    inputSchema: {
      type: 'object',
      properties: {
        plan: { type: 'string', description: "The plan's slug: its file name under .turbo/plans/, without .md." },
        worktree: { type: 'boolean', description: 'With `plan`: implement the plan in a git worktree of its own.' },
        handoff: { type: 'string', description: "The handoff file's path. Pass it in place of `plan`." },
      },
    },
  })
}

export async function queueContinuation($: EngineInterface, e: Frozen<Args<'tool.call'>>) {
  if (e.agentId !== undefined) {
    return { result: 'Kein Clear für einen Subagenten: Dieses Werkzeug leert die Hauptsitzung.' }
  }

  const continuation = await validContinuation($, e as ContinuationInput)

  if (continuation === undefined) {
    return {
      result:
        'Nichts vorgemerkt: Gib entweder den Slug eines Plans unter .turbo/plans/ als `plan` an, optional mit `worktree`, ' +
        'oder den Pfad einer vorhandenen Übergabedatei als `handoff`, ohne `worktree`.',
    }
  }

  pendingContinuation = continuation
  const afterClear = 'plan' in continuation ? `führt /${IMPLEMENT_COMMAND} für den Plan aus` : 'fährt mit der Übergabe fort'

  return {
    result: `Nach Ende dieser Runde wird die Sitzung geleert und ${afterClear}. Beende verbleibende Aufgaben und beende dann die Runde.`,
  }
}

async function validContinuation(
  $: EngineInterface,
  { plan, worktree, handoff }: ContinuationInput,
): Promise<PendingContinuation | undefined> {
  if (plan !== undefined && handoff !== undefined) {
    return undefined
  }

  if (typeof plan === 'string' && SLUG.test(plan) && (await $.fs.exists(`.turbo/plans/${plan}.md`))) {
    return { plan, worktree: worktree === true }
  }

  if (typeof handoff === 'string' && ONE_LINE.test(handoff) && worktree !== true && (await $.fs.exists(handoff))) {
    return { handoff }
  }

  return undefined
}

export async function continueAfterTurn($: EngineInterface, reason: TurnCompleteReason) {
  const continuation = pendingContinuation
  pendingContinuation = undefined

  if (continuation === undefined || reason !== 'answer') {
    return
  }

  $.clock.after(0, () =>
    void ('plan' in continuation ? clearThenImplement($, continuation) : clearThenResume($, continuation.handoff)),
  )
}

async function clearThenImplement($: EngineInterface, plan: PlanContinuation) {
  const args = plan.worktree ? `${plan.plan} in einem Worktree` : plan.plan
  const typed = `/${IMPLEMENT_COMMAND} ${args}`

  if (!(await clearOrToast($, typed))) {
    return
  }

  try {
    await $.command.run({ command: IMPLEMENT_COMMAND, args })
  } catch (error) {
    $.ui.toast(`${messageOf(error)}: Sitzung geleert, aber der Plan wurde nicht gestartet. Führe ${typed} aus`, TOAST)
  }
}

async function clearThenResume($: EngineInterface, handoff: string) {
  const reply = `antworte "Lies die Übergabe unter ${handoff} und fahre fort"`

  if (!(await clearOrToast($, reply))) {
    return
  }

  await submitOrToast(
    $,
    handoffPrompt(handoff, 'cleared'),
    `${handoff}: Sitzung geleert, aber die Fortsetzungsaufforderung wurde nicht gesendet. Antworte "Lies die Übergabe unter ${handoff} und fahre fort".`,
  )
}

async function clearOrToast($: EngineInterface, next: string) {
  try {
    await $.command.run({ command: 'clear' })

    return true
  } catch (error) {
    $.ui.toast(`${messageOf(error)}: Leeren fehlgeschlagen. Führe /clear aus, dann ${next}`, TOAST)

    return false
  }
}
