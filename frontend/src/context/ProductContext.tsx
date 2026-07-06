import type { Product, ProductsLoading } from '../types/product.types'
import {getProductsService} from '../services/product.service'
import { createContext, useState } from 'react'

type ProductContextType = {
    products: Product[]
    loading: ProductsLoading
    getProducts: () => Promise<void>
}

export const ProductContext = createContext<ProductContextType | null>(null)

export const ProductContextProvider = ({children}: any) => {

    const [products, setProducts] = useState<Product[]>([])

    const [loading, setLoading] = useState<ProductsLoading>({get: true})

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
    return (
        <ProductContext.Provider value={{products, getProducts, loading}}>
            {children}
        </ProductContext.Provider>
    )
}