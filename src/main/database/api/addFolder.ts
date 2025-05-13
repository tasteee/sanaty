import { createSample } from './createSample'
import { createFolder } from './createFolder'
import { openAddFolderSelectDialog } from '../helpers'
import { scanFolder } from './scanFolder'
import { $folders, $samples } from '../setup'

// [User selects a folder from the file system for sanaty to index.]
// Find all the sample files recursively in the folder.
// Create a new folder document.
// For each sample, create a new sample document.
// Add the folder and samples to the database.

export async function addFolder() {
  const folderPath = await openAddFolderSelectDialog()
  if (!folderPath) return

  console.log('adding folder ', folderPath)
  
  const foundSamplePaths = scanFolder(folderPath)

  console.log(folderPath, ' found sample paths ', foundSamplePaths.length)
  
  const folder = createFolder(folderPath, foundSamplePaths.length)
  $folders.([...$folders.state, folder)
  const newSampleDocs = foundSamplePaths.map((path) => createSample(path, folder.id))
  console.log('-- adding ', newSampleDocs.length, ' samples!')
  $samples.state = [...$samples.state, ...newSampleDocs]
  console.log('-- there are now ', $samples.state.length, ' sample docs!')
}
