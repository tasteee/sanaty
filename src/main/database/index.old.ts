// import path from 'path'
// import { glob } from 'glob'
// import { list } from '#/modules/list'
// import { $likes, $folders, $samples, $collections } from './setup'
// import { dialog } from 'electron'

// //
// // helpers
// //

// // function openFolderSelectDialog() {
// //   return dialog.showOpenDialog({
// //     properties: ['openDirectory'],
// //     title: 'Select a folder to index'
// //   })
// // }

// async function checkHasFolderBeenAdded(folderPath: string) {
//   const existingFolders = await getAllFolders()
//   return existingFolders.some((folder: FolderT) => folder.path === folderPath)
// }

// // function toggleAssetLiked(id: string) {
// //   $likes.toggle(id)
// //   return $likes.list
// // }

// //
// // getAll*
// //

// // async function getAllFolders() {
// //   const allFolders: FolderT[] = await $folders.findAsync({})
// //   return allFolders
// // }

// // async function getAllSamples() {
// //   const allSamples: SampleT[] = await $samples.findAsync({})
// //   return allSamples
// // }

// // async function getAllCollections() {
// //   const allCollections: CollectionT[] = await $collections.findAsync({})
// //   return allCollections
// // }

// // async function getAllLikes() {
// //   return await $likes.list
// // }

// //
// // create*
// //

// // // Build the base FolderT object.
// // async function createFolder(folderPath: string, sampleCount: number) {
// //   const folderName = path.basename(folderPath)

// //   return {
// //     id: folderPath,
// //     path: folderPath,
// //     name: folderName,
// //     sampleCount,
// //     createdDate: Date.now()
// //   } as FolderT
// // }

// // // Create the SampleT object to store in db.
// // function createSample(filePath: string, folderId: string) {
// //   const fileName = path.basename(filePath)
// //   const name = path.parse(fileName).name

// //   // TODO: Determine what npm packages I can use
// //   // to determine the duration, bpm, musical key / scale
// //   // sampleType, and potentially to auto generate
// //   // tags for the audio file...

// //   return {
// //     id: filePath,
// //     name, // 'soul-guitar'
// //     fileName, // 'soul-guitar.wav'
// //     filePath, // 'C://foo/bar/soul-guitar.wav'
// //     fileSize: 12345, // bytes
// //     folderId, // Reference to FolderT.id
// //     duration: 10,
// //     bpm: 93,
// //     key: 'd',
// //     scale: 'minor',
// //     sampleType: 'shot',
// //     tags: [],
// //     createdDate: Date.now()
// //   }
// // }

// // async function createCollection(data: CollectionT) {
// //   return await $collections.insertAsync(data)
// // }

// //
// // update*
// // //

// // async function updateFolder(id: string, updates: Partial<FolderT>) {
// //   await $folders.updateAsync({ id }, updates)
// // }

// // async function updateSample(id: string, updates: Partial<SampleT>) {
// //   await $samples.updateAsync({ id }, updates)
// // }

// // async function updateCollection(id: string, updates: Partial<SampleT>) {
// //   await $collections.updateAsync({ id }, updates)
// // }

// // Get all paths from sample objects in the DB.
// async function getAllSamplePaths() {
//   const allSamples: SampleT[] = await getAllSamples()
//   return allSamples.map((sample) => sample.filePath)
// }

// async function getOnlyNewSampleFilePaths(filePaths: string[]) {
//   const existingSampleFilePaths = await getAllSamplePaths()

//   return filePaths.filter((sampleFilePath) => {
//     return !existingSampleFilePaths.includes(sampleFilePath)
//   })
// }

// // given a folder path, get all the paths of mp3 or wav
// // files recursively inside of the folder
// // async function getFilePathsInFolder(folderPath: string) {
// //   const globOptions = { stat: true, absolute: true }
// //   const globString = `${folderPath}/**/*.{mp3|wav}`
// //   const audioFilePaths = glob.sync(globString, globOptions)
// //   return audioFilePaths
// // }

// async function getAllFolderSamples(folderId: string) {
//   const allSamples = await getAllSamples()

//   return allSamples.filter((sample) => {
//     return sample.folderId === folderId
//   })
// }

// async function addSampleToCollection(id: string, sampleId: string) {
//   const collection = await $collections.findOneAsync({ id })
//   const newSampleIds = Array.from(new Set([...collection.sampleIds, sampleId]))
//   await $collections.updateAsync({ id }, { sampleIds: newSampleIds })
// }

// async function removeSampleFromCollection(id: string, sampleId: string) {
//   const collection = await $collections.findOneAsync({ id })
//   const newSampleIds = collection.sampleIds.filter((assetId) => assetId !== sampleId)
//   await $collections.updateAsync({ id }, { sampleIds: newSampleIds })
// }

// // get all .wav or .mp3 file paths recursively inside folder.
// // ensure that none of the paths already exist on any samples
// // in the dataabse. create a new SampleT for each *new*
// // sample file path, then bulk add the new SampleTs to the db.
// async function indexFolderSamples(folderPath: string) {
//   const samplePaths = await getFilePathsInFolder(folderPath)
//   const newSampleFilePaths = await getOnlyNewSampleFilePaths(samplePaths)
//   const buildSample = (samplePath) => createSample(samplePath, folderPath) as SampleT
//   const sampleDatas = newSampleFilePaths.map(buildSample)
//   const sampleDocs = await $samples.insertAsync(sampleDatas)
//   const sampleCount = sampleDocs.length
//   console.log({ sampleCount, sampleDatas, samplePaths, newSampleFilePaths, sampleDocs })
//   return { sampleCount, sampleDocs }
//   // [1] { log output: Please fix why no samples are being found.....
//   //   [1]   sampleCount: 0,
//   //   [1]   sampleDatas: [],
//   //   [1]   samplePaths: [],
//   //   [1]   newSampleFilePaths: [],
//   //   [1]   sampleDocs: []
//   //   [1] }
// }

