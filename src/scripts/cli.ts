#!/usr/bin/env node

import prompts from 'prompts'
const chalk = require('chalk')
import { updateConfig, readConfig, getConfigSource } from '../common/config'
import plaid from '../integrations/plaid/setup'
import google from '../integrations/google/setup'
import csv from '../integrations/csv-import/setup'
import add from '../integrations/plaid/add'
import fetch from './fetch'
import migrate from './migrate'
import { logError } from '../common/logging'
;(async function() {
    const logo = [
        '\n',
        '          %',
        '          %%',
        '         %%%%%',
        '       %%%%%%%%',
        '     %%%%%%%%%%',
        '   %%%%%%%%%%%%',
        '  %%%% %%%%%%%%',
        '  %%%  %%%%%%',
        '  %%   %%%%%%',
        '   %   %%%',
        '        %%%',
        '         %%',
        '           %',
        '\n'
    ]

    logo.forEach(line => {
        console.log(chalk.green(line))
    })

    console.log(' M I N T A B L E\n')

    const commands = {
        migrate: migrate,
        fetch: fetch,
        'plaid-setup': plaid,
        'account-setup': add,
        'google-setup': google,
        'csv-import-setup': csv
    }

    const arg = process.argv[2]

    if (arg == 'setup') {
        const configSource = getConfigSource()
        if (readConfig(configSource, true)) {
            const overwrite = await prompts([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Config already exists. Do you to overwrite it?',
                    initial: false
                }
            ])
            if (overwrite.confirm === false) {
                logError('Config update cancelled by user.')
            }
        }
        updateConfig(config => config, true)
        await plaid()
        await google()
        await add()
    } else if (commands.hasOwnProperty(arg)) {
        commands[arg]()
    } else {
        console.log(`\nmintable v${require('../../package.json').version}\n`)
        console.log('\nusage: mintable <command>\n')
        console.log('available commands:')
        Object.keys(commands)
            .concat(['setup'])
            .forEach(command => console.log(`\t${command}`))
    }
})()