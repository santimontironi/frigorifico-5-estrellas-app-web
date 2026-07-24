import type { Product, ProductsLoading, ImportProductsResponse } from '../types/product.types'
import {getProductsService, editProductService, deleteProductService, importProductsService, createProductService} from '../services/product.service'
import { createContext, useState } from 'react'

type ProductContextType = {
    products: Product[]
    loading: ProductsLoading
    getProducts: () => Promise<void>
    editProduct: (id: string, data: FormData) => Promise<void>
    deleteProduct: (id: string) => Promise<void>
    importProducts: (file: File) => Promise<ImportProductsResponse>
    createProduct: (data: FormData) => Promise<void>
}

export const ProductContext = createContext<ProductContextType | null>(null)

export const ProductContextProvider = ({children}: any) => {

    const [products, setProducts] = useState<Product[]>([])

    const [loading, setLoading] = useState<ProductsLoading>({get: true, update: false, delete: false, import: false, create: false})

    const getProducts = async () => {
        try{
            const res = await getProductsService()
            setProducts(res.products)
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

    async function deleteProduct(id: string) {
        setLoading((prev: ProductsLoading) => ({...prev, delete: true}))
        try{
            await deleteProductService(id)
            setProducts(prev => prev.filter(p => p._id !== id))
        }
        catch(err){
            console.error(err)
            throw err
        }
        finally{
            setLoading((prev: ProductsLoading) => ({...prev, delete: false}))
        }
    }

    const importProducts = async (file: File) => {
        setLoading((prev: ProductsLoading) => ({...prev, import: true}))
        try{
            return await importProductsService(file)
        }
        finally{
            setLoading((prev: ProductsLoading) => ({...prev, import: false}))
        }
    }

    const createProduct = async (data: FormData) => {
        setLoading((prev: ProductsLoading) => ({...prev, create: true}))
        try{
            await createProductService(data)
            await getProducts()
        }
        catch(err){
            console.error(err)
            throw err
        }
        finally{
            setLoading((prev: ProductsLoading) => ({...prev, create: false}))
        }
    }

    return (
        <ProductContext.Provider value={{products, getProducts, editProduct, loading, deleteProduct, importProducts, createProduct}}>
            {children}
        </ProductContext.Provider>
    )
}