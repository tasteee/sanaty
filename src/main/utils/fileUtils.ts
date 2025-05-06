import fs from 'fs'
import path from 'path'

export const getAudioFilePathsRecursive = (folderPath: string): string[] => {
  let audioPaths: string[] = []

  const entries = fs.readdirSync(folderPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name)

    if (entry.isDirectory()) {
      audioPaths = audioPaths.concat(getAudioFilePathsRecursive(fullPath))
    } else if (entry.isFile() && (entry.name.endsWith('.wav') || entry.name.endsWith('.mp3'))) {
      audioPaths.push(fullPath)
    }
  }

  return audioPaths
}
