import type { Product } from '../types/products.types'
import {getProductsService} from '../services/product.service'
import { createContext, useState } from 'react'

type ProductContextType = {
    products: Product[]
    getProducts: () => Promise<void>
}

export const ProductContext = createContext<ProductContextType | null>(null)

export const ProductContextProvider = ({children}: any) => {

    const [products, setProducts] = useState<Product[]>([])

    const getProducts = async () => {
        const res = await getProductsService()
        setProducts(res.data.products)
    }
    return (
        <ProductContext.Provider value={{products, getProducts}}>
            {children}
        </ProductContext.Provider>
    )
}