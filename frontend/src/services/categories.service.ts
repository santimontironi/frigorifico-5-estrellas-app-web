import api from "./api";
import { getAllCategoriesResponseSchema } from "../../../shared";

export const getAllCategoriesService = async () => {
  const res = await api.get("/categories");
  return getAllCategoriesResponseSchema.parse(res.data);
}

export const deleteCategoryService = async (id: string) => {
  return await api.delete(`/categories/${id}`);
}