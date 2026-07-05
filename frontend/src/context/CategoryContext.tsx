import { createContext, useState } from "react";
import type { Category, CategoriesLoading } from "../types/category.types";
import { getAllCategoriesService } from "../services/categories.service";

type CategoryContextType = {
    categories: Category[];
    getCategories: () => Promise<void>;
    loading: CategoriesLoading;
}

export const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryContextProvider = ({children}: any) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState<CategoriesLoading>({
        get: false
    })

    const getCategories = async () => {
        setLoading(prev => ({...prev, get: true}));
        try {
            const res = await getAllCategoriesService();
            setCategories(res.categories);
        } catch (err) {
            console.error(err);
        }
        finally{
            setLoading(prev => ({...prev, get: false}));
        }
    }

    return (
        <CategoryContext.Provider value={{categories, getCategories, loading}}>
            {children}
        </CategoryContext.Provider>
    )
}