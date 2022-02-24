#!/usr/bin/env node

import chalk from 'chalk'
import { isNPM, prettier, eslint, commitlint, husky, commitizen, semanticRelease, readMe, standardVersion } from './helpers/commands.js'
import { gitRepoInitialized, initializeRepo, executeConfig } from './helpers/functions.js'

(async()=>{
  console.log(chalk.cyan('Organize Codebases'))

  let isGitRepo = gitRepoInitialized()
  if(!isGitRepo) await initializeRepo()
  isGitRepo = gitRepoInitialized()

  const isNPMProject = await executeConfig(isNPM)

  await executeConfig(prettier)
  await executeConfig(eslint)
  await executeConfig(commitlint)

  if(isGitRepo) await executeConfig(husky)
  await executeConfig(commitizen)

  if(isNPMProject){
    await executeConfig(semanticRelease)
    await executeConfig(readMe)
  }
  else await executeConfig(standardVersion)
})()
