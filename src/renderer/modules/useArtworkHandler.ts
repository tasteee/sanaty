import { useState } from 'react'

export const useArtworkHandler = (value) => {
  const [file, setFile] = useState(null)
  const [imageBase64, setImageBase64] = useState(value)
  const imageSrc = imageBase64 || 'https://i.imgur.com/Zsft8Uj.png'

  const onFileChange = (event) => {
    const files = event.target.files

    if (files && files[0]) {
      const newFile = files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        // @ts-ignore
        setImageBase64(reader.result)
      }

      reader.readAsDataURL(newFile)
      setFile(newFile)
    }
  }

  const clear = (event) => {
    event.stopPropagation()
    setFile(null)
    setImageBase64('')
  }

  return {
    file,
    imageSrc,
    clear,
    onFileChange
  }
}
