import { QuestionCollection } from "inquirer";

export type ICommand = {
    type: string, 
    name: string, 
    message: string, 
    commands?: {command: string, args: string[]}[],
    writeToFile?: string[]
} & QuestionCollection