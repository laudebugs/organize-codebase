import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import inquirer from 'inquirer'
import { CLICommand, ICommand } from '../interfaces/command'
import spawn from 'cross-spawn'

/* Create the prompter */
const prompt = inquirer.createPromptModule()

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
export async function sh(cmd: string) {
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else {
                resolve({ stdout, stderr })
            }
        })
    })
}

/**
 * Write to file
 * @param {string} filename
 */
export function writeFile(filename: string) {
    const file = fs.readFileSync(path.join(process.cwd(), `node_modules/organize-codebase/lib/${filename}`), 'utf8')
    fs.writeFileSync(filename, file, 'utf8')
}

export async function initializeRepo() {
    const initCommand: ICommand = {
        type: 'confirm',
        name: 'proceed',
        message: 'This folder is not currently a git repository. Do you want to initialize an new repository?',
    }
    const result = await executeConfig(initCommand)
    if (result) return await sh('git init')
    else return Promise.resolve()
}

export function gitRepoInitialized(): boolean {
    return fs.existsSync(path.join(process.cwd(), '.git'))
}

/**
 * Executes a configuration command
 * @param {Object} config
 * @returns whether or not the user chose to execute the command
 */
export async function executeConfig(config: ICommand) {
    return prompt(config).then(async (answers) => {
        if (answers.proceed) {
            if (config.commands) {
                config.commands.forEach(({ command, args }: CLICommand) => {
                    spawn.sync(command, args, { stdio: 'inherit' })
                })
            }
            if (config.writeToFile) {
                config.writeToFile.forEach((file: string) => {
                    writeFile(file)
                })
            }
        }
        return answers.proceed
    })
}