// // Re-index the samples recusrively in the folder.
// // If any samples found have unique paths (no other
// // $samples have the same filePath) then those samples
// // with unique paths are inserted into the db.
// async function refreshFolder(id: string) {
//   const folderDoc = await $folders.findOneAsync({ id })
//   const oldSampleCount = folderDoc.sampleCount
//   const { sampleCount } = await indexFolderSamples(folderDoc.path)
//   await updateFolder(id, { sampleCount })
//   console.log('refreshFolder ', { folderDoc, oldSampleCount, sampleCount })
//   return true
// }

// // Create a FolderT object and then
// // insert it to the db so it gets a id assigned
// // and pass it on to use to index samples in the folder
// // which will all be added to the db when indexing is done
// async function addFolder() {
//   const result = await openFolderSelectDialog()
//   const noFolderWasSelected = result.filePaths.length === 0
//   const selectionWasCanceled = result.canceled
//   const shouldExit = selectionWasCanceled || noFolderWasSelected

//   if (shouldExit) return null

//   const folderPath = result.filePaths[0]
//   const isAlreadyAdded = await checkHasFolderBeenAdded(folderPath)

//   if (isAlreadyAdded) return false

//   const { sampleCount } = await indexFolderSamples(folderPath)
//   const folderData = await createFolder(folderPath, sampleCount)
//   const folderDoc = await $folders.insertAsync(folderData)
//   console.log('addFolder ', { folderDoc, sampleCount })
//   return true
// }

// // find all SampleT ids in db related to the given folder id.
// // remove found sample ids from any collection's assetIds list.
// // remove all corresponding SampleT ojects from db.
// // delete corresponding folder from db
// async function removeFolder(id: string) {
//   const folderSamples = await getAllFolderSamples(id)
//   const allCollections = await getAllCollections()
//   const folderSampleIds = folderSamples.map((sample) => sample.id)

//   for (const collection of allCollections) {
//     const newCollectionSampleIds = list(collection.sampleIds).intersect(folderSampleIds)
//     const didListChange = collection.sampleIds.length !== newCollectionSampleIds.length
//     const updateQuery = { $set: { sampleIds: newCollectionSampleIds } }
//     if (didListChange) await $collections.updateAsync({ id: collection.id }, updateQuery)
//   }

//   await $samples.removeAsync({ folderId: id }, { multi: true })
//   await $folders.removeAsync({ id }, {})
// }

// // Count the samples in the DB that belong to the folder id provided.
// async function getFolderSampleCount(id: string) {
//   const folderSamples = await getAllFolderSamples(id)
//   return folderSamples.length
// }

// async function getCollectionAssets(id: string) {
//   const collection = await $collections.findOneAsync({ id })
//   const sampleIds = collection.sampleIds
//   return $samples.findAsync({ id: { $in: sampleIds } })
// }

// async function deleteCollection(id) {
//   await $collections.removeAsync({ id }, {})
// }

// type SampleSearchQueryT = {
//   key: string
//   scale: string
//   sampleType: string
//   isLiked: boolean
//   bpmMin: number
//   bpmMax: number
//   durationMin: number
//   durationMax: number
//   searchValue: string
//   sortOrder: string
//   sortBy: string
//   tags: string[]
// }

// async function searchSamples(filters: SampleSearchQueryT) {
//   const query = {} as any
//   query.bpm = { $gte: filters.bpmMin, $lte: filters.bpmMax }
//   query.duration = { $gte: filters.durationMin, $lte: filters.durationMax }
//   if (filters.key !== 'any') query.key = filters.key
//   if (filters.scale !== 'any') query.scale = filters.scale
//   if (filters.sampleType !== 'any') query.sampleType = filters.sampleType
//   if (filters.searchValue) query.name = { $regex: filters.searchValue, $options: 'i' }
//   if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags }
//   const sortQuery = { [filters.sortBy]: filters.sortOrder === 'ascending' ? 1 : -1 }
//   const samples = await $samples.findAsync(query).sort(sortQuery)
//   if (!filters.isLiked) return samples

//   return samples.filter((sample) => {
//     return $likes.list.includes(sample.id)
//   })
// }

// export const database = {
//   addFolder,
//   removeFolder,
//   createFolder,
//   refreshFolder,
//   getAllFolders,
//   getAllSamples,
//   searchSamples,
//   deleteCollection,
//   getAllCollections,
//   getFolderSampleCount,
//   getFilePathsInFolder,
//   createCollection,
//   getAllFolderSamples,
//   getAllSamplePaths,
//   getOnlyNewSampleFilePaths,
//   getCollectionAssets,
//   createSample,
//   indexFolderSamples,
//   addSampleToCollection,
//   removeSampleFromCollection,
//   updateCollection,
//   updateSample,
//   toggleAssetLiked,
//   getAllLikes
// }
