import api from "./api"
import { getOffersResponse, createOfferResponse, deleteOfferResponse } from "../../../shared"

export const getAllOffersService = async () => {
  const res = await api.get("/offers")
  return getOffersResponse.parse(res.data)
}

export const createOfferService = async (data: FormData) => {
  const res = await api.post("/offers", data)
  return createOfferResponse.parse(res.data)
}

export const deleteOfferService = async (id: string) => {
  const res = await api.delete(`/offers/${id}`)
  return deleteOfferResponse.parse(res.data)
}