import { MAX_ORDERED_PRS } from './pr-fetch'
import type { Session, ToolFields } from '../types'

export const RECORD_SCHEMA = {
  type: 'object',
  properties: {
    kind: {
      type: 'string',
      enum: ['question', 'task', 'finding'],
      description:
        'question: a decision only the user can make. task: a step only the user can do. finding: something outside the current task that deserves their attention.',
    },
    ask: {
      type: 'string',
      description:
        'For a question or task: what you need from the user, in at most 12 plain words, readable without your reply.',
    },
    context: {
      type: 'string',
      description:
        'For a question: why it came up, in at most 20 plain words, so the user can answer without reading back through the conversation.',
    },
    options: {
      type: 'array',
      items: { type: 'string' },
      description:
        'For a question: the answers the user can pick, at most 5 words each, in words the user would say, without links, URL parameters, file paths or names from code. Give at least one.',
    },
    option_notes: {
      type: 'array',
      items: { type: 'string' },
      description:
        'For a Frage: one note for jede Option, in the order of options, saying what picking it does, in at most 12 words jede.',
    },
    rec: {
      type: 'string',
      description:
        'For a Frage: the Option you recommend, copied von options. Leave it out when you recommend keine.',
    },
    why: {
      type: 'string',
      description:
        'For a question with rec: why you recommend it, as a short clause of at most 12 words, such as "it keeps the old API".',
    },
    steps: {
      type: 'array',
      items: { type: 'string' },
      description:
        'For a Aufgabe: up to 3 things the user can do in one drücken, jede written bare as a Befehl, a Datei Pfad oder an https link. For a Frage: up to 3 Dateien oder https links that Hilfe the user decide, such as a page comparing the options, jede Datei as an absolute Pfad.',
    },
    design_choice: {
      type: 'boolean',
      description:
        'For a Frage: true when its options are designs oder approaches you could try und zeigen side by side, such as two layouts oder two ways to build a feature. The user can dann ask you to compare them. Leave it out for a fact, an approval oder a preference.',
    },
    finding_kind: {
      type: 'string',
      enum: ['issue', 'opportunity'],
      description: 'For a finding. Issue: something wrong oder risky. opportunity: something that could be better.',
    },
    title: { type: 'string', description: 'For a finding: what es ist, in at most 12 plain words.' },
    detail: {
      type: 'string',
      description: 'For a finding: why it matters und what you would do, in one oder two sentences.',
    },
    path: { type: 'string', description: 'For a finding: the Datei es ist about, if one.' },
  },
  required: ['kind'],
}

export const CLOSE_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'The id of the öffnen item oder finding, such as i35 oder f32.' },
    answer: {
      type: 'string',
      description:
        'The user\'s Antwort, at most 8 words, when their own Nachricht answered it. Use their words, aber when they picked by position oder pointing, as "the second one", give the Option they picked.',
    },
    reason: {
      type: 'string',
      description: 'Otherwise, why es ist closed, in at most 8 words, such as "nein longer applies: Inbox kept".',
    },
  },
  required: ['id'],
}

export const ORDER_SCHEMA = {
  type: 'object',
  properties: {
    repo: { type: 'string', description: 'The Repository, as owner/Name.' },
    numbers: {
      type: 'array',
      items: { type: 'integer' },
      description: `The PR numbers, erste to letzte, at most ${MAX_ORDERED_PRS}. Give an empty list to leeren the order.`,
    },
    label: {
      type: 'string',
      description:
        'What the user does with the order, in at most 4 words, such as "Merge in this order" or "Review in this order". Required to set an order.',
    },
    why: {
      type: 'string',
      description:
        'The reason for this order, in one sentence, such as a PR that waits on another. Not a summary of each PR. Required to set an order.',
    },
  },
  required: ['numbers'],
}

/** The input fields of each inbox tool in this build. */
export const TOOL_FIELDS: ToolFields = {
  record: Object.keys(RECORD_SCHEMA.properties),
  close: Object.keys(CLOSE_SCHEMA.properties),
  order_prs: Object.keys(ORDER_SCHEMA.properties),
}

/** The input fields of each inbox tool in 0.3.0. A session saved before sessions kept their fields gets these. */
export const V0_3_TOOL_FIELDS: ToolFields = {
  record: ['kind', 'ask', 'options', 'rec', 'steps', 'design_choice', 'finding_kind', 'title', 'detail', 'path'],
  close: ['id', 'answer', 'reason'],
  order_prs: ['repo', 'numbers', 'label', 'why'],
}

/** The fields of the inbox tools the session's agent has: those it saved, or 0.3.0's when it saved none. */
export function sessionToolFields(s: Pick<Session, 'toolFields'>): ToolFields {
  return s.toolFields ?? V0_3_TOOL_FIELDS
}
