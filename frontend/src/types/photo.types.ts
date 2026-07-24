import { z } from "zod"
import { photoSchema } from "../../../shared"

export type Photo = z.infer<typeof photoSchema>

export type PhotosLoading = {
  get: boolean
  create: boolean
}
