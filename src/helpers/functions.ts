import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import inquirer from 'inquirer'
import { CLICommand, ICommand, YarnNPM } from '../interfaces/command'
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
 * Check for package-lock.json
 * @returns {boolean}
 */
export function usingNPM(){
    return fs.existsSync(path.join(process.cwd(), 'package-lock.json'))
}

/**
 * Check for yarn.lock
 * @returns {boolean}
 */
export function usingYarn(){
    return fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
}

export async function initializeNPMorYarn(){
    const initCommand: ICommand = {
        type: 'list',
        name: 'proceed',
        choices: ['npm', 'yarn'],
        message: 'Do you want to use `npm` or `yarn` to manage your npm dependencies?',
        choiceTree: {
            npm: { command: 'npm', args: ['init'] },
            yarn: { command: 'yarn', args: ['init']},
        },

    }
    return await executeConfig(initCommand).then(async (result)=>{
        if (result === 'npm') {
            spawn.sync(initCommand.choiceTree?.npm.command ?? '', initCommand?.choiceTree?.npm.args ?? [], { stdio: 'inherit' })
            return {npm: true, yarn: false}
        }
        else if (result === 'yarn') {
            spawn.sync(initCommand.choiceTree?.yarn.command ?? '', initCommand?.choiceTree?.yarn.args ?? [], { stdio: 'inherit' })
            return {npm: false, yarn: true}
        }
        else return {npm: false, yarn: false}
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
export async function executeConfig(config: ICommand, yarnNpm: YarnNPM = {npm: false, yarn: false}){
    switch (config.type) {
        case 'confirm':
            return prompt(config).then(async (answers) => {
                if (answers.proceed) {
                    try {
                        if (config.commands) {
                            config.commands.forEach(({ command, args, successMessage }: CLICommand) => {
                                if(command === 'npm' && args[0] === 'install' && yarnNpm.yarn){
                                    command = 'yarn'
                                    args[0] = 'add'
                                }
                                spawn.sync(command, args, { stdio: 'inherit' })
                            })
                        }
                        if (config.writeToFile) {
                            config.writeToFile.forEach(({fileName, content}) => {
                                writeFile(fileName, content)
                            })
                        }
                        if(config.packageJsonEntries){
                            config.packageJsonEntries.forEach(({key, item}) => {
                                editToPackageJson(key, item)
                            })
                        }
                        if(config.successMessage) console.log(chalk.grey(config.successMessage), chalk.green('✔'))     
                    } catch (error: any) {
                        console.log(chalk.red('✘'), chalk.grey(error?.message))
                    }
                }
                return answers.proceed
            })
        }
}
