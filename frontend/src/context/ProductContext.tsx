import type { Product, ProductsLoading } from '../types/product.types'
import {getProductsService, editProductService} from '../services/product.service'
import { createContext, useState } from 'react'

type ProductContextType = {
    products: Product[]
    loading: ProductsLoading
    getProducts: () => Promise<void>
    editProduct: (id: string, data: FormData) => Promise<void>
}

export const ProductContext = createContext<ProductContextType | null>(null)

export const ProductContextProvider = ({children}: any) => {

    const [products, setProducts] = useState<Product[]>([])

    const [loading, setLoading] = useState<ProductsLoading>({get: true, update: false})

    const getProducts = async () => {
        try{
            const res = await getProductsService()
            setProducts(res.products)
        }
        catch(err){
            console.error(err)
        }
        finally{
            setLoading((prev: ProductsLoading) => ({...prev, get: false}))
        }
    }
    const editProduct = async (id: string, data: FormData) => {
        setLoading((prev: ProductsLoading) => ({...prev, update: true}))
        try{
            const res = await editProductService(id, data)
            setProducts(prev => prev.map(p => p._id === id ? res.product : p))
        }
        catch(err){
            console.error(err)
            throw err
        }
        finally{
            setLoading((prev: ProductsLoading) => ({...prev, update: false}))
        }
    }

    return (
        <ProductContext.Provider value={{products, getProducts, editProduct, loading}}>
            {children}
        </ProductContext.Provider>
    )
}