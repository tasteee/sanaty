import { $folders } from "../setup";

export function getAllFolders() {
    return $folders.query()
}