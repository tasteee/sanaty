import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import editJsonFile from 'edit-json-file'
import { CONFIG_FILENAME, DEFAULT_CONFIG } from './constants'

// Define the path to the config file in the user data directory
const CONFIG_PATH = path.join(app.getPath('userData'), CONFIG_FILENAME)

// Convert default config to a string for file creation
const STRING_DEFAULT_CONFIG = JSON.stringify(DEFAULT_CONFIG, null, 2)

// If config file does not exist yet, create it with the default config
if (!fs.existsSync(CONFIG_PATH)) {
  fs.writeFileSync(CONFIG_PATH, STRING_DEFAULT_CONFIG)
}

// Export the config object for use in other modules
export const config = editJsonFile(CONFIG_PATH)
