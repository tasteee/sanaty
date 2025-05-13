import { $likes } from "../setup";

export function getAllLikes() {
    return $likes.query().map(like => like.id)
}