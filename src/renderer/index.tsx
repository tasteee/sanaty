import '@mantine/core/styles.css'
import { createRoot } from 'react-dom/client'
import { App } from './App'
// import { styleSheet } from './styles'

// import gsap from 'gsap'
// import { useGSAP } from '@gsap/react'
// gsap.registerPlugin(useGSAP)

globalThis.app = {} as any

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
  <>
    {/* <style dangerouslySetInnerHTML={{ __html: styleSheet() }} /> */}
    <App />
  </>
)
