#!/usr/bin/env node
import 'dotenv/config'
import { bold } from 'chalk'

import { CommandDefinition } from './internal/utils/command-definition'
import {
  generateUsageGuide,
  Synopsis,
  typedCommandLineArgs,
  TypedOptionDefinitions,
  validateOptions
} from './internal/utils/typed-command-line-arguments'
import { checkVersionCommand, prepareReleaseCommand, redirectRefsCommand, setVersionCommand } from './internal/commands'

const commandDefinitions: Array<CommandDefinition<any>> = [
  checkVersionCommand,
  setVersionCommand,
  prepareReleaseCommand,
  redirectRefsCommand
]

const supportedCommands = commandDefinitions
  .map(command => `'${command.command}'`)
  .join(', ')

interface OptionsWithHelp {
  help: boolean
}

interface MainOptions {
  command?: string
}

const mainDefinitions: TypedOptionDefinitions<MainOptions> = {
  command: {
    defaultOption: true,
    typeLabel: '<command>',
    type: String,
    description: `One of: {bold ${commandDefinitions
      .map(command => command.command)
      .join(', ')}}
For more information about particular command run: {bold spicy <command> --help}`
  }
}

const mainOptions = typedCommandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })

if (mainOptions.command == null) {
  console.log(
    generateUsageGuide({
      command: 'spicy',
      precedingSections: [
        {
          header: '@spicy-hooks/bin',
          content: 'A set of binary utilities for managing and releasing JS/TS based projects.'
        }
      ],
      typedDefinition: mainDefinitions,
      synopses: [
        ['command']
      ]
    })
  )
  process.exit(0)
}

const activeCommandDefinition = commandDefinitions.find(({ command }) => command === mainOptions.command)

if (!activeCommandDefinition) {
  console.error(`Invalid command '${mainOptions.command}'. Supported commands: ${supportedCommands}`)
  process.exit(1)
}

const commandOptionsDefinitionsWithHelp: TypedOptionDefinitions<OptionsWithHelp> = {
  ...activeCommandDefinition.options,
  help: {
    type: Boolean,
    description: 'Display this usage guide',
    alias: 'h',
    required: true
  }
}

const commandOptions = typedCommandLineArgs(commandOptionsDefinitionsWithHelp, { argv: mainOptions._unknown ?? [] })

if (commandOptions.help) {
  console.log(
    generateUsageGuide({
      command: `spicy ${activeCommandDefinition.command}`,
      precedingSections: [
        {
          header: `spicy ${activeCommandDefinition.command}`,
          content: activeCommandDefinition.description
        }
      ],
      typedDefinition: commandOptionsDefinitionsWithHelp,
      synopses: [
        ...(activeCommandDefinition.synopses ?? [Object.keys(activeCommandDefinition.options)]) as Array<Synopsis<OptionsWithHelp>>,
        ['help']
      ]
    })
  )
  process.exit(0)
}

if (!validateOptions(activeCommandDefinition.options, commandOptions)) {
  console.log(`
Use ${bold('--help')} for more information`)

  process.exit(1)
}

activeCommandDefinition.execute(commandOptions)
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .catch(status => {
    process.exit(status)
  })
