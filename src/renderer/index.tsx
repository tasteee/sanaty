import { createRoot } from 'react-dom/client'
import { App } from './App'

globalThis.app = {} as any

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<App />)
