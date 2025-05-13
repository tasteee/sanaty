import { $collections } from "../setup";

export function updateCollection(id, data: Partial<CollectionT>) {
    $collections.queryUpdate(id, (collection) => {
        Object.assign(collection, data)
    })
}