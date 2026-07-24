import { createContext, useState } from "react"
import type { Photo, PhotosLoading } from "../types/photo.types"
import { getAllPhotosService, createPhotoService, deletePhotoService } from "../services/photo.service"

type PhotoContextType = {
  photos: Photo[]
  loading: PhotosLoading
  getPhotos: () => Promise<void>
  createPhoto: (data: FormData) => Promise<void>
  deletePhoto: (id: string) => Promise<void>
}

export const PhotoContext = createContext<PhotoContextType | null>(null)

export const PhotoContextProvider = ({ children }: any) => {
  const [photos, setPhotos] = useState<Photo[]>([])

  const [loading, setLoading] = useState<PhotosLoading>({
    get: false,
    create: false,
  })

  const getPhotos = async () => {
    setLoading(prev => ({ ...prev, get: true }))
    try {
      const res = await getAllPhotosService()
      setPhotos(res.photos)
    } catch (err) {
      console.error(err)
      setPhotos([])
    } finally {
      setLoading(prev => ({ ...prev, get: false }))
    }
  }

  const createPhoto = async (data: FormData) => {
    setLoading(prev => ({ ...prev, create: true }))
    try {
      await createPhotoService(data)
      await getPhotos()
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading(prev => ({ ...prev, create: false }))
    }
  }

  const deletePhoto = async (id: string) => {
    try {
      await deletePhotoService(id)
      setPhotos(prev => prev.filter(photo => photo._id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <PhotoContext.Provider value={{ photos, loading, getPhotos, createPhoto, deletePhoto }}>
      {children}
    </PhotoContext.Provider>
  )
}
