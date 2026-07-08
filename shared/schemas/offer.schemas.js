import {z} from 'zod'
import { productSchema } from './product.schema'

export const CreateOfferSchema = ({
    image: z.string().trim().optional(),
    product: productSchema,
    newPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0')
})

export const GetOfferSchema = ({
    _id: z.string(),
    image: z.string().trim().optional(),
    product: productSchema,
    newPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    createdAt: z.string()
})