import { $collections } from "../setup";

export function getAllCollections() {
    return $collections.query()
}