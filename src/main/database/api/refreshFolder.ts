import { createSample } from './createSample'
import { scanFolder } from './scanFolder'
import { $folders, $samples } from '../setup'

export function refreshFolder(id: string) {
  const folder = $folders.queryById(id)
  const existingFolderSamples = $samples.query({ folderId: id })
  const existingSamplePaths = existingFolderSamples.map((sample) => sample.path)
  const foundSamplePaths = scanFolder(folder.path)
  const missingSamplePaths = existingSamplePaths.filter((path) => !foundSamplePaths.includes(path))
  const newSampleFilePaths = foundSamplePaths.filter((path) => !existingSamplePaths.includes(path))
  const newSampleDocs = newSampleFilePaths.map((path) => createSample(path, id))
  const withMissingRemoved = existingFolderSamples.filter((sample) => !missingSamplePaths.includes(sample.path))
  $samples.state = [...withMissingRemoved, ...newSampleDocs]
  $folders.queryUpdate(id, (folder) => ({ ...folder, sampleCount: newSampleDocs.length }))
}
