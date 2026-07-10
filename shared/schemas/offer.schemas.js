import { z } from "zod";

export const createOfferSchema = z.object({
  image: z.string().trim().optional(),
  product: z.string().trim().min(1, "El producto es obligatorio"),
  newPrice: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
});

export const getOfferSchema = z.object({
  _id: z.string(),
  image: z.string().trim().optional(),
  product: z.string().trim().min(1, "El producto es obligatorio"),
  newPrice: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  createdAt: z.string(),
});
