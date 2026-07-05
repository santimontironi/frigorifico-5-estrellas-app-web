import api from "./api";
import { getAllCategoriesResponseSchema } from "../../../shared";

export const getAllCategoriesService = async () => {
  const res = await api.get("/categories");
  return getAllCategoriesResponseSchema.parse(res.data);
}