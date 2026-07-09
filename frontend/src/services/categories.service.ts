import api from "./api";
import { getAllCategoriesResponseSchema, createCategoryResponseSchema } from "../../../shared";
import type { CreateCategoryCredentials } from "../types/category.types";

export const getAllCategoriesService = async () => {
  const res = await api.get("/categories");
  return getAllCategoriesResponseSchema.parse(res.data);
}

export const deleteCategoryService = async (id: string) => {
  return await api.delete(`/categories/${id}`);
}

export const createCategoryService = async (name: CreateCategoryCredentials) => {
  const res = await api.post("/categories", { name });
  return createCategoryResponseSchema.parse(res.data);
}