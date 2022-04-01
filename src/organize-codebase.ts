#!/usr/bin/env node

import chalk from 'chalk'
import { isNPMPackage, prettier, eslint, commitlint, husky, commitizen, semanticRelease, readMe, standardVersion } from './helpers/commands.js'
import { gitRepoInitialized, initializeRepo, executeConfig, usingNPM, usingYarn, initializeNPMorYarn } from './helpers/functions.js'

(async()=>{
  console.log(chalk.cyan('\nLet\s organize your codebase.\n'))

  let npmYarn = {npm: false, yarn: false}
  npmYarn.npm = await usingNPM()
  npmYarn.yarn = await usingYarn()
  console.log(npmYarn)
  if(!npmYarn.npm && !npmYarn.yarn){
    npmYarn = await initializeNPMorYarn()
  }
  let isGitRepo = gitRepoInitialized()
  if(!isGitRepo) await initializeRepo()
  isGitRepo = gitRepoInitialized()

  const isNPMProject = await executeConfig(isNPMPackage)

  await executeConfig(prettier, npmYarn)
  await executeConfig(eslint, npmYarn)
  await executeConfig(commitlint, npmYarn)

  if(isGitRepo) await executeConfig(husky, npmYarn)
  await executeConfig(commitizen, npmYarn)

  if(isNPMProject){
    await executeConfig(semanticRelease, npmYarn)
    await executeConfig(readMe, npmYarn)
  }
  else await executeConfig(standardVersion, npmYarn)

  console.log(chalk.hex('#F18F01')('\nSetup complete!\n'))
})()