export function createCollection(data: Partial<CollectionT>) {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description || '',
    sampleIds: data.sampleIds || [],
    dateAdded: Date.now()
  } as CollectionT
}
