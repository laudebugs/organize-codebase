import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import inquirer from 'inquirer'
import { CLICommand, ICommand } from '../interfaces/command'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import { editToPackageJson } from './write-to-package.json.js'

/* Create the prompter */
const prompt = inquirer.createPromptModule()

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Promise} - Returns a promise that resolves to the output of the running the terminal
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
export function writeFile(filename: string, content: string) {
    fs.writeFileSync(filename, content, 'utf8')
    console.log(chalk.hex('#829CBC')(`░ Created ${filename} in base directory. ░`))
}

/**
 * Initialize git repo in the current directory where the command is executed.
 * 
 * @returns {Promise<boolean>}
 */
export async function initializeRepo() {
    const initCommand: ICommand = {
        type: 'confirm',
        name: 'proceed',
        message: 'Looks like the current directory isn\'t a git repository. Would you like to initialize an new git repository?',
        writeToFile: [{fileName: '.gitignore', content: `node_modules\n`}],
    }
    return await executeConfig(initCommand).then(async (result)=>{
        if (result) {
            return await sh('git init')}
        else return false
    })
}

/**
 * Checks if the current directory is a git repository.
 * 
 * @returns {Boolean} true if git repo is initialized
 */
export function gitRepoInitialized(): boolean {
    return fs.existsSync(path.join(process.cwd(), '.git'))
}

/**
 * Executes a configuration command
 * 
 * @param {ICommand} config
 * @returns whether or not the user chose to execute the command
 */
export async function executeConfig(config: ICommand) {
    return prompt(config).then(async (answers) => {
        if (answers.proceed) {
            if (config.commands) {
                config.commands.forEach(({ command, args, successMessage }: CLICommand) => {
                    spawn.sync(command, args, { stdio: 'inherit' })
                })
            }
            if (config.writeToFile) {
                config.writeToFile.forEach(({fileName, content}) => {
                    writeFile(fileName, content)
                })
            }
        }
        if(config.packageJsonEntries){
            config.packageJsonEntries.forEach(({key, item}) => {
                editToPackageJson(key, item)
            })
        }
        if(config.successMessage) console.log(chalk.grey(config.successMessage), chalk.green('✔'))
        return answers.proceed
    })
}
