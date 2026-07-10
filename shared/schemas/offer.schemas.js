import { z } from "zod";
import { categorySchema } from "./category.schema.js";

export const offerProductSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  category: categorySchema,
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  unit: z.enum(['kg', 'unit'], 'La unidad debe ser "kg" o "unit"'),
  image: z.string().nullable().optional(), // URL de Cloudinary — opcional
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const offerSchema = z.object({
  _id: z.string(),
  image: z.string().trim().optional(),
  product: offerProductSchema,
  newPrice: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  active: z.boolean().optional(),
  createdAt: z.string(),
});

export const offerSchemaWithoutProduct = z.object({
  _id: z.string(),
  image: z.string().trim().optional(),
  newPrice: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  active: z.boolean().optional(),
  createdAt: z.string(),
})

export const createOfferSchema = z.object({
  image: z.string().optional().nullable(), // la imagen es opcional
  product: z.string().trim().min(1, "El producto es obligatorio"),
  newPrice: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
});

export const getOffersResponse = z.object({
  offers: z.array(offerSchema),
});

export const createOfferResponse = z.object({
  message: z.string(),
  offer: z.object({
    _id: z.string(),
    image: z.string().optional(),
    product: z.string(),
    newPrice: z.number(),
    active: z.boolean().optional(),
    createdAt: z.string(),
  }),
});

export const deleteOfferResponse = z.object({
  offer: offerSchemaWithoutProduct
})
