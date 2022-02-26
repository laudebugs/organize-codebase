import { QuestionCollection } from "inquirer";

export type ICommand = {
    type: string, 
    name: string, 
    message: string, 
    commands?: CLICommand[],
    writeToFile?: {fileName: string, content:string}[], 
    successMessage?: string,
    packageJsonEntries?: {key: string, item: {[index: string]: string | Object}}[],
} & QuestionCollection

export type CLICommand = {
    command: string, args: string[], successMessage?: string
}