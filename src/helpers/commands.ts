import { ICommand } from '../interfaces/command'

export const isNPM: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Is your project a package to be published to npm?',
    successMessage: 'Successfully initialized a git repository.',
}

/* Prettier */
export const prettier: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Install Prettier? (Standardize code format: tabs, spaces, semi-colons, e.t.c)',
    commands: [{ command: 'npm', args: ['install', 'prettier', '-D'] }],
    writeToFile: ['.prettierrc.json'],
    successMessage: 'Installed Prettier and updated package.json.',
}

/* ESLINT */
export const eslint: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Install Eslint? (Find and fix problems in your codebase)',
    commands: [{ command: 'npm', args: ['init', '@eslint/config'] }],
}

/* Commitlint */
// Docs: https://github.com/conventional-changelog/commitlint#getting-started
export const commitlint: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Install Commitlint? (Lint your commit messages)',
    commands: [{ command: 'npm', args: ['install', '@commitlint/cli', '@commitlint/config-conventional', '-D'] }],
    writeToFile: ['commitlint.config.js'],
    successMessage: 'Installed Commitlint and updated package.json.',
}

/* Pre-Commit Hooks (with Husky) */
export const husky: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Add Pre-commit hooks? (Perform linting and code formatting when commiting)',
    commands: [
        // Install husky
        { command: 'npm', args: ['install', 'husky', '-D'] },
        // Activate Hooks
        { command: 'npx', args: ['husky', 'install'] },
        // Commitlint Hook
        { command: 'npx', args: ['husky', 'add', '.husky/commit-msg', 'npx --no -- commitlint --edit $1'] },
        /* Prettier Hook using pretty-quick: 
       https://prettier.io/docs/en/precommit.html#option-2-pretty-quickhttpsgithubcomazzpretty-quick */
        { command: 'npm', args: ['install', 'pretty-quick', '-D'] },
        { command: 'npx', args: ['husky', 'set', '.husky/pre-commit', '"npx pretty-quick --staged"'] },
    ],
    successMessage: 'Installed Husky, added pre-commit hooks and updated package.json.',
}

/* Commitizen
    https://github.com/commitizen/cz-cli#installing-the-command-line-tool */
export const commitizen: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Add Commitizen? (A Commandline utility for easily making commits)',
    commands: [{ command: 'npm', args: ['install', 'commitizen', '-D'] }],
}

/* Semantic Release - Best for NPM Packages
     Using the semantic release CLI
     https://github.com/semantic-release/semantic-release/blob/master/docs/usage/getting-started.md#getting-started */
export const semanticRelease: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Configure Semantic Release? (To automate Semantic versioning - uses the Semantic Release CLI)',
    commands: [
        { command: 'npx', args: ['semantic-release-cli', 'setup'] },
        { command: 'npm', args: ['install', '@semantic-release/changelog', '-D'] },
        { command: 'npm', args: ['install', '@semantic-release/git', '-D'] },
    ],
    successMessage: 'Configured Semantic Release and updated package.json.',
}

/* Standard Version - Best for non npm projects
   https://github.com/conventional-changelog/standard-version#standard-version */
export const standardVersion: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Configure Standard Version? (To Automate Versioning and Changelog Generation)',
    commands: [{ command: 'npm', args: ['install', 'standard-version', '-D'] }],
    successMessage: 'Installed Standard Version and updated package.json.',
}

export const readMe: ICommand = {
    type: 'confirm',
    name: 'proceed',
    message: 'Generate QuickStart Readme? (Using readme-md-generator)',
    commands: [{ command: 'npx', args: ['readme-md-generator'] }],
    successMessage: 'Generated README.md.',
}
