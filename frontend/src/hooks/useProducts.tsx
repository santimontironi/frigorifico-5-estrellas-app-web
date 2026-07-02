import { useContext } from "react"
import { ProductContext } from "../context/ProductContext"

const UseProducts = () => {

    const productContext = useContext(ProductContext)
    
    if(!productContext) {
        throw new Error('useProducts must be used within a ProductProvider')
    }

    return productContext
    
}

export default UseProducts