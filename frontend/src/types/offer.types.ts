import { z } from "zod"
import { offerSchema, createOfferSchema } from "../../../shared"

export type Offer = z.infer<typeof offerSchema>

export type OffersLoading = {
  get: boolean
  create: boolean
}

export type CreateOfferInput = z.input<typeof createOfferSchema>
export type CreateOfferCredentials = z.infer<typeof createOfferSchema>
