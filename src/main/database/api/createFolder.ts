import path from 'path'

export function createFolder(folderPath: string, sampleCount: number) {
  const folderName = path.basename(folderPath)

  return {
    id: crypto.randomUUID(),
    path: folderPath,
    name: folderName,
    sampleCount,
    dateAdded: Date.now()
  } as FolderT
}
