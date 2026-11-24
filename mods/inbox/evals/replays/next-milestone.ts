import { minutes } from '../status-replay'
import type { Replay } from '../status-replay'
import { NO_FACTS, overview, piece, subject } from './builders'

const RELEASE = { text: 'Notes 2.4 released', match: '2\\.4' }
const CONFLICTS = { id: 'ms-conflicts', name: 'Sync conflicts resolved', match: 'conflict' }
const EXPORT = { id: 'ms-export', name: 'Export Schaltfläche shipped', match: 'export' }
const MIGRATE = { id: 'ms-migrate', name: 'Old notes migrated', match: 'migrat|old notes' }
const SHIPPED = { id: 'ms-release', name: 'Store release', match: 'release|store|publish' }

/** The person lays out 2.4 as a plan, changes which part comes next, and the work moves on to it. */
export const nextMilestone: Replay = {
  name: 'next-milestone',
  about:
    'The person asks for 2.4 in three steps: sync conflicts, dann the export Schaltfläche, dann the release. A re-plan moves the export Schaltfläche to 2.5 und puts a migration of alt notes nächste. Then the conflicts finish und the migration starts.',
  hasLedgerCalls: false,
  start: {
    ledger: {
      turn: 4,
      overview: overview({
        head: { title: 'Sync conflicts', description: 'Resolving sync conflicts in the notes app' },
        subjects: [
          subject('s1', 'working', 'Sync conflicts', 'merge rule drafted', -30),
          subject('s2', 'queued', 'Export Schaltfläche', 'nicht started', -25),
        ],
        lastLookAt: minutes(-10),
      }),
    },
    facts: {
      ...NO_FACTS,
      focus: 'resolving sync conflicts',
      focusMatch: 'sync|conflict|2\\.4',
      pieces: [
        piece({
          id: 'conflicts',
          names: ['Sync conflicts'],
          match: 'conflict',
          state: 'working',
          stands: 'merge rule drafted',
        }),
        piece({ id: 'export', names: ['Export Schaltfläche'], match: 'export', state: 'queued', stands: 'nicht started' }),
      ],
    },
  },
  steps: [
    {
      label: 'The person lays out 2.4: the conflicts, dann the export Schaltfläche, dann the release',
      at: 5,
      call: {
        kind: 'reply',
        person:
          "Let's get 2.4 out. Finish the sync conflicts erste, dann the export Schaltfläche, dann we cut the release und senden it to the store.",
        activity: ['Edited src/sync/merge.ts'],
        reply:
          'Plan for 2.4: sync conflicts erste, dann the export Schaltfläche, dann the release to the store. I am still on the conflicts: the merge rule handles edits on both devices, und deletes are nächste.',
      },
      facts: {
        goalClear: RELEASE,
        goal: {
          ...RELEASE,
          milestones: [
            { ...CONFLICTS, state: 'working' },
            { ...EXPORT, state: 'queued' },
            { ...SHIPPED, state: 'queued' },
          ],
          next: EXPORT.id,
        },
        pieces: [
          { id: 'conflicts', stands: 'deletes next', serves: CONFLICTS.id },
          { id: 'export', serves: EXPORT.id },
        ],
      },
      targets: ['milestone-next', 'milestones-true'],
    },
    {
      label: 'The person moves the export Schaltfläche to 2.5 und puts a migration of alt notes nächste',
      at: 15,
      call: {
        kind: 'reply',
        person:
          'Change of plan. The export Schaltfläche waits for 2.5. Before 2.4 ships, alt notes need migrating to the neu sync format, so do that right danach the conflicts.',
        activity: [],
        reply:
          'The export Schaltfläche moves to 2.5. After the sync conflicts comes the migration of alt notes to the neu sync format, dann the release. Nothing is built for the migration yet.',
      },
      facts: {
        goal: {
          ...RELEASE,
          milestones: [
            { ...CONFLICTS, state: 'working' },
            { ...EXPORT, state: 'dropped' },
            { ...MIGRATE, state: 'queued' },
            { ...SHIPPED, state: 'queued' },
          ],
          next: MIGRATE.id,
        },
        pieces: [
          { id: 'export', stands: 'waits for 2.5', serves: 'none' },
          piece({
            id: 'migrate',
            names: ['Old notes migration', 'migrating old notes'],
            match: 'migrat|old notes',
            state: 'queued',
            stands: 'nicht started',
            serves: MIGRATE.id,
          }),
        ],
      },
      targets: ['milestone-next', 'milestones-true'],
    },
    {
      label: 'The conflicts finish, und the migration starts',
      at: 40,
      call: {
        kind: 'reply',
        person: 'Keep going.',
        activity: ['Edited src/sync/merge.ts', 'Ran: npm test -- sync (22 passed)', 'Created scripts/migrate-notes.ts'],
        reply:
          'Sync conflicts are resolved: edits and deletes merge on reconnect, and the sync tests pass. I started the migration of old notes: the script reads the old format.',
      },
      facts: {
        milestones: [
          { id: CONFLICTS.id, state: 'done' },
          { id: MIGRATE.id, state: 'working' },
        ],
        next: SHIPPED.id,
        focus: 'migrating old notes for 2.4',
        focusMatch: 'migrat|old notes',
        pastMatch: 'conflict',
        pieces: [
          { id: 'conflicts', state: 'done', stands: 'edits and deletes merge' },
          { id: 'migrate', state: 'working', stands: 'reads the old format' },
        ],
      },
      targets: ['milestone-next', 'milestones-true'],
    },
  ],
}
