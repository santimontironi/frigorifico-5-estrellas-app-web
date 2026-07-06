import { createContext, useState } from "react";
import type { Category, CategoriesLoading } from "../types/category.types";
import { getAllCategoriesService, deleteCategoryService } from "../services/categories.service";

type CategoryContextType = {
    categories: Category[];
    getCategories: () => Promise<void>;
    loading: CategoriesLoading;
    deleteCategory: (id: string) => Promise<void>;
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

    const deleteCategory = async (id: string) => {
        try{
            await deleteCategoryService(id);
            setCategories(prev => prev.filter(category => category._id !== id));
            await getCategories();
        }
        catch(err){
            console.error(err);
        }
    }

    return (
        <CategoryContext.Provider value={{categories, getCategories, loading, deleteCategory}}>
            {children}
        </CategoryContext.Provider>
    )
}