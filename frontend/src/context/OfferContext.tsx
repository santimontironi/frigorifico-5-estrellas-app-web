import { createContext, useState } from "react"
import type { Offer, OffersLoading } from "../types/offer.types"
import { getAllOffersService, createOfferService, deleteOfferService } from "../services/offer.services"

type OfferContextType = {
  offers: Offer[]
  loading: OffersLoading
  getOffers: () => Promise<void>
  createOffer: (data: FormData) => Promise<void>
  deleteOffer: (id: string) => Promise<void>
}

export const OfferContext = createContext<OfferContextType | null>(null)

export const OfferContextProvider = ({ children }: any) => {
  const [offers, setOffers] = useState<Offer[]>([])

  const [loading, setLoading] = useState<OffersLoading>({
    get: false,
    create: false,
  })

  const getOffers = async () => {
    setLoading(prev => ({ ...prev, get: true }))
    try {
      const res = await getAllOffersService()
      setOffers(res.offers)
    } catch (err) {
      console.error(err)
      setOffers([])
    } finally {
      setLoading(prev => ({ ...prev, get: false }))
    }
  }

  const createOffer = async (data: FormData) => {
    setLoading(prev => ({ ...prev, create: true }))
    try {
      await createOfferService(data)
      await getOffers()
    } finally {
      setLoading(prev => ({ ...prev, create: false }))
    }
  }

  const deleteOffer = async (id: string) => {
    try {
      await deleteOfferService(id)
      setOffers(prev => prev.filter(offer => offer._id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <OfferContext.Provider value={{ offers, loading, getOffers, createOffer, deleteOffer }}>
      {children}
    </OfferContext.Provider>
  )
}
