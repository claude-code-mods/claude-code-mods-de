import type { EngineInterface } from 'claude-code'

export const TOAST = { timeoutMs: 60_000 }

export const ONE_LINE = /^[^\p{Cc}\p{Cf}\p{Zl}\p{Zp}]+$/u

export function messageOf(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function handoffPrompt(handoff: string, reset: 'compacted' | 'cleared') {
  return (
    `Die Sitzung wurde ${reset}. Lies die Übergabe unter ${handoff}, ` +
    'nutze dann das TaskList-Werkzeug und fahre mit dem nächsten darin genannten Schritt fort.'
  )
}

export async function submitOrToast($: EngineInterface, text: string, notSent: string) {
  try {
    const submitted = await $.prompt.submit({ text })

    if (submitted.drop === undefined) {
      return
    }
  } catch {}

  $.ui.toast(notSent, TOAST)
}
