import { config } from 'dotenv'

import { CommandDefinition } from './internal/utils/command-definition'
import { typedCommandLineArgs, TypedOptionDefinitions } from './internal/utils/typed-command-line-arguments'
import { checkVersionCommand, setVersionCommand } from './internal/commands'

config()

const commandDefinitions: Array<CommandDefinition<any>> = [
  checkVersionCommand,
  setVersionCommand
]

const supportedCommands = commandDefinitions
  .map(command => `'${command.command}'`)
  .join(', ')

interface MainOptions {
  command?: string
}

const mainDefinitions: TypedOptionDefinitions<MainOptions> = {
  command: {
    defaultOption: true,
    type: String
  }
}

const mainOptions = typedCommandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })

if (mainOptions.command == null) {
  console.error(`Missing command. Supported commands: ${supportedCommands}`)
  process.exit(1)
}

const activeCommandDefinition = commandDefinitions.find(({ command }) => command === mainOptions.command)

if (!activeCommandDefinition) {
  console.error(`Invalid command '${mainOptions.command}'. Supported commands: ${supportedCommands}`)
  process.exit(1)
}

const commandOptions = typedCommandLineArgs(activeCommandDefinition.options, { argv: mainOptions._unknown ?? [] })

activeCommandDefinition.execute(commandOptions)
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .catch(status => {
    process.exit(status)
  })
