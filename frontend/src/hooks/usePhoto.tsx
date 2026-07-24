import { useContext } from "react"
import { PhotoContext } from "../context/PhotoContext"

const usePhoto = () => {
  const photoContext = useContext(PhotoContext)

  if (!photoContext) {
    throw new Error("usePhoto must be used within a PhotoContextProvider")
  }

  return photoContext
}

export default usePhoto
