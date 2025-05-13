import { glob } from 'glob'

// When user is adding a folder or refreshing a folder.
// Find all the sample file pats recursively in the folder.

export function scanFolder(folderPath: string) {
  const globOptions = { stat: true, absolute: true }
  const globString = `${folderPath}/**/*.{mp3,wav}`
  const audioFilePaths = glob.sync(globString, globOptions)
  return audioFilePaths
}
