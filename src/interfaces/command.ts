import { QuestionCollection } from "inquirer";

export type ICommand = {
    type: string, 
    name: string, 
    message: string, 
    commands?: CLICommand[],
    writeToFile?: string[], 
    successMessage?: string,
} & QuestionCollection

export type CLICommand = {
    command: string, args: string[], successMessage?: string
}