import { getAudioFilePathsRecursive } from './utils/fileUtils'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const indexFolder = async (_event, folderPath: string, existingFilePaths: Set<string> = new Set()) => {
  const filePaths = getAudioFilePathsRecursive(folderPath)

  const assets = filePaths
    .filter((filePath) => !existingFilePaths.has(filePath))
    .map((filePath) => {
      const stats = fs.statSync(filePath)
      return {
        id: uuidv4(),
        filePath,
        name: path.basename(filePath),
        length: 12, // placeholder
        key: 'd#', // placeholder
        scale: 'minor', // placeholder
        bpm: 120, // placeholder
        tagIds: [],
        isLiked: false,
        dateAdded: Date.now(),
        sampleType: 'oneShot', // placeholder
        fileSize: stats.size
      }
    })

  return assets
}
