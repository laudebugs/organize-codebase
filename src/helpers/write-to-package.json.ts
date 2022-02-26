import fs from 'fs'
import path from 'path'


/**
 * Adds a script or value to the package.json file
 * If the key doesn't exist, it will be created.
 * 
 * @param key {string} - the key in the package.json file
 * @param value the value to set the key to
 */
export function editToPackageJson(key: string, item: {key: string, value: string}) {
    const file = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
    const line = file.split(/\r\n|\n/)[1]

    // Determine tabWidth
    let tabWidth = 4
    if(!/    /gm.test(line) && /  /gm.test(line)) tabWidth = 2

    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'))
    if(!packageJson[key]) packageJson[key] = {}
    packageJson[key][item.key] = item.value
    fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, tabWidth), 'utf8')
}

