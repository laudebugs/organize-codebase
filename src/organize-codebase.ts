#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import { exec } from 'child_process'
import spawn from 'cross-spawn'
import inquirer from 'inquirer'
import fs from 'fs'
import { ICommand } from './interfaces/command';

// must do this initialization *before* other requires in order to work
if (process.argv.includes('--debug')) {
  require('debug').enable('eslint:*,-eslint:code-path,eslintrc:*')
}

// clear()

console.log(
  chalk.cyan(
    figlet.textSync('Organize Codebases', { horizontalLayout: 'full' }),
  ),
)

/* Create the prompter */ 
const prompt = inquirer.createPromptModule()

const isNPM: ICommand = {
  type: 'confirm',
  name: 'proceed',
  message:
    'Is your project an npm package? (Determines which versioning package to use)',
}

/* Prettier */
const prettier: ICommand = {
  type: 'confirm',
  name: 'proceed',
  message:
    'Install Prettier? (Standardize code format: tabs, spaces, semi-colons, e.t.c)',
  commands: [
    { command: 'npm', args: ['install', 'prettier', '-D']}
  ], 
  writeToFile: [".prettierrc.json"]
}

/* ESLINT */
const eslint: ICommand = {
  type: 'confirm',
  name: 'proceed',
  message:
    'Install Eslint? (Find and fix problems in your codebase)',
  commands: [
    { command: "npm", args: ["init", "@eslint/config"] }
  ]
}

/* Commitlint */ 
// Docs: https://github.com/conventional-changelog/commitlint#getting-started
const commitlint: ICommand = {
  type: 'confirm',
  name: 'proceed',
  message:
    'Install Commitlint? (Lint your commit messages)',
  commands: [
    { command: 'npm', args: ['install', '@commitlint/cli', '@commitlint/config-conventional']}, 
  ], 
  writeToFile: [ "commitlint.config.js" ]
}

/* Pre-Commit Hooks (with Husky) */ 
const husky: ICommand = {
  type: 'confirm',
  name: 'proceed',
  message:
    'Add Pre-commit hooks? (Perform linting and code formatting when commiting)',
  commands: [
    // Install husky
    { command: 'npm', args: ['install', 'husky', '-D']}, 
    // Activate Hooks
    { command: 'npx', args: ['husky', 'install']}, 
    // Commitlint Hook
    { command: 'npx', args: [ 'husky', 'add', '.husky/commit-msg', 'npx --no -- commitlint --edit $1']},
    /* Prettier Hook using pretty-quick: 
     https://prettier.io/docs/en/precommit.html#option-2-pretty-quickhttpsgithubcomazzpretty-quick */
    { command: 'npm', args: ['install', 'pretty-quick', '-D']}, 
    { command: 'npx', args: ['husky', 'set', '.husky/pre-commit', '"npx pretty-quick --staged"']}, 
  ]
}

/* Commitizen
  https://github.com/commitizen/cz-cli#installing-the-command-line-tool */
const commitizen: ICommand = {
  type: 'confirm', 
  name: 'proceed', 
  message: 'Add Commitizen? (A Commandline utility for easily making commits)',
  commands: [
    { command: 'npm', args: [ 'install', 'commitizen', '-D']}
  ]
}

/* Semantic Release - Best for NPM Packages
   Using the semantic release CLI
   https://github.com/semantic-release/semantic-release/blob/master/docs/usage/getting-started.md#getting-started */
const semanticRelease: ICommand = {
  type: 'confirm', 
  name: 'proceed',
  message: 'Configure Semantic Release? (To automate Semantic versioning - uses the Semantic Release CLI)', 
  commands: [
    { command: 'npx', args: ['semantic-release-cli', 'setup'] }, 
    { command: 'npm', args: ['@semantic-release/release-notes-generator'] },
    { command: 'npm', args: ['@semantic-release/changelog'] },
    { command: 'npm', args: ['@semantic-release/git'] },
  ]
}

/* Standard Version - Best for non npm projects
 https://github.com/conventional-changelog/standard-version#standard-version */
const standardVersion: ICommand = {
  type: 'confirm', 
  name: 'proceed', 
  message: 'Configure Standard Version? (To Automate Versioning and Changelog Generation)',
  commands: [
    { command: 'npm', args: ['standard-version'] }
  ]
}


/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd: string) {
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
function writeFile(filename: string){
  const file = fs.readFileSync(`lib/${filename}`, 'utf8')
  fs.writeFileSync(filename, file, 'utf8')
}

/**
 * Executes a configuration command
 * @param {Object} config 
 * @returns whether or not the user chose to execute the command
 */
async function executeConfig(config: ICommand) {
  return prompt(config).then(async (answers) => {
    if (answers.proceed) {
      if(config.commands){
        config.commands.forEach((command)=>{
          spawn.sync(command.command, command.args, { stdio: 'inherit' })
        })
      }
      if (config.writeToFile) {
        config.writeToFile.forEach((file)=>{
          writeFile(file)
        })
      }
    }
    return answers.proceed
  })
}

(async()=>{
  const isNPMProject = await executeConfig(isNPM)
  await executeConfig(prettier)
  await executeConfig(eslint)
  await executeConfig(commitlint)
  await executeConfig(husky)
  await executeConfig(commitizen)
  if(isNPMProject){
    await executeConfig(semanticRelease)
  }
  else{
    await executeConfig(standardVersion)
  }
})()
