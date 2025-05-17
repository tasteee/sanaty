import PocketBase from 'pocketbase'

const pocketPath = 'http://127.0.0.1:8090'
export const pocket = new PocketBase(pocketPath)
export default pocket
