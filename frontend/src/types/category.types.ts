import { categorySchema } from "../../../shared";
import {z} from "zod";

export type Category = z.infer<typeof categorySchema>;

export type CategoriesLoading = {
    get: boolean
}