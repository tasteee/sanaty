// src/main/indexer.ts
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const getAudioFilePathsRecursive = (folderPath: string): string[] => {
  let audioPaths: string[] = []
  const entries = fs.readdirSync(folderPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name)

    if (entry.isDirectory()) {
      audioPaths = audioPaths.concat(getAudioFilePathsRecursive(fullPath))
    } else if (entry.isFile() && isAudioFile(entry.name)) {
      audioPaths.push(fullPath)
    }
  }

  return audioPaths
}

const isAudioFile = (fileName: string): boolean => {
  const supportedExtensions = ['.wav', '.mp3', '.aif', '.aiff', '.flac', '.ogg']
  const extension = path.extname(fileName).toLowerCase()
  return supportedExtensions.includes(extension)
}

const extractAudioMetadata = async (filePath: string) => {
  // This is where you would implement audio file analysis
  // Ideally using a library like music-metadata or ffprobe
  // For now, returning placeholder values
  return {
    duration: 0, // Duration in seconds
    bpm: 93,
    key: 'd',
    scale: 'minor'
  }
}

export const indexFolder = async (folderPath: string, folderId: string): Promise<SampleT[]> => {
  const filePaths = getAudioFilePathsRecursive(folderPath)

  const samples = await Promise.all(
    filePaths.map(async (filePath) => {
      const stats = fs.statSync(filePath)
      const fileName = path.basename(filePath)
      const name = path.parse(fileName).name
      const fileExtension = path.extname(filePath).slice(1)
      const metadata = await extractAudioMetadata(filePath)

      return {
        _id: uuidv4(),
        name,
        fileName,
        filePath,
        fileSize: stats.size,
        fileExtension,
        isLiked: false,
        isDisliked: false,
        tags: [],
        folderId: folderId,
        createdDate: Date.now(),
        sampleType: 'loop',
        ...metadata
      } as SampleT
    })
  )

  return samples
}
