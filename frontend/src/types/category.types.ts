import { categorySchema, createCategorySchema } from "../../../shared";
import {z} from "zod";

export type Category = z.infer<typeof categorySchema>;

export type CategoriesLoading = {
    get: boolean,
    create: boolean
}

export type CreateCategoryCredentials = z.infer<typeof createCategorySchema>;