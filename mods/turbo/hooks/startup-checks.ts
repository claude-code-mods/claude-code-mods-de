import type { EngineInterface } from 'claude-code'

const TODO_TOOLS_STATUS = 'setze CLAUDE_CODE_ENABLE_TODO_TOOLS=1 in den Einstellungen unter env (siehe SETUP.md)'

const TODO_TOOLS_NOTICE =
  '- `CLAUDE_CODE_ENABLE_TODO_TOOLS` ist in dieser Sitzung nicht auf `1` gesetzt, daher fehlen die Aufgaben-Werkzeuge. Informiere den Nutzer vor dem Start einer Turbo-Pipeline, dass die Schrittverfolgung erst funktioniert, wenn er `"CLAUDE_CODE_ENABLE_TODO_TOOLS": "1"` unter `env` in `~/.claude/settings.json` ergänzt und Claude Code neu startet.'

const COPY_INSTALL_STATUS = 'führe /update-turbo einmal aus, um zum Plugin zu migrieren'

const COPY_INSTALL_NOTICE =
  '- Auf diesem Rechner ist noch eine ältere Turbo-Kopie installiert. Bitte den Nutzer, `/update-turbo` einmal zur Migration zum Plugin auszuführen, oder folge, wenn diese Skill fehlt, https://github.com/tobihagemann/turbo/blob/main/claude/UPDATE.md; bis dahin überlagern kopierte Skills in `~/.claude/skills` die gleichnamigen Plugin-Skills.'

let notices: readonly string[] = []

export const startupNotices = () => notices

async function hasCopyInstall($: EngineInterface) {
  const config = `${await $.env.get('HOME')}/.turbo/config.json`

  try {
    const parsed = JSON.parse(await $.fs.read(config))

    return parsed?.claude?.lastUpdateHead !== undefined || parsed?.lastUpdateHead !== undefined
  } catch {
    return false
  }
}

export async function runStartupChecks($: EngineInterface) {
  const statuses: string[] = []
  const found: string[] = []

  if ((await $.env.get('CLAUDE_CODE_ENABLE_TODO_TOOLS')) !== '1') {
    statuses.push(TODO_TOOLS_STATUS)
    found.push(TODO_TOOLS_NOTICE)
  }

  if (await hasCopyInstall($)) {
    statuses.push(COPY_INSTALL_STATUS)
    found.push(COPY_INSTALL_NOTICE)
  }

  $.ui.status(statuses.length === 0 ? undefined : statuses.join(' · '))
  notices = found
}
