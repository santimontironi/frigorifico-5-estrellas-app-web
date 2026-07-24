import api from "./api"
import { getPhotosResponse, createPhotoResponse, deletePhotoResponse } from "../../../shared"

export const getAllPhotosService = async () => {
  const res = await api.get("/photos")
  return getPhotosResponse.parse(res.data)
}

export const createPhotoService = async (data: FormData) => {
  const res = await api.post("/photos", data)
  return createPhotoResponse.parse(res.data)
}

export const deletePhotoService = async (id: string) => {
  const res = await api.delete(`/photos/${id}`)
  return deletePhotoResponse.parse(res.data)
}
